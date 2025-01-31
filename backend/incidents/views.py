from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from geopy.distance import great_circle
from incidents.models import DisasterReliefStations, FireStations, PoliceStations
from .serializers import CommentSerializer, IncidentSerializer, UserSerializer, MessageSerializer, ConversationSerializer
from incidents.models import DisasterReliefStations, FireStations, PoliceStations, Admin
from .serializers import IncidentSerializer, UserSerializer
from django.core.mail import send_mail
import requests
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from utils.call_Operator import EmergencyHelplineBot
from twilio.rest import Client
import json
from geopy.distance import great_circle
from .models import Incidents, FireStations, PoliceStations, User, Comment, Message, Conversation
from .serializers import IncidentSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.exceptions import AuthenticationFailed
import logging
logger = logging.getLogger(__name__)
from rest_framework import generics, status
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from django.core.cache import cache
from langchain_google_genai import ChatGoogleGenerativeAI
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from langchain.schema.output_parser import StrOutputParser
from langchain.schema import HumanMessage, AIMessage

@api_view(['GET'])
def latest_incidents(request):
    incidents = Incidents.objects.order_by('-reported_at')[:10]  # Adjust the number of incidents as needed
    serializer = IncidentSerializer(incidents, many=True)
    return Response(serializer.data)

class SignUpView(APIView):
    def post(self, request):
        data = request.data

        # Validate required fields
        required_fields = [
            "firstName", "lastName", "email", "phoneNumber",
            "address", "aadharNumber", "emergencyContact1",
            "emergencyContact2", "password"
        ]
        for field in required_fields:
            if not data.get(field):
                return Response({field: f"{field} is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check for unique constraints
        if User.objects.filter(email=data["email"]).exists():
            return Response({"email": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Save user
        try:
            user = User.objects.create(
                first_name=data["firstName"],
                last_name=data["lastName"],
                email=data["email"],  # Use email as username
                password=make_password(data["password"])  # Hash the password
            )

            # Add custom fields if you're using a custom User model
            user.phone_number = data["phoneNumber"]
            user.address = data["address"]
            user.aadhar_number = data["aadharNumber"]
            user.emergency_contact1 = data["emergencyContact1"]
            user.emergency_contact2 = data["emergencyContact2"]
            user.save()

            return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)

        except IntegrityError:
            return Response({"error": "An error occurred while creating the user."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Input validation
        if not email or not password:
            return Response({
                "error": "Both email and password are required."
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Determine if it's an admin or regular user login
            if email.endswith("@admin.com"):
                user = get_object_or_404(Admin, email=email)
                user_type = "admin"
            else:
                user = get_object_or_404(User, email=email)
                user_type = "user"

            # Verify password
            if not check_password(password, user.password):
                return Response({
                    "error": "Invalid credentials"
                }, status=status.HTTP_401_UNAUTHORIZED)

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "user_type": user_type,
                "user_id": user.id,
                "email": user.email,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh)
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": "Invalid credentials"
            }, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['POST'])
def report_incident(request):
    user = None
    
    # Check for authentication token if provided
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    if auth_header and auth_header.startswith('Bearer '):
        try:
            # Extract and validate token
            token_str = auth_header.split(' ')[1]
            token = AccessToken(token_str)
            user = User.objects.get(id=token['user_id'])
        except Exception:
            # If token validation fails, we'll fall back to anonymous user
            pass
    
    # If no valid authentication was provided or token validation failed,
    # get or create anonymous user
    if not user:
        user, _ = User.objects.get_or_create(
            email='anonymous@example.com',
            defaults={
                'first_name': 'Anonymous',
                'last_name': 'User',
                'phone_number': '0000000000',
                'address': 'Anonymous',
                'aadhar_number': '000000000000',
                'emergency_contact1': '0000000000',
                'emergency_contact2': '0000000000',
                'password': 'anonymous'
            }
        )

    serializer = IncidentSerializer(data=request.data)

    if serializer.is_valid():
        # Save the incident with the appropriate user
        incident = serializer.save(reported_by=user)

        # Parse and validate location data
        try:
            if isinstance(incident.location, str):
                incident.location = json.loads(incident.location)
        except json.JSONDecodeError:
            return Response({
                "error": "Invalid location data format"
            }, status=status.HTTP_400_BAD_REQUEST)

        user_lat = incident.location.get('latitude')
        user_lon = incident.location.get('longitude')

        if not user_lat or not user_lon or \
           not isinstance(user_lat, (int, float)) or \
           not isinstance(user_lon, (int, float)):
            return Response({
                "error": "Location must include valid latitude and longitude"
            }, status=status.HTTP_400_BAD_REQUEST)

        # Map incident types to appropriate station models
        station_map = {
            'Fire': FireStations,
            'Theft': PoliceStations,
            'Accident': PoliceStations,
            'Other': None
        }

        station_model = station_map.get(incident.incidentType)

        if station_model:
            try:
                # Find nearest station
                stations = station_model.objects.all()
                if stations.exists():
                    nearest_station = min(
                        stations,
                        key=lambda station: great_circle(
                            (user_lat, user_lon),
                            (station.latitude, station.longitude)
                        ).km
                    )

                    # Send notifications
                    try:
                        number = '+91' + str(nearest_station.number)
                        message = (
                            f"New {incident.incidentType} reported!\n"
                            f"Location: ({user_lat}, {user_lon})\n"
                            f"Description: {incident.description}"
                        )
                        
                        send_sms(message, number)
                        send_email_example(
                            "New Incident Alert",
                            message,
                            nearest_station.email
                        )
                    except Exception as e:
                        # Log notification error but don't fail the request
                        print(f"Notification error: {str(e)}")

            except Exception as e:
                return Response({
                    "error": f"Error processing station data: {str(e)}"
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Incident reported successfully!",
            "incident_id": incident.id
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def send_sms(message, number):
    account_sid = 'ACa342288beff5795775a39a8ba798b51b'
    auth_token = 'f35864d84f9fd0b14453405c8168d76d'
    client = Client(account_sid, auth_token)
    sms = client.messages.create(
    messaging_service_sid='MGa0dd71e727f8ff58f14fc197430c0988',
    body=message,
    to = number
    # to='+918452950512'
    )
    return Response({'message': 'sms sent successfully'})


def send_email_example(subject, message, email):
    send_mail(
        subject=subject,
        message=message,
        from_email='mayankhmehta80@gmail.com',
        recipient_list=[email],
        fail_silently=False,
    )
    return Response({'message': 'email sent successfully'})


# Function to get coordinates from Geoapify Geocoding API
def get_coordinates(location, api_key):
    api_key = "5b3ce3597851110001cf6248c3e5474dc5b64991afad8ceec07950da"
    url = f"https://api.geoapify.com/v1/geocode/search?text={location}&apiKey={api_key}"
    response = requests.get(url)
    data = response.json()
    if data['features']:
        coords = data['features'][0]['geometry']['coordinates']
        return coords[1], coords[0]  # Return latitude, longitude
    else:
        raise ValueError(f"Could not find coordinates for location: {location}")
    
class LatestIncidentsView(generics.ListAPIView):
    serializer_class = IncidentSerializer
    queryset = Incidents.objects.all().order_by('-reported_at')  # Get latest first
    
    def get_queryset(self):
        return self.queryset.prefetch_related('comments')[:10]  # Get 10 latest with comments



class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    
    def create(self, request, *args, **kwargs):
        email = request.data.get('user_email')
        incident_id = request.data.get('commented_on')
        
        # Verify user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found. Please login first."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify incident exists
        try:
            incident = Incidents.objects.get(id=incident_id)
        except Incidents.DoesNotExist:
            return Response(
                {"error": "Incident not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Create comment
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(commented_by=user, commented_on=incident)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
# class EmergencyHelplineAPIView(APIView):
#     """
#     API View for the Emergency Helpline Bot.
#     """

#     def __init__(self, **kwargs):
#         super().__init__(**kwargs)
#         self.bot = EmergencyHelplineBot()

#     async def post(self, request):
#         try:
#             user_input = request.data.get("user_input", "")
#             if not user_input:
#                 return Response({"error": "No user input provided."}, status=status.HTTP_400_BAD_REQUEST)

#             # Directly await handle_conversation if it's an async method
#             response_data = await self.bot.handle_conversation(user_input)

#             return Response({
#                 "response": response_data["response"],
#                 "chat_history": [
#                     {"type": "human" if isinstance(msg, dict) and msg.get('is_human', False) else "bot", "content": msg}
#                     for msg in response_data["chat_history"]
#                 ]
#             }, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def all_user_incidents(request):
    try:
        # Extract the Authorization header
        auth_header = request.META.get('HTTP_AUTHORIZATION', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"error": "Authorization header missing or malformed"}, status=400)

        # Extract the token from the header
        token_str = auth_header.split(' ')[1]  # 'Bearer <token>'
        token = AccessToken(token_str)

        # Validate and retrieve the user
        user = User.objects.get(id=token['user_id'])

        # Fetch incidents for the user
        incidents = Incidents.objects.filter(reported_by=user).values()
        return Response({"incidents": list(incidents)}, status=200)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except Exception as e:
        return Response({"error": f"There was an error while finding the reports: {e}"}, status=400)
    
@api_view(['GET'])
def all_ongoing_incidents(request):
    incidents = Incidents.objects.filter(status="Submitted")
    return Response(incidents, status=201)

@api_view(['GET'])
def all_incidents(request):
    incidents = Incidents.objects.all()
    serializer = IncidentSerializer(incidents, many=True)
    return Response(serializer.data, status=201)

class CommentListCreateView(APIView):

    def get(self, request, incident_id):
        comments = Comment.objects.filter(commented_on_id=incident_id).order_by('-commented_at')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, incident_id):
    # Extract the Authorization header
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response({"error": "Authorization header missing or malformed"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract the token from the header
        token_str = auth_header.split(' ')[1]
        try:
            token = AccessToken(token_str)
            print("Done successfully")
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the incident exists
            incident = Incidents.objects.get(id=incident_id)
            
            # Prepare the data
            serializer_data = {
                'comment': request.data.get('comment'),
                'commented_on': incident.id 
            }
            
            serializer = CommentSerializer(data=serializer_data)
            if serializer.is_valid():
                # Pass the user when saving
                serializer.save(commented_by_id=token['user_id'])
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Incidents.DoesNotExist:
            return Response(
                {"error": "Incident not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    

@api_view(['GET'])
def get_location(request):
    incident = Incidents.objects.get(id=1)
    print(incident.location)
    return Response({
        "link": get_google_maps_link(incident.location['latitude'], incident.location['longitude'])
    })



def get_google_maps_link(latitude, longitude):
    return f"https://www.google.com/maps?q={latitude},{longitude}"

class CustomChatMemoryHistory(BaseChatMessageHistory):
    def __init__(self):
        self.messages = []

    def add_user_message(self, message: str) -> None:
        """Add a user message to the memory."""
        self.messages.append(HumanMessage(content=message))

    def add_ai_message(self, message: str) -> None:
        """Add an AI message to the memory."""
        self.messages.append(AIMessage(content=message))

    def clear(self) -> None:
        """Clear the memory."""
        self.messages = []

    def to_dict(self) -> dict:
        """Convert memory to a dictionary."""
        return {"messages": [msg.as_dict() for msg in self.messages]}

from django.contrib.auth import get_user_model
import jwt
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    def get_authenticated_user(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return None
        
        token = auth_header.split(' ')[1]
        
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256']
            )
            print("Decoded Payload: ", payload)
            User = get_user_model()
            user_id = payload.get('user_id')
            return User.objects.get(id=user_id)
            
        except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, User.DoesNotExist) as e:
            print("Authentication error:", str(e)) 
            return None

    def dispatch(self, request, *args, **kwargs):
        user = self.get_authenticated_user(request)
        if not user:
            return Response(
                {'error': 'Authentication failed'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        request.user = user
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return Conversation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        try:
            conversation = self.get_object()
            print(f"Conversation user_id: {conversation.user.id}")  # Debug line
            print(f"Request user_id: {request.user.id}")
            
            if conversation.user.id != request.user.id:
                return Response(
                {'error': f'You do not have permission to access this conversation. Owner: {conversation.user.id}, Requester: {request.user.id}'}, 
                status=status.HTTP_403_FORBIDDEN
            )
            
            # Extract user input from the request
            user_input = request.data.get('message', '')
            if not user_input:
                return Response({'error': 'Message content is required'}, status=status.HTTP_400_BAD_REQUEST)
        
            # Save the user's message
            Message.objects.create(conversation=conversation, is_user=True, content=user_input)
            
            # Initialize custom memory
            memory = CustomChatMemoryHistory()
            
            # Load conversation history into memory
            for msg in conversation.messages.all():
                if msg.is_user:
                    memory.add_user_message(msg.content)
                else:
                    memory.add_ai_message(msg.content)
            
            # Set up the AI chat model
            chat = ChatGoogleGenerativeAI(
                model="gemini-1.5-pro",
                api_key="AIzaSyDv7RThoILjeXAryluncDRZ1QeFxAixR7Q"
            )
            
            # Define the chat prompt template
            prompt = ChatPromptTemplate.from_messages([
                ("system", "You are a helpful AI assistant."),
                MessagesPlaceholder(variable_name="chat_history"),
                ("human", "{input}")
            ])
            
            # Create the chain using LangChain Expression Language (LCEL)
            chain = prompt | chat | StrOutputParser()
            
            try:
                # Get AI response with chat history and input
                response = chain.invoke({
                    "chat_history": [msg.as_dict() for msg in memory.messages],  # Convert messages to dict
                    "input": user_input
                })
                
                # Save the AI's response
                ai_message = Message.objects.create(
                    conversation=conversation,
                    is_user=False,
                    content=response
                )
                
                # Add the AI's response to memory
                memory.add_ai_message(response)
                
                # Return the AI's message and updated conversation
                return Response({
                    'message': MessageSerializer(ai_message).data,
                    'conversation': self.get_serializegithubr(conversation).data
                })
            
            except Exception as e:
                # Handle any exceptions that occur during the process

                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'Conversation not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
      
@api_view(['GET'])
def trial(request):
    for record in Conversation.objects.all():
        if not User.objects.filter(id=record.user.id):
            print(f"Invalid reference: {record.id} references non-existent User {record.user.id}")
        else:
            print("all good")
    return Response({}, status=200)
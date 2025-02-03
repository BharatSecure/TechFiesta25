from rest_framework.decorators import api_view
from rest_framework.response import Response
from geopy.distance import great_circle
from utils.comments import contains_cuss_words, is_spam
from incidents.models import DisasterReliefStations, FireStations, PoliceStations
from .serializers import CommentSerializer, IncidentSerializer, UserSerializer
from incidents.models import DisasterReliefStations, FireStations, PoliceStations, Admin
from .serializers import IncidentSerializer
from django.core.mail import send_mail
import requests
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from utils.call_Operator import EmergencyHelplineBot
from twilio.rest import Client
import json
from geopy.distance import great_circle
from .models import Incidents, FireStations, PoliceStations, User, Comment
from .serializers import IncidentSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import logging
logger = logging.getLogger(__name__)
from rest_framework import generics, status
from langchain_core.chat_history import BaseChatMessageHistory
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from django.core.exceptions import ImproperlyConfigured
from rest_framework import viewsets, status
from rest_framework.decorators import action
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

@api_view(['PATCH'])
def update_incident(request, id):
    status = request.data.get("status")
    try:
        incident = get_object_or_404(Incidents, id=id)
        incident.status = status
        incident.save()
        serializer = IncidentSerializer(incident)
        return Response(serializer.data, status=200)
    except Exception as e:
        return Response({"message": f"Error Occurred: {e}"}, status=400)      

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
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the incident exists
            incident = get_object_or_404(Incidents, id=incident_id)

            # Get the comment text
            comment_text = request.data.get('comment', "").strip()

            # Check for spam or cuss words
            if contains_cuss_words(comment_text) or is_spam(comment_text):
                return Response(
                    {"error": "Your comment contains inappropriate content or spam."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Prepare the data
            serializer_data = {
                'comment': comment_text,
                'commented_on': incident.id
            }

            serializer = CommentSerializer(data=serializer_data)
            if serializer.is_valid():
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

@api_view(['GET'])
def view_incident(request, id):
   try:
       incident = get_object_or_404(Incidents, id=id)
       serializer = IncidentSerializer(incident, context={'request': request})
       return Response(serializer.data, status=200)
   except Exception as e:
       return Response({'error': str(e)}, status=400)


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

from langgraph.store.memory import InMemoryStore
from langchain_core.runnables import RunnablePassthrough
import uuid
from rest_framework.parsers import JSONParser
from tenacity import wait_exponential

class ChatbotView_Therapist(APIView):
    parser_classes=[JSONParser]
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                api_key="AIzaSyDv7RThoILjeXAryluncDRZ1QeFxAixR7Q",
                max_retries=3,
                retry_wait_strategy=wait_exponential(multiplier=1, min=4, max=10)
            )
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are both a therapist and a legal guidance officer based in India. As a therapist, your role is to provide emotional support, comfort, and guidance to the user, especially after a traumatic incident. As a legal guidance officer, you will provide advice on legal matters specific to Indian law, ensuring your answers are clear and based on the legal framework in India. Balance both roles carefully, making your responses brief but considerate and accurate."),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{user_input}"),
        ])
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
        user_input = request.data.get("user_input", "").strip()
        chat_history = request.data.get("chat_history")

        if not isinstance(chat_history, list):  # Ensure chat_history is a list
            chat_history = []

        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        chain_input = {"user_input": user_input, "chat_history": chat_history}
        response = self.chain.invoke(chain_input)

        chat_history.append(f"User: {user_input}")
        chat_history.append(f"Bot: {response}")

        return Response({
            "user_input": user_input,
            "bot_response": response,
            "chat_history": chat_history,
        }, status=status.HTTP_200_OK)

class ChatbotView_Legal(APIView):
    parser_classes=[JSONParser]
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize the LLM
        self.llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                api_key="AIzaSyDv7RThoILjeXAryluncDRZ1QeFxAixR7Q",
                max_retries=3,
                retry_wait_strategy=wait_exponential(multiplier=1, min=4, max=10)
            )
        # Define the prompt template with a placeholder for chat history
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a Legal guidance officer in India. The user has gone through a traumatic incident and wants some help in the legal section. Help them by solving their queries"),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{user_input}"),
        ])
        # Define the chain using LCEL
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
        user_input = request.data.get("user_input", "").strip()
        chat_history = request.data.get("chat_history")

        if not isinstance(chat_history, list):  # Ensure chat_history is a list
            chat_history = []

        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        chain_input = {"user_input": user_input, "chat_history": chat_history}
        response = self.chain.invoke(chain_input)

        # Append new messages as strings (not `HumanMessage` or `AIMessage` objects)
        chat_history.append(f"User: {user_input}")
        chat_history.append(f"Bot: {response}")


        return Response({
            "user_input": user_input,
            "bot_response": response,
            "chat_history": chat_history,
        }, status=status.HTTP_200_OK)

from django.conf import settings
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
from .models import Incidents, FireStations, PoliceStations, User, Comment, Hospital, NGO
from .serializers import IncidentSerializer
from rest_framework.views import APIView
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
import logging
logger = logging.getLogger(__name__)
from rest_framework import generics, status
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_google_genai import ChatGoogleGenerativeAI
from rest_framework import viewsets, status
from langchain.schema.messages import SystemMessage
from langchain.schema.output_parser import StrOutputParser
from rest_framework.parsers import JSONParser
from tenacity import wait_exponential
import re
from django.db.models import (
    Avg, Count, Q, FloatField, F, 
    ExpressionWrapper, Case, When, 
    OuterRef, Subquery, IntegerField
)
from django.db.models.functions import (
    ExtractWeekDay, TruncMonth, 
    ExtractHour, ExtractYear
)
from django.utils import timezone
from datetime import timedelta

model = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                api_key="AIzaSyDv7RThoILjeXAryluncDRZ1QeFxAixR7Q",
                max_retries=3,
                retry_wait_strategy=wait_exponential(multiplier=1, min=4, max=10)
            )

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
        
        

class form_report(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.llm = model
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", """
            Analyze the incident report and determine its severity level based on the following criteria:

            high:
            - Immediate threat to life
            - Multiple casualties
            - Large-scale property damage
            - Ongoing dangerous situation

            medium:
            - Non-life-threatening injuries
            - Significant property damage
            - Potential for situation escalation
            - Missing persons cases

            low:
            - Minor incidents
            - No injuries
            - Minor property damage
            - Non-emergency situations

            Return ONLY one of these words: high, medium, or low
            """),
            ("human", "{user_input}")
        ])
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
        user = None
        
        # Check for authentication token if provided
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token_str = auth_header.split(' ')[1]
                token = AccessToken(token_str)
                user = User.objects.get(id=token['user_id'])
            except Exception as e:
                print(f"Authentication error: {str(e)}")
                # If token validation fails, fall back to anonymous user
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
        
        # Map incident types to appropriate station models
        station_map = {
            'Fire': [FireStations, PoliceStations, Hospital],
            'Theft': [PoliceStations],
            'Accident': [PoliceStations, Hospital],
            'Missing Persons': [PoliceStations],
            'Other': []  # Changed from [None] to empty list
        }

        try:
            data = request.data.copy()
            response = self.chain.invoke({"user_input": data})
            data['severity'] = response.strip()
            print(response)
            serializer = IncidentSerializer(data=data)

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

                # Get the station models for the incident type
                station_models = station_map.get(incident.incidentType, [])
                user_location = (user_lat, user_lon)

                nearest_police_station = None
                nearest_fire_station = None
                nearest_hospital = None

                # Find nearest stations and send notifications
                for station_model in station_models:
                    stations = station_model.objects.all()
                    if stations.exists():
                        nearest_station = min(
                            stations,
                            key=lambda station: great_circle(
                                user_location,
                                (station.latitude, station.longitude)
                            ).km
                        )

                        # Save the nearest station based on its type
                        if station_model == PoliceStations:
                            nearest_police_station = nearest_station
                        elif station_model == FireStations:
                            nearest_fire_station = nearest_station
                        elif station_model == Hospital:
                            nearest_hospital = nearest_station

                        # Send notifications with enhanced message
                        try:
                            number = '+91' + str(nearest_station.number)
                            message = (
                                f"New {incident.incidentType} reported!\n"
                                f"Severity: {response}\n"
                                f"Location: ({user_lat}, {user_lon})\n"
                                f"Description: {incident.description}\n"
                                f"Reported by: {user.first_name} {user.last_name}"
                            )
                            
                            # send_sms(message, number)
                            send_email_example(
                                f"New {response} Priority Incident Alert",
                                message,
                                nearest_station.email
                            )
                        except Exception as e:
                            print(f"Notification error for station {nearest_station.id}: {str(e)}")
                            # Continue processing even if notification fails

                # Update the incident with the nearest stations
                incident.police_station = nearest_police_station
                incident.fire_station = nearest_fire_station
                incident.hospital_station = nearest_hospital
                incident.save()

                return Response({
                    "message": "Incident reported successfully!",
                    "incident_id": incident.id,
                    "severity": response
                }, status=status.HTTP_201_CREATED)

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "error": f"An unexpected error occurred: {str(e)}"
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class voicereport(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.llm = model  # Ensure `model` is defined
        self.prompt = ChatPromptTemplate.from_messages([
            ('system', "Analyze the provided incident report and return a structured JSON response in the exact same format as the given example. Preserve all field names and ensure values are correctly formatted. Based on the input, choose the value of severity can be either high, medium or low. Do not add or remove any fields. Ensure the response is a valid JSON object."),
            ('human',"{json_format}"),
            ('human', "description: {user_input}, Location = {location}")
        ])
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
        user = None
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token_str = auth_header.split(' ')[1]
                token = AccessToken(token_str)
                user = User.objects.get(id=token['user_id'])
            except Exception as e:
                print(f"Token validation failed: {str(e)}")
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

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

        json_format = """{
        "incidentType": "Accident",
        "location": {"latitude": 19.1234048, "longitude": 72.8563712},
        "description": "I've been in a terrible accident",
        "severity": "high"
    }"""

        user_input = request.data.get("user_input", "").strip()
        user_lat = request.data.get('latitude')
        user_lon = request.data.get('longitude')
        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        chain_input = {"user_input": user_input, "json_format":json_format, "location": {"latitude": user_lat, "longitude": user_lon}}
        incident = self.chain.invoke(chain_input)
        
        # Regular expression to extract JSON block
        json_pattern = re.search(r"\{[\s\S]*\}", incident)

        if json_pattern:
            json_text = json_pattern.group()  # Extract JSON string
            try:
                incident = json.loads(json_text)  # Convert to dictionary
                print(incident)
            except json.JSONDecodeError as e:
                print("Invalid JSON:", e)
        else:
            print("No JSON found in the log.")

        serializer = IncidentSerializer(data=incident)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        incident_obj = serializer.save()
        incident_obj.reported_by = user

        if not (-90 <= user_lat <= 90) or not (-180 <= user_lon <= 180):
            return Response({"error": "Invalid latitude or longitude values"}, status=status.HTTP_400_BAD_REQUEST)

        station_map = {
            'Fire': [FireStations, PoliceStations, Hospital],
            'Theft': [PoliceStations],
            'Accident': [PoliceStations, Hospital],
            'Missing Persons': [PoliceStations],
            'Other': [None]
        }

        station_models = station_map.get(incident.get('incidentType'), [])
        nearest_stations = {
            'police_station': None,
            'fire_station': None,
            'hospital_station': None
        }

        if station_models:
            try:
                for station_model in station_models:
                    if station_model is None:
                        continue
                    
                    stations = station_model.objects.all()
                    if stations.exists():
                        nearest_station = min(
                            stations,
                            key=lambda station: great_circle(
                                (user_lat, user_lon),
                                (station.latitude, station.longitude)
                            ).km
                        )

                        if station_model == PoliceStations:
                            nearest_stations['police_station'] = nearest_station
                        elif station_model == FireStations:
                            nearest_stations['fire_station'] = nearest_station
                        elif station_model == Hospital:
                            nearest_stations['hospital_station'] = nearest_station

                        try:
                            number = '+91' + str(nearest_station.number)
                            message = (
                                f"New {incident['incidentType']} reported!\n"
                                f"Location: ({user_lat}, {user_lon})\n"
                                f"Description: {incident['description']}"
                            )
                            # send_sms(message, number)
                            send_email_example(
                                "New Incident Alert",
                                message,
                                nearest_station.email
                            )
                        except Exception as e:
                            print(f"Notification error: {str(e)}")
                
                incident_obj.police_station = nearest_stations['police_station']
                incident_obj.fire_station = nearest_stations['fire_station']
                incident_obj.hospital_station = nearest_stations['hospital_station']
                incident_obj.save()
            
            except Exception as e:
                return Response({"error": f"Error processing station data: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            "message": "Incident reported successfully!",
            "incident_id": incident_obj.id
        }, status=status.HTTP_201_CREATED)

        



@api_view(['PATCH'])
def update_incident(request, id):
    status = request.data.get("status")
    try:
        incident = get_object_or_404(Incidents, id=id)
        incident.status = status
        incident.save()
        serializer = IncidentSerializer(incident)
        user = incident.reported_by
        print("information gotten")
        # Send Email Notification
        #subject = f"Incident Status Updated: {incident.id}"
        # message = f"Dear {user.first_name},\n\nThe status of your reported incident (ID: {incident.id}) has been updated to: {status}.\n\nThank you,\nIncident Management Team"
        # recipient_email = user.email  # Get user email
        # print("Information recieved")
        # send_email_example(subject, message, email=recipient_email)
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
        print(incidents)
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

@api_view(['GET'])
def all_station_incidents(request):
    # Check for the presence and validity of the authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response(
            {"error": "Authorization header missing or malformed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Extract and validate the token
        token_str = auth_header.split(' ')[1]
        token = AccessToken(token_str)
        admin = get_object_or_404(Admin, id=token['user_id'])
    except Exception as e:
        return Response(
            {"error": "Invalid or expired token"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Determine which station the admin belongs to and filter incidents accordingly
    if admin.police_station is not None:
        incidents = Incidents.objects.filter(police_station=admin.police_station)
    elif admin.fire_station is not None:
        incidents = Incidents.objects.filter(fire_station=admin.fire_station)
    elif admin.hospital is not None:
        incidents = Incidents.objects.filter(hospital_station=admin.hospital)
    else:
        return Response(
            {"error": "Admin is not associated with any station"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Serialize the incidents and return the response
    serializer = IncidentSerializer(incidents, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    


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
def save_score(request):
    allincidents = Incidents.objects.all()
    
    for incident in allincidents:
        if incident.reported_by and incident.reported_by.first_name == 'Anonymous':
            incident.score = 50
        else:
            incidents = Incidents.objects.filter(reported_by=incident.reported_by)
            count = sum(1 for i in incidents if i.true_or_false)  # Count valid incidents
            
            if incidents.count() > 0:
                incident.score = (count / incidents.count()) * 100
            else:
                incident.score = 0  # Prevent division by zero

        incident.save()  # Save the updated score to the database
    
    return Response({"message": "All scores updated successfully."})

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

class ChatbotView_Therapist(APIView):
    parser_classes=[JSONParser]
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.llm = model
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

@api_view(["GET"])
def incident_chart_data(request):
    try:
        # Get time range from query params (default to last 12 months)
        months = int(request.query_params.get('months', 12))
        start_date = timezone.now() - timedelta(days=30*months)
        
        # Base queryset
        queryset = Incidents.objects.filter(reported_at__gte=start_date)
        
        # Monthly incident count
        monthly_incidents = (
            queryset
            .annotate(month=TruncMonth('reported_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )

        # Incident types distribution
        type_distribution = (
            queryset
            .values('incidentType')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Severity distribution
        severity_distribution = (
            queryset
            .values('severity')
            .annotate(count=Count('id'))
            .order_by('severity')
        )

        # Time of day analysis
        hourly_distribution = (
            queryset
            .annotate(hour=ExtractHour('reported_at'))
            .values('hour')
            .annotate(count=Count('id'))
            .order_by('hour')
        )

        # Status distribution
        status_distribution = (
            queryset
            .values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )

        data = {
            'monthly_incidents': list(monthly_incidents),
            'type_distribution': list(type_distribution),
            'severity_distribution': list(severity_distribution),
            'hourly_distribution': list(hourly_distribution),
            'status_distribution': list(status_distribution),
            'total_incidents': queryset.count(),
        }
        
        logger.info(f"Successfully generated chart data: {data}")
        return Response(data)
    
    except Exception as e:
        logger.error(f"Error in incident_chart_data: {str(e)}")
        return Response(
            {"error": str(e)}, 
            status=500
        )
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime
@api_view(['GET'])
def advanced_incident_analysis(request):
    try:
        # Get date range from query params or default to last 12 months
        months = int(request.query_params.get('months', 12))
        start_date = datetime.now() - timedelta(days=30*months)
        
        # Base queryset with date filter
        queryset = Incidents.objects.filter(reported_at__gte=start_date)
        
        analytics = {
            'response_time_analysis': list(
                queryset
                .values('incidentType', 'severity')
                .annotate(
                    avg_score=Avg('score'),
                    total_incidents=Count('id'),
                    avg_resolution_time=Avg(
                        Case(
                            When(
                                resolved_at__isnull=False,
                                then=ExtractHour('resolved_at') - ExtractHour('reported_at')
                            ),
                            output_field=IntegerField(),
                        )
                    )
                )
                .order_by('incidentType', 'severity')
            ),
            
            'monthly_trends': list(
                queryset
                .annotate(month=TruncMonth('reported_at'))
                .values('month')
                .annotate(
                    total_incidents=Count('id'),
                    high_severity=Count('id', filter=Q(severity='high')),
                    medium_severity=Count('id', filter=Q(severity='medium')),
                    low_severity=Count('id', filter=Q(severity='low')),
                    resolved_count=Count('id', filter=Q(status='resolved')),
                    resolution_rate=Count('id', filter=Q(status='resolved')) * 100.0 / Count('id')
                )
                .order_by('month')
            ),
            
            'hourly_distribution': list(
                queryset
                .annotate(hour=ExtractHour('reported_at'))
                .values('hour')
                .annotate(
                    incident_count=Count('id'),
                    high_severity_count=Count('id', filter=Q(severity='high')),
                    avg_response_score=Avg('score')
                )
                .order_by('hour')
            ),
            
            'risk_hotspots': list(
                queryset
                .values('location')
                .annotate(
                    incident_density=Count('id'),
                    high_severity_count=Count('id', filter=Q(severity='high')),
                    avg_response_score=Avg('score'),
                    resolution_rate=Count('id', filter=Q(status='resolved')) * 100.0 / Count('id')
                )
                .order_by('-incident_density')[:10]
            ),
            
            'incident_type_analysis': list(
                queryset
                .values('incidentType')
                .annotate(
                    total_count=Count('id'),
                    high_severity=Count('id', filter=Q(severity='high')),
                    medium_severity=Count('id', filter=Q(severity='medium')),
                    low_severity=Count('id', filter=Q(severity='low')),
                    avg_response_score=Avg('score'),
                    resolution_rate=Count('id', filter=Q(status='resolved')) * 100.0 / Count('id')
                )
                .order_by('-total_count')
            ),
            
            'weekly_pattern': list(
                queryset
                .annotate(weekday=ExtractWeekDay('reported_at'))
                .values('weekday')
                .annotate(
                    total_incidents=Count('id'),
                    avg_severity=Avg(
                        Case(
                            When(severity='high', then=3),
                            When(severity='medium', then=2),
                            When(severity='low', then=1),
                            output_field=IntegerField(),
                        )
                    ),
                    resolution_rate=Count('id', filter=Q(status='resolved')) * 100.0 / Count('id')
                )
                .order_by('weekday')
            ),
            
            'emergency_services_summary': list(
                queryset
                .values('incidentType')
                .annotate(
                    total_incidents=Count('id'),
                    police_involved=Count('police_station', filter=Q(police_station__isnull=False)),
                    fire_involved=Count('fire_station', filter=Q(fire_station__isnull=False)),
                    hospital_involved=Count('hospital_station', filter=Q(hospital_station__isnull=False)),
                    multi_agency_response=Count('id', filter=Q(
                        police_station__isnull=False,
                        fire_station__isnull=False
                    ) | Q(
                        police_station__isnull=False,
                        hospital_station__isnull=False
                    ) | Q(
                        fire_station__isnull=False,
                        hospital_station__isnull=False
                    ))
                )
                .order_by('incidentType')
            ),
            
            'overall_statistics': {
                'total_incidents': queryset.count(),
                'resolution_rate': (
                    queryset.filter(status='resolved').count() * 100.0 / 
                    queryset.count() if queryset.count() > 0 else 0
                ),
                'avg_response_score': queryset.aggregate(Avg('score'))['score__avg'] or 0,
                'high_severity_percentage': (
                    queryset.filter(severity='high').count() * 100.0 / 
                    queryset.count() if queryset.count() > 0 else 0
                ),
                'multi_agency_percentage': (
                    queryset.filter(
                        Q(police_station__isnull=False) |
                        Q(fire_station__isnull=False) |
                        Q(hospital_station__isnull=False)
                    ).distinct().count() * 100.0 / 
                    queryset.count() if queryset.count() > 0 else 0
                )
            }
        }

        return Response(
            json.loads(json.dumps(analytics, cls=DjangoJSONEncoder)),
            status=status.HTTP_200_OK
        )
    
    except Exception as e:
        return Response({
            'error': 'Analysis failed',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from .models import User
from django.views import View

class UserDetailView(View):
    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        user_data = {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "address": user.address,
            "aadhar_number": user.aadhar_number,
            "emergency_contact1": user.emergency_contact1,
            "emergency_contact2": user.emergency_contact2,
            "date_joined": user.date_joined.strftime("%Y-%m-%d %H:%M:%S"),
        }
        return JsonResponse(user_data)

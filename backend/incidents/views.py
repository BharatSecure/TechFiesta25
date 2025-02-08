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
from utils.sms import get_coordinates_from_address

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
            Analyze the incident report and determine its severity level strictly based on the given description, using the following criteria:

            high:
            Immediate threat to life
            Multiple casualties
            Large-scale property damage
            Ongoing dangerous situation
            
            medium:
            Non-life-threatening injuries
            Significant property damage
            Potential for situation escalation
            Missing persons cases

            low:
            Minor incidents
            No injuries
            Minor property damage
            Non-emergency situations
            
            You must return only one of these words: high, medium, or low based on the information provided. If details are unclear, make the best possible classification rather than asking for more details. Do not include explanations—return only the classification.
            """),
            ("human", "{user_input}")
        ])
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
        """Handles reporting of incidents"""
        try:
            user = self.authenticate_user(request)
            data = request.data.copy()
            data['severity'] = self.chain.invoke({"user_input": data.get("description", "")}).strip()
            
            # Validate location data
            location = self.validate_location(data.get("location"))
            if not location:
                return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)
            
            lat, lon = location["latitude"], location["longitude"]
            
            # Check for similar existing incidents
            existing_incident = self.find_similar_incident(data, lat, lon)
            if existing_incident:
                existing_incident.count += 1
                existing_incident.save()
                self.notify_existing_incident(existing_incident)
            
                
                return Response({
                    "message": "Incident reported successfully!",
                    "incident_id": existing_incident.id,
                    "severity": data['severity']
                }, status=status.HTTP_201_CREATED)
            print(data)
            # Create new incident
            serializer = IncidentSerializer(data=data)
            if serializer.is_valid():
                incident = serializer.save(reported_by=user)
                self.assign_nearest_stations(incident, lat, lon)
                return Response({
                    "message": "Incident reported successfully!",
                    "incident_id": incident.id,
                    "severity": data['severity']
                }, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": f"An unexpected error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def authenticate_user(self, request):
        """Authenticate user or fallback to anonymous"""
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token_str = auth_header.split(' ')[1]
                token = AccessToken(token_str)
                return User.objects.get(id=token['user_id'])
            except Exception:
                pass  # Fallback to anonymous

        return User.objects.get_or_create(
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
        )[0]

    def validate_location(self, location):
        """Ensures location is valid"""
        if isinstance(location, str):
            try:
                location = json.loads(location)
            except json.JSONDecodeError:
                return None

        if not isinstance(location, dict) or "latitude" not in location or "longitude" not in location:
            return None

        lat, lon = location["latitude"], location["longitude"]
        if not isinstance(lat, (int, float)) or not isinstance(lon, (int, float)):
            return None
        
        return location

    def find_similar_incident(self, data, lat, lon):
        """Check for existing similar incidents within 50 meters & 1 hour"""
        recent_incidents = Incidents.objects.filter(incidentType=data.get("incidentType"))
        for incident in recent_incidents:
            if great_circle((lat, lon), (incident.location["latitude"], incident.location["longitude"])).meters <= 50:
                print("Under 50 metres")
                if abs(data.get("reported_at", timezone.now()) - incident.reported_at) <= timedelta(hours=1):
                    print("Under 1 hour")
                    if self.is_similar_incident(data["description"], incident.description):
                        return incident
        return None

    def is_similar_incident(self, new_description, previous_description):
        """Check if two incidents have similar descriptions using LLM"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", "Based on the description of the two incidents, return only 'True' if they are similar, otherwise 'False'."),
            ("human", "{newdata} \n {previousdata}")
        ])
        chain = prompt | model | StrOutputParser()
        return chain.invoke({"newdata": new_description, "previousdata": previous_description}) == "True"

    def notify_existing_incident(self, incident):
        """Send notification if an incident is reported again"""
        stations = [incident.police_station, incident.fire_station, incident.hospital_station]
        for station in filter(None, stations):
            subject = "Incident has been reported by another user"
            message = f"Another user has reported the same incident (ID: {incident.id}). Please investigate."
            send_email_example(subject, message, station.email)

    def assign_nearest_stations(self, incident, lat, lon):
        """Assigns nearest police, fire, and hospital stations to the incident"""

        station_map = {
            'Domestic Violence': [PoliceStations],
            'Child Abuse': [PoliceStations],
            'Sexual Harassment': [PoliceStations],
            'Stalking': [PoliceStations],
            'Human Trafficking': [PoliceStations],
            'Fire': [FireStations, PoliceStations, Hospital],
            'Theft': [PoliceStations],
            'Accident': [PoliceStations, Hospital],
            'Missing Persons': [PoliceStations],
            'Other': [PoliceStations]  
        }

        station_models = station_map.get(incident.incidentType, [])
        user_location = (lat, lon)

        for station_model in station_models:
            stations = station_model.objects.all()
            if stations.exists():
                nearest_station = min(stations, key=lambda station: great_circle(user_location, (station.latitude, station.longitude)).km)
                
                if station_model == PoliceStations:
                    incident.police_station = nearest_station
                elif station_model == FireStations:
                    incident.fire_station = nearest_station
                elif station_model == Hospital:
                    incident.hospital_station = nearest_station

                # Notify nearest station
                self.notify_new_incident(nearest_station, incident)

        incident.save()

    def notify_new_incident(self, station, incident):
        """Send email notification to the assigned station"""
        try:
            message = (
                f"New {incident.incidentType} reported!\n"
                f"Severity: {incident.severity}\n"
                f"Location: ({incident.location['latitude']}, {incident.location['longitude']})\n"
                f"Description: {incident.description}\n"
                f"Reported by: {incident.reported_by.first_name} {incident.reported_by.last_name}"
            )
            number = "+91"+str(station.number)
            # send_sms(message, number)
            send_email_example(f"New {incident.severity.capitalize()} Priority Incident Alert", message, station.email)
        except Exception as e:
            print(f"Notification error for station {station.id}: {str(e)}")

class voicereport(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.llm = model  # Ensure `model` is defined
        self.prompt = ChatPromptTemplate.from_messages([
            ('system', """
                Analyze the provided incident report and return a structured JSON response that strictly follows the given format.
                
                - Preserve all field names exactly as in the provided example.
                - Ensure values are correctly formatted based on the input.
                - Determine the severity level as 'high', 'medium', or 'low' based on the incident details.
                - If no location is found in the input, return an error message
                - Do not add, remove, or modify any fields.
                - Ensure the response is a valid JSON object.
            """),
            ('human', "Expected JSON format: {json_format}"),
            ('human', "Incident details: {user_input}")
        ])
        self.chain = self.prompt | self.llm | StrOutputParser()

    def post(self, request, *args, **kwargs):
    # Authenticate user
        print("function started")
        user = None
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if auth_header and auth_header.startswith('Bearer '):
            try:
                token_str = auth_header.split(' ')[1]
                token = AccessToken(token_str)
                user = User.objects.get(id=token['user_id'])
            except Exception as e:
                return Response({"error": "Invalid or expired token"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user:
            user, _ = User.objects.get_or_create(
                email='anonymous@example.com',
                defaults={'first_name': 'Anonymous', 'last_name': 'User', 'phone_number': '0000000000'}
            )
        print("User recieved")
        json_format = """{
            "incidentType": "Accident",
            "location": "A-201, Shubham CHS, Gaurav garden complex 2, Kandivali West, Mumbai",
            "description": "I've been in a terrible accident",
            "severity": "high"
        }"""

        user_input = request.data.get("user_input", "").strip()
        print(f"Received input: {user_input}")
            
        if not user_input:
            return Response({"error": "user_input is required"}, status=status.HTTP_400_BAD_REQUEST)

        print("user_input successful")
        chain_input = {"user_input": user_input, "json_format": json_format}
        incident = self.chain.invoke(chain_input)

        if isinstance(incident, str):
            try:
                incident = json.loads(incident)
            except json.JSONDecodeError:
                return Response({"error": "Invalid response format from LLM"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        print(incident)
        if 'error' in incident:
            return Response(incident, status=status.HTTP_400_BAD_REQUEST)

        if 'location' not in incident or not incident['location']:
            return Response({"error": "Location not specified in the incident report."}, status=status.HTTP_400_BAD_REQUEST)

        incident['location'] = get_coordinates_from_address(incident['location'])

        serializer = IncidentSerializer(data=incident)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        incident_obj = serializer.save(reported_by=user)

        user_lat = incident['location'].get('latitude')
        user_lon = incident['location'].get('longitude')

        if user_lat is None or user_lon is None:
            return Response({"error": "Invalid location data"}, status=status.HTTP_400_BAD_REQUEST)

        # Nearest stations lookup
        station_map = {
            'Domestic Violence': [PoliceStations],
            'Child Abuse': [PoliceStations],
            'Sexual Harassment': [PoliceStations],
            'Stalking': [PoliceStations],
            'Human Trafficking': [PoliceStations],
            'Fire': [FireStations, PoliceStations, Hospital],
            'Theft': [PoliceStations],
            'Accident': [PoliceStations, Hospital],
            'Missing Persons': [PoliceStations],
            'Other': [None]
        }
        station_models = station_map.get(incident.get('incidentType'), [])
        nearest_stations = {'police_station': None, 'fire_station': None, 'hospital_station': None}

        for station_model in station_models:
            if station_model is None:
                continue
            stations = station_model.objects.all()
            if stations.exists():
                nearest_station = min(stations, key=lambda s: great_circle((user_lat, user_lon), (s.latitude, s.longitude)).km)
                if station_model == PoliceStations:
                    nearest_stations['police_station'] = nearest_station
                elif station_model == FireStations:
                    nearest_stations['fire_station'] = nearest_station
                elif station_model == Hospital:
                    nearest_stations['hospital_station'] = nearest_station

                try:
                    send_email_example("New Incident Alert", f"New {incident['incidentType']} reported at {incident['location']}", nearest_station.email)
                except Exception as e:
                    print(f"Notification error: {str(e)}")

        incident_obj.police_station = nearest_stations['police_station']
        incident_obj.fire_station = nearest_stations['fire_station']
        incident_obj.hospital_station = nearest_stations['hospital_station']
        incident_obj.save()

        return Response({"message": "Incident reported successfully!", "incident_id": incident_obj.id}, status=status.HTTP_201_CREATED)


        



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
        # subject = f"Incident Status Updated: {incident.id}"
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

@api_view(['GET', 'POST'])
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
        incidents = Incidents.objects.filter(police_station=admin.police_station, true_or_false=True)
    elif admin.fire_station is not None:
        incidents = Incidents.objects.filter(fire_station=admin.fire_station, true_or_false=True)
    elif admin.hospital is not None:
        incidents = Incidents.objects.filter(hospital_station=admin.hospital, true_or_false=True)
    else:
        return Response(
            {"error": "Admin is not associated with any station"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Handle toggle requests (POST method)
    if request.method == 'POST':
        incident_id = request.data.get("incident_id")
        if not incident_id:
            return Response({"error": "Incident ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            incident = Incidents.objects.get(id=incident_id)
            incident.true_or_false = not incident.true_or_false  # Toggle flagged state
            incident.save()
            return Response({"message": f"Flagged status toggled to {incident.true_or_false}"}, status=status.HTTP_200_OK)
        except Incidents.DoesNotExist:
            return Response({"error": "Incident not found"}, status=status.HTTP_404_NOT_FOUND)

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

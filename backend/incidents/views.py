from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from geopy.distance import great_circle
from incidents.models import DisasterReliefStations, FireStations, PoliceStations
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
from .models import Incidents, FireStations, PoliceStations, User
from .serializers import IncidentSerializer
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.exceptions import AuthenticationFailed
import logging
logger = logging.getLogger(__name__)
from .models import Incidents  # Replace with your actual model
from .serializers import IncidentSerializer  # Create a serializer for your model

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

        # Validate input
        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        user = get_object_or_404(User, email=email)

        # Verify password
        if not check_password(password, user.password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # Generate tokens
        print(user.id)
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_200_OK)
        
@api_view(['POST'])
def report_incident(request):
    # Extract the Authorization header
    auth_header = request.META.get('HTTP_AUTHORIZATION', None)
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return Response({"error": "Authorization header missing or malformed"}, status=400)
    
    # Extract the token from the header
    token_str = auth_header.split(' ')[1] 
    
    try:
        token = AccessToken(token_str) 
        user = User.objects.get(id=token['user_id'])  
    except (Exception, AuthenticationFailed) as e:
        return Response({"error": f"Invalid or expired token: {str(e)}"}, status=401)
    
    # In case of no token or invalid token, fallback to anonymous user
    if not user:
        user, _ = User.objects.get_or_create(first_name='Anonymous')  # Ensure anonymous user exists

    serializer = IncidentSerializer(data=request.data)

    if serializer.is_valid():
        # Save the incident with the logged-in user
        incident = serializer.save(reported_by=user)

        # Parse and validate location data
        if isinstance(incident.location, str):
            try:
                incident.location = json.loads(incident.location)  # Convert string to JSON object
            except json.JSONDecodeError:
                return Response({"error": "Invalid location data"}, status=400)

        user_lat = incident.location.get('latitude')
        user_lon = incident.location.get('longitude')

        if not user_lat or not user_lon or not isinstance(user_lat, (int, float)) or not isinstance(user_lon, (int, float)):
            return Response({"error": "Location data must include valid latitude and longitude"}, status=400)

        # Map incident type to station model
        station_map = {
            'Fire': FireStations,
            'Theft': PoliceStations,
            'Accident': PoliceStations,
            'Other': None
        }

        station_model = station_map.get(incident.incidentType)

        if station_model:
            try:
                # Fetch all stations and find the nearest one
                stations = station_model.objects.all()
                nearest_station = min(
                    stations,
                    key=lambda station: great_circle(
                        (user_lat, user_lon),
                        (station.latitude, station.longitude)
                    ).km
                )

                # Send SMS and email notifications
                number = '+91' + str(nearest_station.number)
                message = f"New {incident.incidentType} reported at ({user_lat}, {user_lon})"
                send_sms(f"New {incident.incidentType} reported! \nDetails: {incident.description}", number)
                send_email_example("New Incident Alert", f"Details: {serializer.data['description']}", nearest_station.email)
            except Exception as e:
                return Response({"error": f"An error occurred while notifying the station: {str(e)}"}, status=500)

        return Response({"message": "Incident reported successfully!"}, status=201)

    return Response(serializer.errors, status=400)


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


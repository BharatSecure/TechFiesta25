from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from geopy.distance import great_circle
from incidents.models import DisasterReliefStations, FireStations, PoliceStations
from .serializers import IncidentSerializer
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests
import math
from rest_framework.decorators import api_view
from rest_framework.response import Response
from twilio.rest import Client

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Incident
from .serializers import IncidentSerializer
import json
from rest_framework.response import Response
from rest_framework.decorators import api_view
from geopy.distance import great_circle
from .models import Incident, FireStations, PoliceStations
from .serializers import IncidentSerializer

@api_view(['POST'])
def report_incident(request):
    serializer = IncidentSerializer(data=request.data)

    if serializer.is_valid():
        # Save the incident
        incident = serializer.save()

        # Ensure the location field is properly a dictionary (if it's a string)
        if isinstance(incident.location, str):
            try:
                incident.location = json.loads(incident.location)  # Convert string to JSON object
            except json.JSONDecodeError:
                return Response({"error": "Invalid location data"}, status=400)

        # Access latitude and longitude from the location field
        user_lat = incident.location.get('latitude')
        user_lon = incident.location.get('longitude')

        if not user_lat or not user_lon:
            return Response({"error": "Location data is missing latitude or longitude"}, status=400)

        # Map incident type to station model
        station_map = {
            'Fire': FireStations,
            'Theft': PoliceStations,
            'Accident': PoliceStations,
            'Other': None
        }
        
        station_model = station_map.get(incident.incidentType)

        # if station_model:
        #     # Fetch all stations and find the nearest one
        #     stations = station_model.objects.all()
        #     nearest_station = min(stations, key=lambda station: great_circle((user_lat, user_lon), (station.latitude, station.longitude)).km)

        #     # Send SMS and email to the nearest station
        #     message = f"New {incident.incidentType} reported at ({user_lat}, {user_lon})"
        #     send_sms(f"New {incident.incidentType} reported!", nearest_station.number)
        #     send_email_example("New Incident Alert", f"Details: {serializer.data['description']}", nearest_station.email)

        return Response({"message": "Incident reported successfully!"}, status=201)

    return Response(serializer.errors, status=400)

def post(self, request):
    serializer = IncidentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        # send_notification(
        #     "New Incident Reported!",
        #     f"Incident: {serializer.data['title']}"
        #     )
        return Response(serializer.data, status=201)
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

# Function to calculate route distance using Geoapify Route API
def great_circle_distance(lat1, lon1, lat2, lon2):
    # Convert degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
    
    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    # Earth radius in kilometers
    R = 6371.0
    distance = R * c
    return distance


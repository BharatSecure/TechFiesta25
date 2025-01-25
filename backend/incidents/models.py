from django.db import models
from django.conf import settings

class Incident(models.Model):
    INCIDENT_TYPES = [
        ('Fire', 'Fire'),
        ('Theft', 'Theft'),
        ('Accident', 'Accident'),
        ('Other', 'Other'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    incidentType = models.CharField(
        max_length=100, 
        choices=INCIDENT_TYPES, 
        default='Other'
    )
    location = models.CharField(max_length=255, default="None")
    description = models.TextField()
    severity = models.FloatField(choices=SEVERITY_CHOICES, default='Low')
    file = models.FileField(upload_to='incident_files/', blank=True, null=True)
    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.incidentType


class PoliceStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Police Station: {self.id}"

class FireStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Fire Station: {self.id}"

class DisasterReliefStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Disaster Relief Station: {self.id}"

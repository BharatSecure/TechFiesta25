from django.db import models
from django.conf import settings
class Incident(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)
    reports = models.FileField()
    def __str__(self):
        return self.title

class PoliceStations(models.Model):
    location = models.CharField(max_length=100)
    id = models.IntegerField(primary_key=True)
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Police Station: {self.location}"

class FireStations(models.Model):
    location = models.CharField(max_length=100)
    id = models.IntegerField(primary_key=True)
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)
    def __str__(self):
        return f"Fire Station: {self.location}"

class DisasterReliefStations(models.Model):
    location = models.CharField(max_length=100)
    id = models.IntegerField(primary_key=True)
    number = models.CharField(max_length=10)
    email = models.CharField(max_length=200)
    def __str__(self):
        return f"Disaster Relief Station: {self.location}"
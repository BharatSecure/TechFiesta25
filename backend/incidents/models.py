from django.db import models
from django.conf import settings

class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=10, unique=True)
    address = models.TextField()
    aadhar_number = models.CharField(max_length=12, unique=True)
    emergency_contact1 = models.CharField(max_length=10)
    emergency_contact2 = models.CharField(max_length=10)
    password = models.CharField(max_length=128)  # Use hashed passwords in production

    def __str__(self):
        return self.email

class Incidents(models.Model):
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

    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("processing", "Processing"),
        ("completed", "Completed")
    ]

    incidentType = models.CharField(
        max_length=100, 
        choices=INCIDENT_TYPES, 
        default='Other'
    )
    location = models.JSONField()   
    description = models.TextField()
    severity = models.CharField(choices=SEVERITY_CHOICES, default='low', max_length=20)
    file = models.FileField(upload_to='incident_files/', blank=True, null=True)
    
    # Changed this to allow null and removed the default function
    reported_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='incidents',
        null=True,
        blank=True
    )
    reported_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(default='submitted', choices=STATUS_CHOICES, max_length=50)
    remarks = models.CharField(default='None', max_length=300)
    true_or_false = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.incidentType}: {self.id}"
    
class Comment(models.Model):
    comment = models.TextField()
    file = models.FileField(upload_to='comments_files/', blank=True, null=True)
    commented_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    commented_at = models.DateTimeField(auto_now_add=True)
    commented_on = models.ForeignKey(
        Incidents,
        on_delete=models.CASCADE,
        related_name='comments'
    )
    useful = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.commented_by} on Incident {self.commented_on.id}"

class PoliceStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.IntegerField()
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Police Station: {self.id}"

class FireStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.IntegerField()
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Fire Station: {self.id}"

class DisasterReliefStations(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.IntegerField()
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Disaster Relief Station: {self.id}"
    
class Hospital(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.IntegerField()
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"Hospital: {self.id}"
    
class NGO(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    number = models.IntegerField()
    email = models.CharField(max_length=200)

    def __str__(self):
        return f"NGO Station: {self.id}"

class Admin(models.Model):
    email = models.CharField(max_length=225, null=False)
    password = models.CharField(max_length=128)
    # Add foreign key relationships to stations
    police_station = models.OneToOneField(
        PoliceStations, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin"
    )
    fire_station = models.OneToOneField(
        FireStations, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin"
    )
    disaster_relief_station = models.OneToOneField(
        DisasterReliefStations, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin"
    )
    hospital = models.OneToOneField(
        Hospital, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin"
    )
    NGO_station = models.OneToOneField(
        NGO, on_delete=models.SET_NULL, null=True, blank=True, related_name="admin"
    )

    def __str__(self):
        return f"Admin: {self.username} (ID: {self.id})"
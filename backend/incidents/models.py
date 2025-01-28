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

    incidentType = models.CharField(
        max_length=100, 
        choices=INCIDENT_TYPES, 
        default='Other'
    )

    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("processing", "Processing"),
        ("completed", "Completed")
    ]
    location = models.JSONField()   
    description = models.TextField()
    severity = models.CharField(choices=SEVERITY_CHOICES, default='low', max_length=20)
    file = models.FileField(upload_to='incident_files/', blank=True, null=True)

     # Fetch the default user dynamically
    def get_default_user():
        return User.objects.get(first_name='Anonymous').id
    
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='incidents', default=get_default_user)
    reported_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(default='Submitted', choices=STATUS_CHOICES, max_length=50)
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
        return f"Comment by {self.commented_by} on {self.commented_on.title}"  # Adjust 'title' if Incident has a different descriptive field

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

from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils import timezone
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        return self.create_user(email, password, **extra_fields)
class User(AbstractBaseUser):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=10, unique=True)
    address = models.TextField()
    aadhar_number = models.CharField(max_length=12, unique=True)
    emergency_contact1 = models.CharField(max_length=10)
    emergency_contact2 = models.CharField(max_length=10)
    password = models.CharField(max_length=128)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'phone_number', 'aadhar_number']

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    # Add these methods for Django admin compatibility
    def has_perm(self, perm, obj=None):
        # Superusers have all permissions
        return self.is_superuser

    def has_module_perms(self, app_label):
        # Superusers have access to all modules
        return self.is_superuser

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

    def save(self, *args, **kwargs):
        """Automatically hash the password before saving."""
        if not self.password.startswith('pbkdf2_'):  # Avoid rehashing if already hashed
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    def __str__(self):
        return f"Admin: (ID: {self.id})"
    
class Conversation(models.Model):
    user_message = models.TextField(default="None")
    bot_response = models.TextField(default="None")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User: {self.user_message} | Bot: {self.bot_response}"
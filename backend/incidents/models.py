from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.utils import timezone

def get_google_maps_link(latitude, longitude):
    return f"https://www.google.com/maps?q={latitude},{longitude}"
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
class Incidents(models.Model):
    INCIDENT_TYPES = [
        ('Fire', 'Fire'),
        ('Theft', 'Theft'),
        ('Accident', 'Accident'),
        ("Injury", "Injury"),
        ("Missing Persons", "Missing Persons"),
        ("Natural Disaster", "Natural Disaster"),
        ('Other', 'Other'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]

    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("under investigation", "Under Investigation"),
        ("resolved", "Resolved")
    ]

    incidentType = models.CharField(max_length=100, choices=INCIDENT_TYPES, default='Other')
    location = models.JSONField()   
    description = models.TextField()
    severity = models.CharField(choices=SEVERITY_CHOICES, default='low', max_length=20)
    file = models.FileField(upload_to='incident_files/', blank=True, null=True)
    reported_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='incidents',
        null=True,
        blank=True
    )
    reported_at = models.DateTimeField(default=timezone.now)  # Ensuring timezone-aware datetime
    police_station = models.ForeignKey(PoliceStations, on_delete=models.DO_NOTHING, null=True, blank=True)
    fire_station = models.ForeignKey(FireStations, on_delete=models.DO_NOTHING, null=True, blank=True)
    hospital_station = models.ForeignKey(Hospital, on_delete=models.DO_NOTHING, null=True, blank=True)
    status = models.CharField(default='submitted', choices=STATUS_CHOICES, max_length=50)
    remarks = models.CharField(default='None', max_length=300)
    maps_link = models.CharField(default="None", max_length=100)
    score = models.DecimalField(decimal_places=2, default=0, max_digits=4)
    resolved_at = models.DateTimeField(null=True, blank=True)
    true_or_false = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Ensure reported_at is timezone-aware
        if self.reported_at and self.reported_at.tzinfo is None:
            self.reported_at = timezone.make_aware(self.reported_at)

        # Handle anonymous user score
        if self.reported_by and self.reported_by.first_name == 'Anonymous':
            self.score = 50
        else:
            # Efficiently calculate the score
            incidents = Incidents.objects.filter(reported_by=self.reported_by)
            count = incidents.filter(true_or_false=True).count()
            total = incidents.count()
            
            self.score = (count / total) * 100 if total > 0 else 80  # Prevent division by zero

        # Generate Google Maps link safely
        if isinstance(self.location, dict) and 'latitude' in self.location and 'longitude' in self.location:
            self.maps_link = get_google_maps_link(self.location['latitude'], self.location['longitude'])

        # Only set resolved_at when status is updated to "Resolved"
        if self.status == "resolved" and not self.resolved_at:
            self.resolved_at = timezone.now()
        elif self.status != "resolved":
            self.resolved_at = None  # Reset if not resolved

        super().save(*args, **kwargs)

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
    
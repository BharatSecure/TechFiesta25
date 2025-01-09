from django.db import models

class Incident(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Subscription(models.Model):
    endpoint = models.TextField()
    auth = models.TextField()
    p256dh = models.TextField()

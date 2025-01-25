from django.urls import path
from . import views

urlpatterns = [
    path('report-incident/', views.report_incident, name='report_incident'),
    path('send_email/', views.send_email_example, name='send_email'),
    path("emergency-bot/", views.EmergencyHelplineAPIView.as_view(), name="emergency_bot"),
]

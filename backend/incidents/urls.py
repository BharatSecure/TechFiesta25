from django.urls import path
from . import views

urlpatterns = [
    path('report-incident/', views.report_incident, name='report_incident'),
    path('send_email/', views.send_email_example, name='send_email'),
<<<<<<< HEAD
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('api/login/', views.LoginView.as_view(), name='login'),
=======
    path("emergency-bot/", views.EmergencyHelplineAPIView.as_view(), name="emergency_bot"),
>>>>>>> 31c630ed1cc941c1fc5a7e8352f09c3fefb91ba4
]

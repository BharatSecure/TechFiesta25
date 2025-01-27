from django.urls import path
from . import views

urlpatterns = [
    path('report-incident/', views.report_incident, name='report_incident'),
    path('send_email/', views.send_email_example, name='send_email'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path("all_user_incidents/", views.all_user_incidents, name="all_user_incidents"),
    path("all_incidents/", views.all_ongoing_incidents, name='all_ongoing_incidents'),
    path('api/latest-incidents/', views.latest_incidents, name='latest-incidents'),
]

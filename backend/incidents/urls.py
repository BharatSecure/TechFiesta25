from django.urls import path
from . import views

urlpatterns = [
    path('report-incident/', views.report_incident, name='report_incident'),
    path('send_email/', views.send_email_example, name='send_email'),
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('api/login/', views.LoginView.as_view(), name='login'),
    path("all_user_incidents/", views.all_user_incidents, name="all_user_incidents"),
    path("all_incident/", views.all_ongoing_incidents, name='all_ongoing_incidents'),
    path('incidents/<int:incident_id>/comments/', views.CommentListCreateView.as_view(), name='incident-comments'),
    path('get_location/', views.get_location, name='get-location'),
    path('api/latest-incidents/', views.LatestIncidentsView.as_view(), name='latest-incidents'),
    path('all_incidents/', views.all_incidents, name='all-incidents'),
    path('chat-t/', views.ChatbotView_Therapist.as_view(), name='chatbot'),
    path('update_incident/<int:id>/', views.update_incident, name='update-incident'),
    path("incident/<int:id>/", views.view_incident, name="view-incident"),
    path("all_station_incidents/", views.all_station_incidents, name="station-incident"),
    path("voicereport/", views.voicereport.as_view(), name="voice-report"),
]


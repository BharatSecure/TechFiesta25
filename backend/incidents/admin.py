from django.contrib import admin

from .models import Incident, PoliceStations, FireStations, DisasterReliefStations

# Register your models here.
admin.site.register(Incident)
admin.site.register(PoliceStations)
admin.site.register(FireStations)
admin.site.register(DisasterReliefStations)
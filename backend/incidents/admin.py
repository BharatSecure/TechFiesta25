from django.contrib import admin

from .models import Incidents, PoliceStations, FireStations, DisasterReliefStations, User

# Register your models here.
admin.site.register(User)
admin.site.register(Incidents)
admin.site.register(PoliceStations)
admin.site.register(FireStations)
admin.site.register(DisasterReliefStations)
from django.contrib import admin

from .models import Incidents, PoliceStations, FireStations, DisasterReliefStations, User, Comment

# Register your models here.
admin.site.register(User)
admin.site.register(Incidents)
admin.site.register(PoliceStations)
admin.site.register(FireStations)
admin.site.register(DisasterReliefStations)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('comment', 'commented_by', 'commented_at', 'commented_on', 'useful')
    list_filter = ('commented_at', 'useful')
    search_fields = ('comment', 'commented_by__username', 'commented_on__title')  # Adjust 'title' if Incident has a different descriptive field
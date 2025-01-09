from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Incident, Subscription
from .serializers import IncidentSerializer
from webpush import send_user_notification

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from django.views.decorators.csrf import csrf_exempt
from pywebpush import webpush, WebPushException

class ReportIncident(APIView):
    def post(self, request):
        serializer = IncidentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            send_notification(
                "New Incident Reported!",
                f"Incident: {serializer.data['title']}"
            )
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@csrf_exempt
def save_subscription(request):
    if request.method == "POST":
        try:
            subscription_data = json.loads(request.body)
            # Use the 'endpoint' field as a unique identifier
            endpoint = subscription_data.get("endpoint")

            if not endpoint:
                return JsonResponse({"error": "Invalid subscription data"}, status=400)

            # Check if the subscription already exists
            existing_subscription = Subscription.objects.filter(endpoint=endpoint).first()

            if not existing_subscription:
                # Save the subscription if it doesn't exist
                Subscription.objects.create(
                    endpoint=subscription_data["endpoint"],
                    keys=json.dumps(subscription_data["keys"]),
                )
                return JsonResponse({"success": "Subscription saved"}, status=201)

            return JsonResponse({"message": "Subscription already exists"}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)


def send_notification(title, message):
    subscriptions = Subscription.objects.all()
    payload = {"head": title, "body": message}
    for sub in subscriptions:
        send_user_notification(subscription_info={
            "endpoint": sub.endpoint,
            "keys": {"auth": sub.auth, "p256dh": sub.p256dh},
        }, payload=payload, ttl=1000)

@csrf_exempt
def report_incident(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        # Process the incident data (e.g., save to database)
        # Notify all subscribers
        for subscription in Subscription.objects.all():
            try:
                webpush(
                    subscription_info={
                        "endpoint": subscription.endpoint,
                        "keys": {
                            "p256dh": subscription.p256dh,
                            "auth": subscription.auth,
                        }
                    },
                    data=json.dumps({
                        "title": "New Incident Reported",
                        "message": f"{data['incidentType']}: {data['description']}",
                    }),
                    vapid_private_key="bFhHq38UhmlZPJOVvFUycd1lsx3NNs8Ri_riFj_AhQk",
                    vapid_claims={
                        "sub": "mailto:admin@example.com"
                    }
                )
            except WebPushException as ex:
                print(f"Failed to send notification: {ex}")

        return JsonResponse({"message": "Incident reported and notifications sent"})

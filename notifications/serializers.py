from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for the Notification model.
    """
    class Meta:
        model = Notification
        fields = [
            'user', 'message', 'notification_type', 'related_object_id', 
            'is_read', 'created_at'
        ]

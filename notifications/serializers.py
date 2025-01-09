from rest_framework import serializers
from .models import Notification
from django.contrib.contenttypes.models import ContentType

class NotificationSerializer(serializers.ModelSerializer):
    """
    Includes `content_type` and `content_object` for related objects.
    """
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'user', 'message', 'notification_type', 'content_type', 
            'object_id', 'content_object', 'is_read', 'created_at'
        ]
    
    def get_content_object(self, obj):
        """
        This method returns the related object based on
        content_type and object_id.
        It ensures that the correct related model is returned in the response.
        """
        if obj.content_object:
            return {
                'id': obj.content_object.id,
                'model': obj.content_type.model,
                'data': str(obj.content_object)
            }
        return None

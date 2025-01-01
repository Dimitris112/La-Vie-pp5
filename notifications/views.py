from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer
from lavie_backend.permissions import IsOwnerOrReadOnly


class NotificationList(generics.ListAPIView):
    """
    List notifications for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationMarkAsRead(generics.UpdateAPIView):
    """
    Mark notifications as read for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user, is_read=False
        )

    def perform_update(self, serializer):
        serializer.save(is_read=True)

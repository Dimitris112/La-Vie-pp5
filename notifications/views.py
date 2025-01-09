from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated


class NotificationList(generics.ListAPIView):
    """
    Returns a list of notifications for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class NotificationDetail(generics.RetrieveAPIView):
    """
    Retrieve a specific notification for the authenticated user.
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    queryset = Notification.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)


class NotificationMarkAsRead(APIView):
    """
    Marks a specific notification as read for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        notification_id = kwargs.get("pk")
        try:
            notification = Notification.objects.get(
                id=notification_id, user=request.user
            )
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found or does not belong to the "
                           "authenticated user"},
                status=status.HTTP_404_NOT_FOUND
            )

        notification.is_read = True
        notification.save()

        return Response(
            {"message": "Notification marked as read"},
            status=status.HTTP_200_OK
        )


class NotificationBatchMarkAsRead(APIView):
    """
    Marks multiple notifications as read for the authenticated user.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        notification_ids = request.data.get("notification_ids", [])
        if not notification_ids:
            return Response(
                {"error": "No notification IDs provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        notifications = Notification.objects.filter(
            id__in=notification_ids, user=request.user, is_read=False
        )

        if not notifications:
            return Response(
                {"error": "No matching unread notifications found"},
                status=status.HTTP_404_NOT_FOUND
            )

        notifications.update(is_read=True)

        return Response(
            {"message": "Notifications marked as read"},
            status=status.HTTP_200_OK
        )

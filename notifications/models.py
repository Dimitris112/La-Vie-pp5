from django.db import models
from django.contrib.auth.models import User


class Notification(models.Model):
    """
    Notification model that tracks types of notifications
    such as likes, followers, or comments.
    """
    user = models.ForeignKey(
        User, related_name='notifications', on_delete=models.CASCADE
    )
    message = models.TextField()
    notification_type = models.CharField(max_length=50)
    related_object_id = models.PositiveIntegerField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Notification for {self.user}: {self.message}'

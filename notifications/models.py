from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


def get_default_content_type():
    """
    Callable function to get the default content type for the User model.
    Returns the ID of the ContentType object instead of the object itself.
    """
    return ContentType.objects.get_for_model(User).id


class Notification(models.Model):
    """
    Notification model that tracks types of notifications such as likes,
    followers, comments, etc. Uses GenericForeignKey for flexibility in
    relating to any model.
    """
    user = models.ForeignKey(
        User, related_name='notifications', on_delete=models.CASCADE
    )
    message = models.TextField()
    notification_type = models.CharField(max_length=50)

    content_type = models.ForeignKey(
        ContentType, on_delete=models.CASCADE, default=get_default_content_type
    )
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Notification for {self.user}: {self.message}'

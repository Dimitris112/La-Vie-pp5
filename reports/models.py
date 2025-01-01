from django.db import models
from django.conf import settings
from posts.models import Post


class Report(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('under_review', 'Under Review'),
        ('resolved', 'Resolved'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES,
                              default='new')

    def __str__(self):
        return f'Report by {self.user} on {self.post}'

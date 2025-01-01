from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = ['id', 'user', 'post', 'reason', 'created_at', 'status']

    def validate(self, data):
        if Report.objects.filter(user=data['user'],
                                 post=data['post']).exists():
            raise serializers.ValidationError(
                'You have already reported this post.')
        return data

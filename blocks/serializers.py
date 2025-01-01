from rest_framework import serializers
from .models import Block


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['blocker', 'blocked', 'created_at']
        read_only_fields = ['blocker']

    def validate(self, data):
        if data['blocker'] == data['blocked']:
            raise serializers.ValidationError('You cannot block yourself.')
        return data

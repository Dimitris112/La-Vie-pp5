from rest_framework import serializers
from .models import Block


class BlockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Block
        fields = ['blocker', 'blocked', 'created_at']
        read_only_fields = ['blocker', 'created_at']

    def validate(self, data):
        request = self.context.get('request')
        if request.user == data['blocked']:
            raise serializers.ValidationError('You cannot block yourself.')
        return data

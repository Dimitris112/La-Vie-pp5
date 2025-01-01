from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Block
from .serializers import BlockSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from lavie_backend.permissions import IsOwnerOrReadOnly


class BlockCreate(generics.CreateAPIView):
    serializer_class = BlockSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    ]

    def perform_create(self, serializer):
        blocker = self.request.user
        blocked_user = get_object_or_404(
            get_user_model(), pk=self.request.data['blocked']
        )
        if blocker == blocked_user:
            raise ValidationError('You cannot block yourself.')
        serializer.save(blocker=blocker)


class BlockList(generics.ListAPIView):
    serializer_class = BlockSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    ]

    def get_queryset(self):
        return Block.objects.filter(blocker=self.request.user)

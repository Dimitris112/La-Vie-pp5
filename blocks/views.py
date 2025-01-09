from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Block
from .serializers import BlockSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from lavie_backend.permissions import IsOwnerOrReadOnly
from django.db import transaction


class BlockCreate(generics.CreateAPIView):
    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        blocker = self.request.user
        blocked_user = get_object_or_404(
            get_user_model(), pk=self.request.data.get('blocked')
        )

        if Block.objects.filter(
            blocker=blocker, blocked=blocked_user
        ).exists():
            raise ValidationError('You have already blocked this user.')

        with transaction.atomic():
            block = serializer.save(blocker=blocker)
            print(f"Block created: {block}")


class BlockDestroy(generics.DestroyAPIView):
    serializer_class = BlockSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        blocker = self.request.user
        blocked_user = get_object_or_404(
            get_user_model(), pk=self.kwargs['user_id']
        )
        return get_object_or_404(
            Block, blocker=blocker, blocked=blocked_user
        )

    def perform_destroy(self, instance):
        instance.delete()


class BlockList(generics.ListAPIView):
    serializer_class = BlockSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    ]

    def get_queryset(self):
        return Block.objects.filter(blocker=self.request.user)


class BlockedList(generics.ListAPIView):
    serializer_class = BlockSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    ]

    def get_queryset(self):
        return Block.objects.filter(blocked=self.request.user)

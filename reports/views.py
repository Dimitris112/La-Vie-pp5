from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from .models import Report
from .serializers import ReportSerializer
from lavie_backend.permissions import IsOwnerOrReadOnly


class ReportListCreateView(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if Report.objects.filter(
                user=self.request.user,
                post=serializer.validated_data['post']
        ).exists():
            raise ValidationError('You have already reported this post.')
        serializer.save(user=self.request.user)


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsOwnerOrReadOnly
    ]

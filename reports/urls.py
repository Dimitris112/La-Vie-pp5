from django.urls import path
from reports import views

urlpatterns = [
    path('reports/', views.ReportListCreateView.as_view()),
    path('reports/<int:pk>/', views.ReportDetailView.as_view()),
]

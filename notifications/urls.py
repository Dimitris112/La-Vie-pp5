from django.urls import path
from notifications import views

urlpatterns = [
    path('notifications/', views.NotificationList.as_view()),
    path('notifications/mark-as-read/', 
         views.NotificationMarkAsRead.as_view()),
]

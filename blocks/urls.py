from django.urls import path
from blocks import views

urlpatterns = [
    path('blocks/', views.BlockCreate.as_view()),
    path('blocks/<int:user_id>/', views.BlockDestroy.as_view()),
    path('blocks/list/', views.BlockList.as_view()),
    path('blocks/blocked-list/', views.BlockedList.as_view()),
]

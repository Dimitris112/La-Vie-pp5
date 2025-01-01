from django.urls import path
from blocks import views

urlpatterns = [
    path('blocks/', views.BlockCreate.as_view()),
    path('blocks/list/', views.BlockList.as_view()),
]

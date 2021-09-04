from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatroom, name='chatroom'),
    path('upload_photo', views.upload_image, name='upload_photo')
]
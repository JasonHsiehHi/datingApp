from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatroom, name='chatroom'),
    path('upload_photo', views.upload_image, name='upload_photo'),
    path('post_school', views.post_school, name='post_school'),
    path('post_name', views.post_name, name='post_name'),
]
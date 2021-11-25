from django.urls import path
from . import views

urlpatterns = [
    path('', views.chatroom, name='chatroom'),
    path('upload_photo', views.upload_image, name='upload_photo'),
    path('post_school', views.post_school, name='post_school'),
    path('post_name', views.post_name, name='post_name'),
    path('signup', views.signup, name='signup'),
    path('signup/<str:token>', views.activate, name='activate'),
    path('login', views.log_in, name='login'),
    path('logout', views.log_out, name='logout'),
    path('change_pwd', views.change_pwd, name='change_pwd'),
    path('reset_pwd', views.reset_pwd, name='reset_pwd')
]
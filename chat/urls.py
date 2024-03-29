from django.urls import path
from . import views, views_game_graduate_girl

urlpatterns = [
    path('', views.chatroom, name='chatroom'),
    path('greet', views.greet, name='greet'),
    path('post_place', views.post_place, name='post_place'),
    path('post_name', views.post_name, name='post_name'),
    path('signup', views.signup, name='signup'),
    path('signup/<str:token>', views.activate, name='activate'),
    path('login', views.log_in, name='login'),
    path('logout', views.log_out, name='logout'),
    path('change_pwd', views.change_pwd, name='change_pwd'),
    path('reset_pwd', views.reset_pwd, name='reset_pwd'),
    path('start_game', views.start_game, name='start_game'),
    path('start_game/<str:game_name>', views.in_game, name='in_game'),
    path('leave', views.leave, name='leave'),
    path('leave_game', views.leave_game, name='leave_game'),
    path('leave_match', views.leave_match, name='leave_match')
    # path('upload_photo', views.upload_image, name='upload_photo'),
]

# game_graduate_girl
urlpatterns += [
    path('start_game/graduate_girl/prolog', views_game_graduate_girl.prolog, name='prolog'),
    path('start_game/graduate_girl/deduce', views_game_graduate_girl.deduce, name='deduce'),
    path('start_game/graduate_girl/examine/<str:uuid>', views_game_graduate_girl.examine, name='examine'),
    path('start_game/graduate_girl/inquire/<str:uuid>', views_game_graduate_girl.inquire, name='inquire'),
    path('start_game/graduate_girl/clue/<str:uuid>', views_game_graduate_girl.clue, name='clue')
]

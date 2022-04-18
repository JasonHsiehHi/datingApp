from django.urls import path
from . import views_game_cheat_game

urlpatterns = [
    path('prepare_game/cheat_game', views_game_cheat_game.prepare, name='cg_prepare'),
    path('start_game/cheat_game/prolog', views_game_cheat_game.prolog, name='cg_prolog'),
    path('start_game/cheat_game/pass/<str:uuid>', views_game_cheat_game.pass_paper, name='cg_pass'),
    path('start_game/cheat_game/change/<str:uuid>', views_game_cheat_game.change_paper, name='cg_change'),
    path('start_game/cheat_game/match/<str:uuid>', views_game_cheat_game.match, name='cg_match'),
    path('start_game/cheat_game/accept/<str:uuid>', views_game_cheat_game.accept, name='cg_accept'),
    path('start_game/cheat_game/reply', views_game_cheat_game.reply, name='cg_reply')
]
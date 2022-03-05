from django.urls import path
from . import views_game_graduate_girl

urlpatterns = [
    path('prepare_game/male_or_female', views_game_graduate_girl.prepare, name='gg_prepare'),
    path('start_game/graduate_girl/prolog', views_game_graduate_girl.prolog, name='gg_prolog'),
    path('start_game/graduate_girl/deduce', views_game_graduate_girl.deduce, name='gg_deduce'),
    path('start_game/graduate_girl/examine/<str:uuid>', views_game_graduate_girl.examine, name='gg_examine'),
    path('start_game/graduate_girl/inquire/<str:uuid>', views_game_graduate_girl.inquire, name='gg_inquire'),
    path('start_game/graduate_girl/clue/<str:uuid>', views_game_graduate_girl.clue, name='gg_clue')
]



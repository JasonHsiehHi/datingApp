from django.urls import path
from . import views_game_male_or_female

urlpatterns = [
    path('prepare_game/male_or_female', views_game_male_or_female.prepare, name='mof_prepare'),
    path('start_game/male_or_female/prolog', views_game_male_or_female.prolog, name='mof_prolog'),
    path('start_game/male_or_female/deduce', views_game_male_or_female.deduce, name='deduce'),
    path('start_game/male_or_female/examine/<str:uuid>', views_game_male_or_female.examine, name='examine'),
    path('start_game/male_or_female/inquire/<str:uuid>', views_game_male_or_female.inquire, name='inquire'),
    path('start_game/male_or_female/clue/<str:uuid>', views_game_male_or_female.clue, name='clue')
]
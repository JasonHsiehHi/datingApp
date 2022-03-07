from django.urls import path
from . import views_game_male_or_female

urlpatterns = [
    path('prepare_game/male_or_female', views_game_male_or_female.prepare, name='mof_prepare'),
    path('start_game/male_or_female/prolog', views_game_male_or_female.prolog, name='mof_prolog'),
    path('start_game/male_or_female/accept/<str:uuid>', views_game_male_or_female.accept, name='mof_accept'),
    path('start_game/male_or_female/invite/<str:uuid>', views_game_male_or_female.invite, name='mof_invite')
]
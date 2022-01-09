from django.contrib import admin
from .models import Game, Room, Match, Player, School, Dialogue


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'game_id', 'isAdult', 'isHetero', 'best_ratio', 'threshold_ratio')


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    pass


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    pass


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    pass


@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    pass


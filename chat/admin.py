from django.contrib import admin
from .models import Game, Room, Match, Player, Dialogue, City, GameRole, GameEvent


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'game_id', 'isAdult', 'isHetero', 'best_ratio', 'threshold_ratio')
    list_filter = ('isAdult', 'isHetero',)
    search_fields = ('name',)


@admin.register(GameRole)
class GameRoleAdmin(admin.ModelAdmin):
    list_display = ('name', 'gender', 'group', 'game')
    list_filter = ('gender', 'game')


@admin.register(GameEvent)
class GameEventAdmin(admin.ModelAdmin):
    list_display = ('name', 'content', 'group', 'game')
    list_filter = ('game', )

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('create_date', 'city', 'game', 'onoff_dict')
    ordering = ('-create_date',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('room', 'player_list')


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'create_date', 'name', 'status', 'isBanned',
                    'city', 'room', 'match', 'isAdult', 'isHetero', 'game',
                    'waiting_time', 'isPrepared', 'isOn')
    list_filter = ('gender', 'status', 'city', 'room', 'match', 'game', 'isOn')
    search_fields = ('uuid', 'name',)


@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ('dialog', 'game', 'action', 'sub', 'number')
    list_filter = ('game',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'roomNum',
                    'femaleNumForMale', 'maleNumForFemale', 'femaleNumForFemale', 'maleNumForMale')



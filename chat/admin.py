from django.contrib import admin
from .models import Game, Room, Match, Player, Dialogue, City, GameRole, GameEvent


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'game_id', 'isAdult', 'isHetero', 'best_ratio', 'threshold_ratio',
                    'noplayerNum', 'showGender')
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
    list_display = ('id', 'create_date', 'city', 'game', 'onoff_dict', 'player_dict', 'answer')
    ordering = ('-create_date',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'player_list', 'secret')


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'name', 'isOn', 'isPrepared', 'waiting_time', 'status', 'tag_int', 'tag_json',
                    'room', 'match', 'city', 'isAdult', 'isHetero', 'game', 'isBanned', 'create_date')
    list_filter = ('gender', 'isOn', 'status', 'city', 'room', 'match', 'game')
    ordering = ('-isOn',)
    search_fields = ('uuid', 'name',)
    save_as = True


@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ('dialog', 'game', 'action', 'sub', 'number')
    list_filter = ('game',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'roomNum',
                    'femaleNumForMale', 'maleNumForFemale', 'femaleNumForFemale', 'maleNumForMale')



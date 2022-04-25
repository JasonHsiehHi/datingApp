from django.contrib import admin
from .models import Game, Room, Match, Player, Dialogue, City, GameRole, GameEvent


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'game_id', 'best_ratio', 'threshold_ratio',
                    'noPlayerNum', 'showGender', 'available')
    search_fields = ('name', )


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
    list_display = ('id', 'create_date', 'city', 'game', 'onoff_dict', 'player_dict')
    ordering = ('-create_date',)


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('id', 'room', 'player_list', 'secret')


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'gender', 'name', 'isOn', 'isPrepared', 'waiting_time', 'status', 'tag_int',
                    'room', 'match', 'isAdult', 'isHetero', 'isBanned')
    list_filter = ('gender', 'isOn', 'status', 'room', 'match')
    ordering = ('-isOn',)
    search_fields = ('uuid', 'name', 'user__username')
    save_as = True


@admin.register(Dialogue)
class DialogueAdmin(admin.ModelAdmin):
    list_display = ('dialog', 'game', 'action', 'sub', 'number')
    list_filter = ('game',)


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name', 'roomNum',
                    'femaleNumForMale', 'maleNumForFemale', 'femaleNumForFemale', 'maleNumForMale')



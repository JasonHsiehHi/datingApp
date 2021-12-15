from channels.db import database_sync_to_async
from django.db.models import Q, F
from .models import Match, Room, Player, School, Dialogue
import json
from datetime import datetime, timezone
from django.core.cache import cache
from random import randint, sample
from datingApp import settings


@database_sync_to_async
def get_player(user):  # only used in connect()
    try:
        player = Player.objects.get(user=user)
    except Player.DoesNotExist:
        player = None
    return player


@database_sync_to_async
def get_player_by_uuid(uuid):
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = None
    return player


@database_sync_to_async
def refresh_player(player):
    pk = player.uuid
    new_player = Player.objects.get(uuid=pk)
    return new_player


@database_sync_to_async
def refresh_room(room):
    pk = room.id
    new_room = Room.objects.get(id=pk)
    return new_room


@database_sync_to_async
def refresh_match(match):
    pk = match.id
    new_match = Match.objects.get(id=pk)
    return new_match


@database_sync_to_async
def set_player_fields(player, fields: dict):  # LARP
    for field, value in fields.items():
        setattr(player, field, value)
    player.save()
    return player


@database_sync_to_async
def set_room_fields(room, fields: dict):  # LARP
    for field, value in fields.items():
        setattr(room, field, value)
    room.save()
    return room


@database_sync_to_async
def set_match_fields(match, fields: dict):  # LARP
    for field, value in fields.items():
        setattr(match, field, value)
    match.save()
    return match


@database_sync_to_async
def get_room_players(player):  # LARP
    room = player.room
    game = room.game
    return room, game, list(room.player_set.all())  # player太多會有效率問題


@database_sync_to_async
def get_match_players(player):  # LARP
    match = player.match
    return match, list(match.player_list)


@database_sync_to_async
def player_onoff_in_room(player, isOn):  # LARP 用於處理disconnect() 之後要做合併
    player.room.onoff_dict[str(player.uuid)] = isOn
    player.room.save()


@database_sync_to_async
def get_school_roomNum_max():  # LARP school改為city 表示city正在進行的遊戲數量
    school = School.objects.order_by('-roomNum').first()
    return str(school.name), int(school.roomNum)


@database_sync_to_async
def set_player_room(player, room_id, matcherName=None):  # 移植到view_game.py 由views.py執行
    if room_id is None:
        player.status = 0
        player.room = None
        Room.objects.filter(room_id=room_id).delete()  # delete room by the user who leave first
        School.objext.filter(name=str(player.school)).update(roomNum=F('roomNum') - 1)
    else:
        player.status = 3
        room = Room.objects.get(room_id=room_id)
        room.userNum = 2
        room.save()
        player.room = room
        player.anonName = matcherName
        player.waiting_time = None
    player.save()
    return player


@database_sync_to_async
def process_player_wait(player, next_status):  # 移植到views.py start_game
    school, name, matchType = player.school, player.name, player.matchType
    if all([school, name, matchType]) and player.status != next_status:
        player.status = next_status
        player.waiting_time = datetime.now(tz=timezone.utc) if (next_status == 2) else None
        if matchType == 'fm':
            school.femaleNumForMale = school.femaleNumForMale + 1 if (next_status == 2) else school.femaleNumForMale - 1

        elif matchType == 'mf':
            school.maleNumForFemale = school.maleNumForFemale + 1 if (next_status == 2) else school.maleNumForFemale - 1

        elif matchType == 'ff':
            school.femaleNumForFemale = school.femaleNumForFemale + 1 if (next_status == 2) else school.femaleNumForFemale - 1

        elif matchType == 'mm':
            school.maleNumForMale = school.maleNumForMale + 1 if (next_status == 2) else school.maleNumForMale - 1

        player.save()
        school.save()
    return player

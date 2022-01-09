from channels.db import database_sync_to_async
from django.db.models import Q, F
from .models import Match, Room, Player, School, Dialogue



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
def delete_room_by_player(player):  # LARP
    room = player.room
    room.delete()


@database_sync_to_async
def delete_match_by_player(player):  # LARP
    match = player.match
    match.delete()


@database_sync_to_async
def player_onoff_in_room(player, isOn):  # LARP 用於處理disconnect() 之後要做合併
    player.room.onoff_dict[str(player.uuid)] = isOn
    player.room.save()


@database_sync_to_async
def get_school_roomNum_max():  # LARP school改為city 表示city正在進行的遊戲數量
    school = School.objects.order_by('-roomNum').first()
    return str(school.name), int(school.roomNum)

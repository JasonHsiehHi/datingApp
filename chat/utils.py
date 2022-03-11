from channels.db import database_sync_to_async
# from django.db.models import Q, F
from .models import Match, Room, Player


@database_sync_to_async
def get_player(user):  # only used in connect()
    try:
        player = Player.objects.get(user=user)
    except Player.DoesNotExist:
        player = None
    return player


@database_sync_to_async
def get_player_by_uuid(uuid):  # haven't been used
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = None
    return player


@database_sync_to_async
def refresh_instance(instance):
    instance.refresh_from_db()
    return instance


@database_sync_to_async
def refresh_player(player):  # use refresh_from_db() instead
    pk = player.uuid
    new_player = Player.objects.get(uuid=pk)
    return new_player


@database_sync_to_async
def refresh_room(room):  # use refresh_from_db() instead
    pk = room.id
    new_room = Room.objects.get(id=pk)
    return new_room


@database_sync_to_async
def refresh_match(match):  # use refresh_from_db() instead
    pk = match.id
    new_match = Match.objects.get(id=pk)
    return new_match


@database_sync_to_async
def set_player_fields(player, fields: dict, refresh=False):
    if refresh is True:
        player.refresh_from_db()
    for field, value in fields.items():
        setattr(player, field, value)
    player.save()
    return player


@database_sync_to_async
def set_room_fields(room, fields: dict, refresh=False):
    if refresh is True:
        room.refresh_from_db()
    for field, value in fields.items():
        setattr(room, field, value)
    room.save()
    return room


@database_sync_to_async
def set_match_fields(match, fields: dict, refresh=False):
    if refresh is True:
        match.refresh_from_db()
    for field, value in fields.items():
        setattr(match, field, value)
    match.save()
    return match


@database_sync_to_async
def get_room_players(player, hasPlayerList=True):
    room = player.room
    room.refresh_from_db()
    game = room.game
    if hasPlayerList is True:
        return room, game, list(room.players.all())  # player太多會有效率問題
    else:
        return room, game


@database_sync_to_async
def get_match_players(player):
    match = player.match
    match.refresh_from_db()
    return match, list(match.player_list)


@database_sync_to_async
def delete_room_by_player(player):
    room = player.room
    if room is not None:
        room.delete()


@database_sync_to_async
def delete_match_by_player(player):
    match = player.match
    if match is not None:
        match.delete()


@database_sync_to_async
def player_onoff_in_room(player, isOn):  # 處理disconnect() 之後要做合併
    room = player.room
    room.refresh_from_db()
    room.onoff_dict[str(player.uuid)] = isOn
    room.save()

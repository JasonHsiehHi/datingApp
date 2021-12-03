from channels.db import database_sync_to_async
from django.db.models import Q, F
from .models import Room, Player, School, Question, Dialogue, Robot
import json
from datetime import datetime, timezone
from django.core.cache import cache
from random import randint, sample
import sys
from datingApp import settings


@database_sync_to_async
def get_player(uuid):
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = None
    return player


@database_sync_to_async
def delete_player(uuid):
    player = Player.objects.get(uuid=uuid)
    player.delete()


@database_sync_to_async
def refresh_player(player):
    if player is None:
        new_player = None
    else:
        uuid = player.uuid
        new_player = Player.objects.get(uuid=uuid)
    return new_player


@database_sync_to_async
def set_player_data(player, data):  # 刪掉
    correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', settings.QUESTION_CORRECT_RESULT, None)
    if 'room' in data:
        data['room'] = Room.objects.get(room_id=data['room'])
    if 'school' in data:
        data['school'] = School.objects.get(name=data['school'])
    if 'waiting_time' in data:
        data['waiting_time'] = datetime.strptime(data['waiting_time'], '%Y-%m-%d %H:%M:%S')
    if 'testResult' in data and len(data['testResult']) == len(correct_result):
        count = 0
        for i, j in zip(data['testResult'], correct_result):
            count = count + 1 if (i == j) else count
        data['score'] = count

    Player.objects.filter(uuid=player.uuid).update(**data)
    player = Player.objects.get(uuid=player.uuid)
    return player


@database_sync_to_async
def set_player_school(player, school_name):  # 刪掉
    school = School.objects.get(name=school_name)
    player.school = school
    player.save()
    return player


@database_sync_to_async
def set_player_profile(player, name, matchType=None):  # 刪掉
    player.name = name
    if matchType is not None:
        player.matchType = matchType
    player.save()
    return player


@database_sync_to_async
def set_player_room(player, room_id, matcherName=None):  # LARP room改為match  且改到views.py執行
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
def set_player_status(player, next_status):  # 刪掉 合併到views.py
    if player.status != next_status:
        player.status = next_status
        player.save()
    return player


@database_sync_to_async
def set_player_isPrepared(player, isPrepared):  # LARP
    player.isPrepared = isPrepared
    player.save()
    return player


@database_sync_to_async
def set_player_isOn(player, isOn):  # LARP isPrepared, isOnOff都用於處理disconnect() 之後要做合併
    player.isPrepared = isOn
    player.save()
    return player


@database_sync_to_async
def player_onoff(player, isOn):  # LARP 用於處理disconnect() 之後要做合併
    player.room.onoff_dict[int(player.user.id)] = isOn
    player.room.save()


@database_sync_to_async
def set_player_imgUrl(player, imgUrl):
    player.imgUrl_adult = imgUrl
    player.save()
    return player


@database_sync_to_async
def create_room(id, matchType, school_id):
    room = Room.objects.create(room_id=id, matchType=matchType, school=school_id)
    School.objext.filter(name=school_id).update(roomNum=F('roomNum') + 1)
    return str(room.id)


@database_sync_to_async
def set_room_userNum(room_id, is_disconnected):
    room = Room.objects.get(room_id=room_id)
    n = -1 if is_disconnected else 1
    room.userNum = room.userNum + n
    room.save()
    return int(room.userNum)


@database_sync_to_async
def get_room_userNum(room_id):
    room = Room.objects.get(room_id=room_id)
    return int(room.userNum)


@database_sync_to_async
def set_player_score(player, testResult):  # 刪掉
    correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', settings.QUESTION_CORRECT_RESULT, None)
    player.testResult = testResult
    if len(testResult) == 0:
        player.score = None
    else:
        count = 0
        for i, j in zip(testResult, correct_result):
            count = count + 1 if (i == j) else count
        player.score = count
    player.save()
    return player


@database_sync_to_async
def process_player_wait(player, next_status):  # 刪掉 合併到進入房間 Match
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


@database_sync_to_async
def process_player_match(someone):  # 刪掉
    match_type = someone.matchType
    players_in = Player.objects.filter(Q(school=someone.school) & Q(status=2))

    if match_type == 'fm' or match_type == 'mf':
        players_in = players_in.filter(matchType=match_type[1]+match_type[0])
    else:
        players_in = players_in.exclude(uuid=someone.uuid).filter(matchType=match_type)
    num = len(players_in)
    if num < 1:
        return None, None

    scoreDiffs = [abs(p.score-someone.score) for p in players_in]
    durations = [(someone.waiting_time-p.waiting_time) for p in players_in]
    li = [x - duration_to_score(y)for x, y in zip(scoreDiffs, durations)]
    min_li = min(li)
    matches = []
    for i, j in zip(durations, li):  # consider more one matchers with same score.
        match = i if j == min_li else 0
        matches.append(match)
    matcher = players_in[matches.index(max(matches))]
    return str(matcher.uuid), str(matcher.name)


def duration_to_score(duration):  # 刪掉
    score_reduction = int(duration.seconds / 60 / settings.MINUTES_FOR_DURATION_TO_SCORE)
    return score_reduction


@database_sync_to_async
def get_school_roomNum_max():  # LARP school改為city 表示city正在進行的遊戲數量
    school = School.objects.order_by('-roomNum').first()
    return str(school.name), int(school.roomNum)


@database_sync_to_async
def get_dialogue_greet_sub(speaker, time):
    time_ranges = cache.get('GREET_TIME_RANGE-{}'.format(speaker))
    if time_ranges is None:
        dialogues = Dialogue.objects.filter(speaker=speaker).filter(action='GREET').filter(sub__startswith='t').filter(number=1)
        time_ranges = [[dialogue.sub[1:3], dialogue.sub[4:6]] for dialogue in dialogues]
        cache.set('GREET_TIME_RANGE-{}'.format(speaker), time_ranges, None)

    true_list = []
    for r in time_ranges:
        start, end = int(r[0]), int(r[1])
        if start <= end:
            if start <= time < end:
                true_list.append(r)
        else:
            if start <= time or time < end:
                true_list.append(r)
    time_range = true_list[randint(0, len(true_list) - 1)]
    sub = 't' + time_range[0] + '-' + time_range[1]
    return sub


@database_sync_to_async
def get_dialogue_dialog(speaker, action, sub, n=None):
    if n is None:
        dialogues = Dialogue.objects.filter(speaker=speaker).filter(action=action).filter(sub=sub)
        dialogue = dialogues[randint(0, len(dialogues)-1)]
    else:
        dialogue = Dialogue.objects.get(speaker=speaker, action=action, sub=sub, number=n)
    return dialogue.dialog


@database_sync_to_async
def get_robot_name(speaker):  # 刪掉
    robot = Robot.objects.get(id=speaker)
    return str(robot.name)


@database_sync_to_async
def get_question_id_list_randomly(n=5, s_l_ratio=None):  # 刪掉
    if s_l_ratio is None:
        s_l_ratio = [3, 2]
    id_list = []
    for x, i in zip(['s', 'l'], s_l_ratio):
        questions = Question.objects.filter(type=x)
        all_id = questions.values_list('id', flat=True)
        random_id = sample(list(all_id), i)
        id_list.extend(random_id)
    return id_list


@database_sync_to_async
def get_question_content_list(id_list):  # 刪掉
    questions = Question.objects.filter(id__in=id_list).values('content', 'choice')
    return list(questions)


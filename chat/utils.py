from channels.db import database_sync_to_async
from django.db.models import Q, F
from .models import Room, Player, School, Question, Dialogue, Robot
import json
import datetime
from django.core.cache import cache
from random import randint, sample
import sys
from datingApp import settings


@database_sync_to_async
def get_player(uuid):
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = Player.objects.create(uuid=uuid)
    return player


@database_sync_to_async
def set_player_data(player, data):  # todo 用戶直接改localStorage問題
    correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', settings.QUESTION_CORRECT_RESULT, None)
    if 'room' in data:
        data['room'] = Room.objects.get(id=data['room'])
    if 'school' in data:
        data['school'] = School.objects.get(name=data['school'])
    if 'waiting_time' in data:
        data['waiting_time'] = datetime.datetime.strptime(data['waiting_time'], '%Y-%m-%d %H:%M:%S')
    if 'testResult' in data and len(data['testResult']) == len(correct_result):
        count = 0
        for i, j in zip(data['testResult'], correct_result):
            count = count + 1 if (i == j) else count
        data['score'] = count

    Player.objects.filter(uuid=player.uuid).update(**data)
    player = Player.objects.get(uuid=player.uuid)
    return player


@database_sync_to_async
def delete_player(uuid):
    player = Player.objects.get(uuid=uuid)
    player.delete()


@database_sync_to_async
def set_player_school(player, school_name):
    school = School.objects.get(name=school_name)
    player.school = school
    player.save()
    return player


@database_sync_to_async
def set_player_profile(player, name, matchType=None):
    player.name = name
    if matchType is not None:
        player.matchType = matchType
    player.save()
    return player


@database_sync_to_async
def set_player_room(player, room_id, matcherName=None):
    if room_id is None:
        player.status = 0
        player.room = None
        Room.objects.filter(id=room_id).delete()  # delete room by the user who leave first
        School.objext.filter(name=str(player.school)).update(roomNum=F('roomNum') - 1)
    else:
        player.status = 3
        room = Room.objects.get(id=room_id)
        room.userNum = 2
        room.save()
        player.room = room
        player.anonName = matcherName
        player.waiting_time = None
    player.save()
    return player


@database_sync_to_async
def set_player_status(player, status):
    player.status = status
    player.save()
    return player

@database_sync_to_async
def create_room(matchType, school_id):
    room = Room.objects.create(matchType=matchType, school=school_id)
    School.objext.filter(name=school_id).update(roomNum=F('roomNum') + 1)
    return str(room.id)


@database_sync_to_async
def set_room_userNum(room_id, is_disconnected):
    room = Room.objects.get(id=room_id)
    n = -1 if is_disconnected else 1
    room.userNum = room.userNum + n
    room.save()
    return int(room.userNum)


@database_sync_to_async
def get_room_userNum(room_id):
    room = Room.objects.get(id=room_id)
    return int(room.userNum)


@database_sync_to_async
def set_player_score(player, testResult):
    correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', ['1', '1', '1', '1', '1'], None)
    player.testResult = testResult
    count = 0
    for i, j in zip(testResult, correct_result):
        count = count + 1 if (i == j) else count
    player.score = count
    player.save()
    return player


@database_sync_to_async
def process_player_wait(player, next_status):
    school, matchType = player.school, player.matchType
    if all([school, matchType]) & player.status != next_status:
        player.status = next_status
        player.waiting_time = datetime.datetime.now(tz=datetime.timezone.utc) if (next_status == 2) else None
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
def process_player_match(someone):
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


def duration_to_score(duration):
    score_reduction = int(duration.seconds/60/settings.MINUTES_FOR_DURATION)
    return score_reduction


@database_sync_to_async
def check_players_num(school_id, target_matchType):  # todo 應與其他process合併 減少訪問資料庫
    school = School.objects.get(name=school_id)
    players_in = Player.objects.filter(Q(school=school) & Q(status=2) & Q(matchType=target_matchType))
    num = len(players_in)
    if target_matchType == 'fm' or target_matchType == 'mf':
        isEnough = True if num >= 1 else False
    else:
        isEnough = True if num >= 2 else False
    return isEnough  # 若為false則wait 若為true則match


@database_sync_to_async
def get_school_roomNum_max():
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
def get_robot_name(speaker):
    robot = Robot.objects.get(id=speaker)
    return str(robot.name)


@database_sync_to_async
def get_question_id_list_randomly(n=5, s_l_ratio=None):
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
def get_question_content_list(id_list):
    questions = Question.objects.filter(id__in=id_list).values('content', 'choice')
    return list(questions)


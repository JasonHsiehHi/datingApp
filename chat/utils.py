from channels.db import database_sync_to_async
from django.db.models import Q
from .models import Room, Player, School, Question, Dialogue
import json
import datetime
from random import randint, sample
import sys


@database_sync_to_async
def get_player(uuid):
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = Player.objects.create(uuid=uuid)
    return player


@database_sync_to_async
def set_player_data(player, data):  # todo 用戶直接改localStorage問題
    if 'room' in data:
        data['room'] = Room.objects.get(group_name=data['room'])
    if 'school' in data:
        data['school'] = School.objects.get(name=data['school'])
    if 'waiting_time' in data:
        data['waiting_time'] = datetime.datetime.strptime(data['waiting_time'], '%Y%m%d%H%M%S%f')
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
def set_player_room(player, room_name):
    if room_name is None:
        player.room = None
        player.inRoom = False
    else:
        player.room = room_name
        player.inRoom = True
        player.isWaiting = False
    player.save()
    return player


@database_sync_to_async
def create_room(matchType, school_id):
    room = Room.objects.create(matchType=matchType, school=school_id)
    return room


@database_sync_to_async
def set_player_score(player, testResult, correct_result):
    player.testResult = testResult
    count = 0
    for i, j in zip(testResult, correct_result):
        count = count + 1 if (i == j) else count
    player.score = count
    player.save()
    return player


@database_sync_to_async
def process_player_wait(player, isWaiting):
    school, matchType = player.school, player.matchType
    if all([school, matchType]) & player.isWaiting != isWaiting:
        player.isWaiting = isWaiting
        player.waiting_time = datetime.datetime.now() if isWaiting else None
        if matchType == 'fm':
            school.femaleNumForMale = school.femaleNumForMale + 1 if isWaiting else school.femaleNumForMale - 1

        elif matchType == 'mf':
            school.maleNumForFemale = school.maleNumForFemale + 1 if isWaiting else school.maleNumForFemale - 1

        elif matchType == 'ff':
            school.femaleNumForFemale = school.femaleNumForFemale + 1 if isWaiting else school.femaleNumForFemale - 1

        elif matchType == 'mm':
            school.maleNumForMale = school.maleNumForMale + 1 if isWaiting else school.maleNumForMale - 1
        player.save()
        school.save()
    return player


@database_sync_to_async
def process_player_match(someone):
    match_type = someone.matchType
    players_in = Player.objects.filter(Q(school=someone.school) & Q(isWaiting=True))

    if match_type == 'fm' or match_type == 'mf':
        players_in = players_in.filter(matchType=match_type[1]+match_type[0])
    else:
        players_in = players_in.exclude(uuid=someone.uuid).filter(matchType=match_type)
    num = len(players_in)
    if num < 1:
        return None, None
    scoreDiffs = [abs(p.score-someone.score) for p in players_in]
    waitingTimes = [(someone.waiting_time-p.waiting_time) for p in players_in]
    li = list(map(lambda x, y: x - waitingTime_to_score(y), zip(scoreDiffs, waitingTimes)))
    min_li = min(li)
    matches = []
    for i, j in zip(waitingTimes, li):  # consider more one matchers with same score.
        match = i if j == min_li else 0
        matches.append(match)
    matcher = players_in[matches.index(max(matches))]
    return matcher.uuid, matcher.name


def waitingTime_to_score(waitingTime):
    score_reduction = int(waitingTime.minutes / 20)
    return score_reduction


@database_sync_to_async
def check_players_num(school_id, target_matchType):  # todo 應與其他process合併 減少訪問資料庫
    school = School.objects.get(name=school_id)
    players_in = Player.objects.filter(Q(school=school) & Q(isWaiting=True) & Q(matchType=target_matchType))
    num = len(players_in)
    if target_matchType == 'fm' or target_matchType == 'mf':
        isEnough = True if num >= 1 else False
    else:
        isEnough = True if num >= 2 else False
    return isEnough  # 若為false則wait 若為true則match


@database_sync_to_async
def get_dialogue_dialog_and_speaker(speaker, action, sub=None, n=None):
    if n is None:
        dialogues = Dialogue.objects.filter(action=action).filter(Q(sub=sub) | Q(sub=None)).filter(speaker=speaker)
        num = len(dialogues)
        dialogue = dialogues[randint(0, num-1)]
    else:
        dialogue = Dialogue.objects.get(action=action, sub=sub, number=n)

    return dialogue.dialog, dialogue.speaker.name


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


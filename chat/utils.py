from channels.db import database_sync_to_async
from django.db.models import Q
from .models import Room, Player, School, Question, Dialogue
from .exceptions import DatabaseError
import json
from random import randint, sample
import sys


@database_sync_to_async
def get_player(uuid):
    try:
        player = Player.objects.get(uuid=uuid)
    except Player.DoesNotExist:
        player = Player.objects.create(uuid=uuid)
        player.save()
    return player


@database_sync_to_async
def delete_player(uuid):
    player = Player.objects.get(uuid=uuid)
    player.delete()


@database_sync_to_async
def get_school_url(name):
    school = School.objects.get(name=name)
    return school.url


@database_sync_to_async
def set_player_profile(pk_uuid, name, matchType=None):
    player = Player.objects.get(uuid=pk_uuid)
    player.name = name
    if matchType is not None:
        player.matchType = matchType
    player.save()
    return player


@database_sync_to_async
def create_room(matchType, school_id):
    room = Room.objects.create(matchType=matchType, school=school_id)
    room.save()
    return room


@database_sync_to_async
def set_player_score(pk_uuid, result, correct_result):
    player = Player.objects.get(uuid=pk_uuid)
    player.result = json.dumps(result)
    count = 0
    for i, j in zip(result, correct_result):
        count = count + 1 if (i == j) else count
    player.score = count
    player.save()
    return count


@database_sync_to_async
def process_player_wait(pk_uuid, isWaiting):  # todo 直接讓self.user_data儲存QuerySet物件 就不用找uuid
    player = Player.objects.get(uuid=pk_uuid)
    school, matchType = player.school, player.matchType
    if all([school, matchType]) & player.isWaiting != isWaiting:
        player.isWaiting = isWaiting
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


@database_sync_to_async
def process_player_match(someone_pk_uuid):
    someone = Player.objects.get(uuid=someone_pk_uuid)
    match_type = someone.matchType
    players_in = Player.objects.filter(Q(school=someone.school) & Q(isWaiting=True))

    if match_type is None:
        raise DatabaseError("WARNING:match_type hasn't be filled")
    else:
        if match_type == 'fm' or match_type == 'mf':
            players_in = players_in.filter(matchType=match_type[1]+match_type[0])
        else:
            players_in = players_in.exclude(uuid=someone_pk_uuid).filter(matchType=match_type)
        num = len(players_in)
        if num < 1:
            return None
        scores = [p.score for p in players_in]
        waitingTimes = [p.waitingTime for p in players_in]
        someone_score = someone.score
        li = list(map(lambda x, y: abs(x - someone_score) - waitingTime_to_score(y), zip(scores, waitingTimes)))
        min_li = min(li)
        matches = []
        for i, j in zip(waitingTimes, li):
            match = i if j == min_li else 0
            matches.append(match)
        matcher = players_in[matches.index(max(matches))]
        return matcher.uuid, matcher.name


def waitingTime_to_score(waitingTime):
    score = int(waitingTime / 1000 / 60 / 20)
    return score


@database_sync_to_async
def check_players_num(school_id, target_matchType):  # 應與其他process合併 減少訪問database的機會
    school = School.objects.get(name=school_id)
    players_in = Player.objects.filter(Q(school=school) & Q(isWaiting=True) & Q(matchType=target_matchType))
    num = len(players_in)
    if target_matchType == 'fm' or target_matchType == 'mf':
        isEnough = True if num >= 1 else False
    else:
        isEnough = True if num >= 2 else False
    return isEnough  # 若為false則wait 若為true則match


@database_sync_to_async
def get_dialogue_dialog(action, sub=None, n=None):
    if n is None:
        dialogues = Dialogue.objects.filter(action=action).filter(Q(sub=sub) | Q(sub=None))
        num = len(dialogues)
        dialogue = dialogues[randint(0, num-1)]
    else:
        dialogue = Dialogue.objects.get(action=action, sub=sub, number=n)

    return dialogue.dialog, dialogue.speaker.name


@database_sync_to_async
def get_question_content_list(correct_result):  # todo 抓過一次要進cache 以避免一直重複抓取
    answers_num = len(correct_result)
    short_questions = Question.objects.filter(type='s').values('content', 'choice')
    long_questions = Question.objects.filter(type='l').values('content', 'choice')
    questions = sample(list(short_questions), k=int(answers_num-answers_num/2))
    questions.extend(sample(list(long_questions), k=int(answers_num/2)))
    return questions


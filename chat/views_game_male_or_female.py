from django.http import JsonResponse

from datingApp import settings
from django.db.models import Q
from .models import Match, Player, GameEvent

from random import sample
from datetime import datetime, timezone, timedelta


def reply(request):
    if request.is_ajax and request.method == "POST":
        msg = request.POST['send-text']
        ith = request.POST['send-tag']
        self_player = request.user.profile
        room = self_player.room
        answer_dict = room.answer
        length = len(answer_dict['realtime'])
        if length < ith:  # 空題：前幾題都沒有人回答 需把answer_dict['realtime']填滿
            answer_dict['realtime'].extend([['no_news']] * (ith - length))

        answer_dict['realtime'][ith - 1].append('{}: {}'.format(self_player.name, msg))
        if length == ith:  # the player to reply first
            answer_dict['realtime'].append(['no_news'])
        elif length > ith:
            answer_dict['realtime'][ith][0] = 'no_news'

        room.answer = answer_dict
        room.save()
        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def invite(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int == 1:
            return JsonResponse({"result": False, "msg": '你已經邀請過其他人了哦！'})
        elif self_player.tag_int == 2:
            return JsonResponse({"result": False, "msg": '你已接受其他人的邀請了哦。'})

        opposite = Player.objects.get(uuid=uuid)
        opposite.tag_json[self_uuid] = 1
        opposite.save()

        self_player.tag_int = 1
        self_player.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def accept(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if self_player.tag_int == 2:
            return JsonResponse({"result": False, "msg": '你已接受其他人的邀請了哦。'})
        opposite = Player.objects.get(uuid=uuid)
        if opposite.tag_int == 2:
            return JsonResponse({"result": False, "msg": '對方已接受其他人的邀請。'})

        match = Match.objects.create(room=self_player.room, player_list=[str(opposite.uuid), str(self_player.uuid)])
        for player in [self_player, opposite]:
            player.match = match
            player.status = 3
            player.tag_int = 2
            player.save()

        return JsonResponse({"result": True, "player_list": match.player_list})
    else:
        print("error: it's not through ajax.")


def prepare(request):  # only the game creator needs to do prepare()
    if request.is_ajax and request.method == 'GET':
        self_player = request.user.profile
        game = self_player.game
        room = self_player.room
        players = room.players.all()
        playerNum = len(players)

        onoff_dict = {}
        player_dict = {}
        answer_dict = {}
        gender_ratio = [0, 0]
        for player in players:
            uuid = str(player.uuid)
            onoff_dict[uuid] = 1 if player.isOn is True else 0

            gender = player.gender if game.showGender is True else 'n'
            player_dict[uuid] = [player.name, gender]

            if player.gender == 'f':
                gender_ratio[0] += 1
            else:
                gender_ratio[1] += 1

        num = settings.QUESTION_NUM
        all_questions = GameEvent.objects.filter(Q(game=game))
        questions = sample(list(all_questions), num)

        prolog_time = settings.PROLOG_SEC + settings.PROLOG_SEC_PER_PLAYER * playerNum
        interval_time = 0
        interval1 = settings.QUESTION_INTERVAL_SEC
        interval2 = settings.REPLY_INTERVAL_SEC

        timetable = {}
        for i, question in zip(range(1, num+1), questions):
            t = datetime.now(tz=timezone.utc) + timedelta(seconds=prolog_time+interval_time)
            t_str = t.strftime('%Y-%m-%d %H:%M:%S')
            timetable[i] = [t_str, question.content]
            # todo 依據question.content的限時回答時間來調整題目間隔
            interval_time += interval1

            t = datetime.now(tz=timezone.utc) + timedelta(seconds=prolog_time + interval_time)
            t_str = t.strftime('%Y-%m-%d %H:%M:%S')
            timetable[i] = [t_str, 'pop_news']
            interval_time += interval2

        answer_dict['timetable'] = timetable
        answer_dict['realtime'] = [['no_news']]  # from the second emlt, the contents are real msgs sent by players
        answer_dict['gender_ratio'] = gender_ratio

        room.onoff_dict = onoff_dict
        room.player_dict = player_dict
        room.answer = answer_dict
        room.save()

        # todo 更新city的room數量

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def prolog(request):  # every game participant needs to do prolog()
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        room = self_player.room
        if self_player.tag_json is None and self_player.tag_int is None:
            # tag_json and tag_int are different in individual game, so they are set up in individual game
            di = {uuid: 0 for uuid in dict(room.player_dict).keys()}
            di['msgbox'] = []
            self_player.tag_json = di
            self_player.tag_int = 0
            self_player.save()

        guest_dialogs = []
        gender_ratio = room.answer['gender_ratio']
        text = "配對人數：{}女 vs {}男".format(gender_ratio[0], gender_ratio[1])
        guest_dialogs.append([text, False, "s"])

        for player in room.player_dict:
            text = "<span class='a-point'>" + player[0] + "</span>😎"
            guest_dialogs.append([text, False, "s"])

        timetable = room.answer['timetable']
        for key in timetable.keys():
            timetable[key] = True if key % 2 == 1 else False

        return JsonResponse({"result": True, "tag_json": self_player.tag_json, "tag_int": self_player.tag_int,
                             "guest_dialogs": guest_dialogs, "timetable": timetable})
    else:
        print("error: it's not through ajax.")


def report(request):  # 檢舉功能 : let people leave match
    if request.is_ajax and request.method == "POST":
        self_player = request.user.profile
        match = self_player.match
        players = Player.objects.filter(match=match)
        leave_dict = request.POST  # out_dict[uuid]= -1 則離開
        leave_players = [uuid for uuid, v in leave_dict.items() if v == -1]

        for uuid in leave_players:
            match.player_list.remove(uuid)
            player = players.get(uuid=uuid)
            player.status = 2
            player.match = None
            player.save()
        match.save()
        # 前端ajax的success需要進行callSendWs() 告知其他人這個人離開了
        return JsonResponse({"result": True, "leave_players": leave_players})
    else:
        print("error: it's not through ajax.")

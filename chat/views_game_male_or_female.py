from django.http import JsonResponse

from datingApp import settings
from django.db.models import Q
from .models import Match, Player, GameEvent

from random import randint, sample
from datetime import datetime, timezone, timedelta


def examine(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if len(self_player.tag_json) == 0 or self_player.tag_json[uuid] != 0:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})
        room = self_player.room
        onoff_list = [1 for v in dict(room.onoff_dict).values() if v != -1]
        onoff_num = len(onoff_list)

        examinee = Player.objects.get(uuid=uuid)
        match = Match.objects.create(room=self_player.room, player_list=[str(examinee.uuid), str(self_player.uuid)])

        self_player.tag_json[uuid] = 1  # 被審問的對象要被紀錄在偵探的tag_json 直到deduce後才會全部為0
        for player in [self_player, examinee]:
            player.match = match
            player.status = 3
            player.waiting_time = datetime.now(tz=timezone.utc) + timedelta(minutes=settings.ROOMTIME_MIN[onoff_num])
            player.save()

        # todo 需要準備計時 且consumer每次都要讀取 不同於waiting_time 需改為倒數計時

        return JsonResponse({"result": True, "player_list": match.player_list})
    else:
        print("error: it's not through ajax.")


def deduce(request):
    if request.is_ajax and request.method == "POST":
        deduce_dict = request.POST.dict()
        deduce_dict.pop('csrfmiddlewaretoken')
        self_player = request.user.profile
        if len(self_player.tag_json) == 0:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})

        room = self_player.room
        # format of room.answer: {player_uuid: [gameevent_name, gameevent_content], ...}
        answer_dict = {uuid: li[0] for uuid, li in dict(room.answer).items()}
        players = Player.objects.filter(room=room)
        out_list = []

        for uuid, name in deduce_dict.items():
            self_player.tag_json[uuid] = 0

            if name == answer_dict[uuid]:
                if name == '與偵探發生關係':  # everyone are out
                    players.exclude(uuid=self_player.uuid).update(status=0, room=None, tag_int=None, tag_json=None)
                    out_list = list(deduce_dict.keys())
                    room.onoff_dict = {key: -1 for key in dict(room.onoff_dict)}
                    room.save()
                    return JsonResponse({"result": True, "over": True, "out_players": out_list})

                out_list.append(uuid)
                room.onoff_dict[uuid] = -1

                player = players.get(uuid=uuid)  # make player out of game
                player.status = 0
                player.room = None
                player.tag_int = None
                player.save()

            else:
                player = players.get(uuid=uuid)  # make player into next round
                player.tag_int = 0
                player.save()

        self_player.save()
        room.save()
        return JsonResponse({"result": True, "over": False, "out_players": out_list})
    else:
        print("error: it's not through ajax.")


def clue(request, uuid):
    if request.is_ajax and request.method == "POST":
        message = request.POST['clue-input']
        self_player = request.user.profile
        if self_player.tag_int != 1:
            return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})
        detective = Player.objects.get(uuid=uuid)
        detective.tag_json['msgbox'].append(message)
        detective.save()

        self_player.tag_int = 2
        self_player.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def reply(request):
    if request.is_ajax and request.method == "POST":
        msg = request.POST['send-text']
        ith = request.POST['send-tag']
        self_player = request.user.profile
        room = self_player.room
        answer_dict = room.answer
        answer_dict['realtime'][ith - 1].append(msg)
        answer_dict['realtime'][ith][0] = 'no_news'

        room.answer = answer_dict
        room.save()
        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def inquire(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if self_player.tag_int != 0:
            return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})

        room = self_player.room
        names = [li[0] for key, li in dict(room.answer).items() if key != uuid and li[1] != []]
        name = names[randint(0, len(names) - 1)]

        self_player.tag_int = 1
        self_player.save()

        return JsonResponse({"result": True, "event": name})
    else:
        print("error: it's not through ajax.")


def prepare(request):
    if request.is_ajax and request.method == 'GET':
        self_player = request.user.profile
        game = self_player.game
        room = self_player.room
        players = room.players.all()
        playerNum = len(players)

        onoff_dict = {}
        player_dict = {}
        answer_dict = {}
        for player in players:
            uuid = str(player.uuid)
            onoff_dict[uuid] = 1 if player.isOn is True else 0

            gender = player.gender if game.showGender is True else 'n'
            player_dict[uuid] = [player.name, gender]

        num = settings.QUESTION_NUM
        all_questions = GameEvent.objects.filter(Q(game=game))
        questions = sample(list(all_questions), num)

        prolog_time = settings.PROLOG_SEC + settings.PROLOG_SEC_PER_PLAYER * playerNum
        interval_time = 0
        interval = settings.QUESTION_INTERVAL_SEC

        timetable = {}
        for i, question in zip(range(1, num+1), questions):
            t = datetime.now(tz=timezone.utc) + timedelta(seconds=prolog_time+interval_time)
            t_str = t.strftime('%Y-%m-%d %H:%M:%S')
            timetable[str(i)] = [t_str, question.content]

            # todo 依據question.content的限時回答時間來調整題目間隔

            interval_time += interval
        answer_dict['timetable'] = timetable
        answer_dict['realtime'] = [['no_news']]  # from the second, it's the real msgs sent by players

        room.onoff_dict = onoff_dict
        room.player_dict = player_dict
        room.answer = answer_dict
        room.save()

        # todo 更新city的room數量

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def prolog(request):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        # uuid = str(self_player.uuid)
        room = self_player.room
        if self_player.tag_json is None and self_player.tag_int is None:
            # tag_json and tag_int are different in individual game, so they are set up in individual game
            di = {uuid: 0 for uuid in dict(room.player_dict).keys()}
            di['msgbox'] = []
            self_player.tag_json = di
            self_player.tag_int = 0
            self_player.save()

        return JsonResponse({"result": True, "tag_json": self_player.tag_json})
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

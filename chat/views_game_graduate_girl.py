from django.http import JsonResponse

from datingApp import settings
from django.db.models import Q
from chat.models import Match, Player, GameRole, GameEvent
from datetime import datetime, timezone, timedelta

from random import randint, sample, shuffle
from collections import Counter


def examine(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if len(self_player.tag_json) == 0 or self_player.tag_json[uuid] != 0:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})
        room = self_player.room
        onoff_list = [1 for v in dict(room.onoff_dict).values() if v != -1]
        onoff_num = len(onoff_list)

        examinee = Player.objects.get(uuid=uuid)
        match = Match.objects.create(room=self_player.room,
                                     player_list=[str(examinee.uuid), str(self_player.uuid)],
                                     secret={'isTiming': True})

        self_player.tag_json[uuid] = 1   # 被審問的對象要被紀錄在偵探的tag_json 直到deduce後才會全部為0
        for player in [self_player, examinee]:
            player.match = match
            player.status = 3
            player.waiting_time = datetime.now(tz=timezone.utc) + timedelta(minutes=settings.ROOMTIME_MIN[onoff_num])
            player.save()

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


def clue(request):
    if request.is_ajax and request.method == "POST":
        self_player = request.user.profile
        if self_player.tag_int != 1:
            return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})

        self_player.tag_int = 2
        self_player.save()

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

        room = self_player.room
        players = room.players

        game = self_player.game
        maleNeeded = game.best_ratio[0]
        femaleNeeded = game.best_ratio[1]

        roles = get_roles_of_game(game, 'f', femaleNeeded) + get_roles_of_game(game, 'm', maleNeeded)
        role_group = [role.group for role in roles]  # role_group = [1, 0, 0, 0,...]

        noplayerNum = game.noplayerNum
        if noplayerNum > 0:
            role_group.extend([0] * noplayerNum)  # for answer_dict['noplayer*']

        event_query = get_event_query(game, role_group)
        # event_query = {0: [[event.name, event.content], ], 1: [[event.name, event.content], ], ...}

        onoff_dict = {}
        player_dict = {}
        answer_dict = {}

        if noplayerNum > 0:
            for x in range(0, noplayerNum):
                answer_dict['noplayer' + str(x)] = event_query[0].pop()
                # noplayer can not take special event, so pop() first

        shuffle(event_query[0])

        for player, role in zip(players, roles):
            uuid = str(player.uuid)
            onoff_dict[uuid] = 1 if player.isOn is True else 0

            gender = player.gender if game.showGender is True else 'n'
            player_dict[uuid] = [player.name, gender, role.name, role.group]
            answer_dict[uuid] = event_query[int(role.group)].pop()

        room.onoff_dict = onoff_dict
        room.player_dict = player_dict
        room.answer = answer_dict
        room.save()

        # todo 更新city的room數量

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def get_roles_of_game(game, gender, num=1):
    roles = GameRole.objects.filter(Q(game=game) & Q(gender=gender))
    return sample(list(roles), num)


def get_events_of_game(game, role_group, num=1):  # use role_group to get event instances
    all_events = GameEvent.objects.filter(Q(game=game) & Q(group=role_group))
    specials = all_events.filter(content=[])  # special event must to be included in game
    events = all_events.exclude(content=[])

    if specials.exists():
        if num-len(specials) >= 1:
            result = list(specials) + sample(list(events), num - len(specials))
        else:
            result = list(specials)
    else:
        result = sample(list(events), num)
    return result


def get_event_query(game, group_list):  # role_group to event_query: assign events to players for room.answer
    c = Counter(group_list)  # c = {0: num_of_0, 1: num_of_1}
    events = []
    for key in c.keys():
        events += get_events_of_game(game, key, c[key])
        # like : roles = get_roles_of_game(game, 'f', femaleNeeded) + get_roles_of_game(game, 'm', maleNeeded)

    event_query = {}
    for event in events:
        li = event_query.get(int(event.group), None)
        if li is None:  # the first time, haven't established event_query[event.group]
            event_query[int(event.group)] = [[event.name, event.content]]

        else:  # have established event_query[event.group] already, so add the next elmt
            event_query[int(event.group)].append([event.name, event.content])
    return event_query


def prolog(request):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        uuid = str(self_player.uuid)
        room = self_player.room
        self_group = room.player_dict[uuid][3]
        self_role = room.player_dict[uuid][2]
        if self_player.tag_json is None and self_player.tag_int is None:
            # tag_json and tag_int are different individual game, so they are set up in individual game
            if self_group == 1:
                 di = {uuid: 0 for uuid in dict(room.player_dict).keys()}
                 di['message'] = []
                 self_player.tag_json = di
                 self_player.tag_int = -1
            else:  # self_group == 0:
                self_player.tag_json = {}
                self_player.tag_int = 0
            self_player.save()

        role_dialogs = []  # [dialog_content, is_image_or_not, m:me or s:system]
        answer = room.answer
        event_names = []
        self_event_content = answer[uuid][1]
        if self_group == 1:
            role_dialogs.append(["妳是這場遊戲的<span class='a-point'>偵探</span>", False, "s"])

            for li in answer.values():
                event_names.append(li[0])
            shuffle(event_names)

        else:  # self_group == 0:
            self_event = answer[uuid][0]
            if self_event == "與偵探發生關係":
                suspects = "渣男"
                text2 = "(噓！渣男的身份只有你知道，你必須想辦法摘贓給別人！)"
            else:
                suspects = "嫌疑人"
                # text2 = "(你不是渣男，但是昨晚酒後失態，所以不能讓偵探知道你昨天幹了什麼傻事，並設法協助偵探找出渣男！)"
                text2 = "(你不是渣男，你必須設法協助偵探找出其中的渣男！)"

            text1 = "你是這場遊戲的<span class='a-point'>{0}-{1}</span>，你昨晚在酒吧<span class='a-point'>{2}</span>".\
                format(suspects, self_role, self_event)

            role_dialogs.append([text1, False, "s"])
            role_dialogs.append([text2, False, "s"])

        return JsonResponse({"result": True, "role_dialogs": role_dialogs, "role": self_role,
                             "event_dialogs": self_event_content, "all_events": event_names,
                             "tag_int": self_player.tag_int, "tag_json": self_player.tag_json})
    else:
        print("error: it's not through ajax.")


def report(request):  # 檢舉功能 : make people leave match
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

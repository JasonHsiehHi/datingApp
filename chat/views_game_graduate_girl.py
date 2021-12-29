from django.http import JsonResponse

from django.contrib.auth.models import User
from .models import Match, Player
from random import randint


def examine(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if len(self_player.tag_json) == 0 or self_player.tag_json[uuid] != 0:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})

        examinee = Player.objects.get(uuid=uuid)
        match = Match.objects.create(room=self_player.room, player_list=[str(examinee.uuid), str(self_player.uuid)])
        examinee.match = match
        examinee.status = 3
        examinee.save()
        self_player.match = match
        self_player.status = 3
        self_player.tag_json[uuid] = 1  # 被審問的對象要被紀錄在偵探的tag_json 直到deduce後才會全部為0
        self_player.save()

        # todo 需要準備計時 給consumer來做

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

            if name == answer_dict[uuid]: # everyone are out
                if name == '與偵探發生關係':
                    room.onoff_dict = {key: -1 for key in dict(room.onoff_dict)}
                    players.exclude(uuid=self_player.uuid).update(status=0, room=None, tag_int=None, tag_json=None)
                    out_list = list(deduce_dict.keys())
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
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})
        detective = Player.objects.get(uuid=uuid)
        detective.tag_json['message'].append(message)
        detective.save()

        self_player.tag_int = 2
        self_player.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def inquire(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        if self_player.tag_int != 0:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})

        room = self_player.room
        names = [li[0] for key, li in dict(room.answer).items() if key != uuid and li[1] != ' ']
        name = names[randint(0, len(names) - 1)]

        self_player.tag_int = 1
        self_player.save()

        return JsonResponse({"result": True, "event": name})
    else:
        print("error: it's not through ajax.")


def prolog(request):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        uuid = str(self_player.uuid)
        room = self_player.room
        self_group = room.player_dict[uuid][3]
        self_role = room.player_dict[uuid][2]
        self_event = room.answer[uuid][0]
        if self_player.tag_json is None and self_player.tag_int is None:
            if self_group == 1:
                 di = {uuid: 0 for uuid in dict(room.player_dict).keys()}
                 di['message'] = []
                 self_player.tag_json = di
                 self_player.tag_int = -1
            else:  # self_group == 0:
                self_player.tag_json = {}
                self_player.tag_int = 0
            self_player.save()

        role_dialogs = []
        if self_group == 1:
            role_dialogs.append(["妳是這場遊戲的<span class='a-point'>偵探</span>", False, "s"])
        else:  # self_group == 0:
            if self_event == "與偵探發生關係":
                suspects = "渣男"
                text2 = "(噓！渣男的身份只有你知道，你必須想辦法摘贓給別人！)"
            else:
                suspects = "嫌疑人"
                text2 = "(你不是渣男，但是昨晚酒後失態，所以不能讓偵探知道你昨天幹了什麼傻事，並設法協助偵探找出渣男！)"
            text1 = "你是這場遊戲的<span class='a-point'>{0}-{1}</span>，你昨晚在酒吧<span class='a-point'>{2}</span>".\
                format(suspects, self_role, self_event)
            role_dialogs.append([text1, False, "s"])
            role_dialogs.append([text2, False, "s"])

        return JsonResponse({"result": True, "role": role_dialogs})
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




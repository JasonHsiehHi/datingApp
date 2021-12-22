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

        # 需要準備計時 給consumer來做

        return JsonResponse({"result": True, "player_list": match.player_list})
    else:
        print("error: it's not through ajax.")


def deduce(request):
    if request.is_ajax and request.method == "POST":
        deduce_dict = request.POST
        self_player = request.user.profile
        room = self_player.room
        # format of room.answer: {player_uuid: [gameevent_name, gameevent_content], ...}
        answer_dict = {uuid: li[0] for uuid, li in dict(room.answer).items()}
        players = Player.objects.fliter(room=room)
        out_list = []
        gameover = False

        for uuid, name in deduce_dict.items():
            self_player.tag_json[uuid] = 0
            if name == answer_dict[uuid]:
                out_list.append(uuid)
                room.onoff_dict[uuid] = -1  # out_player的status=0 room=None還未設定
                if name == '昨晚與偵探發生關係':
                    gameover = True
                    for key in dict(room.onoff_dict):
                        room.onoff_dict[key] = -1  # out_player的status=0 room=None還未設定
                    break
            else:
                player = players.get(uuid=uuid)
                player.tag_int = 0
                player.save()

        self_player.save()
        room.save()
        return JsonResponse({"result": True, "over": gameover, "out_players": out_list})

    else:
        print("error: it's not through ajax.")


def clue(request, uuid):
    if request.is_ajax and request.method == "POST":
        message = request.POST['clue-input']
        self_player = request.user.profile
        if self_player.tag_int != 1:
            pass  # return JsonResponse({"result": False, "msg": '此角色或當前狀態無法執行此功能。'})
        detective = Player.objects.get(uuid=uuid)
        detective.tag_json['message'] = message
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
        names = [li[0] for key, li in room.answer if key != uuid]
        name = names[randint(0, len(names) - 1)]

        self_player.tag_int = 1
        self_player.save()

        return JsonResponse({"result": True, "event": name})
    else:
        print("error: it's not through ajax.")


def prolog(request):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        room = self_player.room
        self_group = room.player_dict[str(self_player.uuid)][3]

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

        dialogs = self_player.game.story
        return JsonResponse({"result": True, "dialogs": dialogs})
    else:
        print("error: it's not through ajax.")


def report(request):  # 檢舉功能 趕人離開match
    if request.is_ajax and request.method == "POST":
        # for uuid in players:
        #    match.player_list.remove(uuid)  可能一次檢舉多人

        #    player = await utils.get_player_by_uuid(uuid)
        #    await utils.set_player_fields(player, {'status': 2, 'match': None})
        #    player.save()

        #    改用前端callSendWs() 告知其他人這個人離開了
        #    await self.channel_layer.group_send(uuid, {
        #        'type': 'leave_match'
        #    })
        # match.save()

        pass
    else:
        print("error: it's not through ajax.")




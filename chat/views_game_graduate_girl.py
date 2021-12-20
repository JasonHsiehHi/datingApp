from django.http import JsonResponse

from django.contrib.auth.models import User
from .models import Match, Player


def examine(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_user = request.user.profile
        examinee = Player.objects.get(uuid=uuid)
        match = Match.objects.create(room=self_user.room, player_list=[str(examinee.uuid), str(self_user.uuid)])
        examinee.match = match
        examinee.status = 3
        self_user.match = match
        self_user.status = 3
        examinee.save()
        self_user.save()
        # 需要準備計時 給consumer來做
        # 被審問的對象要被紀錄在偵探的tag_json 直到deduce後才會全部為0

        return JsonResponse({"result": True, "msg": '已建立房間 等待中...', "player_list": match.player_list})
    else:
        print("error: it's not through ajax.")


def deduce(request):  # 最麻煩 放到最後在寫
    if request.is_ajax and request.method == "POST":
        # 最後要將結果回傳 故room中要記錄answer_dict 每位玩家所配對的答案
        # 必須提取answer_dict和傳入的答案做比對
        # room.answer 會隨劇本而有所不同 當前為{player.uuid:gameevent.name,...}
        # 先依序回傳是否為正確答案 兩變數 一個bool值紀錄是否遊戲結束 一個list值紀錄出局人數
        # 若遊戲結束則全員出局 若未結束 則被猜到的人遊戲結束

        # deduce之後 room.onoff_dict已經被修改 已經把需要被趕走的人設為-1

        # player = await utils.get_player_by_uuid(uuid) 舊版
        # await utils.set_player_fields(player, {'status': 0, 'room': None})
        # await utils.set_room_fields(room, {
        #   'player_dict': room.player_dict, 'onoff_dict': room.onoff_dict, 'playerNum': room.playerNum})

        # 清空偵探的的tag_json和其他人的tag_int 表示下一輪開始
        pass
    else:
        print("error: it's not through ajax.")


def clue(request):  # 提交線索
    if request.is_ajax and request.method == "POST":
        pass
    else:
        print("error: it's not through ajax.")


def prolog(request):
    if request.is_ajax and request.method == "GET":
        player = request.user.profile
        dialogs = player.game.story
        return JsonResponse({"result": True, "dialogs": dialogs})
    else:
        print("error: it's not through ajax.")


def report(request):  # 檢舉功能
    if request.is_ajax and request.method == "POST":
        # for uuid in players:
        #    match.player_list.remove(uuid) 趕人離開match
        #    player = await utils.get_player_by_uuid(uuid)
        #    await utils.set_player_fields(player, {'status': 2, 'match': None})
        #    await self.channel_layer.group_send(uuid, {
        #        'type': 'leave_match'
        #    })
        # await utils.set_match_fields(match, {'player_list': match.player_list})
        pass
    else:
        print("error: it's not through ajax.")




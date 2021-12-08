from django.http import JsonResponse

from django.contrib.auth.models import User
from .models import Match, Player


import sys


def examine(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_user = request.user.profile
        examinee = Player.objects.get(uuid=uuid)
        match = Match.objects.create(room=examinee.room, player_list=[examinee.uuid, self_user.uuid])
        examinee.match = match
        examinee.status = 3
        self_user.match = match
        self_user.status = 3
        examinee.save()
        self_user.save()
        return JsonResponse({"result": True, "msg": '進入房間', "examinee": str(examinee.uuid)})
    else:
        print("error: it's not through ajax.", file=sys.stderr)


def deduce(request):  # 最麻煩 放到最後在寫
    if request.is_ajax and request.method == "POST":
        # 最後要將結果回傳 故room中要記錄answer_dict 每位玩家所配對的答案
        # 必須提取answer_dict和傳入的答案做比對
        pass
    else:
        print("error: it's not through ajax.", file=sys.stderr)



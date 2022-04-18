from django.http import JsonResponse

from django.db.models import Q
from .models import Match, Player, GameEvent

from random import sample, choice
# from datetime import datetime, timezone, timedelta


def reply(request):
    if request.is_ajax and request.method == "POST":
        msg = request.POST['send-text']
        self_player = request.user.profile
        if self_player.tag_int != 0:
            return JsonResponse({"result": False, "msg": '你已經在這張<span class="a-point">紙條</span>上留過答案了哦！'})

        self_player.tag_json['paper'][3].append("<span class='a-point'>{}</span>: {}".format(self_player.name, msg))
        self_player.tag_json['interact'][str(self_player.uuid)] = 1
        self_player.tag_int = 1
        self_player.save()

        room = self_player.room
        room.player_dict[str(self_player.uuid)][2] = 1  # update room instead of updating tag_json of every player
        room.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def pass_paper(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int != 1:
            return JsonResponse({"result": False, "msg": '你現在不能將紙條傳給別人哦！'})

        opposite = Player.objects.get(uuid=uuid)
        if opposite.tag_json['interact'][uuid] != 1:
            return JsonResponse({"result": False, "msg": '對方現在不能與你交換紙條哦！'})

        opposite.tag_json['interact'][self_uuid] = 3
        opposite.save()

        self_player.tag_int = 2
        self_player.tag_json['interact'][uuid] = 2
        self_player.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def change_paper(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int not in [1, 2]:
            return JsonResponse({"result": False, "msg": '你的紙條還沒有作答完或已經換了新紙條。'})

        opposite = Player.objects.get(uuid=uuid)
        if self_player.tag_json['interact'][uuid] != 3 and opposite.tag_json['interact'][self_uuid] != 2:
            return JsonResponse({"result": False, "msg": '對方已經與其他人交換新紙條或已與其他人配對成功。'})

        term = self_player.tag_json['paper']
        self_player.tag_json['paper'] = opposite.tag_json['paper']
        opposite.tag_json['paper'] = term

        def refresh_after_change(interact_dict, selfUUID):
            for uuid, s in interact_dict.items():
                if s in [2, 3]:
                    interact_dict[uuid] = 0
                elif s in [5, 6]:
                    interact_dict[uuid] = 4
            interact_dict[selfUUID] = 0
            return interact_dict

        term = self_player.tag_json['interact']
        self_player.tag_json['interact'] = refresh_after_change(opposite.tag_json['interact'], uuid)
        opposite.tag_json['interact'] = refresh_after_change(term, self_uuid)
        self_player.save()
        opposite.save()

        room = self_player.room
        room.player_dict[str(self_player.uuid)][2] = 0  # update room instead of updating tag_json of every player
        room.save()

        opposite_data = {
            'paper': opposite.tag_json['paper'],
            'interact': opposite.tag_json['interact']
        }

        return JsonResponse({"result": True, "self_paper": self_player.tag_json['paper'],
                             "self_interact": self_player.tag_json['interact'], "opposite_data": opposite_data})
    else:
        print("error: it's not through ajax.")


def match(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int not in [0, 1]:  # whether you have responded your paper or not
            return JsonResponse({"result": False, "msg": '你現在不能寄送配對邀請哦！'})

        opposite = Player.objects.get(uuid=uuid)
        if opposite.tag_json['interact'][uuid] not in [1, 4]:  # whether player has responded your paper or not
            return JsonResponse({"result": False, "msg": '對方現在不能與你配對！'})

        opposite.tag_json['interact'][self_uuid] = 6
        opposite.save()

        self_player.tag_int = 2
        self_player.tag_json['interact'][uuid] = 5
        self_player.save()

        return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def accept(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)

        opposite = Player.objects.get(uuid=uuid)
        if self_player.tag_json['interact'][uuid] != 6 and opposite.tag_json['interact'][self_uuid] not in [1, 5]:
            return JsonResponse({"result": False, "msg": '對方已與其他人配對成功或已與其他人交換新紙條。'})

        match = Match.objects.create(room=self_player.room, player_list=[uuid, self_uuid])
        for player in [opposite, self_player]:
            player.match = match
            player.status = 3
            player.tag_int = 3
            player.tag_json['interact'][uuid] = 7
            player.tag_json['interact'][self_uuid] = 7
            player.save()

        room = self_player.room
        isWon = True if room.answer['roles'][self_uuid] == 1 or room.answer['roles'][uuid] == 1 else False
        return JsonResponse({"result": True, "isWon": isWon})
    else:
        print("error: it's not through ajax.")


def prepare(request):  # only the game creator needs to do prepare()
    if request.is_ajax and request.method == 'GET':
        self_player = request.user.profile
        game = self_player.game
        room = self_player.room
        players = room.players.all()
        playerNum = len(players)

        all_questions = GameEvent.objects.filter(Q(game=game))
        questions = sample(list(all_questions), playerNum)
        ascii_list = 'abcdefghij'
        asciis = sample(list(ascii_list), playerNum)

        onoff_dict = {}
        player_dict = {}
        answer_dict = {}
        gender_ratio = [0, 0]
        roles = {}
        papers = {}
        for player, a, question in zip(players, asciis, questions):
            uuid = str(player.uuid)
            onoff_dict[uuid] = 1 if player.isOn is True else 0
            gender = player.gender if game.showGender is True else 'n'
            player_dict[uuid] = [player.name, gender, 0]

            if player.gender == 'f':
                gender_ratio[0] += 1
                roles[uuid] = 1
            else:
                gender_ratio[1] += 1
                roles[uuid] = 0

            content = question.content
            content[0] = '<span class="a-point">問題：</span>' + content[0]
            explain = ['每個人一開始所獲得的<span class="a-point">作弊紙條</span>都不一樣！',
                       '可開啟左側選單找尋你認為是<span class="a-point">槍手</span>的玩家，'
                       '<span class="a-point">傳紙條</span>給他，若對方選擇<span class="a-point">換紙條</span>，'
                       '則成功與他交換手上的紙條，即可查看對方的答案！']
            papers[uuid] = ['作弊紙條-' + a, content, explain, []]

        if gender_ratio[1] == 0:
            player = choice(list(players))
            roles[str(player.uuid)] = 1
        elif gender_ratio[0] == 0:
            player = choice(list(players))
            roles[str(player.uuid)] = 0

        answer_dict['gender_ratio'] = gender_ratio
        answer_dict['roles'] = roles
        answer_dict['papers'] = papers

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
        self_uuid = str(self_player.uuid)
        room = self_player.room
        if self_player.tag_json is None and self_player.tag_int is None:
            # tag_json and tag_int are different in individual game, so they are set up in views_{game_name}.py
            di = {
                'interact': {uuid: 0 for uuid in dict(room.player_dict).keys()},
                'msgbox': ['私信箱'],
                'paper': room.answer['papers'][self_uuid],
                'role': '槍手' if room.answer['roles'][self_uuid] == 1 else '一般考生'
            }
            self_player.tag_json = di
            self_player.tag_int = 0
            self_player.save()

        guest_dialogs = []
        gender_ratio = room.answer['gender_ratio']
        text = "配對人數：{}女 vs {}男".format(gender_ratio[0], gender_ratio[1])
        guest_dialogs.append([text, False, "s"])

        cnt = 1
        for player in room.player_dict.values():
            text = "玩家{}：<span class='a-point'>{}</span>😎".format(cnt, player[0])
            guest_dialogs.append([text, False, "s"])
            cnt += 1

        return JsonResponse({"result": True, "tag_json": self_player.tag_json, "tag_int": self_player.tag_int,
                             "guest_dialogs": guest_dialogs})
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

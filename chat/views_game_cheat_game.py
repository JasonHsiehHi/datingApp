from django.http import JsonResponse

from django.db.models import Q
from .models import Match, Player, GameEvent

from random import sample, choice
from datetime import datetime, timezone, timedelta


def retake(request):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int != 2:
            return JsonResponse({"result": False, "msg": '你還沒有把紙條傳出去或寄送出配對邀請哦！'})
        retake_uuid = self_player.tag_json['retake'][0]
        retake_str = '紙條' if self_player.tag_json['interact'][retake_uuid] == 2 else '邀請'

        opposite = Player.objects.get(uuid=retake_uuid)
        now = datetime.now(tz=timezone.utc)
        t = datetime.strptime(self_player.tag_json['retake'][1], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)

        if opposite.room == self_player.room:
            if now < t:
                return JsonResponse({"result": False, "msg": '對方可能正在猶豫與思考，必須超過5分種，才能收回你的'+retake_str+'！'})
            else:
                opposite.tag_json['interact'][self_uuid] -= 2
                opposite.save()

        self_player.tag_int = 1
        self_player.tag_json['retake'] = ['', None]
        self_player.tag_json['interact'][retake_uuid] -= 1
        self_player.save()

        return JsonResponse({"result": True})

    else:
        print("error: it's not through ajax.")


def reply(request):
    if request.is_ajax and request.method == "POST":
        msg = request.POST['send-text']
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int != 0:
            return JsonResponse({"result": False, "msg": '你已經在這張<span class="a-point">紙條</span>上留過答案了哦！'})
        answer = "<span class='a-point'>{}</span>: {}".format(self_player.name, msg)
        self_player.tag_json['paper'][4].append(answer)
        self_player.tag_json['interact'][self_uuid] = 1
        self_player.tag_int = 1
        self_player.save()

        room = self_player.room
        for player in room.players.all().exclude(uuid=self_uuid):
            if player.tag_json['interact'][self_uuid] in [0, 2, 3]:
                player.tag_json['interact'][self_uuid] = 1
                player.save()

        # room.player_dict[self_uuid][2] = 1  # update room instead of updating tag_json of every player
        # room.save()

        return JsonResponse({"result": True, 'answer': answer})
    else:
        print("error: it's not through ajax.")


def pass_paper(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int != 1:
            return JsonResponse({"result": False, "msg": '你現在不能將紙條傳給別人哦！'})

        opposite = Player.objects.get(uuid=uuid)
        if opposite.tag_int in [0, 3]:
            return JsonResponse({"result": False, "msg": '對方現在不能與你交換紙條哦！'})

        opposite.tag_json['interact'][self_uuid] = 3
        opposite.save()

        self_player.tag_int = 2
        self_player.tag_json['interact'][uuid] = 2
        t_str = (datetime.now(tz=timezone.utc) + timedelta(minutes=4)).strftime('%Y-%m-%dT%H:%M:%SZ')
        self_player.tag_json['retake'] = [uuid, t_str]
        self_player.save()

        return JsonResponse({"result": True, "time": t_str})
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

        room = self_player.room
        if uuid not in room.onoff_dict.keys():
            return JsonResponse({"result": False, "msg": '你們不在同一個房間。'})

        term = self_player.tag_json['paper']
        self_player.tag_json['paper'] = opposite.tag_json['paper']
        opposite.tag_json['paper'] = term

        def change_btn_two(interact_dict, the_self_uuid, opposite_uuid):
            for uuid, s in interact_dict.items():
                if s in [2, 3]:
                    interact_dict[uuid] = 1  # player had passed, so let the value to be 1
                elif s in [5, 6]:
                    interact_dict[uuid] = 4
            interact_dict[the_self_uuid] = 0
            interact_dict[opposite_uuid] = 4
            return interact_dict

        term = self_player.tag_json['interact']
        self_player.tag_json['interact'] = change_btn_two(opposite.tag_json['interact'], self_uuid, uuid)
        self_player.tag_int = 0
        opposite.tag_json['interact'] = change_btn_two(term, uuid, self_uuid)
        opposite.tag_int = 0
        self_player.save()
        opposite.save()

        def refresh_after_change(value, toSave, intToChange):
            if intToChange is False and value in [2, 5]:
                intToChange = True

            if value in [1, 2, 3]:  # player took new paper, so let the value to be 0
                value = 0
                toSave = True
            elif value in [5, 6]:
                value = 4
                toSave = True
            return value, toSave, intToChange

        toSave = False
        intToChange = False
        for player in room.players.all().exclude(uuid__in=[self_uuid, uuid]):
            player.tag_json['interact'][self_uuid], toSave, intToChange = \
                refresh_after_change(player.tag_json['interact'][self_uuid], toSave, intToChange)
            player.tag_json['interact'][uuid], toSave, intToChange = \
                refresh_after_change(player.tag_json['interact'][uuid], toSave, intToChange)
            if intToChange is True:
                player.tag_int = 1 if player.tag_json['interact'][str(player.uuid)] == 1 else 0
            if toSave is True:
                player.save()

        # room.player_dict[self_uuid][2] = 0  # update room instead of updating tag_json of every player
        # room.player_dict[uuid][2] = 0
        # room.save()

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
        if opposite.tag_int == 3:  # whether player has responded your paper or not
            return JsonResponse({"result": False, "msg": '對方現在不能與你配對！'})

        opposite.tag_json['interact'][self_uuid] = 6
        opposite.save()

        self_player.tag_int = 2
        self_player.tag_json['interact'][uuid] = 5
        t_str = (datetime.now(tz=timezone.utc) + timedelta(minutes=4)).strftime('%Y-%m-%dT%H:%M:%SZ')
        self_player.tag_json['retake'] = [uuid, t_str]
        self_player.save()

        return JsonResponse({"result": True, "time": t_str})
    else:
        print("error: it's not through ajax.")


def accept(request, uuid):
    if request.is_ajax and request.method == "GET":
        self_player = request.user.profile
        self_uuid = str(self_player.uuid)
        if self_player.tag_int == 3:  # whether you have responded your paper or not
            return JsonResponse({"result": False, "msg": '你已經接受過其他人的配對了哦！'})

        opposite = Player.objects.get(uuid=uuid)
        if self_player.tag_json['interact'][uuid] != 6 and opposite.tag_json['interact'][self_uuid] not in [1, 5]:
            return JsonResponse({"result": False, "msg": '對方已與其他人配對成功或已與其他人交換新紙條。'})

        room = self_player.room
        if uuid not in room.onoff_dict.keys():
            return JsonResponse({"result": False, "msg": '你們不在同一個房間。'})

        match = Match.objects.create(room=self_player.room, player_list=[uuid, self_uuid])
        for player in room.players.all():
            player_uuid = str(player.uuid)
            if player_uuid in [self_uuid, uuid]:
                player.match = match
                player.status = 3
                player.tag_int = 3
            else:
                if player.tag_json['retake'][0] in [self_uuid, uuid]:
                    player.tag_int = 1 if player.tag_json['interact'][player_uuid] == 1 else 0
            player.tag_json['interact'][uuid] = 7
            player.tag_json['interact'][self_uuid] = 7
            player.save()

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
            player_dict[uuid] = [player.name, gender]

            if player.gender == 'f':
                gender_ratio[0] += 1  # gender_ratio: [f, m]
                roles[uuid] = 1
            else:
                gender_ratio[1] += 1
                roles[uuid] = 0

            content = question.content
            content[0] = '<span class="a-point">問題：</span>' + content[0]
            papers[uuid] = ['作弊紙條-' + a, [], [], content, ['<span class="a-point">回答：</span>']]

        if gender_ratio[1] == 0:  # all female
            for uuid in roles.keys():
                roles[uuid] = 0
            player = choice(list(players))
            roles[str(player.uuid)] = 1
        elif gender_ratio[0] == 0:  # all male
            player = choice(list(players))
            roles[str(player.uuid)] = 1

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
                'role': '槍手' if room.answer['roles'][self_uuid] == 1 else '一般考生',
                'retake': ['', None]
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


def report(request):  # todo 檢舉功能 : let people leave match
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

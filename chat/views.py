from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail

from datingApp import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.sessions.models import Session
from django.core.cache import cache
from .models import Player, City, Room, Game, GameRole, GameEvent, Dialogue
from django.forms.models import model_to_dict
from django.db.models import Q
from random import randint, sample, shuffle
from collections import Counter

from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

from datetime import datetime, timezone
from uuid import uuid4
from hashlib import md5

import re

from django.db import connection


def get_loginData(user, player):
    player_dict = model_to_dict(player, fields=[
        'gender', 'uuid', 'isBanned', 'status', 'waiting_time', 'name', 'city'])
    room = player.room
    match = player.match
    if room is None:
        player_dict['game'] = ''
        player_dict['player_dict'] = {}
        player_dict['onoff_dict'] = {}
        player_dict['tag_int'] = -1
        player_dict['tag_json'] = ''

        player_dict['event_name'] = []
        player_dict['event_content'] = []
    else:
        player_dict['game'] = str(room.game)
        player_dict['player_dict'] = room.player_dict
        player_dict['onoff_dict'] = room.onoff_dict
        player_dict['tag_int'] = player.tag_int
        player_dict['tag_json'] = player.tag_json

        answer = room.answer
        event_names = []
        for li in answer.values():
            event_names.append(li[0])
        shuffle(event_names)

        event_content = answer[str(player_dict['uuid'])][1]

        player_dict['event_name'] = event_names
        player_dict['event_content'] = event_content

    if match is None:
        player_dict['player_list'] = []
    else:
        player_dict['player_list'] = match.player_list

    login_dict = {
        'isLogin': True,
        'email': user.username,
        **player_dict
    }
    return login_dict


def chatroom(request):
    user = request.user
    if user.is_authenticated:
        login_dict = get_loginData(user, user.profile)
        # print('db_query: {}'.format(connection.queries))
        if user.profile.status in [2, 3]:
            return redirect('/chat/start_game/{}'.format(login_dict['game']))

    else:
        login_dict = {
            'isLogin': False,
            'email': '',
            'gender': '',
            'uuid': '',
            'isBanned': False,
            'status': 0,
        }
    return render(request, 'chat/chatroom.html', {'login_dict': login_dict})


def in_game(request, game_name):
    user = request.user
    if user.is_authenticated and user.profile.status in [2, 3]:
        player = user.profile
        if str(player.game) == game_name:
            game = Game.objects.get(game_id=game_name)
            playerNum = game.best_ratio[0] + game.best_ratio[1]
            login_dict = get_loginData(user, user.profile)
            url = 'chat/chatroom_game_' + game_name + '.html'
            return render(request, url, {'login_dict': login_dict, 'range': range(1, playerNum)})
        else:
            return redirect('/chat/start_game/{}'.format(str(player.game)))
    else:
        return redirect('/chat/')


def greet(request):
    if request.is_ajax and request.method == "GET":
        dialogs = []
        t = int(datetime.now().strftime('%H'))
        sub_t = get_dialogue_greet_sub(t)
        dialog_t = get_dialogue_dialog('GREET', sub_t)
        dialogs.append(dialog_t)

        # city_name, roomNum = get_city_roomNum_max() # the func is unavailable
        city_name, roomNum = '', 0
        if roomNum > settings.PLENTY_ROOM_NUM:
            dialog_city = get_dialogue_dialog('GREET', 'city')
            dialog_city = dialog_city.format(city_name)
            dialogs.append(dialog_city)

        return JsonResponse({"result": True, "dialogs": dialogs})
    else:
        print("error: it's not through ajax.")


def get_dialogue_greet_sub(time):
    time_ranges = cache.get('GREET_TIME_RANGE')
    if time_ranges is None:
        dialogues = Dialogue.objects.filter(Q(action='GREET') & Q(sub__startswith='t') & Q(number=1))
        time_ranges = [[dialogue.sub[1:3], dialogue.sub[4:6]] for dialogue in dialogues]
        cache.set('GREET_TIME_RANGE', time_ranges, settings.SECONDS_FOR_CACHE_GREET)

    true_list = []
    for r in time_ranges:
        start, end = int(r[0]), int(r[1])
        if start <= end:
            if start <= time < end:
                true_list.append(r)
        else:
            if start <= time or time < end:
                true_list.append(r)
    time_range = true_list[randint(0, len(true_list) - 1)]
    sub = 't' + time_range[0] + '-' + time_range[1]
    return sub


def get_dialogue_dialog(action, sub, n=None):
    if n is None:
        dialogues = Dialogue.objects.filter(Q(action=action) & Q(sub=sub))
        dialogue = dialogues[randint(0, len(dialogues)-1)]
    else:
        dialogue = Dialogue.objects.get(action=action, sub=sub, number=n)
    return dialogue.dialog


def get_city_roomNum_max():
    city = City.objects.order_by('-roomNum').first()
    return str(city.name), int(city.roomNum)


'''  # upload_image haven't been available.
def upload_image(request):
    if request.is_ajax and request.method == "POST":
        photo = Photo.objects.create(image=request.FILES['send-img'], uploader=str(request.user.id),
                                     isForAdult=request.POST['send-tag'])
        old_path = photo.image.path
        extension_name = photo.image.name.split('.')[-1]
        photo.image.name = 'photo/' + photo.name + '.' + extension_name
        os.rename(old_path, photo.image.path)
        photo.save()
        return JsonResponse({'img_url': photo.image.url})
    else:
        print("error: it's not through ajax.")
'''


def post_place(request):
    if request.is_ajax and request.method == "POST":
        try:
            city = City.objects.get(name=request.POST['goto-input'])
        except city.DoesNotExist:
            return JsonResponse({"result": False, "msg": "抱歉，該城市還未開放。"})

        user = request.user
        if user.is_authenticated and user.is_active:
            self_player = user.profile
            if self_player.status != 0:
                return JsonResponse({"result": False, "msg": "你現在不能前往其他城市！"})
            self_player.city = city
            self_player.save()

        dialogs = []  # todo dialog place動態資訊
        return JsonResponse({"result": True, "city": city.name, "dialogs": dialogs})
    else:
        print("error: it's not through ajax.")


def post_name(request):
    if request.is_ajax and request.method == "POST":
        name = request.POST['name-input']
        if len(name) > 20:
            return JsonResponse({"result": False, "msg": "暱稱太長了，不能超過20個字元"})
        elif len(name.strip()) == 0:
            return JsonResponse({"result": False, "msg": "暱稱不能空白"})

        user = request.user
        if user.is_authenticated and user.is_active:
            self_player = user.profile
            if self_player.status != 0:
                return JsonResponse({"result": False, "msg": "你現在不能變更名字！"})
            self_player.name = name
            self_player.save()

        return JsonResponse({"result": True, "name": name})
    else:
        print("error: it's not through ajax.")


# account function
def signup(request):
    if request.is_ajax and request.method == "POST":
        email = request.POST['signup-input-email']
        password1 = request.POST['signup-input-password']
        password2 = request.POST['signup-input-confirm']
        gender = request.POST['signup-input-gender']
        valid_email = EmailValidator()
        try:
            valid_email(email)
        except ValidationError:
            return JsonResponse({"result": False, "msg": '電子信箱不符合格式！'})
        try:
            validate_pwd(password1, password2)
        except ValidationError as e:
            return JsonResponse({"result": False, "msg": e.message})

        if settings.DEBUG is True:  # test mode: single email can apply for multiple accounts
            filter_result = User.objects.filter(email=email)
            username = email + str(len(filter_result))
        else:
            username = email

        filter_result = User.objects.filter(username__exact=username)
        if len(filter_result) == 1:
            if filter_result[0].is_active:
                return JsonResponse({"result": False, "msg": '此電子信箱已經註冊過了！如果您的密碼遺失可選擇重設密碼。'})
            else:
                if cache.get('signup_' + email) is True:
                    return JsonResponse({"result": False, "msg": '已經寄到此電子信箱了哦！如果需要再寄一次則需等待10分鐘。'})

                isSent = signup_send_mail(email)
                if isSent is False:
                    return JsonResponse({"result": False, "msg": '寄件失敗，請稍候再試。'})
                else:
                    return JsonResponse({"result": True})

        else:
            user = signup_create_user(username, email, password2)
            try:
                city = City.objects.get(name=request.POST['goto-input'])
            except city.DoesNotExist:  # localData.city is ''(empty_string) until user haven't updated the field.
                city = None
            Player.objects.create(uuid=str(uuid4()), user=user, gender=gender,
                                  name=request.POST['name-input'], city=city)

            isSent = signup_send_mail(email)
            if isSent is False:
                return JsonResponse({"result": False, "msg": '寄件失敗，請稍候再試。'})
            else:
                return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def signup_create_user(username, email, password):
    user = User.objects.create_user(username=username, password=password, email=email)
    user.is_active = False
    user.save()
    return user


def signup_send_mail(email):
    token = get_random_str()
    url = '/'.join([settings.DOMAIN, 'chat', 'signup', token])
    html_msg = render_to_string('chat/signup_mail.html', {'url': url})

    title = 'A-LARP匿名劇本殺 註冊認證信'
    msg = ''
    receivers = [email]
    email_from = settings.EMAIL_FROM

    status = send_mail(title, msg, email_from, receivers, html_message=html_msg)
    cache.set(token, email, settings.SECONDS_FOR_CACHE_TOKEN)
    cache.set('signup_' + email, True, settings.SECONDS_FOR_CACHE_EMAIL)
    isSent = True if status == 1 else False
    return isSent


def get_random_str():
    uuid_str = str(uuid4()).encode("utf-8")
    time_str = datetime.now().strftime('%f').encode("utf-8")
    md5_instance = md5()
    md5_instance.update(uuid_str + time_str)
    return md5_instance.hexdigest()


def activate(request, token):
    email = cache.get(token)
    if email is None:
        return render(request, 'chat/chatroom_activate.html', {"title": '啟用失敗',
                                                               "msg": '驗證連結可能已過期或已完成，或所驗證的帳號不存在，請重新註冊。'})
    else:
        if settings.DEBUG is True:  # test mode: single email can apply for multiple accounts
            users = User.objects.filter(email=email)
            users.update(is_active=True)
            user = list(users)[-1]
        else:
            user = User.objects.get(username=email)
            user.is_active = True
            user.save()
        login(request, user)
        retain_last_login(request.session)
        cache.delete(token)
        return render(request, 'chat/chatroom_activate.html', {"title": '啟用成功',
                                                               "msg": '信箱註冊成功，現在可以開始遊戲了哦！'})


def log_in(request):
    if request.is_ajax and request.method == 'POST':
        email = request.POST['login-input-email']
        password = request.POST['login-input-password']
        valid_email = EmailValidator()
        try:
            valid_email(email)
        except ValidationError:
            return JsonResponse({"result": False, "msg": '不符合電子信箱格式！'})

        user = authenticate(request, username=email, password=password)
        if user is None or user.is_active is False:
            return JsonResponse({"result": False, "msg": '登入失敗，密碼錯誤或信箱還未完成註冊驗證。'})
        else:
            login(request, user)
            retain_last_login(request.session)
            return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def log_out(request):
    if request.is_ajax and request.method == 'POST':
        if request.user.is_authenticated:
            logout(request)
            request.session.flush()
            return JsonResponse({"result": True})
        else:
            print("error: user isn't authenticated to log_out.")
    else:
        print("error: it's not through ajax.")


def retain_last_login(session):
    sid = session.session_key
    data = session.encode(dict(session))
    Session.objects.filter(session_data__startswith=str(data)[0:50]).exclude(pk=sid).delete()


def change_pwd(request):
    if request.is_ajax and request.method == 'POST':
        user = request.user
        if user.is_authenticated:
            old_password = request.POST['change-pwd-input-old']
            password1 = request.POST['change-pwd-input-password']
            password2 = request.POST['change-pwd-input-confirm']

            if user.check_password(old_password) is False:
                return JsonResponse({"result": False, "msg": '原密碼錯誤！'})
            try:
                validate_pwd(password1, password2)
            except ValidationError as e:
                return JsonResponse({"result": False, "msg": e.message})

            user.set_password(password2)
            user.save()
            login(request, user)
            retain_last_login(request.session)
            return JsonResponse({"result": True})
        else:
            print("error: user isn't authenticated to change_pwd.")
    else:
        print("error: it's not through ajax.")


def validate_pwd(password1, password2):
    if len(password1) < 8:
        raise ValidationError('密碼至少8個字元！')
    elif len(password1) > 30:
        raise ValidationError('密碼太長了！不能超過30字元')
    elif re.match(r'^(?=.*[\d])(?=.*[a-zA-Z]).{8,30}$', password1) is None:
        raise ValidationError('密碼至少一個數字與至少一個英文字母')
    elif password1 != password2:
        raise ValidationError('密碼與確認密碼不ㄧ致！')


def reset_pwd(request):
    if request.is_ajax and request.method == 'POST':
        email = request.POST['reset-pwd-input-email']
        valid_email = EmailValidator()
        try:
            valid_email(email)
        except ValidationError:
            return JsonResponse({"result": False, "msg": '不符合電子信箱格式！'})

        filter_result = User.objects.filter(username__exact=email)
        if len(filter_result) != 1:
            return JsonResponse({"result": False, "msg": '此電子信箱尚未註冊哦！'})
        else:
            if cache.get('reset_pwd_'+email) is True:
                return JsonResponse({"result": False, "msg": '已經寄到此電子信箱了哦！如果需要再寄一次則需等待10分鐘。'})

            user = filter_result[0]
            temp_pwd = str(get_random_str())[:7]+'a'+'1'
            user.set_password(temp_pwd)
            user.save()
            isSent = reset_pwd_send_mail(email, temp_pwd)
            if isSent is False:
                return JsonResponse({"result": False, "msg": '寄件失敗，請稍候再試。'})
            else:
                return JsonResponse({"result": True})
    else:
        print("error: it's not through ajax.")


def reset_pwd_send_mail(email, temp_pwd):
    html_msg = render_to_string('chat/reset_pwd_mail.html', {'pwd': temp_pwd})

    title = 'A-LARP匿名劇本殺 重置密碼'
    msg = ''
    receivers = [email]
    email_from = settings.EMAIL_FROM

    status = send_mail(title, msg, email_from, receivers, html_message=html_msg)
    cache.set('reset_pwd_'+email, True, settings.SECONDS_FOR_CACHE_EMAIL)
    isSent = True if status == 1 else False
    return isSent


# game function
def start_game(request):
    if request.is_ajax and request.method == 'GET':
        if not request.user.is_authenticated:
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})

        self_player = request.user.profile
        if self_player.city is None:
            return JsonResponse({"result": False, "msg": '尚未選擇所在城市'})
        if self_player.name is None:
            return JsonResponse({"result": False, "msg": '尚未取新的遊戲暱稱'})

        game = get_game(self_player.isAdult, self_player.isHetero)

        # 自己登記遊戲
        self_player.game = game
        self_player.isPrepared = True
        self_player.waiting_time = datetime.now(tz=timezone.utc)
        self_player.status = 1
        self_player.save()

        # todo 更新city的等待人數

        # 判斷遊戲人數是否足夠
        players = Player.objects.filter(Q(game=game) & Q(isPrepared=True))  # todo 創房者獲取資料後 其他人才離線 問題
        # con't replace isPrepared=True by status=2 because isPrepared is relative to on/off
        # 改為用isAdult和isHetero判斷 直到成功建立者的game作為room的game
        male_players = players.filter(gender='m')
        female_players = players.filter(gender='f')
        maleNeeded = game.best_ratio[0]
        femaleNeeded = game.best_ratio[1]

        # 人數足夠 建立房間
        if len(male_players) >= maleNeeded and len(female_players) >= femaleNeeded:
            room = Room.objects.create(game=game, city=self_player.city)
            if self_player.gender == 'm':
                players = list(female_players.order_by('waiting_time'))[:femaleNeeded] + \
                          [self_player] + list(male_players.order_by('waiting_time'))[:maleNeeded-1]
            else:
                players = [self_player] + list(female_players.order_by('waiting_time'))[:femaleNeeded-1] + \
                          list(male_players.order_by('waiting_time'))[:maleNeeded]

            roles = get_roles_of_game(game, 'f', femaleNeeded) + get_roles_of_game(game, 'm', maleNeeded)

            role_group = [role.group for role in roles]  # role_group = [1, 0, 0, 0,...]
            role_group.extend([0, 0])  # for answer_dict['noplayer0'] and answer_dict['noplayer1']
            event_query = get_event_query(game, role_group)
            # event_query = {0: [event.name, event.content], 1: [event.name, event.content], ...}

            player_dict = {}
            onoff_dict = {}
            answer_dict = {  # noplayer can not take special event, so pop() first
                'noplayer0': event_query[0].pop(),
                'noplayer1': event_query[0].pop()
            }
            shuffle(event_query[0])
            for player, role in zip(players, roles):
                player.room = room  # todo 等待期間的玩家都不能存取資料庫以避免建房者發生錯誤 用player.status禁止上傳
                player.game = game
                player.status = 2
                player.isPrepared = False
                player.waiting_time = None
                player.save()

                uuid = str(player.uuid)
                player_dict[uuid] = [player.name, player.gender, role.name, role.group]
                onoff_dict[uuid] = 1
                answer_dict[uuid] = event_query[int(role.group)].pop()

            room.player_dict = player_dict
            room.onoff_dict = onoff_dict

            room.answer = answer_dict
            room.save()

            # todo 更新city的room數量

            return JsonResponse({"result": True, "start": True, "msg": '遊戲人數齊全，等待加載...'})
        # 人數不足 等待
        else:
            return JsonResponse({"result": True, "start": False, "msg": '請等待其他玩家進入遊戲',
                                 "waiting_time": self_player.waiting_time})

    else:
        print("error: it's not through ajax.")


def get_game(isAdult, isHetero):
    games = Game.objects.filter(Q(isAdult=isAdult) & Q(isHetero=isHetero))
    game = games[randint(0, len(games) - 1)]

    # game = Game.objects.get(id=2)  # for test mode

    return game


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


def get_event_query(game, group_list):  # role_group to event_query: assign event to player for room.answer
    c = Counter(group_list)  # c = {0: num_of_0, 1: num_of_1}
    events = []
    for key in c.keys():
        events += get_events_of_game(game, key, c[key])

    event_query = {}
    for event in events:
        li = event_query.get(int(event.group), None)
        if li is None:  # the first time, haven't established event_query[event.group]
            event_query[int(event.group)] = [[event.name, event.content]]

        else:  # have established event_query[event.group] already, so add the next elmt
            event_query[int(event.group)].append([event.name, event.content])
    return event_query


def leave(request):
    if request.is_ajax and request.method == 'GET':
        if request.user.is_authenticated:
            player = request.user.profile
            player.status = 0
            player.waiting_time = None
            player.save()
            return JsonResponse({"result": True})
        else:
            print("error: user isn't authenticated to leave.")
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})
    else:
        print("error: it's not through ajax.")


def leave_game(request):
    if request.is_ajax and request.method == 'GET':
        if request.user.is_authenticated:
            player = request.user.profile
            room = player.room

            room.onoff_dict[str(player.uuid)] = -1
            room.save()

            player.status = 0
            player.tag_int = None
            player.tag_json = None
            # can't do (player.room = None) because need player.room to do ChatConsumer.call_leave_game()
            player.save()

            # todo 更新city的room數量

            return JsonResponse({"result": True})
        else:
            print("error: user isn't authenticated to leave_game.")
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})
    else:
        print("error: it's not through ajax.")


def enter_match(request):
    # in view_game_{gamename}.py
    pass


def leave_match(request):
    if request.is_ajax and request.method == 'GET':
        if request.user.is_authenticated:
            player = request.user.profile
            match = player.match
            match.player_list.remove(str(player.uuid))
            match.save()

            player.status = 2
            player.waiting_time = None
            player.save()

            return JsonResponse({"result": True})
        else:
            print("error: user isn't authenticated to leave_match.")
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})
    else:
        print("error: it's not through ajax.")

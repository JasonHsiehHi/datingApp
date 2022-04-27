from django.shortcuts import render, redirect
from django.http import JsonResponse

from django.template.loader import render_to_string
from django.core.mail import send_mail

from datingApp import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.sessions.models import Session
from .models import Player, City, Game, Dialogue, Room
from django.core.cache import cache

from django.forms.models import model_to_dict
# from django.db.models import Q, F
from django.db.models import Q

# from random import randint, sample, shuffle, choice
from random import randint

from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
import re

from datetime import datetime, timezone, timedelta
from uuid import uuid4
from hashlib import md5


def get_loginData(user, player):
    player_dict = model_to_dict(player, fields=[
        'gender', 'uuid', 'isBanned', 'status', 'waiting_time', 'name', 'city', 'isAdult', 'isHetero'])
    room = player.room
    if room is None:
        player_dict['game'] = ''
        player_dict['player_dict'] = {}
        player_dict['onoff_dict'] = {}
        player_dict['tag_int'] = -1
        player_dict['tag_json'] = ''

    else:
        player_dict['game'] = str(room.game)
        player_dict['player_dict'] = room.player_dict
        player_dict['onoff_dict'] = room.onoff_dict
        player_dict['tag_int'] = player.tag_int
        player_dict['tag_json'] = player.tag_json

        match = player.match
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
            game = player.game
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

        # city_name, roomNum = get_city_roomNum_max() # unavailable
        city_name, roomNum = '', 0
        if roomNum > settings.PLENTY_ROOM_NUM:
            dialog_city = get_dialogue_dialog('GREET', 'city')
            dialog_city = dialog_city.format(city_name)
            dialogs.append(dialog_city)

        notice_ids = settings.NOTICE_IDS_LIST
        if isinstance(notice_ids, list) and notice_ids[0] != 'no':
            for nid in notice_ids:
                dialog_notice = get_dialogue_dialog('GREET', nid)
                dialogs.append(dialog_notice)

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

        try:
            findUser = User.objects.get(username__iexact=email)
        except User.DoesNotExist:
            findUser = None
        if findUser is not None:
            email = findUser.username

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
    if request.is_ajax and request.method == 'POST':
        isLater = True if request.POST['isLater'] == '1' else False
        isHetero = True if request.POST['sex-radio'] == '1' else False
        isAdult = True if request.POST['mode-radio'] == '1' else False
        if not request.user.is_authenticated:
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})

        self_player = request.user.profile
        if self_player.city is None:
            return JsonResponse({"result": False, "msg": '尚未選擇所在城市'})
        if self_player.name is None:
            return JsonResponse({"result": False, "msg": '尚未取新的遊戲暱稱'})

        # 自己登記
        if isLater is False:
            self_player.game = get_game()
            self_player.status = 1
            self_player.isHetero = isHetero
            self_player.isAdult = isAdult
            self_player.isPrepared = True
            self_player.waiting_time = datetime.now(tz=timezone.utc)
            self_player.save()

        # todo 更新city的等待人數

        # 判斷遊戲人數是否足夠
        # todo 是否能夠不訪問Player資料庫的情況判斷人數是否充足

        players = Player.objects.filter(Q(isHetero=isHetero) & Q(isAdult=isAdult) & Q(isPrepared=True) &
                                        Q(waiting_time__gte=datetime.now(tz=timezone.utc)-timedelta(hours=2)))
        # can't replace isPrepared=True by status=2 because isPrepared is relative to player's on/off

        game = self_player.game
        if self_player.isHetero is True:
            male_players, female_players = players.filter(gender='m'), players.filter(gender='f')
            maleNeeded, femaleNeeded = game.best_ratio[0], game.best_ratio[1]
            maleThreshold, femaleThreshold = game.threshold_ratio[0], game.threshold_ratio[1]
        else:
            if self_player.gender == 'm':
                male_players, female_players = players.filter(gender='m'), players.none()
                maleNeeded, femaleNeeded = game.best_ratio[0] + game.best_ratio[1], 0
                maleThreshold, femaleThreshold = game.threshold_ratio[0] + game.threshold_ratio[1], 0

            else:  # self_player.gender == 'f'
                male_players, female_players = players.none(), players.filter(gender='f')
                maleNeeded, femaleNeeded = 0, game.best_ratio[0] + game.best_ratio[1]
                maleThreshold, femaleThreshold = 0, game.threshold_ratio[0] + game.threshold_ratio[1]

        # 人數足夠 建立房間
        if (len(male_players) >= maleNeeded and len(female_players) >= femaleNeeded) or \
                (isLater is True and len(male_players) >= maleThreshold and len(female_players) >= femaleThreshold):
            room = Room.objects.create(game=game, city=self_player.city)
            # arrange players in gender order
            if self_player.gender == 'm':
                players = list(female_players.order_by('waiting_time'))[:femaleNeeded] + \
                          [self_player] + list(male_players.order_by('waiting_time'))[:maleNeeded - 1]
            else:  # self_player.gender == 'f'
                players = [self_player] + list(female_players.order_by('waiting_time'))[:femaleNeeded - 1] + \
                          list(male_players.order_by('waiting_time'))[:maleNeeded]

            for player in players:
                player.game = game
                player.room = room  # todo 等待期間的玩家都不能存取資料庫以避免建房者發生錯誤 用player.status禁止上傳
                player.status = 2
                player.isPrepared = False
                player.waiting_time = None
                player.save()

            return JsonResponse({"result": True, "start": True,
                                 "game": str(game.game_id), "msg": '遊戲人數齊全，等待加載...'})
        # 人數不足 等待
        elif len(male_players) >= maleThreshold and len(female_players) >= femaleThreshold:
            return JsonResponse({"result": True, "start": False, "later": True,
                                 "msg": '請等待其他玩家進入遊戲', "waiting_time": self_player.waiting_time})
        else:
            return JsonResponse({"result": True, "start": False, "later": False,
                                 "msg": '請等待其他玩家進入遊戲', "waiting_time": self_player.waiting_time})
    else:
        print("error: it's not through ajax.")


def get_game():
    # games = Game.objects.filter(available=True)
    # game = games[randint(0, len(games) - 1)]

    game = Game.objects.get(id=4)  # designate the game instead of selecting randomly
    return game


def leave(request):
    if request.is_ajax and request.method == 'GET':
        if request.user.is_authenticated:
            player = request.user.profile
            player.status = 0
            player.isPrepared = False
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

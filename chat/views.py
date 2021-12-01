from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail

from datingApp import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
from .models import Photo, Player, School, Room, Game, GameRole
from django.forms.models import model_to_dict
from django.db.models import Q
from random import randint, sample

from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator

from datetime import datetime, timezone
from uuid import uuid4
from hashlib import md5

import re
import os
import sys


def chatroom(request):
    loginStatus = True if request.user.is_authenticated else False
    return render(request, 'chat/chatroom.html', {'loginStatus': loginStatus})


def upload_image(request):
    if request.is_ajax and request.method == "POST":
        photo = Photo.objects.create(image=request.FILES['send-img'], uploader=request.POST['send-hidden'],
                                     isForAdult=request.POST['send-tag'])
        old_path = photo.image.path
        extension_name = photo.image.name.split('.')[-1]
        photo.image.name = 'photo/' + photo.name + '.' + extension_name
        os.rename(old_path, photo.image.path)
        photo.save()
        return JsonResponse({'img_url': photo.image.url})
    else:
        print("error: it's not through ajax.", file=sys.stderr)


def post_school(request):
    if request.is_ajax and request.method == "POST":
        school_name = request.POST['goto-input'].upper()
        filter_result = School.objects.filter(name__exact=school_name)
        if len(filter_result) == 0:
            return JsonResponse({"result": False, "msg": "抱歉，所在城市還未開放。"})

        school = filter_result[0]
        Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                        defaults={'school': school})
        dialog = []  # todo dialog GOTO 動態資訊
        return JsonResponse({"result": True, "school": school.name, "dialog": dialog})
    else:
        print("error: it's not through ajax.", file=sys.stderr)


def post_name(request):  # todo 加上修改權限permission 用於替代self.player_data.status
    if request.is_ajax and request.method == "POST":
        name = request.POST['name-input']
        if len(name) > 20:
            return JsonResponse({"result": False, "msg": "暱稱太長了，不能超過20個字元"})

        player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                          defaults={'name': name})
        return JsonResponse({"result": True, "name": player.name})
    else:
        print("error: it's not through ajax.", file=sys.stderr)


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
            return JsonResponse({"result": False, "msg": '不符合電子信箱格式！'})

        error_msg = validate_pwd(password1, password2)  # 密碼不符合條件
        if error_msg is not None:
            return JsonResponse({"result": False, "msg": error_msg})

        filter_result = User.objects.filter(username__exact=email)
        if len(filter_result) == 1:
            if filter_result[0].is_active is True:
                return JsonResponse({"result": False, "msg": '此電子信箱已經註冊過了！如果您的密碼遺失可選擇重設密碼。'})

            else:
                if cache.get('signup_' + email) is True:
                    return JsonResponse({"result": False, "msg": '已經寄到此電子信箱了哦！如果需要再寄一次則需等待10分鐘。'})

                isSent = signup_send_mail(email)
                if isSent is False:
                    return JsonResponse({"result": False, "msg": '寄件失敗，請稍候再試。'})
                else:
                    return JsonResponse({"result": True, "msg": "已成功將註冊認證信寄到你的信箱了哦！"})

        else:
            user = signup_create_user(email, password2)
            Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                            defaults={'user': user, 'registered': True, 'gender': gender})
            isSent = signup_send_mail(email)
            if isSent is False:
                return JsonResponse({"result": False, "msg": '寄件失敗，請稍候再試。'})
            else:
                return JsonResponse({"result": True, "msg": "已成功將註冊認證信寄到你的信箱了哦！"})
    else:
        print("error: it's not through ajax.", file=sys.stderr)


def signup_create_user(email, password):

    if settings.DEBUG is True:  # todo 測試時開放同信箱註冊 username名稱自動遞增
        filter_result = User.objects.filter(email=email)
        username = email+len(filter_result)
    else:
        username = email

    user = User.objects.create_user(username=username, password=password, email=email)
    user.is_active = False
    user.save()
    return user


def signup_send_mail(email):
    token = get_random_str()
    url = '/'.join([settings.DOMAIN, 'chat', 'signup', token])
    html_msg = render_to_string('chat/signup_mail.html', {'url': url})

    title = 'A-LARP匿名狼人殺 註冊認證信'
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
        user = User.objects.get(username=email)
        user.is_active = True
        user.save()
        login(request, user)
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
            player_dict = model_to_dict(user.profile, fields=['uuid', 'name', 'school'])
            return JsonResponse({"result": True, 'player': player_dict, "msg": '帳號登入成功！'})

    else:
        print("error: it's not through ajax.", file=sys.stderr)


def log_out(request):
    if request.is_ajax and request.method == 'POST':
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({"result": True, "msg": '帳號已登出！'})
        else:
            print("error: user isn't authenticated.", file=sys.stderr)
    else:
        print("error: it's not through ajax.", file=sys.stderr)


def validate_pwd(password1, password2):
    error_msg = None
    if len(password1) < 8:
        error_msg = '密碼至少8個字元！'
    if len(password1) > 30:
        error_msg = '密碼太長！'
    if re.match(r'^(?=.*[\d])(?=.*[a-zA-Z]).{8,30}$', password1) is None:
        error_msg = '至少一個數字與至少一個英文字母'
    if password1 != password2:
        error_msg = '確認密碼不ㄧ致！'
    return error_msg


def change_pwd(request):
    if request.is_ajax and request.method == 'POST':
        if not request.user.is_authenticated:
            print("error: user isn't authenticated.", file=sys.stderr)
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})

        old_password = request.POST['change-pwd-input-old']
        password1 = request.POST['change-pwd-input-password']
        password2 = request.POST['change-pwd-input-confirm']

        user = request.user
        if user.check_password(old_password) is False:
            return JsonResponse({"result": False, "msg": '原密碼錯誤！'})

        error_msg = validate_pwd(password1, password2)  # 密碼不符合條件
        if error_msg is not None:
            return JsonResponse({"result": False, "msg": error_msg})

        user.set_password(password2)
        user.save()
        login(request, user)
        return JsonResponse({"result": True, "msg": '變更密碼成功！'})

    else:
        print("error: it's not through ajax.", file=sys.stderr)


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
            return JsonResponse({"result": True, "msg": '已成功將重設密碼信寄到你的信箱了哦！'})

    else:
        print("error: it's not through ajax.", file=sys.stderr)


def reset_pwd_send_mail(email, temp_pwd):
    html_msg = render_to_string('chat/reset_pwd_mail.html', {'pwd': temp_pwd})

    title = 'A-LARP匿名狼人殺 重置密碼'
    msg = ''
    receivers = [email]
    email_from = settings.EMAIL_FROM

    status = send_mail(title, msg, email_from, receivers, html_message=html_msg)
    cache.set('reset_pwd_'+email, True, settings.SECONDS_FOR_CACHE_EMAIL)
    isSent = True if status == 1 else False
    return isSent


def start_game(request):
    if request.is_ajax and request.method == 'POST':
        if not request.user.is_authenticated:
            print("error: user isn't authenticated.", file=sys.stderr)
            return JsonResponse({"result": False, "msg": '用戶尚未登入。'})

        user = request.user
        self_player = user.profile

        if self_player.school is None:
            return JsonResponse({"result": False, "msg": '尚未選擇所在城市'})
        if self_player.name is None:
            return JsonResponse({"result": False, "msg": '尚未取新的遊戲暱稱'})

        game = get_game(self_player.isAdult, self_player.isHetero)

        # 自己登記遊戲
        self_player.game = game
        self_player.isPrepared = True
        self_player.waiting_time = datetime.now(tz=timezone.utc)
        self_player.save()

        # 判斷遊戲人數是否足夠
        players = Player.objects.filter(Q(game=game) & Q(isPrepared=True))  # todo 創房者獲取資料後 其他人才離線 問題
        male_players = players.filter(gender='m')
        female_players = players.filter(gender='f')
        maleNeeded = game.best_ratio[0]
        femaleNeeded = game.best_ratio[1]

        # 人數足夠 建立房間
        if len(male_players) >= maleNeeded and len(female_players) > femaleNeeded:
            room = Room.objects.create(id=user.id, game=game)
            if self_player.gender == 'm':
                players = female_players.order_by('waiting_time')[:femaleNeeded] + \
                          self_player + male_players.order_by('waiting_time')[:maleNeeded-1]
            else:
                players = self_player + female_players.order_by('waiting_time')[:femaleNeeded-1] + \
                          male_players.order_by('waiting_time')[:maleNeeded]

            roles = get_roles_of_game(game, 'f', femaleNeeded) + get_roles_of_game(game, 'm', maleNeeded)

            player_dict = {}
            onoff_dict = {}
            for player, role in zip(players, roles):
                player.room = room  # todo 等待期間的玩家都不能存取資料庫以避免建房者發生錯誤 用player.status禁止上傳
                player.save()
                player_dict[player.user.id] = [player.name, player.gender, role.name]
                onoff_dict[player.user.id] = True


            room.player_dict = player_dict
            room.onoff_dict = onoff_dict
            room.playerNum = femaleNeeded + maleNeeded
            room.save()

            return JsonResponse({"result": True, "msg": '遊戲人數齊全，請等待加載...', "start": True})
        # 人數不足 等待
        else:
            return JsonResponse({"result": True, "msg": '請等待其他玩家進入遊戲', "start": False})

    else:
        print("error: it's not through ajax.", file=sys.stderr)


def get_game(isAdult, isHetero):
    games = Game.objects.filter(Q(isAdult=isAdult) & Q(isHetero=isHetero))
    game = games[randint(0, len(games) - 1)]

    if settings.DEBUG is True:
        game = Game.objects.get(id=1)
    return game


def get_roles_of_game(game, gender, num=1):
    roles = GameRole.objects.filter(Q(game=game) & Q(gender=gender))
    return sample(roles, num)


def in_game(request, game_name):
    # 先查看request.user 是否資料完全符合 遊戲房間必須正確 是否真的在遊戲進行中permission
    # 被保持獨立 遊戲中的ajax則要傳送到 views_game_name.py
    # consumers.py中也不會有個別遊戲專屬的method 而是所有遊戲都使用consumers.py的標配功能
    pass


# 放到views_game_name.py
def leave_game(request):
    pass


# 放到views_game_name.py
def enter_room(request):
    pass


# 放到views_game_name.py
def leave_room(request):
    pass


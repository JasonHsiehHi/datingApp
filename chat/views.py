from django.shortcuts import render
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.core.mail import send_mail

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
from django.forms.models import model_to_dict
from django.forms import ValidationError
from .models import Photo, Player, School, Room
from datingApp import settings

from datetime import datetime, timezone
from uuid import uuid4
from hashlib import md5

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
        return JsonResponse({"error": "it's not through ajax."})


def post_school(request):
    if request.is_ajax and request.method == "POST":
        school_name = request.POST['goto-input'].upper()
        filter_result = School.objects.filter(name__exact=school_name)
        if len(filter_result) == 0:
            raise ValidationError("the school hasn't been available yet.")
        else:
            school = filter_result[0]
            player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                              defaults={'school': school})
            dialog = []  # todo dialog GOTO 動態資訊
            return JsonResponse({"school": school.name, "dialog": dialog})
    else:
        return JsonResponse({"error": "it's not through ajax."})


def post_name(request):  # todo 加上修改權限permission用於替代self.player_data.status
    if request.is_ajax and request.method == "POST":
        name = request.POST['name-input']
        if len(name) > 20:
            raise ValidationError("the length of name is more than 20 characters.")
        else:
            player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                              defaults={'name': name})
            return JsonResponse({"name": player.name})
    else:
        return JsonResponse({"error": "it's not through ajax."})


def signup(request):
    if request.is_ajax and request.method == "POST":
        email = request.POST['signup-input-email']
        password1 = request.POST['signup-input-password']  # 前端才需要檢查password-confirm
        password2 = request.POST['signup-input-confirm']
        filter_result = User.objects.filter(username__exact=email)
        # todo 加上ValidationError做資料驗證

        if len(filter_result) == 1:
            if filter_result[0].is_active is False:
                seconds = (datetime.now(tz=timezone.utc) - filter_result[0].date_joined).seconds
                if seconds > settings.SECONDS_FOR_CACHE_TOKEN:
                    user = signup_create_user(email, password2, again=True)
                    player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                                      defaults={'user': user, 'registered': True})
                    isSent = signup_send_mail(email)
                    return JsonResponse({"send_result": isSent})
                else:
                    return JsonResponse({"send_result": True})
            else:
                return JsonResponse({"already_signup": True})

        else:
            user = signup_create_user(email, password2)
            player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                              defaults={'user': user, 'registered': True})
            isSent = signup_send_mail(email)
            return JsonResponse({"send_result": isSent})
    else:
        return JsonResponse({"error": "it's not through ajax."})


def signup_create_user(email, password, again=False):
    if again is True:
        u = User.objects.get(username=email)
        u.delete()
    user = User.objects.create_user(username=email, password=password, email=email)
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
                                                               "msg": '驗證連結可能已過期，或所驗證的使用者不存在，請重新註冊。'})
    else:
        user = User.objects.get(username=email)
        user.is_active = True
        user.save()
        login(request, user)
        return render(request, 'chat/chatroom_activate.html', {"title": '啟用成功',
                                                               "msg": '信箱註冊成功，現在可以開始遊戲了哦！'})


def log_in(request):
    if request.is_ajax and request.method == 'POST':
        user = authenticate(request,
                            username=request.POST['login-input-email'],
                            password=request.POST['login-input-password'])
        if user is not None and user.is_active:
            login(request, user)
            player_dict = model_to_dict(user.profile, fields=['uuid', 'name', 'school'])
            return JsonResponse({"login": True, 'player': player_dict})
        else:
            return JsonResponse({"login": False})

    else:
        return JsonResponse({"error": "it's not through ajax."})


def log_out(request):
    if request.is_ajax and request.method == 'POST':
        if request.user.is_authenticated:
            logout(request)
            return JsonResponse({"logout": True})
    else:
        return JsonResponse({"error": "it's not through ajax."})


def change_pwd(request):
    if request.is_ajax and request.method == 'POST':
        old_password = ['change-pwd-input-old']
        password1 = ['change-pwd-input-password']
        password1 = ['change-pwd-input-confirm']

    else:
        return JsonResponse({"error": "it's not through ajax."})


def reset_pwd(request):
    if request.is_ajax and request.method == 'POST':
        old_password = ['change-pwd-input-old']
        password1 = ['change-pwd-input-password']
        password1 = ['change-pwd-input-confirm']

    else:
        return JsonResponse({"error": "it's not through ajax."})


def start_game(request):
    # 檢查user.is_active
    pass


def leave_game(request):
    pass


def enter_room(request):
    pass


def leave_room(request):
    pass


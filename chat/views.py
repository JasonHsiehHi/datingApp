from django.shortcuts import render
from .models import Photo, Player, School, Room
from . import utils
from django.http import JsonResponse
import os
import sys


def chatroom(request):
    return render(request, 'chat/chatroom.html')


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
        school = School.objects.get(name=request.POST['goto-input'].upper())  # todo school_id檢測 把schoolImgSet存入cache中
        player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                          defaults={'school': school})
        dialog = []  # todo dialog GOTO 動態資訊
        return JsonResponse({"school": school.name, "dialog": dialog})
    else:
        return JsonResponse({"error": "it's not through ajax."})


def post_name(request):
    if request.is_ajax and request.method == "POST":
        player, created = Player.objects.update_or_create(uuid=request.POST['uuid-input'],
                                                          defaults={'name': request.POST['name-input']})
        return JsonResponse({"name": player.name})
    else:
        return JsonResponse({"error": "it's not through ajax."})


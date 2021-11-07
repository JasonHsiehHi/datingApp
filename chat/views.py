from django.shortcuts import render
from .models import Photo
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

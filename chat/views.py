from django.shortcuts import render
from .forms import PhotoModelForm
from django.http import JsonResponse
import os
from django.conf import settings


def chatroom(request):
    return render(request, 'chat/chatroom.html')


def upload_image(request):
    if request.is_ajax and request.method == "POST":
        form = PhotoModelForm(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            extension_name = instance.image.name.split('.')[-1]
            instance.image.name = 'photo/'+instance.name+'.'+extension_name
            new_path = settings.MEDIA_ROOT + instance.image.name
            os.rename(instance.image.path, new_path)
            instance.save()
            return JsonResponse({'img_url': instance.image.url})
        else:
            return JsonResponse({"error": form.errors})
    return JsonResponse({"error": "it's not through ajax."})

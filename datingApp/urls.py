from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView

urlpatterns = [
    path('chat/', include('chat.urls')),
    path('', RedirectView.as_view(url='/chat/'))
]

from django.conf import settings
from django.conf.urls.static import static

if settings.ADMIN_ENABLED:
    urlpatterns += [path(settings.ADMIN_PATH, admin.site.urls)]

if settings.DEBUG:  # for test mode locally
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'datingApp.settings')
django.setup()  # for import chat.routing(INSTALLED_APPS)

from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing

# channel installation
application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns
        )
    ),
})


from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
# as_asgi()等同 urls.py的as_view()
# 將變數(?P<room_name>\w+)傳給as_asgi() 如同在urls.py的<int:pk>傳給views.py一樣
# 可用self.scope['url_route']['kwargs']['room_name']在consumers.py中使用

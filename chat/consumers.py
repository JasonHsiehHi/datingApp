from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from django.core.cache import cache
import time
import json
import sys


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self, **kwargs):
        self.player_data = None
        self.robot = 2  # randint(0, 1)
        await self.accept()

        # await self.close() to reject connection

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            str(self.player_data.uuid),
            self.channel_name
        )
        if self.player_data.inRoom:
            await self.channel_layer.group_discard(
                int(self.player_data.room),
                self.channel_name
            )
        await utils.delete_player(self.player_data.uuid)

    # receive from client side first
    async def receive_json(self, content):
        command = content.get('cmd', None)
        if command is not None:
            if command == 'open':
                await self.cmd_open(content['uuid'])
            elif command == 'goto':
                await self.cmd_goto(content['school'])
            elif command == 'profile':
                await self.cmd_profile(content['name'], content['matchType'])
            elif command == 'rename':
                await self.cmd_profile(content['name'])
            elif command == 'test':
                await self.cmd_test()
            elif command == 'wait':
                await self.cmd_wait(content['result'])
            elif command == 'leave':
                await self.cmd_leave()
            elif command == 'change':
                await self.cmd_leave()
                await self.cmd_wait()

            # todo 還有/reset, /adult
        elif self.player_data.inRoom:
            if 'wn' in content:
                await self.channel_layer.group_send(self.player_data.room, {
                    'type': 'is_waiting',
                    'boolean': content['wn']
                })
            elif 'msg' in content:
                await self.channel_layer.group_send(self.player_data.room, {
                    'type': 'chat_message',
                    'message': content['msg']
                })
            elif 'img' in content:
                await self.channel_layer.group_send(self.player_data.room, {
                    'type': 'chat_image',
                    'image': content['img']
                })

    # 主要用於調用資料庫 且調用結束後仍須通知對方 self.channel_layer.group_send()
    # 每個command最後都需回傳給client端 提供UI做回應 self.send_json()

    # called by receive_json to response client side
    async def cmd_open(self, uuid):
        await self.channel_layer.group_add(
            uuid,
            self.channel_name
        )
        self.player_data = await utils.get_player(uuid)
        t = int(time.strftime('%H', time.localtime()))
        if 5 <= t < 17:
            dialog, robot = await utils.get_dialogue_dialog_and_speaker(self.robot, 'GREET', 'mo')
        else:
            dialog, robot = await utils.get_dialogue_dialog_and_speaker(self.robot, 'GREET', 'ev')
        await self.send_json({
            'type': 'GREET',
            'dialog': dialog,
            'anonName': robot
        })

    async def cmd_goto(self, school_id):
        school_id = school_id.lower()
        await utils.set_player_school(self.player_data, school_id)
        dialog, robot = await utils.get_dialogue_dialog_and_speaker(1, 'GOTO', school_id)
        await self.send_json({
            'type': 'GOTO',
            'dialog': dialog  # todo 存入database的dialogue需要能夠挖空 並可放入name變數
        })

    async def cmd_profile(self, name, match_type=None):
        if match_type is None:
            action = 'RENAME'
            self.player_data = await utils.set_player_profile(
                self.player_data, name)

        else:
            action = 'PROFILE'
            self.player_data = await utils.set_player_profile(
                self.player_data, name, match_type)

        await self.send_json({
            'type': action
        })

    async def cmd_test(self):
        id_list = cache.get_or_set('QUESTION_ID_LIST', await utils.get_question_id_list_randomly(), None)
        question_list = cache.get_or_set('QUESTION_LIST', await utils.get_question_content_list(id_list), 0)
        # how to change questions : update QUESTION_ID_LIST and then delete QUESTION_LIST
        await self.send_json({
            'type': 'TEST',
            'questions': question_list,
        })

    async def cmd_wait(self, result=None):  # 即使client端的testResult存在 仍再次傳入
        correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', [True, True, True, True, True], None)
        if self.player_data.result != result:
            self.player_data = await utils.set_player_score(self.player_data, result, correct_result)
        self.player_data = await utils.process_player_wait(self.player_data, True)

        matcher_uuid, matcher_name = await utils.process_player_match(self.player_data)
        if matcher_uuid is None:
            await self.send_json({
                'type': 'WAIT'
            })
        else:
            room_match_type = 'mf' if self.player_data['matchType'] == 'fm' else self.player_data.matchType
            room = await utils.create_room(room_match_type, self.player_data.school)
            await self.channel_layer.group_send(matcher_uuid, {
                'type': 'enter_room',
                'name': self.player_data.name,
                'room': room.group_name
            })
            await self.enter_room({  # your matcher and you do the same thing
                'name': matcher_name,
                'room': room.group_name
            })

            '''
            await self.channel_layer.group_add(
                room.group_name,
                self.channel_name
            )
            self.player_data['room'] = room.group_name
            self.player_data['inRoom'] = True
            self.player_data['isWaiting'] = False
            await self.send_json({
                'type': 'ENTER',
                'room': room.group_name,
                'matcher_name': matcher_name
            })
            '''

    async def cmd_leave(self):
        await self.channel_layer.group_send(self.player_data['room'], {
            'type': 'leave_room',
            'active': False
        })
        await self.leave_room({'active': True})  # you do the same thing : you're active and your matcher is passive

        '''
        await self.channel_layer.group_discard(
            self.player_data['room'],
            self.channel_name
        )
        self.player_data['room'] = None
        self.player_data['inRoom'] = False
        '''

    # receive from other chatConsumers
    async def enter_room(self, event):
        name, room_name = event['name'], event['room']
        await self.channel_layer.group_add(
            room_name,
            self.channel_name
        )
        self.player_data = await utils.set_player_room(self.player_data, room_name)
        await self.send_json({
            'type': 'ENTER',
            'room': room_name,
            'matcher_name': name
        })

    async def leave_room(self, event):
        await self.channel_layer.group_discard(
            self.player_data['room'],
            self.channel_name
        )
        self.player_data = await utils.set_player_room(self.player_data, None)
        action = 'LEAVE' if event['active'] else 'LEFT'
        await self.send_json({
            'type': action
        })

    async def chat_message(self, event):
        message = event['message']
        await self.send_json({
            'type': 'MSG',  # todo 'MSG'和'MSGS'之差異
            'msg': message
        })

    async def chat_image(self, event):
        imgUrl = event['image']
        await self.send_json({
            'type': 'IMG',
            'img': imgUrl
        })

    async def is_waiting(self, event):
        isWaiting = event['boolean']
        await self.send_json({
            'type': 'WN',
            'wn': isWaiting
        })

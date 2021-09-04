from django.conf import settings
from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
from . import utils


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self, **kwargs):
        self.player_data = {}
        await self.accept()

        # await self.close() 可觸發webSocket.onclose() 可用於拒絕連線

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.player_data['uuid'],
            self.channel_name
        )
        if self.player_data['inRoom']:
            await self.channel_layer.group_discard(
                self.player_data['room'],
                self.channel_name
            )
        await utils.delete_player(self.player_data['uuid'])

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
            elif command == 'name':
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

            # todo 還有/reset, /adult兩種

        elif 'wn' in content and self.player_data['inRoom']:
            await self.channel_layer.group_send(self.player_data['room'], {
                'type': 'is_waiting',
                'boolean': content['wn']
            })

        elif 'msg' in content and self.player_data['inRoom']:
            await self.channel_layer.group_send(self.player_data['room'], {
                'type': 'chat_message',
                'message': content['msg']
            })

    # 主要用於調用資料庫 且調用結束後仍須通知對方 self.channel_layer.group_send()
    # 每個command最後都需回傳給client端 提供UI做回應 self.send_json()
    # called by receive_json to response client side

    async def cmd_open(self, uuid):
        await self.channel_layer.group_add(
            uuid,
            self.channel_name
        )
        player = await utils.create_player(uuid)
        self.player_data['uuid'] = uuid
        self.player_data['player'] = player
        self.player_data['create_date'] = player.create_date
        time = player.create_date.strftime('%H')
        # consumers.py傳入的action 需包含時間資訊才能回傳早上晚上不同的資料
        if 5 <= time < 17:
            dialog, robot = await utils.get_dialogue_dialog('GREET', 'mo')
        else:
            dialog, robot = await utils.get_dialogue_dialog('GREET', 'ev')
        await self.send_json({
            'type': 'GREET',
            'dialog': dialog,
            'anonName': robot
        })

    async def cmd_goto(self, school_id):
        self.player_data['school'] = school_id
        image_url = await utils.get_school_url(school_id)
        await self.send_json({
            'type': 'GOTO',
            'school': image_url,
            'dialog': await utils.get_dialogue_dialog('GOTO')
        })

    async def cmd_profile(self, name, match_type=None):
        if match_type is None:
            action = 'NAME'
            self.player_data['player'] = await utils.set_player_profile(
                self.player_data['uuid'], name)

        else:
            action = 'PROFILE'
            self.player_data['player'] = await utils.set_player_profile(
                self.player_data['uuid'], name, match_type)
            self.player_data['matchType'] = match_type
        self.player_data['name'] = name
        # todo 存入database的dialogue需要能夠挖空 並可放入name變數
        await self.send_json({
            'type': action
        })

    async def cmd_leave(self):
        await self.channel_layer.group_send(self.player_data['room'], {
            'type': 'leave_room',
            'active': False
        })
        await self.leave_room({'active': True})  # your matcher and you do the same thing

        '''
        await self.channel_layer.group_discard(
            self.player_data['room'],
            self.channel_name
        )
        self.player_data['room'] = None
        self.player_data['inRoom'] = False
        '''

    async def cmd_test(self):
        await self.send_json({
            'type': 'TEST',
            'questions': await utils.get_question_content_list(settings.CORRECT_RESULT),
        })

    async def cmd_wait(self, result=None):
        if result is None:
            score = self.player_data['score']
        else:
            score = await utils.set_player_score(self.player_data['uuid'], result, settings.CORRECT_RESULT)
            self.player_data['result'] = result
            self.player_data['score'] = score

        isWaiting = True
        await utils.process_player_wait(self.player_data['uuid'], isWaiting)
        self.player_data['isWaiting'] = isWaiting

        matcher_uuid, matcher_name = await utils.process_player_match(self.player_data['uuid'])
        if matcher_uuid is None:
            await self.send_json({
                'type': 'WAIT'
            })
        else:
            room_match_type = 'mf' if self.player_data['matchType'] == 'fm' else self.player_data['matchType']
            room = await utils.create_room(room_match_type, self.player_data['school'])
            await self.channel_layer.group_send(matcher_uuid, {
                'type': 'enter_room',
                'name': self.player_data['name'],
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

    # receive from other chatConsumers
    async def enter_room(self, event):
        name, room_name = event['name'], event['room']
        await self.channel_layer.group_add(
            room_name,
            self.channel_name
        )
        self.player_data['room'] = room_name
        self.player_data['inRoom'] = True
        self.player_data['isWaiting'] = False
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
        action = 'LEAVE' if event['active'] else 'LEFT'
        self.player_data['room'] = None
        self.player_data['inRoom'] = False
        await self.send_json({
            'type': action
        })

    async def chat_message(self, event):
        message = event['message']
        await self.send_json({
            'type': 'MSG',  # todo 'MSG'和'MSGS'之差異
            'msg': message
        })

    async def is_waiting(self, event):
        isWaiting = event['boolean']
        await self.send_json({
            'type': 'WN',
            'wn': isWaiting
        })

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from django.core.cache import cache
from datetime import datetime
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
        if self.player_data.status == 3:
            room_id = str(self.player_data.room_id)

            await self.channel_layer.group_send(room_id, {
                'type': 'is_disconnected',
                'boolean': True,
                'from': str(self.player_data.name)
            })

            await self.channel_layer.group_discard(
                room_id,
                self.channel_name
            )
        await utils.delete_player(self.player_data.uuid)

    # receive from client side first
    async def receive_json(self, content):
        command = content.get('cmd', None)  # todo 後端也要做資料驗證 以避免用戶硬改JS
        print(command, file=sys.stderr)
        if command is None and self.player_data.status == 3 and self.room_userNum == 2:
            room_id = str(self.player_data.room_id)
            if 'wn' in content:

                print('wn', file=sys.stderr)

                await self.channel_layer.group_send(room_id, {
                    'type': 'is_writing',
                    'boolean': content['wn'],
                    'from': str(self.player_data.name)
                })
            elif 'st' in content:
                await self.channel_layer.group_send(room_id, {
                    'type': 'update_status',
                    'num': content['st'],
                    'from': content['from']
                })
            elif 'msg' in content:
                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_message',
                    'message': content['msg'],
                    'isImg': content['isImg'],
                    'from': str(self.player_data.name)
                })
            elif 'msgs' in content:
                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_messageList',
                    'messages': content['msgs'],
                    'from': str(self.player_data.name)
                })


        elif command is not None:
            if command == 'open':
                await self.cmd_open(content['uuid'])
            elif command == 'import':
                await self.cmd_import(content['data'])
            elif command == 'goto':
                await self.cmd_goto(content['school'])
            elif command == 'profile':
                await self.cmd_profile(content['name'], content['matchType'])
            elif command == 'rename':
                await self.cmd_profile(content['name'])
            elif command == 'test':
                await self.cmd_test()
            elif command == 'wait':
                await self.cmd_wait(content['testResult'])
            elif command == 'leave':
                await self.cmd_leave()
            elif command == 'change':
                await self.cmd_leave()
                await self.cmd_wait()
            # todo 還有/reset, /adult

    # 主要用於調用資料庫 且調用結束後仍須通知對方 self.channel_layer.group_send()
    # 每個command最後都需回傳給client端 提供UI做回應 self.send_json()

    # called by receive_json to response client side
    async def cmd_open(self, uuid):
        await self.channel_layer.group_add(
            uuid,
            self.channel_name
        )
        self.player_data = await utils.get_player(uuid)

        if self.player_data.status == 0 or self.player_data.status == 2:
            t = int(datetime.now().strftime('%H'))
            if 5 <= t < 17:
                dialog, robot = await utils.get_dialogue_dialog_and_speaker(self.robot, 'GREET', 'mo')
            else:
                dialog, robot = await utils.get_dialogue_dialog_and_speaker(self.robot, 'GREET', 'ev')
            await self.send_json({
                'type': 'GREET',
                'dialog': dialog,  # todo 存入database的dialogue需要能夠挖空 並可放入name變數
                'anonName': robot
            })

    async def cmd_import(self, data):
        correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', ['1', '1', '1', '1', '1'], None)
        self.player_data = await utils.set_player_data(self.player_data, data, correct_result)
        if self.player_data.status == 3:
            room_id = str(self.player_data.room_id)
            await self.channel_layer.group_add(
                room_id,
                self.channel_name
            )
            self.room_userNum = await utils.get_room_userNum(room_id) + 1
            # get_room_userNum() 表示自己還未進入房間的人數 也就是只觀測對方是否在房間
            await self.channel_layer.group_send(room_id, {
                'type': 'is_disconnected',
                'boolean': False,
                'from': str(self.player_data.name)
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

    async def cmd_wait(self, testResult=None):  # 即使client端的testResult存在 仍再次傳入
        correct_result = cache.get_or_set('QUESTION_CORRECT_RESULT', ['1', '1', '1', '1', '1'], None)
        if self.player_data.testResult != testResult:
            self.player_data = await utils.set_player_score(self.player_data, testResult, correct_result)
        self.player_data = await utils.process_player_wait(self.player_data, 2)

        matcher_uuid, matcher_name = await utils.process_player_match(self.player_data)
        if matcher_uuid is None:
            await self.send_json({
                'type': 'WAIT'
            })
        else:
            room_match_type = 'mf' if self.player_data.matchType == 'fm' else self.player_data.matchType
            room_id = await utils.create_room(room_match_type, self.player_data.school)
            await self.channel_layer.group_send(matcher_uuid, {
                'type': 'enter_room',
                'name': str(self.player_data.name),
                'room': room_id
            })
            await self.enter_room({  # your matcher and you do the same thing
                'name': matcher_name,
                'room': room_id
            })

    async def cmd_leave(self):
        await self.channel_layer.group_send(str(self.player_data.room_id), {
            'type': 'leave_room'
        })
        await self.leave_room({  # the same thing:you're active and your matcher is passive
        })

    # receive from other chatConsumers
    async def enter_room(self, event):
        name, room_id = event['name'], event['room']  # todo room_id 太容易猜到 必須要改名
        await self.channel_layer.group_add(
            room_id,
            self.channel_name
        )
        self.player_data = await utils.set_player_room(self.player_data, room_id, name)
        self.room_userNum = 2
        await self.send_json({
            'type': 'ENTER',
            'room': room_id,
            'matcherName': name
        })

    async def leave_room(self, event):
        await self.channel_layer.group_discard(
            str(self.player_data.room_id),
            self.channel_name
        )
        self.player_data = await utils.set_player_room(self.player_data, None, None)
        await self.send_json({
            'type': 'LEAVE',
            'sender': str(self.player_data.name)
        })

    async def chat_message(self, event):
        if str(self.player_data.name) != event['from']:
            await self.send_json({
                'type': 'MSG',
                'msg': event['message'],
                'isImg': event['isImg'],
                'sender': event['from']
            })

    async def chat_messageList(self, event):
        if str(self.player_data.name) != event['from']:
            await self.send_json({
                'type': 'MSGS',
                'msgs': event['messages'],
                'sender': event['from']
            })

    async def is_writing(self, event):
        if str(self.player_data.name) != event['from']:
            await self.send_json({
                'type': 'WN',
                'wn': event['boolean'],
                'sender': event['from']
            })

    async def update_status(self, event):
        if str(self.player_data.name) == event['from']:
            await self.send_json({
                'type': 'ST',
                'num': event['num'],
                'receiver': event['from']
            })

    async def is_disconnected(self, event):
        if str(self.player_data.name) != event['from']:
            self.room_userNum = await utils.set_room_userNum(str(self.player_data.room_id), event['boolean'])
            # set_room_userNum() 只觀測對方是否進入房間
            m = 'DISCON' if event['boolean'] else 'CONN'
            await self.send_json({
                'type': m
            })



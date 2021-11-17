from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from django.core.cache import cache
from datetime import datetime
import time
import sys
from datingApp import settings


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self, **kwargs):
        self.player_data = None  # todo self.player_data自動變為None的問題
        self.robot_id = 3  # randint(1, 3)
        await self.accept()

        # await self.close() to reject connection
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            str(self.player_data.uuid),
            self.channel_name
        )
        if self.player_data.status == 3:
            room_id = str(self.player_data.room_id)

            self.room_userNum = await utils.set_room_userNum(str(self.player_data.room_id), True)

            await self.channel_layer.group_send(room_id, {
                'type': 'is_disconnected',
                'boolean': True,
                'from': str(self.player_data.name)
            })

            await self.channel_layer.group_discard(
                room_id,
                self.channel_name
            )
        await utils.delete_player(str(self.player_data.uuid))

    # receive from client side first
    async def receive_json(self, content):
        self.start = time.time()
        command = content.get('cmd', None)  # todo 後端資料驗證 避免用戶直接操作console
        if command is None and self.player_data.status == 3 and self.room_userNum == 2:
            room_id = str(self.player_data.room_id)
            if 'wn' in content:

                print('wn', file=sys.stderr)  # tt
                print("執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'is_writing',
                    'boolean': content['wn'],
                    'from': str(self.player_data.name),
                    't': self.start
                })
            elif 'st' in content:

                print('st', file=sys.stderr)  # tt
                print("執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'update_status',
                    'num': content['st'],
                    'from': content['from'],
                    't': self.start
                })
            elif 'msg' in content:

                print('msg', file=sys.stderr)  # tt
                print("執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_message',
                    'message': content['msg'],
                    'isImg': content['isImg'],
                    'from': str(self.player_data.name),
                    't': self.start
                })
            elif 'msgs' in content:

                print('msgs', file=sys.stderr)  # tt
                print("執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_messageList',
                    'messages': content['msgs'],
                    'from': str(self.player_data.name),
                    't': self.start
                })

        elif command is not None:
            print(command, file=sys.stderr)
            if command == 'open':
                await self.cmd_open(content['uuid'], content['isFirst'])
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
            elif command == 'adult':
                await self.cmd_adult(content['imgUrl'])
            elif command == 'wait':
                await self.cmd_wait(content['testResult'])
            elif command == 'leave':
                await self.cmd_leave()
            elif command == 'change':
                await self.cmd_change()
            elif command == 'reset':
                await self.cmd_reset()
            else:
                print(str(self.player_data.uuid) + ' insert a wrong command: ' + command, file=sys.stderr)

    # 主要用於調用資料庫 且調用結束後仍須通知對方 self.channel_layer.group_send()
    # 每個command最後都需回傳給client端 提供UI做回應 self.send_json()

    # called by receive_json to response client side
    async def cmd_open(self, uuid, isFirst):
        await self.channel_layer.group_add(
            uuid,
            self.channel_name
        )
        self.player_data = await utils.get_player(uuid)

        if isFirst is True and (self.player_data.status == 0 or self.player_data.status == 2):
            dialog, sub = [], []
            t = int(datetime.now().strftime('%H'))
            robot = await utils.get_robot_name(self.robot_id)
            sub_t = await utils.get_dialogue_greet_sub(self.robot_id, t)
            dialog_t = await utils.get_dialogue_dialog(self.robot_id, 'GREET', sub_t)
            dialog.append(dialog_t)
            sub.append(sub_t)

            school_id, roomNum = await utils.get_school_roomNum_max()
            if roomNum > settings.PLENTY_ROOM_NUM:
                dialog_sch = await utils.get_dialogue_dialog(self.robot_id, 'GREET', 'sch')
                dialog_sch = dialog_sch.format(school_id)
                dialog.append(dialog_sch)
                sub.append('sch')

            await self.send_json({
                'type': 'GREET',
                'dialog': dialog,
                'sub': sub,
                'anonName': robot
            })

    async def cmd_import(self, data):
        self.player_data = await utils.set_player_data(self.player_data, data)

        if self.player_data.status == 3:
            room_id = str(self.player_data.room_id)
            await self.channel_layer.group_add(
                room_id,
                self.channel_name
            )

            self.room_userNum = await utils.set_room_userNum(str(self.player_data.room_id), False)
            print(self.room_userNum, file=sys.stderr)  # tt

            m = 'CONN' if self.room_userNum == 2 else 'DISCON'
            await self.send_json({
                'type': m
            })

            await self.channel_layer.group_send(room_id, {
                'type': 'is_disconnected',
                'boolean': False,
                'from': str(self.player_data.name)
            })

    async def cmd_goto(self, school_id):
        if self.player_data.status == 0:  # todo school_id檢測 把schoolImgSet存入cache中
            school_id = school_id.upper()
            await utils.set_player_school(self.player_data, school_id)

            dialog = []  # todo dialog GOTO 動態資訊
            # dialog_id = await utils.get_dialogue_dialog(self.robot_id, 'GOTO', school_id)
            # dialog.append(dialog_id)
            await self.send_json({
                'type': 'GOTO',
                'dialog': dialog
            })

    async def cmd_profile(self, name, matchType=None):
        if self.player_data.status == 0:
            if matchType is None:
                action = 'RENAME'
                self.player_data = await utils.set_player_profile(
                    self.player_data, name)

            else:
                action = 'PROFILE'
                self.player_data = await utils.set_player_profile(
                    self.player_data, name, matchType)

            await self.send_json({
                'type': action
            })

    async def cmd_test(self):
        if self.player_data.status == 0 or self.player_data.status == 1:
            id_list = cache.get_or_set('QUESTION_ID_LIST', await utils.get_question_id_list_randomly(), None)
            question_list = cache.get_or_set('QUESTION_LIST', await utils.get_question_content_list(id_list), None)
            # how to change questions : update QUESTION_ID_LIST and then delete QUESTION_LIST
            if len(self.player_data.testResult) > 0:
                self.player_data = await utils.set_player_score(self.player_data, [])

            self.player_data = await utils.set_player_status(self.player_data, 1)
            await self.send_json({
                'type': 'TEST',
                'questions': question_list,
            })

    async def cmd_adult(self, imgUrl):
        if self.player_data.status == 0:
            self.player_data = await utils.set_player_imgUrl(self.player_data, imgUrl)

    async def cmd_wait(self, testResult=None):  # 即使client端的testResult存在 仍再次傳入
        if self.player_data.status is not None:  # self.player_data.status == 0,1,2,3 皆可
            if testResult is not None and (testResult != self.player_data.testResult):
                self.player_data = await utils.set_player_score(self.player_data, testResult)

            self.player_data = await utils.process_player_wait(self.player_data, 2)
            matcher_uuid, matcher_name = await utils.process_player_match(self.player_data)

            if matcher_uuid is None:
                await self.send_json({
                    'type': 'WAIT'
                })
            else:
                room_match_type = 'mf' if self.player_data.matchType == 'fm' else str(self.player_data.matchType)
                room_id = str(self.player_data.uuid)[0, 8] + datetime.now().strftime('%H%M%S%f')
                room_id = await utils.create_room(room_id, room_match_type, str(self.player_data.school))
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

        if self.player_data.status == 1:
            self.player_data = await utils.set_player_status(self.player_data, 0)
            await self.send_json({
                'type': 'BACK'
            })

        elif self.player_data.status == 2:
            self.player_data = await utils.process_player_wait(self.player_data, next_status=0)
            await self.send_json({
                'type': 'BACK'
            })

        elif self.player_data.status == 3:
            await self.channel_layer.group_send(str(self.player_data.room_id), {
                'type': 'leave_room',
                'from': str(self.player_data.name)
            })
            await self.leave_room({  # the same thing:you're active and your matcher is passive
                'from': str(self.player_data.name)
            })

    async def cmd_change(self):
        if self.player_data.status == 1:
            await self.cmd_test()

        elif self.player_data.status == 2:
            await self.cmd_wait()

        elif self.player_data.status == 3:
            await self.channel_layer.group_send(str(self.player_data.room_id), {
                'type': 'leave_room',
                'from': str(self.player_data.name)
            })
            await self.cmd_wait()

    async def cmd_reset(self):
        if self.player_data.status == 0:
            uuid = str(self.player_data.uuid)
            await utils.delete_player(uuid)
            await self.send_json({
                'type': 'RESET'
            })

    # receive from other chatConsumers
    async def enter_room(self, event):
        name, room_id = event['name'], event['room']  # todo room_id 太容易猜到 必須要改名
        await self.channel_layer.group_add(
            room_id,
            self.channel_name
        )
        self.player_data = await utils.process_player_wait(self.player_data, 3)
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
        self.player_data = await utils.set_player_room(self.player_data, str(self.player_data.room_id), None)
        await self.send_json({
            'type': 'LEAVE',
            'sender': event['from']
        })

    async def chat_message(self, event):
        if str(self.player_data.name) != event['from']:

            print('chat_message', file=sys.stderr)  # tt
            print("執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSG',
                'msg': event['message'],
                'isImg': event['isImg'],
                'sender': event['from']
            })

    async def chat_messageList(self, event):
        if str(self.player_data.name) != event['from']:

            print('chat_messageList', file=sys.stderr)  # tt
            print("執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSGS',
                'msgs': event['messages'],
                'sender': event['from']
            })

    async def is_writing(self, event):
        if str(self.player_data.name) != event['from']:

            print('is_writing', file=sys.stderr)  # tt
            print("執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'WN',
                'wn': event['boolean'],
                'sender': event['from']
            })

    async def update_status(self, event):
        if str(self.player_data.name) == event['from']:

            print('update_status', file=sys.stderr)  # tt
            print("執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'ST',
                'num': event['num'],
                'receiver': event['from']
            })

    async def is_disconnected(self, event):
        if str(self.player_data.name) != event['from']:
            self.room_userNum = await utils.get_room_userNum(str(self.player_data.room_id))
            m = 'DISCON' if event['boolean'] else 'CONN'
            await self.send_json({
                'type': m
            })



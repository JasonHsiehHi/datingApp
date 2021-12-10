from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from django.core.cache import cache
from datetime import datetime
import time
from datingApp import settings

import sys


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self, **kwargs):
        # todo 每次使用consumer時都要做refresh_player 因為views.py也會update資料
        if self.scope['user'].is_authenticated:  # 帳號登入後再開webSocket
            self.player_data = await utils.get_player(self.scope['user'])
            self.uuid = str(self.player_data.uuid)  # todo 前端不再做uuid 改由後端傳到前端 uuid綁定player永遠不變
            # 是否用user.id 取代 player.uuid
            self.player_data = await utils.set_player_fields(self.player_data, {'isOn': True})
            if self.player_data.status == 1:  # 進入LARP遊戲前的等待階段
                self.player_data = await utils.set_player_fields(self.player_data, {'isPrepared': True})

            await self.channel_layer.group_add(
                self.uuid,
                self.channel_name
            )

            '''
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
            '''

            # self.robot_id = 3  # 之後刪掉
            self.count = 0
            await self.accept()

        else:
            await self.close()

    async def disconnect(self, close_code):
        self.player_data = await utils.refresh_player(self.player_data)
        self.player_data = await utils.set_player_fields(self.player_data, {'isOn': False, 'isPrepared': False})

        await self.channel_layer.group_discard(
            self.uuid,
            self.channel_name
        )

        if self.player_data.status == 2 or self.player_data.status == 3:  # 進入LARP遊戲後
            await utils.player_onoff(self.player_data, False)

        """  # 舊版 需要修改 進房間後斷線
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
        """

    # receive from client side first
    async def receive_json(self, content):
        self.start = time.time()
        self.player_data = await utils.refresh_player(self.player_data)
        call = content.get('call', None)  # LARP
        if call == 'start_game':
            await self.call_start_game()
        elif call == 'leave_game':
            await self.call_leave_game(content['players'])
        elif call == 'enter_match':
            await self.call_enter_match(content['players'])
        elif call == 'leave_match':
            await self.call_leave_match(content['players'])

        command = content.get('cmd', None)
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

        elif command is not None:  # 全部刪掉
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
    async def call_start_game(self):  # 建房者要告訴其他人'遊戲開始'  # 是否需要堤防用戶console操作
        # self.player_data = await utils.set_player_fields(self.player_data, {'status': 2})  # 移到start_game()進行

        room, game, room_players = await utils.get_room_players(self.player_data)
        self.room = room
        self.game_id = str(game.game_id)
        for player in room_players:
            if player.uuid != self.player_data.uuid:
                await self.channel_layer.group_send(str(player.uuid), {
                    'type': 'start_game',
                    'game': self.game_id,
                    'player_dict': room.player_dict,
                    'onoff_dict': room.onoff_dict,
                    'from': str(self.player_data.uuid)
                })

    async def call_start_game_down(self, room_creator):  # 其他人告訴創房者'已加載完成'
        #  self.player_data = await utils.set_player_fields(self.player_data, {'status': 2}) 移到start_game()進行

        room, game, room_players = await utils.get_room_players(self.player_data)
        self.room = room  # 每個人都要有 且要放到connect() 因為有些人可以離線後上線
        self.game_id = str(game.game_id)

        await self.channel_layer.group_send(room_creator, {
            'type': 'start_game_down'
        })

    async def call_leave_game(self, players):
        if len(players) == 0:  # 自己離開後通知對方
            for uuid in self.room.player_dict.keys():
                await self.channel_layer.group_send(uuid, {
                    'type': 'leave_game',
                    'from': str(self.player_data.uuid)
                })
        else:  # 其他人被動離開 不能用view
            self.room = await utils.refresh_room(self.room)
            room = self.room
            for uuid in players:
                room.player_dict.pop(uuid)
                room.onoff_dict.pop(uuid)
                room.playerNum -= 1
                player = await utils.get_player_by_uuid(uuid)
                await utils.set_player_fields(player, {'status': 0, 'room': None})
                await self.channel_layer.group_send(uuid, {
                    'type': 'leave_game'
                })

            await utils.set_room_fields(room, {
                'player_dict': room.player_dict, 'onoff_dict': room.onoff_dict, 'playerNum': room.playerNum})

    async def call_enter_match(self, players):
        for uuid in players:
            await self.channel_layer.group_send(uuid, {
                'type': 'enter_match',
            })

    async def call_leave_match(self, players):
        match = await utils.get_match(self.player_data)
        if len(players) == 0:  # 自己離開後通知對方
            for uuid in match.player_list:
                await self.channel_layer.group_send(uuid, {
                    'type': 'leave_match',
                    'from': str(self.player_data.uuid)
                })
        else:  # 其他人被動離開 不能用view
            for uuid in players:
                match.player_list.remove(uuid)
                player = await utils.get_player_by_uuid(uuid)
                await utils.set_player_fields(player, {'status': 2, 'match': None})
                await self.channel_layer.group_send(uuid, {
                    'type': 'leave_match'
                })

            await utils.set_match_fields(match, {'player_list': match.player_list})



    async def call_onoff(self, isOn):
        # 用connect和disconnect來呼叫
        pass

    # receive from other chatConsumers
    async def start_game(self, event):  # 其他人接收'遊戲開始'訊息
        await self.send_json({
            "type": 'START',
            "msg": '遊戲開始！',
            "game": event['game'],
            "player_dict": event['player_dict'],
            "onoff_dict": event['onoff_dict']})

        await self.call_start_game_down(event['from'])

    async def start_game_down(self, event):  # 建房者接收'已加載完成'訊息
        self.count += 1
        if self.count == self.room.playerNum-1:
            await self.send_json({
                "type": 'START',
                "msg": '遊戲開始！',
                "game": self.game_id,
                "player_dict": self.room.player_dict,
                "onoff_dict": self.room.onoff_dict})

            self.count = 0

    async def leave_game(self, event):
        if event['form'] is None:
            event['form'] = '你'

        await self.send_json({
            "type": 'OUT',
            "msg": ' 已離開遊戲...',
            "from": event['form']
        })

    async def enter_match(self, event):
        await self.send_json({
            "type": 'ENTER',
            "msg": '進入房間'
        })

    async def leave_match(self, event):
        if event['form'] is None:
            event['form'] = '你'

        await self.send_json({
            "type": 'LEAVE',
            "msg": '已離開房間',
            "form": event['form']
        })

    # called by receive_json to response client side
    async def cmd_open(self, uuid, isFirst):
        pass
        '''  # 已經移植到view
        # greet dialog LARP遊戲開始前 status要改
        if isFirst is True and (self.player_data is None or self.player_data.status == 0 or self.player_data.status == 2):
            dialog, sub = [], []
            t = int(datetime.now().strftime('%H'))
            robot = await utils.get_robot_name(self.robot_id)
            sub_t = await utils.get_dialogue_greet_sub(self.robot_id, t)
            dialog_t = await utils.get_dialogue_dialog(self.robot_id, 'GREET', sub_t)
            dialog.append(dialog_t)
            sub.append(sub_t)

            school_id, roomNum = await utils.get_school_roomNum_max()  # 把學校改成城市
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
        '''

    async def cmd_import(self, data):
        pass

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

    async def cmd_wait(self, testResult=None):  # # 合併到views.py Match
        if self.player_data.status is not None:  # self.player_data.status == 0,1,2,3 皆可
            if testResult is not None and (testResult != self.player_data.testResult):
                self.player_data = await utils.set_player_score(self.player_data, testResult)

            self.player_data = await utils.process_player_wait(self.player_data, next_status=2)
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

    async def cmd_leave(self):  # 合併到views.py Match
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
    async def enter_room(self, event):  # LARP 改到views.py
        name, room_id = event['name'], event['room']
        await self.channel_layer.group_add(
            room_id,
            self.channel_name
        )
        self.player_data = await utils.process_player_wait(self.player_data, next_status=3)
        self.player_data = await utils.set_player_room(self.player_data, room_id, name)
        self.room_userNum = 2
        await self.send_json({
            'type': 'ENTER',
            'room': room_id,
            'matcherName': name
        })

    async def leave_room(self, event):  # LARP 改到views.py
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



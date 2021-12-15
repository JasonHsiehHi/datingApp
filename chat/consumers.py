from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from django.core.cache import cache
from datetime import datetime, timezone
import time
from datingApp import settings


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self, **kwargs):
        # todo 每次使用consumer時都要做refresh_player 因為views.py也會update資料
        if self.scope['user'].is_authenticated:
            self.player_data = await utils.get_player(self.scope['user'])
            self.uuid = str(self.player_data.uuid)  # 是否用user.id 取代 player.uuid
            if self.player_data.status == 1:  # in waiting
                self.player_data = await utils.set_player_fields(
                    self.player_data, {'isPrepared': True, 'waiting_time': datetime.now(tz=timezone.utc), 'isOn': True})
            else:  # not in waiting
                self.player_data = await utils.set_player_fields(self.player_data, {'isOn': True})

            await self.channel_layer.group_add(
                self.uuid,
                self.channel_name
            )

            self.count = 0
            if self.player_data.status in [2, 3]:  # in room
                self.room, game, room_players = await utils.get_room_players(self.player_data)
                self.game_id = str(game.game_id)

                await utils.player_onoff_in_room(self.player_data, 1)

                await self.channel_layer.group_add(
                    'room-'+str(self.room.id),
                    self.channel_name
                )

                await self.channel_layer.group_send('room-'+str(self.room.id), {
                    'type': 'is_on',
                    'boolean': True,
                    'from': self.uuid
                })

                if self.player_data.status == 3:  # in match
                    self.match, player_list = await utils.get_match_players(self.player_data)

                    await self.channel_layer.group_add(
                        'match-'+str(self.match.id),
                        self.channel_name
                    )
            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        self.player_data = await utils.refresh_player(self.player_data)
        self.player_data = await utils.set_player_fields(
            self.player_data, {'isPrepared': False, 'waiting_time': None, 'isOn': False})

        await self.channel_layer.group_discard(
            self.uuid,
            self.channel_name
        )

        if self.player_data.status in [2, 3]:  # in room
            self.room, game, room_players = await utils.get_room_players(self.player_data)

            await utils.player_onoff_in_room(self.player_data, 0)

            await self.channel_layer.group_send('room-'+str(self.room.id), {
                'type': 'is_on',
                'boolean': False,
                'from': self.uuid
            })

            await self.channel_layer.group_discard(
                'room-'+str(self.room.id),
                self.channel_name
            )

            if self.player_data.status == 3:  # in match
                self.match, player_list = await utils.get_match_players(self.player_data)

                await self.channel_layer.group_discard(
                    'match-' + str(self.match.id),
                    self.channel_name
                )

    # receive from client side first
    async def receive_json(self, content):
        self.start = time.time()
        self.player_data = await utils.refresh_player(self.player_data)
        call = content.get('call', None)  # LARP
        if call == 'start_game':
            await self.call_start_game()
        elif call == 'leave_game':
            await self.call_leave_game()
        elif call == 'make_out':
            await self.call_make_out()
        elif call == 'enter_match':
            await self.call_enter_match()
        elif call == 'leave_match':
            await self.call_leave_match()
        elif call == 'make_leave':
            await self.call_make_leave()


        command = content.get('cmd', None)
        if command is None and self.player_data.status == 3 and self.room_userNum == 2:
            room_id = str(self.player_data.room_id)
            if 'wn' in content:

                print("wn - 執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'is_writing',
                    'boolean': content['wn'],
                    'from': str(self.player_data.name),
                    't': self.start
                })
            elif 'st' in content:

                print("st - 執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'update_status',
                    'num': content['st'],
                    'from': content['from'],
                    't': self.start
                })
            elif 'msg' in content:

                print("msg - 執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_message',
                    'message': content['msg'],
                    'isImg': content['isImg'],
                    'from': str(self.player_data.name),
                    't': self.start
                })
            elif 'msgs' in content:

                print("msgs - 執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(room_id, {
                    'type': 'chat_messageList',
                    'messages': content['msgs'],
                    'from': str(self.player_data.name),
                    't': self.start
                })

        elif command is not None:  # 全部刪掉
            print(command)
            if command == 'open':
                await self.cmd_open(content['uuid'], content['isFirst'])
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
                print(str(self.player_data.uuid) + ' insert a wrong command: ' + command)

    # functions called by receive_json to response client side
    async def call_start_game(self):  # 建房者要告訴其他人'遊戲開始'
        # 驗證資料來堤防用戶console操作
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)
        self.game_id = str(game.game_id)

        self.room_playerNum = len(self.room.onoff_dict)

        await self.channel_layer.group_add(
            'room-'+str(self.room.id),
            self.channel_name
        )
        for player in room_players:
            if player.uuid != self.uuid:
                await self.channel_layer.group_send(str(player.uuid), {
                    'type': 'start_game',
                    'game': self.game_id,
                    'room_id': 'room-' + str(self.room.id),
                    'player_dict': self.room.player_dict,
                    'onoff_dict': self.room.onoff_dict,
                    'from': self.uuid
                })

    async def call_start_game_down(self, room_creator):  # 其他人告訴創房者'已加載完成'
        await self.channel_layer.group_send(room_creator, {
            'type': 'start_game_down'
        })

    async def call_leave_game(self):
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)

        on_list = [i for i in list(self.room.onoff_dict.values()) if i == 1]
        self.room_playerNum = len(on_list)

        await self.channel_layer.group_send('room-'+str(self.room.id), {
            'type': 'leave_game',
            'from': self.uuid
        })

        await self.channel_layer.group_discard(
            'room-'+str(self.room.id),
            self.channel_name
        )

    async def call_leave_game_down(self, room_leaver):
        await self.channel_layer.group_send(room_leaver, {
            'type': 'leave_game_down'
        })

    async def call_make_out(self):
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)

        for uuid, i in self.room.onoff_dict.items():
            if i == -1:  # deduce之後執行 room.onoff_dict已被修改 已把需要趕走的人設為-1
                await self.channel_layer.group_send(uuid, {
                    'type': 'call_leave_game'
                })

    async def call_enter_match(self):
        # examine後執行 match.player_list已被修改
        self.match, player_list = await utils.get_match_players(self.player_data)
        await self.channel_layer.group_add(
            'match-'+str(self.match.id),
            self.channel_name
        )
        for uuid in player_list:
            if uuid != self.uuid:
                await self.channel_layer.group_send(uuid, {
                    'type': 'enter_match',
                    'match_id': 'match-'+str(self.match.id),
                    'from': self.uuid,
                    'player_list': player_list
                })

    async def call_leave_match(self):
        # 離開鍵後執行 match.player_list已被修改
        self.match, player_list = await utils.get_match_players(self.player_data)
        await self.channel_layer.group_send('match-'+str(self.match.id), {
            'type': 'leave_match',
            'match_id': 'match-' + str(self.match.id),
            'from': self.uuid,
            'num': len(player_list) - 1,
            'player_list': player_list
        })

        await self.channel_layer.group_discard(
            'match-'+str(self.match.id),
            self.channel_name
        )

    async def call_make_leave(self):  # haven't been used
        self.match = await utils.refresh_match(self.match)
        # 在Match model中加上leaver_list 標記需要離開的人
        pass

    async def timer(self, duration_min, call, **kwargs):
        time.sleep(duration_min * 60)
        content = {'call': call, **kwargs}
        await self.receive_json(content)



    # functions received from other chatConsumers
    async def is_on(self, event):
        if self.uuid != event['from']:
            m = 'CONN' if event['boolean'] else 'DISCON'
            await self.send_json({
                'type': m,
                'sender': event['from']
            })

    async def start_game(self, event):  # 其他人接收'遊戲開始'訊息
        await self.channel_layer.group_add(
            event['room_id'],
            self.channel_name
        )
        await self.call_start_game_down(event['from'])

        await self.send_json({
            "type": 'START',
            "msg": '遊戲開始！',
            "game": event['game'],
            "player_dict": event['player_dict'],
            "onoff_dict": event['onoff_dict']})

    async def start_game_down(self, event):  # 建房者接收'已加載完成'訊息
        self.count += 1
        if self.count == self.room_playerNum-1:
            await self.send_json({
                "type": 'START',
                "msg": '遊戲開始！',
                "game": self.game_id,
                "player_dict": self.room.player_dict,
                "onoff_dict": self.room.onoff_dict
            })
            self.count = 0
            del self.room_playerNum

    async def leave_game(self, event):
        if self.uuid != event['from']:
            await self.call_leave_game_down(event['from'])

            await self.send_json({
                "type": 'OUT',
                "msg": ' 已離開遊戲...',
                'sender': event['form']
            })

    async def leave_game_down(self, event):
        self.count += 1
        if self.count == self.room_playerNum-1:
            await self.send_json({
                "type": 'OUTDOWN'
            })
            self.count = 0
            del self.room_playerNum

    async def enter_match(self, event):
        await self.channel_layer.group_add(
            event['match_id'],
            self.channel_name
        )

        await self.send_json({
            "type": 'ENTER',
            "msg": ' 進入房間',
            'sender': event['form'],
            "player_list": event['player_list']
        })

    async def leave_match(self, event):
        if self.uuid != event['from']:
            if event['num'] == 1:
                await self.channel_layer.group_discard(
                    event['match_id'],
                    self.channel_name
                )

            await self.send_json({
                "type": 'LEAVE',
                "msg": ' 已離開房間...',
                'sender': event['form'],
                "player_list": event['player_list']
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
        # 由於建房由view創建 故通知進房時才做group_add
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

    async def chat_message(self, event):
        if str(self.player_data.name) != event['from']:

            print("chat_message - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSG',
                'msg': event['message'],
                'isImg': event['isImg'],
                'sender': event['from']
            })

    async def chat_messageList(self, event):
        if str(self.player_data.name) != event['from']:

            print("chat_messageList - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSGS',
                'msgs': event['messages'],
                'sender': event['from']
            })

    async def is_writing(self, event):
        if str(self.player_data.name) != event['from']:

            print("is_writing - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'WN',
                'wn': event['boolean'],
                'sender': event['from']
            })

    async def update_status(self, event):
        if str(self.player_data.name) == event['from']:

            print("update_status - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'ST',
                'num': event['num'],
                'receiver': event['from']
            })

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from datetime import datetime, timezone
import time
from threading import Timer
from asgiref.sync import async_to_sync


class ChatConsumer(AsyncJsonWebsocketConsumer):
    # todo 系統會自動重連 會導致一直上下線顯示 或不使用chatlog即可解決

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

            if self.player_data.status in [2, 3]:  # in room
                self.room, game, room_players = await utils.get_room_players(self.player_data)
                self.game_id = str(game.game_id)
                self.room_id = 'room-'+str(self.room.id)

                await utils.player_onoff_in_room(self.player_data, 1)

                await self.channel_layer.group_add(
                    self.room_id,
                    self.channel_name
                )

                if self.player_data.status == 3:  # in match
                    self.match, player_list = await utils.get_match_players(self.player_data)
                    self.match_id = 'match-'+str(self.match.id)

                    self.in_match = True  # to avoid multi-match
                    await self.channel_layer.group_add(
                        self.match_id,
                        self.channel_name
                    )

                    td = self.player_data.waiting_time - datetime.now(tz=timezone.utc)
                    seconds = td.total_seconds()
                    await self.timer_leave(seconds)

                await self.channel_layer.group_send(self.room_id, {
                    'type': 'is_on',
                    'boolean': True,
                    'from': self.uuid
                })

            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if not self.scope['user'].is_authenticated:
            print("error: user isn't authenticated to connect.")
            return False

        self.player_data = await utils.refresh_player(self.player_data)
        if self.player_data.status == 1:
            self.player_data = await utils.set_player_fields(
                self.player_data, {'isPrepared': False, 'waiting_time': None, 'isOn': False})
        else:
            self.player_data = await utils.set_player_fields(self.player_data, {'isOn': False})

        await self.channel_layer.group_discard(
            self.uuid,
            self.channel_name
        )

        if self.player_data.status in [2, 3]:  # in room
            self.room, game, room_players = await utils.get_room_players(self.player_data)
            self.room_id = 'room-'+str(self.room.id)

            await utils.player_onoff_in_room(self.player_data, 0)

            await self.channel_layer.group_send(self.room_id, {
                'type': 'is_on',
                'boolean': False,
                'from': self.uuid
            })

            await self.channel_layer.group_discard(
                self.room_id,
                self.channel_name
            )

            if self.player_data.status == 3:  # in match
                self.match, player_list = await utils.get_match_players(self.player_data)
                self.match_id = 'match-'+str(self.match.id)

                self.in_match = False
                await self.channel_layer.group_discard(
                    self.match_id,
                    self.channel_name
                )

    ######## receive from client side first ########
    async def receive_json(self, content):
        self.start = time.time()  # 僅用於測試

        call = content.get('call', None)
        if call is None:

            match = getattr(self, 'match', None)
            if match is None:
                print('{} send msg out of match.'.format(self.uuid))
                return False

            if 'wn' in content:
                print("wn - 執行時間：%f 秒" % (time.time() - self.start))
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'is_writing',
                    'boolean': content['wn'],
                    'from': self.uuid,
                    't': self.start  # 僅用於測試
                })
            elif 'st' in content:
                print("st - 執行時間：%f 秒" % (time.time() - self.start))
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'update_status',
                    'st_type': content['st'],
                    'backto': content['backto'],  # the sender's uuid (opposite side in match)
                    't': self.start  # 僅用於測試
                })
            elif 'msg' in content:
                print("msg - 執行時間：%f 秒" % (time.time() - self.start))
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'chat_message',
                    'message': content['msg'],
                    'isImg': content['isImg'],
                    'from': self.uuid,
                    't': self.start  # 僅用於測試
                })
            elif 'msgs' in content:
                print("msgs - 執行時間：%f 秒" % (time.time() - self.start))

                await self.channel_layer.group_send(self.match_id, {
                    'type': 'chat_messageList',
                    'messages': content['msgs'],
                    'from': self.uuid,
                    't': self.start  # 僅用於測試
                })

        else:
            if call == 'start_game':
                await self.call_start_game()
            elif call == 'leave_game':
                await self.call_leave_game()
            elif call == 'make_out':
                await self.call_make_out()
            elif call == 'enter_match':
                await self.call_enter_match()
            elif call == 'leave_match':
                isTimeout = getattr(content, 'isTimeout', False)
                await self.call_leave_match(isTimeout)
            elif call == 'make_leave':
                await self.call_make_leave()
            elif call == 'see_message':
                await self.call_see_message(content['player'])
            else:
                print(self.uuid + ' insert a wrong call: ' + call)

    ######## functions called by receive_json to response client side ########
    async def call_start_game(self):  # 建房者要告訴其他人'遊戲開始'
        # todo 驗證資料來堤防用戶console操作
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)
        self.room_id = 'room-'+str(self.room.id)
        self.game_id = str(game.game_id)

        await self.channel_layer.group_add(
            self.room_id,
            self.channel_name
        )
        for player in room_players:
            await self.channel_layer.group_send(str(player.uuid), {
                'type': 'start_game',
                'game': self.game_id,
                'room_id': self.room_id,
                'player_dict': self.room.player_dict,
                'onoff_dict': self.room.onoff_dict,
                'from': self.uuid
            })

    async def call_leave_game(self):
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)
        self.room_id = 'room-'+str(self.room.id)

        await self.channel_layer.group_send(self.room_id, {
            'type': 'leave_game',
            'from': self.uuid
        })

        await self.channel_layer.group_discard(
            self.room_id,
            self.channel_name
        )

        # on_list = [i for i in list(self.room.onoff_dict.values()) if i == 1]
        onoff_list = [i for i in list(self.room.onoff_dict.values()) if (i == 1 or i == 0)]
        if len(onoff_list) == 0:
            await utils.delete_room_by_player(self.player_data)
        else:
            await utils.set_player_fields(self.player_data, {'room': None})

    async def call_make_out(self):
        self.player_data = await utils.refresh_player(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)
        self.room_id = 'room-'+str(self.room.id)

        onoff_dict = dict(self.room.onoff_dict)
        if all(v == -1 for v in onoff_dict.values()) is True:  # game over
            await self.channel_layer.group_send(self.room_id, {
                'type': 'game_over'
            })
            await utils.delete_room_by_player(self.player_data)
            await utils.set_player_fields(self.player_data,
                                          {'status': 0, 'room': None, 'tag_int': None, 'tag_json': None})
        else:  # make someone out
            await self.channel_layer.group_send(self.room_id, {
                'type': 'out_or_in',
                'onoff': onoff_dict
            })

    async def call_enter_match(self):
        self.player_data = await utils.refresh_player(self.player_data)
        self.match, player_list = await utils.get_match_players(self.player_data)
        self.match_id = 'match-'+str(self.match.id)

        self.in_match = True
        await self.channel_layer.group_add(
            self.match_id,
            self.channel_name
        )
        for uuid in player_list:
            await self.channel_layer.group_send(uuid, {
                'type': 'enter_match',
                'match_id': self.match_id,
                'player_list': player_list,
                'from': self.uuid
            })
        td = self.player_data.waiting_time - datetime.now(tz=timezone.utc)
        seconds = td.total_seconds()
        await self.timer_leave(seconds)

    async def call_leave_match(self, isTimeout=False):
        self.player_data = await utils.refresh_player(self.player_data)
        self.match, player_list = await utils.get_match_players(self.player_data)
        self.match_id = 'match-' + str(self.match.id)

        await self.channel_layer.group_send(self.match_id, {
            'type': 'leave_match',
            'match_id': self.match_id,
            'from': self.uuid,
            'player_list': player_list,
            'timeout': isTimeout
        })

        self.in_match = False
        await self.channel_layer.group_discard(
            self.match_id,
            self.channel_name
        )
        if len(player_list) == 0:
            await utils.delete_match_by_player(self.player_data)
        else:
            await utils.set_player_fields(self.player_data, {'match': None})

    async def call_make_leave(self):  # haven't been used
        # add leaver_list to Match model 標記需要離開的人
        pass

    async def call_inform(self, group_name, message):
        # 不發生player資料改變 只做資料傳遞
        # 不能由前端發出 只能在consumer中調用 避免用戶直接透過此方法傳訊
        await self.channel_layer.group_send(group_name, {
            'type': 'inform',
            'msg': message,
            'from': self.uuid
        })

    async def call_see_message(self, to_uuid):
        await self.channel_layer.group_send(to_uuid, {
            'type': 'see_message',
            'from': self.uuid,
            'toMe': False
        })

        await self.see_message({
            'from': self.uuid,
            'toMe': True
        })

    async def timer_leave(self, sleep_secs):  # when player connect or enter_match, set up the timer
        t = Timer(sleep_secs, async_to_sync(self.timeout_leave))
        t.start()

    async def timeout_leave(self):
        self.player_data = await utils.set_player_fields(self.player_data, {'status': 2, 'waiting_time': None})
        self.match, player_list = await utils.get_match_players(self.player_data)

        #player_list.remove(self.uuid)
        player_list = []
        self.match = await utils.set_match_fields(self.match, {'player_list': player_list})

        await self.call_leave_match(True)

    async def timer(self, sleep_secs, **kwargs):  # it's been unavailable
        t = Timer(sleep_secs, async_to_sync(self.execute_in_match), kwargs=kwargs)
        t.start()

    async def execute_in_match(self, **kwargs):
        in_match = getattr(self, 'in_match', None)
        if in_match is True:
            await self.receive_json(kwargs)


    ######## functions received from other chatConsumers ########
    async def is_on(self, event):
        if self.uuid != event['from']:
            m = 'CONN' if event['boolean'] else 'DISCON'
            await self.send_json({
                'type': m,
                'sender': event['from']
            })

    async def start_game(self, event):  # 其他人接收'遊戲開始'訊息
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'START',
                "game": self.game_id,
                "player_dict": self.room.player_dict,
                "onoff_dict": self.room.onoff_dict
            })

        else:
            await self.channel_layer.group_add(
                event['room_id'],
                self.channel_name
            )

            await self.send_json({
                "type": 'START',
                "game": event['game'],
                "player_dict": event['player_dict'],
                "onoff_dict": event['onoff_dict']})

    async def leave_game(self, event):
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'OUTDOWN'
            })
        else:
            await self.send_json({
                "type": 'OUT',
                'sender': event['from']
            })

    async def enter_match(self, event):
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'ENTER',
                "player_list": event['player_list'],
            })

        else:
            in_match = getattr(self, 'in_match', None)
            if in_match is True:  # to avoid multi-match
                self.in_match = False
                await self.channel_layer.group_discard(
                    self.match_id,
                    self.channel_name
                )

            self.in_match = True
            await self.channel_layer.group_add(
                event['match_id'],
                self.channel_name
            )

            await self.send_json({
                "type": 'ENTER',
                "player_list": event['player_list'],
                'sender': event['from']
            })

    async def leave_match(self, event):
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'LEAVEDOWN',
                "timeout": event['timeout']
            })
        else:
            await self.send_json({
                "type": 'LEAVE',
                'sender': event['from'],
                "player_list": event['player_list']
            })

    async def inform(self, event):
        if self.uuid != event['from']:
            await self.send_json({
                "type": 'INFORM',
                "msg": event['msg']
            })
        else:
            await self.send_json({
                "type": 'INFORM',
                "msg": '通知成功'
            })

    async def see_message(self, event):
        if self.uuid == event['from']:
            if event['toMe'] is True:
                await self.send_json({
                    "type": 'MESSAGE',
                    "toMe": True
                })
        else:
            self.player_data = await utils.refresh_player(self.player_data)
            msg_li = self.player_data.tag_json['message']
            await self.send_json({
                "type": 'MESSAGE',
                "toMe": False,
                "msgs": msg_li
            })
            self.player_data.tag_json['message'] = []
            await utils.set_player_fields(self.player_data, {'tag_json': self.player_data.tag_json})

    async def game_over(self, event):
        await self.channel_layer.group_discard(  # everyone in game all need to discard
            'room-'+str(self.room.id),
            self.channel_name
        )
        await self.send_json({
            "type": 'OVER',
            "isOver": True
        })

    async def out_or_in(self, event):
        onoff_dict = event['onoff']
        if onoff_dict[self.uuid] == -1:
            await self.channel_layer.group_discard(  # only someone who is out needs to discard
                'room-' + str(self.room.id),
                self.channel_name
            )
            await self.send_json({
                "type": 'OVER',
                "isOver": False
            })

        elif onoff_dict[self.uuid] == 1:
            await self.send_json({
                "type": 'ALIVE'
            })

    async def chat_message(self, event):
        if self.uuid != event['from']:
            print("chat_message - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSG',
                'msg': event['message'],
                'isImg': event['isImg'],
                'sender': event['from']
            })

    async def chat_messageList(self, event):
        if self.uuid != event['from']:
            print("chat_messageList - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'MSGS',
                'msgs': event['messages'],
                'sender': event['from']
            })

    async def is_writing(self, event):
        if self.uuid != event['from']:
            print("is_writing - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'WN',
                'wn': event['boolean']
            })

    async def update_status(self, event):
        if self.uuid == event['backto']:
            print("update_status - 執行時間：%f 秒" % (time.time() - event['t']))

            await self.send_json({
                'type': 'ST',
                'st_type': event['st_type']
            })

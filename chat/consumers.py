from channels.generic.websocket import AsyncJsonWebsocketConsumer
from . import utils
from datetime import datetime, timezone
from threading import Timer
from time import sleep
from asgiref.sync import async_to_sync


class ChatConsumer(AsyncJsonWebsocketConsumer):
    # todo 手機只要不在瀏覽器畫面即會做disconnect() 如何處理

    async def connect(self, **kwargs):
        if self.scope['user'].is_authenticated:
            self.player_data = await utils.get_player(self.scope['user'])
            self.uuid = str(self.player_data.uuid)

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

                # inform others in room that player is on
                await self.channel_layer.group_send(self.room_id, {
                    'type': 'is_on',
                    'boolean': True,
                    'from': self.uuid
                })

                answer = self.room.answer
                if 'timetable' in answer:
                    self.timetable = answer['timetable']  # timetable and taskLast are fixed
                    self.taskLast = len(self.timetable) - 1
                    self.timers = {}
                    await self.set_timetable(0)

                if self.player_data.status == 3:  # in match
                    self.match, player_list = await utils.get_match_players(self.player_data)
                    self.match_id = 'match-'+str(self.match.id)

                    self.in_match = True  # to avoid multi-match
                    await self.channel_layer.group_add(
                        self.match_id,
                        self.channel_name
                    )

                    secret = self.match.secret
                    self.timing = None
                    if 'isTiming' in secret:
                        td = self.player_data.waiting_time - datetime.now(tz=timezone.utc)
                        seconds = td.total_seconds()
                        self.timing = await self.timer_execute(seconds, self.timeout_leave_match)

            await self.accept()
        else:
            await self.close()

    async def disconnect(self, close_code):
        if not self.scope['user'].is_authenticated:
            print("error: user isn't authenticated to connect.")
            return False
        self.player_data = await utils.refresh_instance(self.player_data)  # to get player_data.status newly

        self.timers = getattr(self, 'timers', None)
        if self.timers is not None:
            for timer in self.timers.values():
                timer.cancel()

        self.timing = getattr(self, 'timing', None)
        if self.timing is not None:
            self.timing.cancel()

        if self.player_data.status == 1:  # in waiting
            self.player_data = await utils.set_player_fields(self.player_data, {'isOn': False})
            # consider about isPrepared and waiting_time
        else:  # not in waiting
            self.player_data = await utils.set_player_fields(self.player_data, {'isOn': False})

        await self.channel_layer.group_discard(
            self.uuid,
            self.channel_name
        )

        if self.player_data.status in [2, 3]:  # in room
            self.room, game, room_players = await utils.get_room_players(self.player_data)
            self.room_id = 'room-'+str(self.room.id)

            await utils.player_onoff_in_room(self.player_data, 0)

            # inform others in room that player is off
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

    async def is_on(self, event):
        """func received from other chatConsumers with connect() and disconnect():  """
        if self.uuid != event['from']:
            m = 'CONN' if event['boolean'] else 'DISCON'
            await self.send_json({
                'type': m,
                'sender': event['from']
            })

    async def receive_json(self, content):
        """receive from client side first """
        # self.start = time.time()  # 僅用於測試

        call = content.get('call', None)
        if call is None:
            match = getattr(self, 'match', None)
            if match is None:
                print('{} send msg out of match.'.format(self.uuid))
                return False

            if 'wn' in content:
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'is_writing',
                    'boolean': content['wn'],
                    'from': self.uuid
                })
            elif 'st' in content:
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'update_status',
                    'st_type': content['st'],
                    'backto': content['backto']  # the sender's uuid (opposite side in match)
                })
            elif 'msg' in content:
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'chat_message',
                    'message': content['msg'],
                    'isImg': content['isImg'],
                    'from': self.uuid
                })
            elif 'msgs' in content:
                await self.channel_layer.group_send(self.match_id, {
                    'type': 'chat_messageList',
                    'messages': content['msgs'],
                    'from': self.uuid
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
                isTimeout = content.get('isTimeout', False)
                await self.call_leave_match(isTimeout)
            elif call == 'make_leave':
                await self.call_make_leave()
            elif call == 'inform':
                tag = content.get('tag', 0)
                hidden = content.get('hidden', 0)
                await self.call_inform(content['target'], content['meInGroup'], content['message'], hidden, tag)
            else:
                print(self.uuid + ' insert a wrong call: ' + call)



    ######## directly-send functions ########
    async def chat_message(self, event):
        """func received from other chatConsumers without call_*():  """
        if self.uuid != event['from']:

            await self.send_json({
                'type': 'MSG',
                'msg': event['message'],
                'isImg': event['isImg'],
                'sender': event['from']
            })

    async def chat_messageList(self, event):
        """func received from other chatConsumers without call_*():  """
        if self.uuid != event['from']:

            await self.send_json({
                'type': 'MSGS',
                'msgs': event['messages'],
                'sender': event['from']
            })

    async def is_writing(self, event):
        """func received from other chatConsumers without call_*():  """
        if self.uuid != event['from']:

            await self.send_json({
                'type': 'WN',
                'wn': event['boolean']
            })

    async def update_status(self, event):
        """func received from other chatConsumers without call_*():  """
        if self.uuid == event['backto']:

            await self.send_json({
                'type': 'ST',
                'st_type': event['st_type']
            })


    ######## call_* functions ########
    # call_*() is responsible to access to database and send data to *();
    # *() is responsible to execute and reply to client side;
    async def call_start_game(self):  # 遊戲建立者者需告訴所有人'遊戲開始'
        """func called by receive_json to response client side:  """

        # todo 驗證資料來堤防用戶console操作

        # call_start_game() be called by one player only, so refreshing data won't influence performance.
        self.player_data = await utils.refresh_instance(self.player_data)
        self.room, game, room_players = await utils.get_room_players(self.player_data)
        self.room_id = 'room-'+str(self.room.id)
        self.game_id = str(game.game_id)

        send_dict = {
            'type': 'start_game',
            'game': self.game_id,
            'room_id': self.room_id,
            'player_dict': self.room.player_dict,
            'onoff_dict': self.room.onoff_dict,
            'from': self.uuid
        }
        for player in room_players:
            player_uuid = str(player.uuid)
            if player_uuid == self.uuid:
                await self.start_game(send_dict)
            else:
                await self.channel_layer.group_send(player_uuid, send_dict)
            sleep(0.2)

    async def start_game(self, event):  # 所有人接收'遊戲開始'訊息 (包含自己)
        """func received from other chatConsumers with call_*():  """
        await self.channel_layer.group_add(
            event['room_id'],
            self.channel_name
        )

        await self.send_json({
            "type": 'START',
            "game": event['game'],
            "player_dict": event['player_dict'],
            "onoff_dict": event['onoff_dict']})

    async def call_leave_game(self):  # 離開者需告知所有人 '自己將離開'
        """func called by receive_json to response client side:  """
        # self.player_data = await utils.refresh_instance(self.player_data)

        # self.room, game = await utils.get_room_players(self.player_data, False) to move down
        # self.room_id = 'room-'+str(self.room.id)
        await self.channel_layer.group_send(self.room_id, {
            'type': 'leave_game',
            'from': self.uuid
        })

        await self.channel_layer.group_discard(
            self.room_id,
            self.channel_name
        )

        self.room, game = await utils.get_room_players(self.player_data, False)
        # on_list = [i for i in list(self.room.onoff_dict.values()) if i == 1]
        onoff_list = [i for i in list(self.room.onoff_dict.values()) if (i == 1 or i == 0)]
        if len(onoff_list) == 0:
            await utils.delete_room_by_player(self.player_data)
        else:
            await utils.set_player_fields(self.player_data, {'room': None}, True)

    async def leave_game(self, event):  # 所有人接收 '離開者將離開' 訊息
        """func received from other chatConsumers with call_*():  """
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'OUTDOWN'
            })
        else:
            await self.send_json({
                "type": 'OUT',
                'sender': event['from']
            })

    async def call_make_out(self):
        """func called by receive_json to response client side: player can make others be out of game """
        # self.player_data = await utils.refresh_instance(self.player_data)

        # self.room, game = await utils.get_room_players(self.player_data, False) to move down
        # self.room_id = 'room-'+str(self.room.id)

        self.room, game = await utils.get_room_players(self.player_data, False)
        onoff_dict = dict(self.room.onoff_dict)
        if all(v == -1 for v in onoff_dict.values()) is True:  # game over
            await self.channel_layer.group_send(self.room_id, {
                'type': 'game_over'
            })
            await utils.delete_room_by_player(self.player_data)
            await utils.set_player_fields(self.player_data,
                                          {'room': None, 'status': 0, 'tag_int': None, 'tag_json': None}, True)
        else:  # make someone out
            await self.channel_layer.group_send(self.room_id, {
                'type': 'out_or_in',
                'onoff': onoff_dict
            })

    async def game_over(self, event):
        """func received from other chatConsumers with call_*():  """
        await self.channel_layer.group_discard(  # everyone in game all need to discard
            'room-'+str(self.room.id),
            self.channel_name
        )
        await self.send_json({
            "type": 'OVER',
            "isOver": True
        })

    async def out_or_in(self, event):
        """func received from other chatConsumers with call_*():  """
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

    async def call_enter_match(self):  # 開房者要告訴所有人'進入房間'(match)
        """func called by receive_json to response client side:  """
        # call_enter_match() be called by one player only
        self.player_data = await utils.refresh_instance(self.player_data)
        self.match, player_list = await utils.get_match_players(self.player_data)
        self.match_id = 'match-'+str(self.match.id)

        send_dict = {
            'type': 'enter_match',
            'match_id': self.match_id,
            'player_list': player_list,
            'from': self.uuid
        }
        for uuid in player_list:
            if uuid == self.uuid:
                await self.enter_match(send_dict)
            else:
                await self.channel_layer.group_send(uuid, send_dict)
            sleep(0.2)

    async def enter_match(self, event):  # 所有人接收'進入房間'訊息
        """func received from other chatConsumers with call_*():  """
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

        if self.uuid == event['from']:
            await self.send_json({
                "type": 'ENTER',
                "player_list": event['player_list'],
            })
        else:
            await self.send_json({
                "type": 'ENTER',
                "player_list": event['player_list'],
                'sender': event['from']
            })

    async def call_leave_match(self, isTimeout=False):
        """func called by receive_json to response client side:  """
        # self.player_data = await utils.refresh_instance(self.player_data)

        # self.match, player_list = await utils.get_match_players(self.player_data)
        # self.match_id = 'match-' + str(self.match.id)

        self.match, player_list = await utils.get_match_players(self.player_data)
        await self.channel_layer.group_send(self.match_id, {
            'type': 'leave_match',
            'match_id': self.match_id,
            'from': self.uuid,
            'player_list': player_list,
            'timeout': isTimeout  # isTimeout(bool): leaving match is due to timeout or not
        })

        self.in_match = False
        await self.channel_layer.group_discard(
            self.match_id,
            self.channel_name
        )
        if len(player_list) == 0:
            await utils.delete_match_by_player(self.player_data)
        else:
            await utils.set_player_fields(self.player_data, {'match': None}, True)

    async def leave_match(self, event):
        """func received from other chatConsumers with call_*():  """
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

    async def call_make_leave(self):  # haven't been used
        """func called by receive_json to response client side: player can make others leave the match """
        # todo 玩家可以趕其他人離開match
        # add leaver_list to Match model 標記需要離開的人
        pass

    async def call_inform(self, group_name, meInGroup, message, hidden=None, tag=0):
        """func called by receive_json to response client side:  """
        await self.channel_layer.group_send(group_name, {
            'type': 'inform',
            'msgs': message,
            'hidden': hidden,
            'from': self.uuid,
            'tag': tag
        })

        if meInGroup is False:
            await self.inform({
                'msgs': message,
                'hidden': hidden,
                'from': self.uuid,
                'tag': tag
            })

    async def inform(self, event):
        """func received from other chatConsumers with call_*():  """
        if self.uuid == event['from']:
            await self.send_json({
                "type": 'INFORM',
                "toSelf": True,
                "msgs": ['通知成功'],  # msg format: list [msg1, msg2,...]
                "hidden": event['hidden'],
                "tag": event['tag']
            })
        else:
            await self.send_json({
                "type": 'INFORM',
                "toSelf": False,
                "msgs": event['msgs'],
                "hidden": event['hidden'],
                "tag": event['tag']
            })

    async def timer_execute(self, sleep_secs, func, *args, **kwargs):
        # when player connect() successfully, set up the timer
        t = Timer(sleep_secs, async_to_sync(func), args, kwargs)
        t.start()
        return t

    async def set_timetable(self, ith_task):
        now = datetime.now(tz=timezone.utc)
        timetable = self.timetable
        for index in range(ith_task, len(timetable)):
            t = datetime.strptime(timetable[index][0], '%Y-%m-%dT%H:%M:%SZ').replace(tzinfo=timezone.utc)
            seconds = (t - now).total_seconds()
            if seconds > 0:
                if timetable[index][1] == 'pop_news':
                    # special code: to send the last one from self.room['answer']['realtime']
                    self.timers[index] = await self.timer_execute(seconds, self.timeout_inform_updated, index)

                elif isinstance(timetable[index][1], list):  # task[1] format: [msg1, msg2, msg3,...]
                    msgs_li = timetable[index][1]
                    self.timers[index] = await self.timer_execute(seconds, self.timeout_inform, msgs_li, index)
                break

    async def set_timetable_next(self, ith_task):
        self.timers[ith_task].cancel()
        del self.timers[ith_task]
        if ith_task < self.taskLast:
            await self.set_timetable(ith_task)

    async def timeout_leave_match(self):
        self.player_data = await utils.set_player_fields(self.player_data, {'status': 2, 'waiting_time': None}, True)

        # self.match, player_list = await utils.get_match_players(self.player_data)
        player_list = []  # everyone will leave in same time
        self.match = await utils.set_match_fields(self.match, {'player_list': player_list}, True)
        await self.call_leave_match(True)

    async def timeout_inform(self, message, ith_task, tag=0):
        await self.inform({
            'msgs': message,
            'from': 'system',  # let 'toSelf': False
            'hidden': ith_task,
            'tag': tag
        })
        await self.set_timetable_next(ith_task)

    async def timeout_inform_updated(self, ith_task):
        # todo 將answer存入cache (用ith_tash和room_id做記號 只有第一個人存取資料庫 其他人從cache來找
        # 存入下一個cache時 把上一個chache刪掉 timetable 要再記最後一個task:clear_cache
        # 同樣是檢查cache 如果已刪除則不動

        self.room, game = await utils.get_room_players(self.player_data, False)
        answer = self.room.answer
        realtime = answer.get('realtime', None)
        if realtime is not None and len(realtime) > 0:
            last = len(realtime) - 1

            if last < ith_task:  # 空題：前幾題都沒有人回答 需由系統把answer_dict['realtime']填滿
                realtime.extend([['no_news']] * (ith_task - last))

            if last == ith_task:  # the player to get inform first need to de that
                realtime.append(['no_news'])
                answer['realtime'] = realtime
                self.room.answer = answer
                await utils.set_room_fields(self.room, {'answer': answer})
            msgs_li = realtime[ith_task]

        # cache 需要存入msgs_li
            if len(msgs_li) > 1:  # the first msg: ['no_news',]
                msgs_li = msgs_li[1:]  # from the second, it's the real msgs sent by players

            await self.timeout_inform(msgs_li, ith_task, tag=1)
            # tag=1: is distinguished from directly timeout_inform()

    async def timeout_clear_cache(self):
        pass

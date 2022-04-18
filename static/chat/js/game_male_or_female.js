var gameCheckGate = function(){
    function pla(isDirected=true){
        var li = [];
        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value === 1) && li.push(key);
        }
        var name_list = li.map(uuid => loginData.player_dict[uuid][0]);
        var text = '<span class="a-point">'+ name_list.join(", ")+ '</span> 已加入遊戲';
        (!0 === isDirected) && theUI.showSys(text);
        return text
        
    }

    function num(isDirected=false){
        var li = [];
        
        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value === 1) && li.push(key);
        }
        var text = '在線人數:<span class="a-point">'+ li.length +'</span> 人';
        (!0 === isDirected) && theUI.showSys(text);
        return text
    }

    function mat(isDirected=true){
        var li_others = [...loginData.player_list];
        li_others.remove(loginData.uuid);
        var li_others_on = [...li_others];

        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value !== 1) && li_others_on.remove(key);
        }

        var text;
        if (0 === li_others_on.length){
            text = '目前房間內剩你一人...';
        }else{
            var name_list = li_others_on.map(uuid => loginData.player_dict[uuid][0]);
            text = '<span class="a-point">'+name_list.join(', ')+'</span> 目前待在房間中';
        }
        (!0 === isDirected) && theUI.showSys(text);
        return text
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/male_or_female/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_json = data.tag_json, loginData.tag_int = data.tag_int;
                    refreshGameTagAll();

                    localData.answers['timetable'] = data.timetable, localData.answers['taskNum'] = Object.keys(data.timetable).length;
                    localStorage.answers = JSON.stringify(localData.answers);
                    replyMethod();
                    (!0 === isOverTime()) && theUI.showSys('配對已結束囉！ 可按右上方"離開"鍵 並準備進行下一場遊戲');
                    
                    var li = [...data.guest_dialogs];
                    li.push(...story_dialogs);  // from db_male_or_female.js, same contents for everyone
                    
                    var ith = getTimetableIth();
                    var interval_ms = (ith > 0)? 0 : 1500;
                    theUI.showStoryAsync(li, interval=interval_ms, callback=function(){
                        theUI.unreadTitle(!0);
                    }) 

                    theUI.storeChatLogs(li, li.length, 'gameLogs');
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    }

    return {
        player:pla,
        playerNum:num,
        matcher:mat,
        prolog:prl
    }
}

function acceptMethod(css_id, player_uuid){
    /* it's binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(e){
        if (loginData.tag_int === 2 && loginData.tag_json[player_uuid] !== 3){
            showNotice('你已接受其他人的邀請了哦。');
            return false
        }

        $.ajax({
            type: 'GET',
            url: '/chat/start_game/male_or_female/accept/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 2, loginData.tag_json[player_uuid] = 3, refreshGameTag(player_uuid);
                    theWS.callSendWs('enter_match');
                    showNotice('已建立房間 等待中...'), theUI.showSys('等待對方回應...');
                }else{
                    showNotice(data['msg']);
                    // but something wrong when the player is disconnected coincidentally
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function replyMethod(){
    if (!0 === hasBound_replyMethod)
        return false
    hasBound_replyMethod = !0;
    $("#send-form").on('submit',function(e){
        e.preventDefault();
        var ith = getTimetableIth();
        if (ith === localData.answers['taskNum'] - 1){
            theUI.showSys('問答環節結束！ 請打開左側玩家選單，向一位參加者寄送邀請。 如果不想與任何參加者配對，則可按右上方的"離開"鍵。');
            theUI.scrollToNow();
            return false
        }
        var timetable = localData.answers['timetable'];
        var isOpen = timetable[ith][1];
        if (!1 === isOpen){
            theUI.showSys('冷靜，等待下一個問題！');
            theUI.scrollToNow();
            return false
        }

        if (!0 === localData.answers['hasAnswered']){
            theUI.showSys('你已經回答過問題了哦！');
            theUI.scrollToNow();
            return false
        }

        var formArray = $(this).serializeArray();
        formArray[3] = ({name:"send-tag", value: ith});
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/male_or_female/reply',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    theUI.showSys('感謝你的回答！ 你的答覆已上傳！');
                    theUI.scrollToNow();
                    localData.answers['hasAnswered'] = !0, localStorage.answers = JSON.stringify(localData.answers);
                }else{
                    theUI.showSys(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function inviteMethod(css_id, player_uuid){
    /* it's binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(a){
        $("#invite-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('邀請');
        $('#invite-modal-form .modal-body p:eq(0)').text('確定要邀請'+others[player_uuid][0]+'?');
        $('#modal').modal('show');

        $("#invite-modal-form").off('submit');
        $("#invite-modal-form").on('submit',function(e){
            e.preventDefault();
            if (loginData.tag_int === 1){
                $('#invite-modal-form p.a-error').text('你已經邀請過其他人了哦');
                return false
            }else if (loginData.tag_int === 2){
                $('#invite-modal-form p.a-error').text('你已接受其他人的邀請了哦。');
                return false
            }

            $.ajax({
                type: 'GET',
                url: '/chat/start_game/male_or_female/invite/' + player_uuid,
                dataType: "json",
                success: function(data) {
                    if (!0 === data['result']){
                        loginData.tag_int = 1, loginData.tag_json[player_uuid] = 1; refreshGameTag(player_uuid);                       
                        var text = '已成功邀請 '+others[player_uuid][0]+'！';
                        $('#game-invite').text(text), showNotice(text);
                        theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', 'invite'], ['hidden', loginData.uuid], ['tag', 2]);

                    }else{
                        $('#invite-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#invite-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#invite-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
            })
        })
    })

}

function disabledGameBtns(){  // only be called in websocket.onmessage 'OVER'
    var css_id; 
    for (let uuid in position)
        css_id = position[uuid], disabledElmtCss(css_id+'-btn');
    disabledElmtCss('#start-btn');

    $('body').off('click', "#leave-btn");
    $("#leave-btn").on('click',function(a){  // status is still 2 on front-end until redirect to /chat  
        window.location.href = "/chat"; 
    })
}

function loadRoleData(){  // to display sidebar content according to individual role
    /* use loginData.player_dict to display sidebar content and establish variables(self, others, position) */
    self = loginData.player_dict[loginData.uuid];
    // [name, gender(m, f or n)]
    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];  // except self
    // {uuid:[name, gender(m, f or n)],...}
    
    var i = 1, css_id, name, gender;
    for (let uuid in others){
        css_id = '#player-' + i.toString();
        name = others[uuid][0], gender = (others[uuid][1]==='m')? 'a-male':((others[uuid][1]==='f')?'a-female': 'a-nogender');
        
        $(css_id).removeClass('d-none');
        $(css_id).data('uuid', uuid), position[uuid] = css_id;  // bind the variable player's css_id to player's uuid
        $(css_id).find('.a-circle').addClass(gender).text(name[0]);
        $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name);
        i++;
    }

    $('#game-rule').html(rule_desc);

    $('#start-btn').text('行 動').attr('disabled', true);
    refreshGameStatus(loginData.status);
}

function refreshGameStatus(status){  // refresh status, tag_json and tag_int according to dividual role
    refreshPlayerAll();  // first, refresh other players on/off
    loginData.onoff_dict[loginData.uuid] = 1; // cuz the websocket's connect() too late to cause error
    switch (status){   // second, refresh self status as well as tag_json and tag_int
        case 2:

            (null !== loginData.tag_int && null !== loginData.tag_json) && refreshGameTagAll();  // refresh player css btn according to current tag_json or tag_int

            var num_on = gameGate.playerNum();
            setNavTitle(num_on);

            (localData.chatLogs.length>0) && theUI.clearChatLogs('chatLogs'); 
            if (localData.gameLogs.length === 0){  // the first time to enter game
                gameGate.player(), gameGate.prolog();
            }else{
                var isMore = theUI.loadChatLogs('gameLogs');  // game dialogs are on status=2 only
                (!0 === isMore) && appearElmtCss('#show-more');
                gameGate.player();
            }

            if ('timetable' in localData.answers){
                replyMethod();  // 只在status===2被使用 當status===3時則直接用theWS.msgSendWs(text)
                (!0 === isOverTime()) && theUI.showSys('配對已結束囉！ 可按右上方"離開"鍵 並準備進行下一場遊戲');
            } 

            break;
        case 3:
            disablePlayerBtnAll();

            setNavTitle('恭喜配對成功！');

            var isMore = theUI.loadChatLogs('chatLogs');  // chat record dialogs are on status=3 only
            (!0 === isMore) && appearElmtCss('#show-more');
            gameGate.matcher();
            break;
    }
}

function disablePlayerBtnAll(){  // like refreshGameTagAll(), but don't use tag_json&tag_int
    for (let uuid in position){
        (1 === loginData.onoff_dict[uuid]) && disabledElmtCss(position[uuid]+'-btn');
    }
}

function refreshPlayerAll(){  // refresh players on/off, only be called by refreshGameStatus()
    for (let uuid in position){
        refreshPlayer(uuid);
    }
}

function refreshPlayer(player_uuid){  // refreshGameSingle() can call refreshPlayer() instead of refreshPlayerAll()
    var css_id = position[player_uuid];
    // var name = $(css_id).find('.a-title').text();
    
    var name = others[player_uuid][0];
    switch (loginData.onoff_dict[player_uuid]){
        case 0:
            (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
            $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(離線)');
            $(css_id).find('.a-onoff').text('(離線)');

            disabledElmtCss(css_id+'-btn');
            
            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !0);
            break;
        case 1:
            ($(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').removeClass('a-off');
            $(css_id).find('.a-title').attr('data-bs-original-title', name);
            $(css_id).find('.a-onoff').text('');

            enabledElmtCss(css_id+'-btn');

            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !1);
            break;
        case -1:
            (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
            $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(已退出)');
            $(css_id).find('.a-onoff').text('(已退出)');
            $(css_id).find('.a-circle').text('');

            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已退出');

            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !0);
            break;
    }
} 

function refreshGameTagAll(){  // refresh tag_int&tag_json only be called on status=2 by refreshGameStatus()
    for (let uuid in position){
        (1 === loginData.onoff_dict[uuid]) && refreshGameTag(uuid); 
        // tag_json & tag_int only affect the players online          
    }
}

function refreshGameTag(player_uuid){  // refreshGameSingle() can call refreshGameTag() instead of refreshGameTagAll()
    // everyone in game is same, so self_group isn't used.
    var css_id = position[player_uuid];
    switch(loginData.tag_json[player_uuid]){
        case null:
            break;
        case 0:
            changeBtnColor(css_id+'-btn', 'btn-warning'), $(css_id+'-btn').text('邀請'), inviteMethod(css_id+'-btn', player_uuid);  
            break;
        case 1:
            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已邀請');
            break;
        case 2:
            changeBtnColor(css_id+'-btn', 'btn-danger'), $(css_id+'-btn').text('接受'), acceptMethod(css_id+'-btn', player_uuid);
            break;
        case 3:
            $(css_id+'-btn').text('已配對');
            break;  
    }
}

function changeBtnColor(css_id, class_name){  
    // class_name:btn-primary, btn-secondary, btn-success, btn-danger, btn-warning, btn-info, btn-light, btn-dark
    $(css_id).removeClass(), $(css_id).addClass('btn '+ class_name);
}

function refreshGameSingle(ws_type, player_uuid, ...args){  // refresh one player status, only be called in websocket.onmessage
    if(2===loginData.status){
        var num_on = gameGate.playerNum();
        setNavTitle(num_on);
    }

    switch (ws_type){  // react the ws_type according to induvidual role
        case 'CONN':
            refreshPlayer(player_uuid), refreshGameTag(player_uuid);
            // tag_json & tag_int will affect the result only if the player is online.

            // var sender_name = loginData.player_dict[player_uuid][0];
            // theUI.showSys('<span class="a-point">'+sender_name+'</span> 已上線！');
            break;
        case 'DISCON':
            refreshPlayer(player_uuid);

            // var sender_name = loginData.player_dict[player_uuid][0];
            // theUI.showSys('<span class="a-point">'+sender_name+'</span> 已下線...');
            break;
        case 'OUT':
            refreshPlayer(player_uuid);
            var sender_name = loginData.player_dict[player_uuid][0];
            theUI.showSys('<span class="a-point">'+ sender_name + '</span>' + ' 已離開遊戲。');
            break;
    }

}

function showGameNotice(ws_type, ...args){  // sent by websocket.onmessage
    switch (ws_type){  // react the ws_type according to induvidual role
        case 'OVER':  // args[0]: data.isOver
            (!0 === args[0])? showNotice('遊戲結束，可按右上方"離開"鍵 並準備進行下一場遊戲。'): showNotice('出局！可按右上方"離開"鍵 並準備進行下一場遊戲。');
            break;
        case 'ALIVE':  // args[0]: self_group
            showNotice('遊戲即將進入下一輪。');
            break;
    }
}

function informGameMessage(data){
    var dialogs, begin_str, ith;
    var msgs_li = [];
    if (0 === data.tag){
        ith = (data.hidden+1)/2;
        begin_str = '問題'+ ith.toString()+': ';
        msgs_li.push(begin_str + data.msgs[0]);
        for (let i = 1;i < data.msgs.length; i++){
            msgs_li.push(data.msgs[i]);
        }
        dialogs = msgs_li.map(msg => [msg, !1, 's']);
        (2 === loginData.status) && theUI.showStoryAsync(dialogs, interval=0);
        theUI.scrollToNow();
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');

        localData.answers['hasAnswered'] = !1, localStorage.answers = JSON.stringify(localData.answers);
    }else if (1 === data.tag){

        if (data.msgs[0] === 'no_news'){
            msgs_li[0] = '......🙈';
        }else{
            for (let msg of data.msgs){
                msg = $('#snippet').html(msg).text();
                msgs_li.push(msg);
            }
        }
        dialogs = msgs_li.map(msg => [msg, !1, 'a']);
        
        if (data.hidden === localData.answers['taskNum']-1){
            dialogs = dialogs.concat(end_dialogs);
        }else{
            dialogs.push(['===== 等待下一題 30秒 =====', !1, 's'])
        }

        (2 === loginData.status) && theUI.showStoryAsync(dialogs, interval=0);
        theUI.scrollToNow();
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');
    }else{  // (2 === data.tag) to get 'invite' message
        var sender_uuid = data.hidden;
        loginData.tag_json[sender_uuid] = 2, refreshGameTag(sender_uuid);
    }
}

function bindGameMsgSend() {  // to overload bindMsgSend() in chatroom.js
    $("#send-text").off('keypress');
    $("#send-text").on('keypress',function(a){
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();
            if (void 0 !== text && null !== text &&'' !== text){
                (3 === loginData.status) ? theWS.msgSendWs(text) : ((2 === loginData.status) ? $("#send-form").submit(): theUI.showSys('你還未進入房間哦！'));
                theUI.scrollToNow();
            } 
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }       
    })
}

function getTimetableIth(){
    var now = new Date(),
        cnt = -1;
    var timetable = localData.answers['timetable'];
    for (let task of timetable){
        if (now >= new Date(task[0]))
            cnt += 1;
        else
            break;
    }
    return cnt
}

function  isOverTime(){
    var now = new Date(),
        task_time = new Date(localData.answers['timetable'][0]);
    seconds = (now - task_time)/1000;
    bool = ((now - task_time)/1000 > 1800)? true: false;
    return bool
}

var GAMETITLE = '不透露性別配對',
    gameGate = gameCheckGate(),
    self = [],
    others = {},
    position = {},
    hasBound_replyMethod = !1
    
$(document).ready(function(){
    loadRoleData(), bindGameMsgSend();  // load the data about role respectively and establish the variable: self, others, position
})

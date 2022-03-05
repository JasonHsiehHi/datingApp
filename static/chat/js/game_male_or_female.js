var gameCheckGate = function(){
    function pla(isDirected=true){
        var li = [];
        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value === 1) && li.push(key);
        }
        var name_list = li.map(uuid => loginData.player_dict[uuid][0]+'('+loginData.player_dict[uuid][2]+')');
        var dialog = ['<span class="a-point">'+ name_list.join(", ")+ '</span> 已加入遊戲', !1];
        (!0 === isDirected) && theUI.showSys(dialog[0]);
        return dialog
        
    }
    function mat(isDirected=true){
        var li = [...loginData.player_list];
        li.remove(loginData.uuid);
        li_others = [...li];

        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value !== 1) && li.remove(key);
        }
        if (0 === li.length){
            var name_list = li_others.map(uuid => loginData.player_dict[uuid][0]+'('+loginData.player_dict[uuid][2]+')');
            var dialog = ['<span class="a-point">'+name_list.join(', ')+'</span> 不在房間裡...', !1];
        }else{  // 0 !== li.length
            var name_list = li.map(uuid => loginData.player_dict[uuid][0]+'('+loginData.player_dict[uuid][2]+')');
            var dialog = ['<span class="a-point">'+name_list.join(', ')+'</span> 目前待在房間中', !1];
        }
        (!0 === isDirected) && theUI.showSys(dialog[0]);
        return dialog
    }

    function mes(){  // be used by chatSocket.onmessage data.type='MESSAGE'
        var text = '某人向妳提供線索：'
        return text
    }

    function eve(isDirected=false, interval=3000){  // be used by prolog()
        var dialogs = event_dialogs;
        (!0 === isDirected) && theUI.showStoryAsync(dialogs, interval);
        return dialogs
    }

    function rol(self_group, isDirected=false, interval=3000){  // be used by prolog()
        var dialogs = role_desc_dialogs[self_group];  // from db_male_or_female.js, different contents by role
        (!0 === isDirected) && theUI.showStoryAsync(dialogs, interval);
        return dialogs
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/male_or_female/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_json = data.tag_json, loginData.tag_int = data.tag_int;
                    refreshGameTagAll(self[3]);
                    var li = [...story_dialogs];  // from db_male_or_female.js, same contents for everyone

                    localData.answers['timetable'] = data.timetable, localStorage.answers = JSON.stringify(localData.answers);
                    replyMethod();

                    theUI.showStoryAsync(li, interval=3000, callback=function(){
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
        matcher:mat,
        event:eve,
        role:rol,
        message:mes,
        prolog:prl
    }
}

function deduceMethod(){
    $("#start-btn").on('click',function(e){
        if (loginData.status !== 2)  // it's overlayed #start-modal-form
            return false
        $("#deduce-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('推理環節');
        $('#modal').modal('show');
    })

    $("#deduce-modal-form").on('submit',function(e){
        e.preventDefault();
        var formArray = $(this).serializeArray();
        var pos_li;
        for (let i=1; i<formArray.length; i++){
            pos_li = formArray[i]['name'].split('-',2);
            formArray[i]['name'] = $('#'+pos_li.join('-')).data('uuid');
        }
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/male_or_female/deduce',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    theWS.callSendWs('make_out');
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    $('#deduce-modal-form p.a-error').text(data['msg']);
                }
            },
            complete: function(data, code) { setOptions(); },
            error: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
    function setOptions(){
        seletedEvent = {};
        var set = new Set(eventSet);
        set.delete('偵探本人');
        for (let name of set){
            $('.gameevent-options').append('<option value='+name+'>'+name+'</option>');
        }
    }

    setOptions();

    var onoff_list = [];
    for(let [key, value] of Object.entries(loginData.onoff_dict)){
        (value === 1 || value === 0) && onoff_list.push(key);
    }
    for (let uuid of onoff_list){
        $(position[uuid]+'-deduce-input').on('change',function(a){
            seletedEvent[position[uuid]] = $(this).val();
            $('.gameevent-options').find('option').show();
            for (let opt of Object.values(seletedEvent)){
                $('.gameevent-options').find('option[value='+opt+']').hide();
            }                
        })
    }
}

function examineMethod(css_id, player_uuid){
    /* it's binded by loadRoleData() on sidebar #player-*-btn
     */
    $(css_id).on('click',function(e){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/male_or_female/examine/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    theWS.callSendWs('enter_match');
                    showNotice('已建立房間 等待中...'), theUI.showSys('等待對方回應...');
                }else{
                    showNotice(data['msg']);  // the player can't reject
                    // but something wrong when the player is disconnected coincidentally
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function clueMethod(css_id, player_uuid){
    /* it's binded by loadRoleData() on sidebar #player-*-btn
     */
    $(css_id).on('click',function(a){
        $("#clue-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('提供線索');
        $('#modal').modal('show');
    })
    $("#clue-modal-form").on('submit',function(e){
        e.preventDefault();
        var clue_msg = $(this).find('input[name="clue-input"]').val();
        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/male_or_female/clue/'+ player_uuid,
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 2, refreshGameTagAll(0);
                    theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', [clue_msg]]);  // message format: list([msg1, msg2,...])
                    $('#modal').modal('hide');
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function replyMethod(){
    $("send-form").on('submit',function(e){
        e.preventDefault();
        var msg_text = $(this).find('input[name="send-text"]').val();
        // 唯有在作答時間內才可回答 而且只能回答一次 (先用前端檢驗一次 到後端還要再檢驗一次)
        // 需要有timetable 其中不會有問題 但會有現在可回覆(1)或不可回覆(0)

        var now = new Date(), 
            cnt = 0;
        var timetable = localData.answers['timetable'];
        for (let t in timetable){
            (now > new Date(t)) && (cnt += 1);
        }

        if (msg_text){
            theUI.showSys('冷靜，等待下一個問題！');
            theUI.showSys('你已經回答過問題了哦！');
            theUI.showSys('問答環節結束！ 請打開左側玩家選單，向一位參加者寄送邀請。 如果不想與任何參加者配對，則可按右上方的離開鍵。');

            return false
        }
        
        var ith = (cnt+1)/2;
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


                    loginData.tag_int = 2, refreshGameTagAll(0);
                    theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', [clue_msg]]);  // message format: list([msg1, msg2,...])
                    $('#modal').modal('hide');
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function inquireMethod(css_id, player_uuid){
    /* it's binded by loadRoleData() on sidebar #player-*-btn
     */
    var name_role = others[player_uuid][0]+'('+others[player_uuid][2]+')';
    $(css_id).on('click',function(a){
        $("#inquire-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('調查');
        $('#inquire-modal-form .modal-body p:eq(0)').text('是否確定調查'+name_role+'?');
        $('#modal').modal('show');
    })
    $("#inquire-modal-form").on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/male_or_female/inquire/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 1, refreshGameTagAll(0);
                    var text = name_role + '沒有 '+data['event'];
                    $('#game-inquire').text(text);
                    showNotice(text);
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
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

function loadRoleData(){  // according to individual role, to display sidebar
    /* use loginData.player_dict to complete sidebar and establish variables(self, others, position)
    */
    self = loginData.player_dict[loginData.uuid];
    // [name, gender(male or female), sub(role name), group(0 or 1)]
    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];  // except self
    // {uuid:[name, gender(male or female), sub(role name), group(0 or 1)],, ...}

    $('#user-role').text( '('+self[2]+')' );
    var i = 1, css_id, name, gender, sub, group;
    for (let uuid in others){
        css_id = '#player-' + i.toString();
        name = others[uuid][0], gender = (others[uuid][1]==='m')? 'a-male':'a-female', sub = '('+others[uuid][2]+')', group = others[uuid][3];

        $(css_id).removeClass('d-none');
        $(css_id).data('uuid', uuid), position[uuid] = css_id;  // bind the variable player's css_id to player's uuid
        $(css_id).find('.a-circle').addClass(gender).text(name[0]);
        $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name);
        $(css_id).find('.a-sub').text(sub);

        if (self[3] === 1){  // bind method or methodSet according to role
            $(css_id+'-btn').text('審問'), examineMethod(css_id+'-btn', uuid);

            $(css_id+'-deduce').removeClass('d-none');
            $(css_id+'-deduce').find('label').text(name+' '+sub+':');
        }else{  // self[3] === 0
            if(group === 1){
                $(css_id+'-btn').text('線索'), clueMethod(css_id+'-btn', uuid);
            }else{
                $(css_id+'-btn').text('調查'), inquireMethod(css_id+'-btn', uuid);
            }
        }
        i++;
    }
    $('#game-event').html(role_desc[self[3]]);

    if (self[3] === 1){
        $('#start-btn').text('推 理'), deduceMethod();
        refreshGameStatus(1, loginData.status);  // refresh self status according to different self_group (role)
    }else{ // self[3] === 0
        $('#start-btn').text('行 動').attr('disabled', true);
        refreshGameStatus(0, loginData.status);
    }
}

function refreshGameStatus(self_group, status){  // refresh status, tag_json and tag_int according to dividual role
    refreshPlayerAll();  // first, refresh other players on/off 
    switch (status){   // second, refresh self status as well as tag_json and tag_int
        case 2:
            refreshGameTagAll(self_group);  // according to current tag_json or tag_int, refresh player css btn

            setNavTitle('劇本:<span class="a-point">'+ GAMETITLE +'</span>');

            (localData.chatLogs.length>0) && theUI.clearChatLogs('chatLogs'); 
            if (localData.gameLogs.length === 0){  // the first time to enter game
                gameGate.player(), gameGate.prolog();
            }else{
                var isMore = theUI.loadChatLogs('gameLogs');  // game dialogs are on status=2 only
                (!0 === isMore) && appearElmtCss('#show-more');
                gameGate.player();
            }
            (self_group === 1) && enabledElmtCss('#start-btn');

            ('timetable' in localData.answers) && replyMethod();  // 只在status===2被使用 當status===3時則直接用theWS.msgSendWs(text)

            break;
        case 3:
            for (let uuid in position){
                (1 === loginData.onoff_dict[uuid]) && disabledElmtCss(position[uuid]+'-btn');
            }

            setNavTitle('審問中 剩餘時間:<span class="a-point a-clock"></span>'), theUI.showClock(loginData.waiting_time, !0);

            var isMore = theUI.loadChatLogs('chatLogs');  // chat record dialogs are on status=3 only
            (!0 === isMore) && appearElmtCss('#show-more');
            gameGate.matcher();
            (loginData.player_list.length === 1) && theUI.showSys('目前房間內剩你一人'); // 合併到gameGate.matcher();

            (self_group === 1) && disabledElmtCss('#start-btn');            
            break;
    }
}

function refreshPlayerAll(){  // refresh players on/off, only be called by refreshGameStatus()
    for (let uuid in position){
        refreshPlayer(uuid);
    }
}

function refreshPlayer(player_uuid){  // refreshGameSingle() can call refreshPlayer() instead of refreshPlayers()
    var css_id = position[player_uuid];
    var name = $(css_id).find('.a-title').text();
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
            
            if (self[3] === 1){  // for action btn
                $(css_id+'-deduce-input').removeAttr('required').attr('disabled', true).removeClass('gameevent-options');
                $(css_id+'-deduce-input>option:eq(0)').text('已退出遊戲');
            }
            break;
    }
} 

function refreshGameTagAll(self_group){  // refresh tag_int&tag_json only be called on status=2 by refreshGameStatus()
    for (let uuid in position){
        (1 === loginData.onoff_dict[uuid]) && refreshGameTag(self_group, uuid); 
        // tag_json & tag_int only affect the players online          
    }
}

function refreshGameTag(self_group, player_uuid){  // refreshGameSingle() can call refreshGameTag() instead of refreshGameTagAll()
    // everyone in game is same, so self_group isn't used.
    var css_id = position[player_uuid];
    switch(loginData.tag_json[player_uuid]){
        case null:
            break;
        case 0:
            changeBtnColor(css_id+'-btn', 'btn-warning'), $(css_id+'-btn').text('邀請');  
            break;
        case 1:
            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已邀請');
            break;
        case 2:
            changeBtnColor(css_id+'-btn', 'btn-danger'), $(css_id+'-btn').text('接受');
            break;
    }
}

function changeBtnColor(css_id, class_name){  
    // class_name:btn-primary, btn-secondary, btn-success, btn-danger, btn-warning, btn-info, btn-light, btn-dark
    $(css_id).removeClass(), $(css_id).addClass('btn '+ class_name);
}

function refreshGameSingle(ws_type, player_css, ...args){  // refresh one player status, only be called in websocket.onmessage
    var player_uuid = $(player_css).data('uuid');
    switch (ws_type){  // react the ws_type according to induvidual role
        case 'CONN':
            refreshPlayer(player_uuid), refreshGameTag(self[3] , player_uuid);  
            // tag_json & tag_int will affect the result only if the player is online.
            break;
        case 'DISCON':
            refreshPlayer(player_uuid);
            break;
        case 'OUT':
            refreshPlayer(player_uuid);
            break;
    }
}

function showGameNotice(ws_type, ...args){
    switch (ws_type){  // react the ws_type according to induvidual role
        case 'OVER':
            (!0 === args[0])? showNotice('遊戲結束，偵探成功破案！ 可按"離開"鍵 並準備進行下一場遊戲。'): showNotice('出局！ 你昨晚所做的事已被偵探查明。 可按"離開"鍵 並準備進行下一場遊戲。');
            break;
        case 'ALIVE':
            (1 === args[0])? showNotice('進入下一輪，妳未能找到昨晚的渣男。'): showNotice('進入下一輪，你昨晚所做的事尚未被偵探察覺。');
            break;
    }
}

function informGameMessage(data){
    // tag_int = data.tag 並且在database的player.tag_int也要修改

    if (true === data.toSelf){
        showNotice('訊息成功送達！');
    }else{
        var begin_str = gameGate.message();
        if (loginData.status === 2){
            for (let msg of data.msgs){
                msg = $('#snippet').html(begin_str + msg).text();
                theUI.showMsg(msg);
            }
        }
        var dialogs = data.msgs.map(msg => [$('#snippet').html(begin_str + msg).text(), !1, 'a']);
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');
    }
}

function bindGameMsgSend() {  // to overload bindMsgSend() in chatroom.js
    $("#send-text").on('keypress',function(a){
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();
            if (void 0 !== text && null !== text &&'' !== text){
                (3 === loginData.status) ? theWS.msgSendWs(text) : ((2 === loginData.status) ? $("#send-form").trigger("submit"): theUI.showSys('你還未進入房間哦！'));
            } 
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }       
    })
}

var GAMETITLE = '不透露性別配對',
    gameGate = gameCheckGate(),
    eventSet = loginData['all_events'],
    event_dialogs = loginData['event_content'],
    seletedEvent = {},
    self = [],
    others = {},
    position = {}
    
$(document).ready(function(){
    loadRoleData();  // load the data about role respectively and establish the variable: self, others, position

})

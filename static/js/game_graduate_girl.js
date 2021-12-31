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
        var name_list = li.map(uuid => loginData.player_dict[uuid][0]+'('+loginData.player_dict[uuid][2]+')');
        var dialog = ['<span class="a-point">'+name_list.join(', ')+'</span> 目前待在房間中', !1];
        (!0 === isDirected) && theUI.showSys(dialog[0]);
        return dialog
    }

    function mes(){  // be used by chatSocket.onmessage data.type='MESSAGE'
        var text = '某人向妳提供線索：'
        return text
    }

    function eve(isDirected=false){
        var li = loginData['event_content'].filter(text => text !== ' ')
        var dialog = ['提示線索：<br><em>' + li.join('<br>')+'</em>', !1];
        (!0 === isDirected) && theUI.showMsg(dialog[0]);
        return dialog
    }

    function rol(self_group){
        var dialog = role_desc[self_group];
        return dialog
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    if (self[3] === 1){
                        var di = {};
                        for (let key in loginData.onoff_dict) { 
                            di[key] = 1; 
                        }
                        di['message'] = [];
                        loginData.tag_json = di, loginData.tag_int = -1;
                    }else{ // self[3] === 0
                        loginData.tag_json = {}, loginData.tag_int = 0;
                    }

                    var li = [...story_dialogs];
                    var event = eve();
                    $('#game-event').html(event[0]);
                    li.push(...data.role, rol(self[3]), [...event, 'a']);
                    theUI.showStoryAsync(li), theUI.storeChatLogs(li, li.length, 'gameLogs');
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
            url: '/chat/start_game/graduate_girl/deduce',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){                    
                    // 偵探call_make_out => 被指名的玩家離開但保留畫面 沒被指名的玩家通知此玩家已經離開 (玩家出局)
                    // 偵探call_make_out => gameover 遊戲結束 全體保留畫面 players按鍵全關動不了 (遊戲結束)
                    
                    theWS.callSendWs('make_out');
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    $('#deduce-modal-form p.a-error').text(data['msg']);
                }
            },
            complete: function(data, code) { setOptions(); },
            error: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
    $(css_id).on('click',function(e){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/examine/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    // loginData.tag_json[player_uuid] = 1, refreshGameStatus(1, loginData.status);
                    theWS.callSendWs('enter_match');
                    showNotice('已建立房間 等待中...'), theUI.showSys('等待對方回應...');
                }else{
                    showNotice(data['msg']);  // 對方無法拒絕 但要考慮剛好離線問題
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function clueMethod(css_id, player_uuid){
    $(css_id).on('click',function(a){
        $("#clue-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('提供線索');
        $('#modal').modal('show');
    })
    $("#clue-modal-form").on('submit',function(e){
        e.preventDefault();
        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/graduate_girl/clue/'+ player_uuid,
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 2, refreshGameStatus(0, loginData.status);
                    theWS.callSendWs('see_message',['player', player_uuid]);
                    $('#modal').modal('hide');
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#clue-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function inquireMethod(css_id, player_uuid){
    $(css_id).on('click',function(a){
        $("#inquire-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('調查');
        var name_role = others[player_uuid][0]+'('+others[player_uuid][2]+')';
        $('#inquire-modal-form .modal-body p:eq(0)').text('是否確定調查'+name_role+'?');
        $('#modal').modal('show');
    })
    $("#inquire-modal-form").on('submit',function(e){
        e.preventDefault();
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/inquire/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 1, refreshGameStatus(0, loginData.status);
                    var text = name_role + '沒有 '+data['event'];
                    $('#game-inquire').text(text);
                    showNotice(text);
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function disabledGameBtns(){
    var css_id; 
    for (let uuid in position)
        css_id = position[uuid], disabledElmtCss(css_id+'-btn');
    disabledElmtCss('#start-btn');
    $('body').off('click', "#leave-btn");
    $("#leave-btn").on('click',function(a){ 
        window.location.href = "/chat"; 
    })
}

function loadRoleData(){
    self = loginData.player_dict[loginData.uuid];
    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];
    $('#user-role').text( '('+self[2]+')' );
    var i = 1, css_id, name, sub, gender, group;
    for (let uuid in others){
        css_id = '#player-' + i.toString();
        name = others[uuid][0], gender = (others[uuid][1]==='m')? 'a-male':'a-female', sub = '('+others[uuid][2]+')', group = others[uuid][3];

        $(css_id).removeClass('d-none');
        $(css_id).data('uuid', uuid), position[uuid] = css_id;
        $(css_id).find('.a-circle').addClass(gender).text(name[0]);
        $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name);
        $(css_id).find('.a-sub').text(sub);
        if (self[3] === 1){
            $(css_id+'-btn').text('審問'), examineMethod(css_id+'-btn', uuid);
            $(css_id+'-deduce').removeClass('d-none');
            $(css_id+'-deduce').find('label').text(name+' '+sub+':');
        }else{  // self[3] === 0
            if(group === 1){
                $(css_id+'-btn').text('線索'), clueMethod(css_id+'-btn', uuid);
            }else{
                $(css_id+'-btn').text('調查'), inquireMethod(css_id+'-btn', uuid);
                // tag_int 0 表示都沒有 1為已調查 2為已提供線索
            }
        }
        i++;
    }
    var event = gameGate.event();
    $('#game-event').html(event[0]);

    if (self[3] === 1){
        $('#start-btn').text('推 理'), deduceMethod();
        refreshGameStatus(1, loginData.status);
    }else{ // self[3] === 0
        $('#start-btn').text('行 動').attr('disabled', true);
        refreshGameStatus(0, loginData.status);
    }

}

function refreshGameStatus(self_group, status){
    // 每次進入match (成功執行examine)後 refresh loginData.tag_json (用來記錄誰被審問過)
    // 嫌疑人每次傳訊息 (成功執行'提供線索')後 refresh loginData.tag_int (用來紀錄自己是否做過)
        
    refreshPlayers();
    switch (status){ 
        case 2:
            for (let uuid in position){
                if (1 === loginData.onoff_dict[uuid]){
                    /*
                    if (self_group === 1)
                        (0 === loginData.tag_json[uuid]) && enabledElmtCss(position[uuid]+'-btn');
                    else{ // self_group === 0
                        switch(loginData.tag_int){
                            case 0:
                                (0 === other[uuid][3]) && enabledElmtCss(position[uuid]+'-btn');
                                break;
                            case 1:
                                (1 === other[uuid][3]) && enabledElmtCss(position[uuid]+'-btn');
                                break;
                            case 2:
                                disabledElmtCss(position[uuid]+'-btn');
                                break;
                        }
                    }
                    */
                    enabledElmtCss(position[uuid]+'-btn')  // for test
                } 
            }
                
            setNavTitle('劇本：<span class="a-point">'+ GAMETITLE +'</span>');

            (localData.chatLogs.length > 0) && theUI.clearChatLogs('chatLogs');

            if (localData.gameLogs.length === 0){
                gameGate.player(), gameGate.prolog();
            }else{
                var isMore = theUI.loadChatLogs('gameLogs');
                (!0 === isMore) && appearElmtCss('#show-more');
                gameGate.player();
            }

            if (self_group === 1)
                enabledElmtCss('#start-btn');
            break;
        case 3:
            for (let uuid in position){
                (1 === loginData.onoff_dict[uuid]) && disabledElmtCss(position[uuid]+'-btn');
            }
            
            setNavTitle('審問中... 剩餘時間：<span class="a-point a-clock"></span>'), theUI.showClock(loginData.waiting_time, !0);
            // if (localData.chatLogs.length !== 0){ }
            var isMore = theUI.loadChatLogs('chatLogs');  
            (!0 === isMore) && appearElmtCss('#show-more');
            
            gameGate.matcher();

            if (self_group === 1)
                disabledElmtCss('#start-btn');
            break;
    }

}

function refreshPlayers(){  // refresh loginData.onoff_dict
    var css_id, name;
    for (let uuid in position){
        css_id = position[uuid], name = $(css_id).find('.a-title').text();
        switch (loginData.onoff_dict[uuid]){
            case 0:
                (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
                $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(離線)');
                $(css_id).find('.a-onoff').html('(離線)');
                disabledElmtCss(css_id+'-btn');
                (!0 === loginData.player_list.includes(uuid)) && (toggle.discon = !0, theUI.showSys(name +' 目前為離線狀態...'));
                break;
            case 1:
                ($(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').removeClass('a-off');
                $(css_id).find('.a-title').attr('data-bs-original-title', name);
                $(css_id).find('.a-onoff').html();
                enabledElmtCss(css_id+'-btn');
                (!0 === loginData.player_list.includes(uuid)) && (toggle.discon = !1);
                break;
            case -1:
                (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
                $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(已退出)');
                $(css_id).find('.a-onoff').html('(已退出)');
                $(css_id).find('.a-circle').text('');
                disabledElmtCss(css_id+'-btn');
                (!0 === loginData.player_list.includes(uuid)) && (toggle.discon = !0, theUI.showSys(name +' 已離開房間。 玩家可按"離開"鍵 離開目前的房間'));
                
                if (self[3] === 1){
                    $(css_id+'-deduce-input').removeAttr('required').attr('disabled', true).removeClass('gameevent-options');
                    $(css_id+'-deduce-input>option:eq(0)').text('已退出遊戲');
                }
                break;
        }
    }
}

function refreshGameSingle(self_group, player_css, ws_type){  // to refresh other one player status
    // only used in websocket.onmessage
    switch (ws_type){  //react the ws_type according to different role 
        case 'CONN':
            enabledElmtCss(player_css+'-btn');
            break;
        case 'DISCON':
            disabledElmtCss(player_css+'-btn');
            break;
        case 'OUT':
            disabledElmtCss(player_css+'-btn');
            break;
    }
    
}

function showGameNotice(ws_type, ...args){
    switch (ws_type){
        case 'OVER':
            (!0 === args[0])? showNotice('遊戲結束，偵探成功破案！ 可按"離開"鍵 並準備進行下一場遊戲。'): showNotice('出局！ 你昨晚的所做所為已被偵探查明。 可按"離開"鍵 並準備進行下一場遊戲。');
            break;
        case 'ALIVE':
            (1 === args[0])? showNotice('進入下一輪，妳未能找到昨晚的渣男。'):showNotice('進入下一輪，你昨晚所做的蠢事尚未被偵探察覺。');
            break;
    }
}


var GAMETITLE = '畢業後的第一夜',
    gameGate = gameCheckGate(),  // 輸出遊戲相關的dialog
    eventSet = loginData['event_name'],
    seletedEvent = {},
    self = [],
    others = {},
    position = {}
    
$(document).ready(function(){
    // bind method or methodSet according to role
    loadRoleData();  // load the data about role respectively and establish the variable: self, others, position

    // 除了load之後 也要做故事情節dialog 放在loadRoleData中的refreshGameStutus中 
    // 等劇本生成完成後 再像chatroom的GREET一樣來要dailog資料 還有最後的gameevent
})

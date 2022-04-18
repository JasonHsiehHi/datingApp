var gameCheckGate = function(){
    function num(isDirected=false){
        var li = [];
        
        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value === 1) && li.push(key);
        }
        var text = '在線人數:<span class="a-point">'+ li.length +'</span> 人';
        (!0 === isDirected) && theUI.showSys(text);
        return text
    }

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

    function mat(isDirected=true){
        var li_others = [...loginData.player_list];
        li_others.remove(loginData.uuid);
        var li_others_on = [...li_others];  // 直接用li_others就行 之後刪掉此行

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

    function art(name, isDirected=false){  // all articles of the player are stored in tag_json
        var text = '已獲得物品<span class="a-point">'+ name+ '</span>！';
        (!0 === isDirected) && theUI.showSys(text);
        return text
        
    }
    function ari(article){
        var dialogs = [], part_di;
        dialogs.push([art(article[0]), !1,'s']);
        for (let part of article.slice(1)){
            (part.length > 0) && (part_di = part.map( msg => [msg, !1, 's'] ));
            dialogs.push(...part_di);
        }
        return dialogs
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/cheat_game/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_json = data.tag_json, loginData.tag_int = data.tag_int, refreshGameTagAll();
                    $('#user-role').text( '('+loginData.tag_json['role']+')');

                    replyMethod();
                    
                    var li = [...data.guest_dialogs];
                    li = li.concat(ari(card));  // from db_cheat_game.js, same contents for everyone
                    var paper = loginData.tag_json['paper'];
                    li = li.concat(ari(paper));
                    
                    theUI.showStoryAsync(li, interval=1500, callback=function(){
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
        playerNum:num,
        player:pla,
        matcher:mat,
        article:art,
        articleInfo:ari,
        prolog:prl
    }
}

function passMethod(css_id, player_uuid){
    /* binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(a){
        $("#pass-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('傳紙條');
        $('#pass-modal-form .modal-body p:eq(0)').text('確定要將紙條傳給'+others[player_uuid][0]+'嗎?');
        $('#modal').modal('show');

        $("#pass-modal-form").off('submit');
        $("#pass-modal-form").on('submit',function(e){
            e.preventDefault();
            if (0 === loginData.tag_int){
                $('#pass-modal-form p.a-error').text('你的紙條還沒有作答完哦！');
                return false
            }else if (2 === loginData.tag_int){
                $('#pass-modal-form p.a-error').text('你已將紙條傳給其他人或已寄送配對邀請！（但對方可能還沒接受）');
                return false
            }
            if (1 !== loginData.tag_int){  // the last check
                $('#pass-modal-form p.a-error').text('你現在不能將紙條傳給別人哦！');
                return false
            }
            if (0 === loginData.tag_json['interact'][player_uuid]){
                $('#pass-modal-form p.a-error').text('對方的紙條還未作答完哦！');
                return false
            }
            if (1 !== loginData.tag_json['interact'][player_uuid]){  // the last check
                $('#pass-modal-form p.a-error').text('對方現在不能與你交換紙條！');
                return false
            }

            $.ajax({
                type: 'GET',
                url: '/chat/start_game/cheat_game/pass/' + player_uuid,
                dataType: "json",
                success: function(data) {
                    if (!0 === data['result']){
                        loginData.tag_int = 2, loginData.tag_json['interact'][player_uuid] = 2; refreshGameTag(player_uuid);
                        showNotice('已將紙條傳給 '+others[player_uuid][0]+' ！');

                        theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', 'pass'], ['tag', 2]);
                    }else{
                        $('#pass-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#pass-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#pass-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
            })
        })
    })
}

function changeMethod(css_id, player_uuid){
    /* binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(e){
        if (!1 === [1,2].includes(loginData.tag_int)){  // the last check
            showNotice('你的紙條還沒有作答完或已經換了新紙條。');
            return false
        }
        if (3 !== loginData.tag_json['interact'][player_uuid]){  // the last check
            showNotice('對方已經與其他人交換新紙條或已與其他人配對成功。');
            return false
        }

        $.ajax({
            type: 'GET',
            url: '/chat/start_game/cheat_game/change/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 0, loginData.tag_json['interact'] = data['self_interact'], refreshGameTagAll();
                    loginData.tag_json['paper'] = data['self_paper'];
                    showNotice('成功與 '+others[player_uuid][0]+' 互換紙條！');
                    theWS.callSendWs('inform',['target', 'room'], ['meInGroup', true], ['message', data['opposite_data']],['hidden', player_uuid] ['tag', 3]);
                    // data['opposite_data'] 需不需要變做JSON.stringify
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

function matchMethod(css_id, player_uuid){
    /* binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(a){
        $("#match-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('配對');
        $('#match-modal-form .modal-body p:eq(0)').text('確定要配對'+others[player_uuid][0]+'?');
        $('#modal').modal('show');

        $("#match-modal-form").off('submit');
        $("#match-modal-form").on('submit',function(e){
            e.preventDefault();
            if (2 === loginData.tag_int){
                $('#pass-modal-form p.a-error').text('你已寄送配對邀請或已將紙條傳給其他人！（但對方可能還沒接受）');
                return false
            }
            if (!1 === [0,1].includes(loginData.tag_int)){  // the last check
                $('#pass-modal-form p.a-error').text('你現在不能寄送配對邀請哦！');
                return false
            }
            if (7 === loginData.tag_json['interact'][player_uuid]){
                $('#pass-modal-form p.a-error').text('對方已經與其他人成功配對了');
                return false
            }
            if (4 !== loginData.tag_json['interact'][player_uuid]){  // the last check
                $('#pass-modal-form p.a-error').text('對方現在不能與你配對！');
                return false
            }

            $.ajax({
                type: 'GET',
                url: '/chat/start_game/cheat_game/match/' + player_uuid,
                dataType: "json",
                success: function(data) {
                    if (!0 === data['result']){
                        loginData.tag_int = 2, loginData.tag_json['interact'][player_uuid] = 5; refreshGameTag(player_uuid);                       
                        showNotice('已送出配對邀請給 '+others[player_uuid][0]+' ！');
                        theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', 'match'], ['tag', 4]);
                    }else{
                        $('#match-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#match-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#match-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
            })
        })
    })
}

function acceptMethod(css_id, player_uuid){
    /* binded by loadRoleData() on sidebar #player-*-btn */
    $(css_id).off('click');
    $(css_id).on('click',function(e){
        if (6 !== loginData.tag_json['interact'][player_uuid]){  // the last check
            showNotice('對方已與其他人配對成功或已與其他人交換新紙條。');
            return false
        }
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/cheat_game/accept/' + player_uuid,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 3, loginData.tag_json['interact'][player_uuid] = 7, refreshGameTag(player_uuid);
                    showNotice('與 '+others[player_uuid][0]+' 成功配對。 已建立房間，等待中...');
                    theWS.callSendWs('inform',['target', 'room'], ['meInGroup', true], ['message', data['isWon']],['hidden', player_uuid] ['tag', 5]);
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

// todo 最後要處理scrollToNow()和unreadTitle()問題 應該要讓theUI可以直接執行方法
function replyMethod(){
    if (!0 === hasBound_replyMethod)
        return false
    hasBound_replyMethod = !0;
    $("#send-form").on('submit',function(e){
        e.preventDefault();

        if (0 !== loginData.tag_int){
            theUI.showSys('你已經在這張<span class="a-point">紙條</span>上留過答案了哦！');
            theUI.scrollToNow();
            return false
        }

        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/cheat_game/reply',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = 1, loginData.tag_json['interact'][loginData.uuid] = 1;
                    theUI.showSys('感謝你的回答！ 你已在這張<span class="a-point">紙條</span>上留下答案了，你可開啟左側玩家名單將<span class="a-point">紙條</span>傳給其他人。');
                    theUI.scrollToNow();
                    theWS.callSendWs('inform',['target', 'room'], ['meInGroup', true], ['message', 'reply'], ['tag', 1]);
                }else{
                    theUI.showSys(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
    (null !== loginData.tag_json) && $('#user-role').text( '('+loginData.tag_json['role']+')');

    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];  // except self
    // {uuid:[name, gender(m,f,n), status],...}
    
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

    // $('#game-rule').html(card); 併入 $('#game-inventory')之中

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
                replyMethod();  // only on status=2, when status=3 with theWS.msgSendWs(text)
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

function refreshPlayerAll(){  // refresh players on/off, only be called by refreshGameStatus()
    for (let uuid in position){
        refreshPlayer(uuid);
    }
}

function refreshPlayer(player_uuid){  // refreshGameSingle() can call refreshPlayer() instead of refreshPlayerAll()
    var css_id = position[player_uuid];    
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

function disablePlayerBtnAll(){  // like refreshGameTagAll(), but don't use tag_json&tag_int
    for (let uuid in position){
        (1 === loginData.onoff_dict[uuid]) && disabledElmtCss(position[uuid]+'-btn');
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
    if (0 === loginData.player_dict[1]){
        if (!0 === [2,3].includes(loginData.tag_json['interact'][player_uuid]))
            loginData.tag_json['interact'][player_uuid] = 0;
        else if (!0 === [5,6].includes(loginData.tag_json['interact'][player_uuid]))
            loginData.tag_json['interact'][player_uuid] = 4;
    }else  // 1 === loginData.player_dict[1]
        if (0 === loginData.tag_json['interact'][player_uuid])
            loginData.tag_json['interact'][player_uuid] = 1;

    switch(loginData.tag_json['interact'][player_uuid]){
        case null:
            break;
        case 0:  // '傳遞前未填完'
        case 1:  // '傳遞前已填完'
            enabledElmtCss(css_id+'-btn'), changeBtnColor(css_id+'-btn', 'btn-warning'), $(css_id+'-btn').text('傳紙條'), passMethod(css_id+'-btn', player_uuid);  
            break;
        case 2:
            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已傳遞');
            break;
        case 3:
            enabledElmtCss(css_id+'-btn'), changeBtnColor(css_id+'-btn', 'btn-danger'), $(css_id+'-btn').text('換紙條'), changeMethod(css_id+'-btn', player_uuid);
            break;
        case 4:
            enabledElmtCss(css_id+'-btn'), changeBtnColor(css_id+'-btn', 'btn-warning'), $(css_id+'-btn').text('配對'), matchMethod(css_id+'-btn', player_uuid);  
            break;
        case 5:
            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已邀請');
            break;
        case 6:
            enabledElmtCss(css_id+'-btn'), changeBtnColor(css_id+'-btn', 'btn-danger'), $(css_id+'-btn').text('接受'), acceptMethod(css_id+'-btn', player_uuid);
            break;
        case 7:
            disabledElmtCss(css_id+'-btn'), $(css_id+'-btn').text('已配對');
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
            refreshPlayer(player_uuid), refreshGameTag(player_uuid); // tag_json & tag_int will affect the result only if the player is online.
            // theUI.showSys('<span class="a-point">'+loginData.player_dict[player_uuid][0]+'</span> 已上線！');
            break;
        case 'DISCON':
            refreshPlayer(player_uuid);
            // theUI.showSys('<span class="a-point">'+loginData.player_dict[player_uuid][0]+'</span> 已下線...');
            break;
        case 'OUT':
            refreshPlayer(player_uuid);
            theUI.showSys('<span class="a-point">'+ loginData.player_dict[player_uuid][0] + '</span>' + ' 已離開遊戲。');
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
    if (0 === data.tag){
        var msgs_li = data.msgs;
        var dialogs = msgs_li.map(msg => [msg, !1, 'a']);
        theUI.showStoryAsync(dialogs, interval=0);
        theUI.scrollToNow();
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');
        
    }else if (1 === data.tag){
        if (!1 === data.toSelf){
            loginData.tag_json['interact'][data.from] = 1, refreshGameTag(data.from);
            var text = '<span class="a-point">'+others[data.from][0]+'</span>已作答完畢，可交換<span class="a-point">作弊紙條</span>！';
            theUI.showSys(text);
            theUI.scrollToNow();
            theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
        }

    }else if (2 === data.tag){
        loginData.tag_json['interact'][data.from] = 3, refreshGameTag(data.from);
        var text = '<span class="a-point">'+others[data.from][0]+'</span>傳紙條給你！';
        theUI.showSys(text);
        theUI.scrollToNow();
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
    
    }else if (3 === data.tag){
        if (loginData.uuid === data.hidden){
            loginData.tag_int = 0, loginData.tag_json['interact'] = data.msgs['interact'], refreshGameTagAll();
            loginData.tag_json['paper'] = data.msgs['peper'];

            // theWS.callSendWs('update');  如果'interact'和'paper'不好傳 可改用'update'

            showNotice('成功與 '+others[data.from][0]+'互換紙條！');
        }else{
            refresh_after_change(data.from), refresh_after_change(data.hidden);
        }
        var text = '<span class="a-point">'+others[data.hidden][0]+'</span> 和 <span class="a-point">'+others[data.from][0]+'</span> 成功交換了紙條。';
        theUI.showSys(text);
        theUI.scrollToNow();
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');

        function refresh_after_change(uuid){
            if (!0 === [2,3].includes(loginData.tag_json['interact'][uuid]))
                loginData.tag_json['interact'][uuid] = 0;
            else if (!0 === [5,6].includes(loginData.tag_json['interact'][uuid]))
                loginData.tag_json['interact'][uuid] = 4;
            refreshGameTag(uuid);
        }

    }else if (4 === data.tag){
        loginData.tag_json['interact'][data.from] = 6, refreshGameTag(data.from);
        var text = '<span class="a-point">'+others[data.from][0]+'</span>想與你配對！';
        theUI.showSys(text);
        theUI.scrollToNow();
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');

    }else if (5 === data.tag){
        var text = '<span class="a-point">'+others[data.hidden][0]+'</span> 和 <span class="a-point">'+others[data.from][0]+'</span> 已成功配對，';
        var text2;
        var msg_li = [];
        if (!0 === data.msgs){
            text2 = '槍手已被找到！';
            msg_li.push(text+text2);
            var winText = (!0 === [data.hidden, data.from].includes(loginData.uuid))? '遊戲勝利！': '遊戲失敗，你未能領先其他人找到槍手。';
            msg_li.push(winText);
        }else{
            text2 = '兩人都不是槍手，目前槍手還混在玩家之中。';
            msg_li.push(text+text2);
        }

        var dialogs = msgs_li.map(msg => [msg, !1, 'a']);
        theUI.showStoryAsync(dialogs, interval=0);
        theUI.scrollToNow();
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');

        if (loginData.uuid === data.hidden){
            loginData.tag_int = 3, loginData.tag_json['interact'][data.from] = 7, refreshGameTag(data.from);
            showNotice('與 '+others[data.from][0]+' 成功配對。 已建立房間，等待中...');
            theWS.callSendWs('enter_match');
        }else{
            refresh_after_accept(data.from), refresh_after_accept(data.hidden);
        }
        function refresh_after_accept(uuid){
            loginData.tag_json['interact'][uuid] = 7;
            refreshGameTag(uuid);
        }
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

var GAMETITLE = '作弊遊戲',
    gameGate = gameCheckGate(),
    self = [],
    others = {},
    position = {},
    hasBound_replyMethod = !1
    
$(document).ready(function(){
    loadRoleData(), bindGameMsgSend();  // load the data about role respectively and establish the variable: self, others, position
})

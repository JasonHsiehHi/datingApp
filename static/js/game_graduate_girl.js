var gameCheckGate = function(){
    function pla(isDirected=true){
        var li;
        for(let [key, value] of Object.entries(onoff_dict)){
            (value === 1) && li.push(key);
        }
        var name_list = li.map(uuid => loginData.player_dict[uuid][0]);
        var dialog = ['<span class="a-point">'+name_list.join(",")+ '</span>加入遊戲', !1]
        (!0 === isDirected) && theUI.showSys(dialog[0]);
        return dialog
        
    }
    function mat(isDirected=true){
        var li = [...loginData.player_list];
        li.remove(loginData.uuid);
        var name_list = li.map(uuid => loginData.player_dict[uuid][0]);
        var dialog = ['<span class="a-point">'+name_list.join(',')+'</span> 已進入房間', !1]
        (!0 === isDirected) && theUI.showSys(dialog[0]);
        return dialog
    }

    function clu(){  // 刪掉 直接在onmessage時顯示並存入gameLogs即可
        // 用於呈現當前其他人提供給偵探的線索 都是匿名
        // 會由偵探的tag.json['clue']中要資料 且每一筆都會分開呈現 
        // 之後會存在localStorage.gameLogs中
        var dialog;
    }

    function eve(){
        // 同時存入sidebar中
        // 想intro和tutor一樣 接在greet之後 不需要決定由誰來講 dialog[0], dialog[1]
        // 由loginData.event_content取用
        var dialog;
    }

    function rol(){
        // 只有你的角色可以看到的資料 你是誰? 做了什麼? 需要做什麼?
        // 針對不同角色(group)的介紹：提供線索與調查 / 審問與推理
        var dialog;
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    var li = data['dialogs'];
                    li.splice();  // 還沒想要要插哪裡 eve rol 可以插進去 因為同一個角色不會變 
                    theUI.showStoryAsync(li), theUI.storeChatLogs(li, li.length, 'gameLogs')
                }else{
                    showNoticeModal(data['msg']);
                }
            },
            error: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    }

    return {
        player:pla,
        matcher:mat,
        clue:clu,
        event:eve,
        role:rol,
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
        for (let i=0;i<position.length;i++)
            formArray[i]['name'] = $('#player-'+(i+1).toString()).data('uuid');
        $.ajax({
            type: 'POST',
            url: '/chat/start_game/graduate_girl/deduce',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    // 一定要到後端 因為前端不知道 最終結果前端可以知道 因為本來就要回傳遊戲結果

                    // data['over'] 猜到渣男 遊戲結束 全員退出但保留畫面 theWS.callLeaveGame(user_id) player_id為全部人員
                    // data['out'] 為一種player_list 如果為空則表示無人出局 用theWS.callLeaveMatch(user_id)  
                    
                    // 將loginData.onoff_dict更新到最新 之後用refreshPlayers
                    // theWS.callMakeOut() 把人趕走
                    // 最後要做theWS.callInform() 遊戲結束！ 或 嫌疑人出局... 通知其他玩家結果

                    // 會更新tag_json和tag_int 因為涉及所有人 故最後要做結果通知
                    // 最簡單的方法就是每一輪結束後 多要進行網頁重整 可以寫在theWS.callMakeOut()之中 無論有沒有成功趕人都要做

                    refreshStatus(loginData.status), refreshGameStatus(1, loginData.status);
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
        for (let name of eventNameSet){
            $('.gameevent-options').append("<option value="+name+">");
        }
    }

    setOptions();

    for (let i=1; i<loginData.onoff_dict.length; i++){
        $('#player-'+i.toString()+'-deduce-input').on('change',function(a){
            seletedEvent[$(this).attr('name')] = $(this).val();
            var set = new Set(eventNameSet);
            for (let opt of Object.values(seletedEvent))
                set.delete(opt);
            for (let name of set)
                $('.gameevent-options').not(this).append("<option value="+name+">");
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
                    // 偵探 tag_json要做紀錄
                    theWS.callSendWs('enter_match');
                    showNoticeModal('已建立房間 等待中...'), theUI.showSys('等待對方回應...');
                }else{
                    showNoticeModal(data['msg']);
                    // 對方無法拒絕 但要考慮剛好離線問題
                }
            },
            error: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
            url: '/chat/start_game/graduate_girl/clue'+ player_uuid,
            data: formArray,
            dataType: "json",
            success: function(data) {
                // 更新 tag_int
                // theWS.callSendWs 通知偵探
                // 最後顯示在gameLogs中 因為每次都會有多個人提供線索 怕sidebar太凌亂
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
        $('#inquire-modal-form .modal-body p:eq(0)').text('是否確定調查'+ loginData.player_dict[player_uuid][0]+'('+loginData.player_dict[player_uuid][2]+')?');
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
                    // 更新 tag_int
                    // 存入自己的sidebar
                }else{
                    $('#inquire-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#inquire-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
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
            $(css_id+'-deduce').find('label').text(name+' '+sub);
        }else{  // self[3] === 0
            if(group === 1){
                $(css_id+'-btn').text('線索')
            }else{
                $(css_id+'-btn').text('調查'), inquireMethod(css_id+'-btn', uuid);
                // tag_int 0 表示都沒有 1為已調查 2為已提供線索
            }
        }
        i++;
    }

    // localData.position = position, localStorage.position = JSON.stringify(position);
    
    if (self[3] === 1){
        $('#start-btn').text('推 理'), deduceMethod();
        refreshGameStatus(1, loginData.status);
    }else{ // self[3] === 0

        $('#start-btn').text('行 動').attr('disabled', true);
        refreshGameStatus(0, loginData.status);
    }

}

function refreshGameStatus(self_group, status){
    // 補助chatroom.js的refreshStatus來控制行動鍵與互動鍵 每一輪推理完也要更新
    // 只在遊戲中的status2或status3中處理行動鍵與互動鍵 且依據不同角色而有所不同

    // 每次進入match (成功執行examine)後 refresh loginData.tag_json (用來記錄誰被審問過)
    // 嫌疑人每次傳訊息 (成功執行'提供線索')後 refresh loginData.tag_int (用來紀錄自己是否做過)
    
    // gameGate.prolog()用來顯示遊戲劇情並存入localStorage中 便不再用prolog取資料 每次直接執行且劇情無延遲
    // 取得資料後要用theUI.showStoryAsync()來做 僅在status 2 進行
    // 將gameevent補足在story之後 並貼在gameevet的<div>中
    // 一開始就會存入localStorage 差別在於之後不用要資料 故只有剛進去後的第一次會有劇情延遲 之後都不會有 用if判別
    
    refreshPlayers();
    switch (status){ 
        case 2:
            for (let uuid in position)
                (1 === loginData.onoff_dict[uuid]) && enabledElmtCss(position[uuid]+'-btn');
            setNavTitle('LARP劇本：<span class="a-point">'+ GAMETITLE +'</span>');

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
            for (let uuid in position)
                (1 === loginData.onoff_dict[uuid]) && disabledElmtCss(position[uuid]+'-btn');
            setNavTitle('審問中... 剩餘時間：<span class="a-point a-clock"></span>');

            if (localData.chatLogs.length !== 0){
                var isMore = theUI.loadChatLogs('chatLogs');  
                (!0 === isMore) && appearElmtCss('#show-more');  //todo 完成'顯示更多'UI和功能
            }
            theUI.showSys('房間剩餘時間: <span class="a-clock a-point"></span>'), theUI.showClock(); // todo showClock改用倒數
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
                $(css_id).find('.a-title').attr('data-bs-original-title', name + '(離線)');
                disabledElmtCss(css_id+'-btn');
                break;
            case 1:
                ($(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').removeClass('a-off');
                $(css_id).find('.a-title').attr('data-bs-original-title', name);
                enabledElmtCss(css_id+'-btn');
                break;
            case -1:
                (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
                $(css_id).find('.a-title').attr('data-bs-original-title', name + '(已退出)');
                $(css_id).find('.a-circle').text('');
                disabledElmtCss(css_id+'-btn');
                break;
        }
    }
}

function refreshGameSingle(self_group, player_css, player_type){  // to refresh other one player status
    // only used in websocket.onmessage
    if (self_group === 1){
        switch (player_type){
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
    }else{

    }

}


var GAMETITLE = '畢業後的第一夜',
    eventNameSet = new Set(loginData['event_name']),
    seletedEvent = {},
    gameGate = gameCheckGate(),  // 輸出遊戲相關的dialog
    self = [],
    others = {},
    position = {}
    
$(document).ready(function(){
    // bind method or methodSet according to role
    loadRoleData();  // load the data about role respectively and establish the variable: self, others, position

    // 除了load之後 也要做故事情節dialog 放在loadRoleData中的refreshGameStutus中 
    // 等劇本生成完成後 再像chatroom的GREET一樣來要dailog資料 還有最後的gameevent
})

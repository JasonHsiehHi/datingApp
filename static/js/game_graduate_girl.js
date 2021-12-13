// game_{gamename}.js可以自行選擇互動鍵與行動鍵 使用彈出modal或直接執行

function gameroomWS(){  // 遊戲中專用websocket 取代chatroomWS 
    // 可能不需要一個專用的websocket 因為所咬執行的都是固定方法 enter_match, leave_match等等
    if (null===chatSocket){
        var wsUrl = 'ws://'+window.location.host+'/ws/chat/'; 
        if (!window.WebSocket){  // todo 改用protocols_whitelist替代
            console.log('瀏覽器版本不支援或已關閉websocket功能');
            return false
        }
        chatSocket = new WebSocket(wsUrl);
        chatSocket.onopen = function(){
            console.log("WS connected.");
        }
        chatSocket.onclose = function(e) {
            console.log('WS disconnected. code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            (!1===loginData.isBanned) && setTimeout(gameroomWS, 15000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };
    }
}

var gameWSManager = function(){ // 在chatroom執行就好
    function cem(){
        chatSocket.send(JSON.stringify({
            'call':'enter_match'
        }))
    }

    function clm(){
        chatSocket.send(JSON.stringify({
            'call':'leave_match'
        }))
    }
    return {
        callEnterMatch:cem,  // 在chatroom執行就好
        callLeaveMatch:clm,  // 在chatroom執行就好
    }
}

var gameCheckGate = function(){ // 與 checkGate()寫法相同 但針對不同遊戲而有所不同故寫於此

    return {
        
    }
}



function deduceMethod(){  // 在$(document).ready中判斷 role 只有group ==1才要
    $("#start-btn").on('click',function(e){
        if (loginData.status !== 2)  // status是否全部交由loadstatus來管理 不需要放在各個click
            return false
        $("#deduce-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('推理環節')
        $('#modal').modal('show');
    })

    $("#deduce-modal-form").on('submit',function(e){
        e.preventDefault();
        
        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    // 一定要到後端 因為前端不知道 最終結果前端可以知道 因為本來就要回傳遊戲結果

                    // data['over'] 猜到渣男 遊戲結束 全員退出但保留畫面 theWS.callLeaveGame(user_id) player_id為全部人員
                    // data['out'] 為一種player_list 如果為空則表示無人出局 用theWS.callLeaveMatch(user_id)  
                    
                    // 將loginData.onoff_dict更新到最新 之後用refreshPlayers
                    // theWS.callMakeOut() 把人趕走
                    refreshPlayers();
                    refreshStatus(), refreshGameStatus();
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    $('#deduce-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#deduce-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    for (let gameEvent of gameEventSet){
        $('#gameevent-options').append("<option value="+gameEvent+">");
    }
}

function examineMethod(css_id, player_uuid){
    $(css_id).on('click',function(e){
        e.preventDefault();

        if (loginData.status !== 2)
            return false
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/' + player_uuid.toString(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.status = 3, refreshStatus(), refreshGameStatus();
                    showNoticeModal(data['msg']);
                    uuid_list = [data['result']], theWS.callEnterMatch(uuid_list);
                    // 針對不同劇本且特定角色才有的標記 例如偵探要全部都訪問完 Player 增加tag_int
                }else{
                    showNoticeModal(data['msg']);
                    // 對方無法拒絕 但要考慮剛好離線問題 用data['result']===false返回
                }
            },
            error: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function loadRoleData(){
    self = loginData.player_dict[loginData.uuid], localData.self = self, localStorage.self = JSON.stringify(self);
    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];
    $('#user-role').text( '('+self[2]+')' );

    var position = {};
    var i = 1, css_id, name, sub, gender, group;
    for (let uuid in others){
        css_id = '#player-' + i.toString();
        name = others[uuid][0], gender = (others[uuid][1]==='m')? 'a-male':'a-female', sub = '('+others[uuid][2]+')', group = others[uuid][3];
        $(css_id).removeClass('d-none');
        $(css_id).find('.a-circle').addClass(gender).text(name[0]);
        $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name);
        $(css_id).find('.a-sub').text(sub);
        position[uuid] = css_id;
        if (self[3] === 1){
            $(css_id+'-btn').text('審問'), examineMethod(css_id+'-btn', uuid);
            $(css_id+'-deduce').removeClass('d-none');
            $(css_id+'-deduce').find('label').text(name+' '+sub);
        }else{  // self[3] === 0
            (group === 0) && $(css_id+'-btn').addClass('d-none');
        }
        i++;
    }
    
    if (self[3] === 1){
        $('#start-btn').text('推 理'), deduceMethod();
        refreshGameStatus(1);
    }else{ // self[3] === 0
        $('#start-btn').attr('disabled', true);
        refreshGameStatus(0);
    }
    localData.position = position, localStorage.position = JSON.stringify(position);
    refreshPlayers(); // refresh player's onoff status
}


function refreshGameStatus(self_group){
    // 補助chatroom.js來控制互動鍵 每一輪推理完也要更新
    // 每次進入match (成功執行examine)後 refresh loginData.tag_json (用來記錄誰被審問過)
    // 嫌疑人每次傳訊息 (成功執行'提供線索')後 refresh loginData.tag_int (用來紀錄自己是否做過)

    // 此外也使用loginData.status來 enable/disable player-i btn
    // 只在遊戲中的status2或status3中處理行動鍵與互動鍵 且依據不同角色而有所不同
    if (self_group === 1){
        switch (loginData.status){ 
            case 2:
                enabledElmtId('start-btn')
                break;
            case 3:
                disabledElmtId('start-btn')
                break;
        }
    }else{


    }

}

var chatSocket = null,  // 改用gameWS 刪掉 同樣用chatroomWS就好
    gameWS = gameWSManager(),  // 用 WSManager就好
    gameGate = gameCheckGate(),  // 輸出遊戲相關的dialog
    self = [],
    others = {},
    gameEventSet = new Set([
    ])

$(document).ready(function(){
    // bind method or methodSet according to role
    loadRoleData();  // load the data about role respectively and establish the variable: self, others 

    
    // 加上loginUserid 用以判定身份 加上group self[3] 用以表示playerdict的顯示方式
    // 行為鍵與互動鍵都在JS做生成 因為必須配合角色與玩家人數 每人都不同

    // 除了load之後 也要做故事情節dialog 放在loadRoleData中的refreshGameStutus中 
    // 等劇本生成完成後 再像chatroom的GREET一樣來要dailog資料 還有最後的gameevent
})

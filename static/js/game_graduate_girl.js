// game_.js可以自行選擇是否彈出modal或直接執行
// UI加上 互動鍵 行動鍵 並把遊戲開始鍵隱藏

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
            (!1===localData.isBanned) && setTimeout(gameroomWS, 15000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };

        chatSocket.onmessage = function(e) {

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

var gameCheckGate = function(){

    return {
        
    }
}



function deduceMethod(){  // 在$(document).ready中判斷 role 只有group ==1才要
    $("#start-btn").on('click',function(e){
        if (localData.status !== 2)  // status是否全部交由loadstatus來管理 不需要放在各個click
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
                    
                    // 接者就可以用delete localData.player_dict[user_id], 存入localStorage
                    refreshPlayerDict() // 更新玩家名單 如果是其他玩家單獨離開或上下線 則使用其他refreshOnOff
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

        if (localData.status !== 2)
            return false
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/graduate_girl/' + player_uuid.toString(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    localData.status = 3, localStorage.status = '3', refreshStatus(), refreshGameStatus();
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
    self = localData.player_dict[loginData.uuid], localData.self = self, localStorage.self = JSON.stringify(self);
    others = JSON.parse(JSON.stringify(localData.player_dict)), delete others[loginData.uuid];

    var i = 1, css_id, sub, gender;
    for (let uuid of others){
        css_id = '#player-' + i.toString(), sub = '('+others[uuid][1]+')', gender = (others[uuid][2]==='m')? 'a-male':'a-female';
        $(css_id).removeClass('d-none');
        $(css_id).find('.a-title').text(others[uuid][0]).attr('data-bs-original-title', others[uuid][0]);
        $(css_id).find('a.a-sub').text(sub), $(css_id).find('.a-circle').addClass(gender);
        if (self[3] === 1){
            $(css_id+'-btn').text('審問'), examineMethod(css_id+'-btn', uuid);
            $(css_id+'-deduce').removeClass('d-none');
            $(css_id+'-deduce').find('label').text(others[uuid][0]+' '+sub);
        }else{  // self[3] === 0
            (others[uuid][3] === 0) && $(css_id+'-btn').addClass('d-none');
        }
        i++;
    }
    if (self[3] === 1){
        $('#start-btn').text('推 理'), deduceMethod();
    }else{ // self[3] === 0
        $('#start-btn').attr('disabled', true);

    }
}

function refreshPlayerDict(){
    // 互動鍵與行動鍵都需要綁status才能進行 如此才不會有太多例外
    // 有人離線或有人離開遊戲都要處理 由chatroom的onmessage通知 直接把離開的元素player-i用離開即可 
    // 一樣用a-off的顏色 但從'離線'換成'退出'
}
function refreshPlayer(){
    // 單一玩家上下線或離開時更新
}

function refreshGameStatus(){
    // 補助chatroom.js來控制互動鍵 每一輪推理完也要更新

}

var chatSocket = null,  // 改用gameWS 刪掉 同樣用chatroomWS就好
    gameWS = gameWSManager(),  // 用 WSManager就好
    gameGate = gameCheckGate(),  // 輸出遊戲相關的dialog
    self = [],
    others = {},
    gameEventSet = new Set([
    ])

$(document).ready(function(){
    loadRoleData();  // establish variable: self, others 

    // 除了load之後 也要做故事情節dialog 
    // 加上loginUserid 用以判定身份 加上localData.group 用以表示playerdict的顯示方式
    // 行為鍵與互動鍵都在JS做生成 因為必須配合角色與玩家人數 每人都不同
    // 等劇本生成完成後 再像chatroom 的 GREET一樣來要dailog資料 還有最後的gameevent
    // 全部由game.loadPlayerDict()執行 會執行所有的安裝
})

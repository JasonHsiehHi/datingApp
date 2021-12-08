function chatroomWS(){
    if (null===chatSocket){
        var wsUrl = 'ws://'+window.location.host+'/ws/chat/'; 
        if (!window.WebSocket){  // todo 改用protocols_whitelist替代
            console.log('瀏覽器版本不支援或已關閉websocket功能');
            return false
        }
        chatSocket = new WebSocket(wsUrl);

        chatSocket.onopen = function(){
            console.log("WS connected.");
        };

        chatSocket.onclose = function(e) {
            console.log('WS disconnected. code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            (!1===loginData.isBanned) && setTimeout(chatroomWS, 15000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };
        // todo 增加開頭畫面：可篩選不符合條件的瀏覽器 另外流量超載就自動斷線

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            console.log('receive: '+ data.type);
            if (3 === localData.status){  // 移到gameroomWS
                switch (data.type){
                    case typeSet.wn:  // 已經沒有typeSet了 直接用'WN'即可
                        if (localData.name!==data.sender){
                            theUI.showWritingNow(data.wn);
                        }
                        break;
                    case typeSet.st:
                        if(localData.name===data.receiver){
                            while(term.emlt_for_status.length>0){
                                var elmt = term.emlt_for_status.pop();
                                theUI.showStatus(elmt, data.num);
                            }
                        }
                        break;
                    case typeSet.msg:
                        if(localData.name!==data.sender){
                            (data.isImg)?(theUI.showImg(data.msg), theUI.storeChatLogs(term.showImg_text)):(theUI.showMsg(data.msg), theUI.storeChatLogs(term.showMsg_text));
                            theWS.statusRespWs(data.sender);  // 接收到訊息後回傳
                        }
                        break;
                    case typeSet.msgs:
                        if(localData.name!==data.sender){ 
                            theUI.showMsgsAsync(data.msgs, 0, function(){
                                theUI.storeChatLogs(term.showMsgs_text, data.msgs.length);  //async方法:必須在執行完後才做storeChatLogs
                                delete term.showMsgs_text;
                            });
                            theWS.statusRespWs(data.sender);  // 接收到訊息後回傳
                        }   
                        break;
                    case typeSet.discon:
                        if(localData.name!==data.sender){ 
                            toggle.discon = !0;
                        }
                        break;
                    case typeSet.conn:
                        if(localData.name!==data.sender){ 
                            toggle.discon = !1;
                            if(localData.text_in_discon.length>0){
                                theWS.msgsSendWs(localData.text_in_discon);
                                localData.text_in_discon=[],localStorage.text_in_discon='[]';
                            }
                        }
                        break;
                    case typeSet.leave:
                        localData.status = 0, localStorage.status = '0';
                        // todo 返回房間外或等待房都加上dialog 故會訪問資料庫 anonName變更回管理員 refreshProfile()
                        theUI.clearChatLogs();
                        if (localData.name===data.sender){
                            theUI.showSys('你已離開<span class="a-point">'+localData.anonName+'</span>');
                            setTimeout(function(){
                                theUI.showSys('/match即可開始下一次的配對，或用/goto前往其他學校。')
                            },200)
                        }else{
                            theUI.showSys('對方已離開你');
                            setTimeout(function(){
                                theUI.showSys('/match開始下一次的配對，或用/goto前往其他學校。')
                            },200)
                        }
                        break;
                    case typeSet.error:
                        console.log(data.error);
                        break;
                }
            }else{
                switch (data.type){ 
                    case 'START':
                        localData.player_dict = data['player_dict'], localStorage.player_dict = JSON.stringify(data['player_dict']);
                        localData.onoff_dict = data['onoff_dict'], localStorage.onoff_dict = JSON.stringify(data['onoff_dict']);
                        localData.status = 2, localStorage.status = '2';
                        $('#modal').modal('hide'), showNoticeModal(data['msg']);
                        $('#modal').on('hide.bs.modal', function(e) { window.location.href = "/chat/start_game/"+data['game']; });
                        break;

                    case 'ENTER':
                        localData.status = 3, localStorage.status = '3', refreshStatus(), refreshGameStatus();
                        $('#modal').modal('hide'), showNoticeModal(data['msg']);
                        break;
                
                    case 'LEAVE':
                        localData.status = 2, localStorage.status = '2', refreshStatus(), refreshGameStatus();
                        data['from']
                        $('#modal').modal('hide'), showNoticeModal(data['from']+data['msg']);
                        break;

                    case 'OUT':
                        localData.status = 1, localStorage.status = '1'
                        $('#modal').modal('hide'), showNoticeModal(data['from']+data['msg']);
                        $('#modal').on('hide.bs.modal', function(e) { window.location.href = "/chat"; });
                        break;
                }
            }
        };
    }
}


var WSManager = function(){
    function ms(msg, isImg=false){
        if(!1===toggle.discon){
            chatSocket.send(JSON.stringify({  //todo: 傳訊息時觸發onerror 而webSocket突然自動關閉
                'msg':msg,
                'isImg':isImg
            }))
        }else{
            localData.text_in_discon.push([msg,isImg]), localStorage.text_in_discon = JSON.stringify(localData.text_in_discon);
        }
        var elmt;
        (isImg) ? (elmt = theUI.showSelfImg(msg), theUI.storeChatLogs(term.showSelfImg_text)):(elmt = theUI.showSelfMsg(msg), theUI.storeChatLogs(term.showSelfMsg_text));
        theUI.showStatus(elmt,1);
        term.emlt_for_status.push(elmt);
    }
    function mss(msg_list){ //  the matcher is disconnected, so send mag_list instead of msg in next connection.
        if(!1===toggle.discon){
            chatSocket.send(JSON.stringify({
                'msgs':msg_list
            }))
        }
    }
    function st(sender,num=2){
        if(!1===toggle.discon){
            chatSocket.send(JSON.stringify({
                'st':num,
                'from':sender
            }))
        }
    }
    function wn(isWriting){
        if(!1===toggle.discon){
            isWriting = isWriting?!0:!1;
            chatSocket.send(JSON.stringify({
                'wn':isWriting
            }))
        }
    }

    function csg(){
        chatSocket.send(JSON.stringify({
            'call':'start_game'
        }))
    }

    function clg(uuid_list=null){  // uuid_list表示令對方離開 而empty表示自己離開
        // 在後端仍需檢驗資料的正確性
        (uuid_list===null) && (uuid_list = []);
        chatSocket.send(JSON.stringify({
            'call':'leave_game',
            'players': uuid_list
        }))
    }
    function cem(uuid_list){  // uuid_list不可為空 一定要有對象
        chatSocket.send(JSON.stringify({
            'call':'enter_match',
            'players': uuid_list
        }))
    }
    function clm(uuid_list=null){
        (uuid_list===null) && (uuid_list = []);
        chatSocket.send(JSON.stringify({
            'call':'leave_match',
            'players': uuid_list
        }))
    }

    return{
        msgSendWs:ms,
        msgsSendWs:mss,
        statusRespWs:st,
        writingNowWs:wn,
        callStartGame:csg,
        callLeaveGame:clg,
        callEnterMatch:cem,
        callLeaveMatch:clm,
    }
}

function getLocalData(){
    var data = {
        name: '取個暱稱吧',
        school: '',  // 改掉 school改成city
        status: 0,
        lastSaid: 'sys',
        anonName: '',
        waiting_time: '',
        text_in_discon: [],
        imgUrl_adult: '',
        player_dict: {},
        onoff_dict: {},
        self: [],
        chatLogsNum: 0,  // 改掉 不需要那摸複雜
        chatLogsMaxNum: 250  // 改掉 不需要那摸複雜
    };

    for (let i = 0;i<5;i++)
        data['chatLogs'+i.toString()] = '';  // 改掉 不需要那摸複雜

    if ('undefined' !== typeof(Storage)){
        if ('true'===localStorage.isSaved){ 
            data.name = localStorage.name,
            data.school = localStorage.school,
            data.status = +localStorage.status,
            data.lastSaid = localStorage.lastSaid,
            data.anonName = localStorage.anonName,
            data.waiting_time = localStorage.waiting_time,
            data.text_in_discon =  JSON.parse(localStorage.text_in_discon),
            data.imgUrl_adult = localStorage.imgUrl_adult,
            data.player_dict = JSON.parse(localStorage.player_dict),
            data.onoff_dict = JSON.parse(localStorage.onoff_dict),
            data.self = JSON.parse(localStorage.self),
            data.chatLogsNum = +localStorage.chatLogsNum,
            data.chatLogsMaxNum = +localStorage.chatLogsMaxNum 
            for (let i = 0;i<5;i++)
                data['chatLogs'+i.toString()] = localStorage['chatLogs'+i.toString()]
        }else{
            localStorage.isSaved = 'true',
            localStorage.name = '取個暱稱吧',
            localStorage.school = '',
            localStorage.status = '0',
            localStorage.lastSaid = 'sys',
            localStorage.anonName = '',
            localStorage.waiting_time = '',
            localStorage.text_in_discon = '[]',
            localStorage.imgUrl_adult = '',
            localStorage.player_dict = '{}',
            localStorage.onoff_dict = '{}',
            localStorage.self = '[]',
            localStorage.chatLogsNum = '0',
            localStorage.chatLogsMaxNum = '250'
            for (let i = 0;i<5;i++)
                localStorage['chatLogs'+i.toString()] = ''
            
        }
    }else{
        console.log('瀏覽器不支援或已關閉Storage功能，無法離線保留聊天記錄。');
    }
    return data
}

function getTermData(){
    var term = {
        name:'',
        schoolId:'',
        showSelfMsg_text:'',
        showMsg_text:'',
        showSelfImg_text:'',
        showImg_text:'',
        showSys_text:'',
        showMsgs_text:'',
        emlt_for_status:[],
        timerId_clock: null,
        timerId_writing: null,
        next_modal:!1,
        next_msg:''
    };
    return term
}
function getToggle(){
    var toggle = {
        writing:!1, // 為避免input欄多次重複輸入
        uploading:!1, // 為避免圖片檔多次重複上傳
        click:!1, // 為避免多次重複點擊
        focus:!1, // 表示focus正在input欄
        scroll:!1, // 表示捲軸正在滾動
        text:!0, // todo 當出現bootbox時 離線後上線是否還要停留在bootbox
        discon:!1,  // 表示對方斷線 重連時直接從後端抓取資料
        problem:!1, // todo 表示自己網路出現問題 會跟開頭畫面一起使用
        first:!0
    };
    return toggle
}

function appearElmtId(elmt_id){
    ($('#'+elmt_id).hasClass('d-none')) && $('#'+elmt_id).removeClass('d-none');
}
function disappearElmtId(elmt_id){
    (!$('#'+elmt_id).hasClass('d-none')) && $('#'+elmt_id).addClass('d-none');
}

function disabledElmtId(elmt_id){
    (void 0 === $('#'+elmt_id).attr('disabled')) && $('#'+elmt_id).attr('disabled', true);
}
function enabledElmtId(elmt_id){
    (void 0 !== $('#'+elmt_id).attr('disabled')) && $('#'+elmt_id).removeAttr('disabled');
}

function loadLocalData(){  // loadLocalData just do theUI work
    refreshProfile(), refreshStatus();
    theUI.gotoSchoolAsync();  // 在db加一個'輸入城市名'的選項 即可
    $('#send-text').focus();
}

function loadLoginStatus(){ 
    if (!0 === loginData.isLogin){
        (localData.status === 0 || localData.status === 1) && chatroomWS(); // 之後修掉 login和local要互相獨立
        appearElmtId('user-info'), appearElmtId('logout-btn'), appearElmtId('change-pwd-btn');
        disappearElmtId('signup-btn'), disappearElmtId('login-btn'), disappearElmtId('reset-pwd-btn');
        $('#user-info>span:eq(0)').text(loginData.email);
        $('#user-info>span:eq(1)').text('性別:' + ((loginData.gender == 'm')?'男':'女'));
        unavailableBtn();
    }else{
        appearElmtId('signup-btn'), appearElmtId('login-btn'), appearElmtId('reset-pwd-btn');
        disappearElmtId('user-info'), disappearElmtId('logout-btn'), disappearElmtId('change-pwd-btn');
    }
    
}

function unavailableBtn(){
    if (loginData.gender==='m'){
        $('#female-radio').click(),disabledElmtId('male-radio'), disabledElmtId('female-radio');
    }else{
        $('#male-radio').click(),disabledElmtId('male-radio'), disabledElmtId('female-radio');
    }
    $('#adult-radio').click(), disabledElmtId('adult-radio'), disabledElmtId('normal-radio');
}


function refreshProfile(){
    // old 只有navbar部分
    $('.navbar-text.a-font>.a-matcher').text(localData.anonName);
    $('.navbar-text.a-font>.a-self').text(localData.name);

    /*
    if (''!==localData.matchType){
        var self = ('m'===localData.matchType[0])?'man':'woman';
        var matcher = ('m'===localData.matchType[1])?'man':'woman';
        var inRoom = (localData.status === 3)?'graphic_eq':'keyboard_arrow_right';
        $('.navbar-text.a-type .material-icons:eq(0)').text(self);
        $('.navbar-text.a-type .material-icons:eq(1)').text(inRoom);
        $('.navbar-text.a-type .material-icons:eq(2)').text(matcher);
    }
    */

    // 增加sidebar部分的更新
    var school_name = localData.school+' '+schoolSet[localData.school];
    $('#school').text(school_name), $('#school').attr('data-bs-original-title', school_name);
    $('#user-tag').text(localData.name[0]);
    $('#user-name').text(localData.name), $('#user-name').attr('data-bs-original-title', localData.name);   
}

function refreshStatus(){  // deal with all UI work about status
    switch (localData.status){  // 太多冗言 改用if...else...
        case 0:
            enabledElmtId('goto-btn'), enabledElmtId('name-btn');
            enabledElmtId('normal-radio'), enabledElmtId('adult-radio'), enabledElmtId('male-radio'), enabledElmtId('female-radio');
            enabledElmtId('start-btn'), $('#start-btn').text('開始遊戲');
            disabledElmtId('leave-btn');
            disappearElmtId('player-list'), appearElmtId('player-empty');
            
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);
            break;
        case 1:
            disabledElmtId('goto-btn'), disabledElmtId('name-btn');
            disabledElmtId('normal-radio'), disabledElmtId('adult-radio'), disabledElmtId('male-radio'), disabledElmtId('female-radio');
            disabledElmtId('start-btn'), $('#start-btn').text('等待中...');
            enabledElmtId('leave-btn');
            disappearElmtId('player-list'), appearElmtId('player-empty');
            theUI.clearChatLogs();
            (0!==localData.waiting_time.length)&&(theUI.showSys('等待時間: <span class="a-clock a-point"></span>'),theUI.showClock(localData.waiting_time));
            // theUI.showClock變為NaN:NaN (safari)
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);
            break;
        case 2:
            disabledElmtId('goto-btn'), disabledElmtId('name-btn');
            disabledElmtId('normal-radio'), disabledElmtId('adult-radio'), disabledElmtId('male-radio'), disabledElmtId('female-radio');
            enabledElmtId('start-btn'), $('#start-btn').text('行 動');
            enabledElmtId('leave-btn');
            disappearElmtId('player-empty'), appearElmtId('player-list');
            
            // 改掉
            theUI.clearChatLogs();
            theUI.showSys('==========<span class="a-point">配對遊戲：共5題</span>==========');
            theUI.showMsg('以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對<span class="a-point">測試結果相近者進行配對</span>。');

            break;

        case 3:
            disabledElmtId('goto-btn'), disabledElmtId('name-btn');
            disabledElmtId('normal-radio'), disabledElmtId('adult-radio'), disabledElmtId('male-radio'), disabledElmtId('female-radio');
            disabledElmtId('start-btn'), $('#start-btn').text('行 動');  // game_{gamename}.js會再將行動鍵改為符合遊戲內容的名稱
            enabledElmtId('leave-btn');
            disappearElmtId('player-empty'), appearElmtId('player-list');
            
            theUI.loadChatLogs(30);  //todo '顯示更多'功能
            theUI.showSys('你與<span class="a-point">'+localData.anonName+'</span>待在一起');
            // todo 重開只會顯示最後十行 其餘要點擊顯示更多 (必須要能夠辨識chatLog之中的元素個數)
            break;
    }
}

function refreshGameStatus(){  // will be overloaded by game_{gamename}.js
    console.log("you haven't been in game.")
}

function bindMsgSend() {
    $("#send-text").on('keypress',function(a){
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();  
            (void 0 !== text && null !== text &&'' !== text) && (text.match(/(\/[a-zA-Z@1-9]+)/i)? theTerminal.command(text) : (3 === localData.status) ? theWS.msgSendWs(text) : theUI.showSys('你還未與其他人配對哦! 目前只能使用指令！'));
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }
    })
    $("#send-text").on('input',function(a){
        if (3 === localData.status && !1 == toggle.writing){
            theWS.writingNowWs(!0), toggle.writing = !0;
        }
        (null !== term.timerId_writing) && clearTimeout(term.timerId_writing);  // 當時間超過10秒再發送 theWS.writingNowWs(!1)
        term.timerId_writing = setTimeout(function(){theWS.writingNowWs(!1)},10000);
    })
    $("#send-text").on('focus',function(a){
        toggle.focus = !0;
        theUI.scrollToNow(), theUI.unreadTitle(!0);
    })
    $("#send-text").on('blur',function(a){
        toggle.focus = !1;
        if (3 === localData.status && !0 == toggle.writing){
            theWS.writingNowWs(!1), toggle.writing = !1;
        }
    })
    $("#send-btn").on('click',function(a){
        a.preventDefault();
        var e = $.Event("keypress");
        e.which = 13, $("#send-text").trigger(e);
        $("#send-text").focus();
    })
}

function showNoticeModal(msg){
    $("#notice-modal-form").removeClass('d-none');
    $('#modal .modal-title').text('通知');
    $('#notice-modal-form .modal-body p').text(msg);
    $('#modal').modal('show');
}

function bindModalHide(){
    $('#modal').on('hidden.bs.modal', function(e) {
        $('#modal').find('form').each(function(a){
            (!$(this).hasClass('d-none')) && $(this).addClass('d-none');
        });
        $('#modal .a-error').text('');
        (!0 === term.next_modal) && (showNoticeModal(term.next_msg), term.next_modal=!1);
    });
}

function loginMethodSet(){
    var modalName = {
        'signup':'註冊信箱',
        'login':'登入',
        'logout':'登出',
        'change-pwd':'變更密碼',
        'reset-pwd':'重置密碼'
    }
    for (let prop in modalName){
        $("#"+prop+"-btn").on('click',function(a){
            $("#"+prop+"-modal-form").removeClass('d-none');
            $('#modal .modal-title').text(modalName[prop])
            $('#modal').modal('show');
        })
    }

    $('#signup-modal-form').on('submit', function(e) {
        e.preventDefault();
        // todo 驗證資料:email不符合標準, pwd不符合標準

        var formArray = $(this).serializeArray();
        formArray.push({name:"uuid-input",value: localData.uuid});
        formArray.push({name:"goto-input",value: localData.school});
        formArray.push({name:"name-input",value: localData.name});

        $(this).find('.modal-footer button[type="submit"]').text('等待中...').attr('disabled', true);
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: formArray,
            dataType: "json",
            success: function(data) {  
                if (!0 === data['result']){
                    term.next_modal = !0, term.next_msg = data['msg'], $('#modal').modal('hide');
                }else{
                    $('#signup-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#signup-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#signup-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            complete: function(data, code) {  
                $('#signup-modal-form button[type="submit"]').text('確定').removeAttr('disabled');
            }
        })
    })

    $('#login-modal-form').on('submit', function(e) {
        e.preventDefault();
        // todo 驗證資料
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                console.log(data['result']);
                if (!0 === data['result']){
                    for (let prep in data['player']){
                        localData[prep] = data['player'][prep], localStorage[prep] = data['player'][prep];
                    }
                    refreshProfile(), loginData.isLogin = !0, loadLoginStatus();

                    term.next_modal = !0, term.next_msg = data['msg'], $('#modal').modal('hide');
                    $('#modal').on('hide.bs.modal', function(e) {
                        (!1 === term.next_modal) && (window.location.href = "/chat");
                    });
                }else{
                    $('#login-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#login-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#login-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#logout-modal-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.isLogin = !1,loadLoginStatus();
                    term.next_modal = !0, term.next_msg = data['msg'], $('#modal').modal('hide');
                    $('#modal').on('hide.bs.modal', function(e) {
                        (!1 === term.next_modal) && (window.location.href = "/chat");
                    });
                }else{
                    $('#logout-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#logout-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#logout-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#change-pwd-modal-form').on('submit', function(e) {
        e.preventDefault();
        // 資料驗證

        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    term.next_modal = !0, term.next_msg = data['msg'], $('#modal').modal('hide');
                    $('#modal').on('hide.bs.modal', function(e) {
                        (!1 === term.next_modal) && (window.location.href = "/chat");
                    });
                }else{
                    $('#change-pwd-modal-form p.a-error').text(data['msg'])
                }
            },
            error: function(data) { $('#change-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#change-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#reset-pwd-modal-form').on('submit', function(e) {
        e.preventDefault();
        // 資料驗證

        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){  // todo 寄信需要提醒用戶等一下
                    term.next_modal = !0, term.next_msg = data['msg'], $('#modal').modal('hide');
                }else{
                    $('#reset-pwd-modal-form p.a-error').text(data['msg'])
                }
            },
            error: function(data) { $('#reset-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#reset-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
        
    })
}

function profileMethodSet(){
    var modalName = {
        'goto':'前往學校',
        'name':'遊戲暱稱'
    }
    for (let prop in modalName){
        $("#"+prop+"-btn").on('click',function(a){
            $("#"+prop+"-modal-form").removeClass('d-none');
            $('#modal .modal-title').text(modalName[prop])
            $('#modal').modal('show');
        })
    }

    $('#name-modal-form').on('submit', function(e) {
        e.preventDefault();
        var name = $(this).find('input[name="name-input"]').val();
        if (name.length>20){
            $('#name-modal-form p.a-error').text('暱稱太長了，不能超過20個字元');
            return false
        }
        var formArray = $(this).serializeArray();
        formArray.push({name:"uuid-input",value: localData.uuid});
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    localData.name = data['name'], localStorage.name = data['name'], refreshProfile();
                    theUI.showSys('名稱：<span class="a-point">'+localData.name+'</span> 已修改完畢');
                    $('#modal').modal('hide');
                }else{
                    $('#name-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#name-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#name-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#goto-modal-form').on('submit', function(e) {
        e.preventDefault();
        var schoolId = $(this).find('input[name="goto-input"]').val();
        if (schoolId === localData.school){
            $('#goto-modal-form p.a-error').text('你目前已經在'+schoolId +schoolSet[schoolId] +'了哦');
            return false
        }

        var formArray = $(this).serializeArray();
        formArray.push({name:"uuid-input",value: localData.uuid});
        $.ajax({
            type: 'POST',
            url: $(this).data('url'),
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    localData.school = data['school'], localStorage.school = data['school'], refreshProfile();
                    var school = localData.school;
                    theUI.clearChatLogs();
                    theUI.gotoSchoolAsync(function(){
                        var li = data['dialog'];
                        li.splice(0,0,['已抵達<span class="a-point">'+school + schoolSet[school] +'</span>了😎',!1]); // insert msg into data.dialog
                        theUI.showMsgsAsync(li);
                    });
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    $('#goto-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#goto-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#goto-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
    for (let school of schoolImgSet){
        $('#school-options').append("<option value="+school+">");
    }

}


function settingsMethod(){
    $("#settings-form").on('submit',function(e){   
        e.preventDefault();
        // 改採關閉後檢驗資料是否改變 若改變則傳送 不變則不做反應
        // 在<form>中仍有submit的<input>
        // 並在chatlog上顯示 像是改學校或改暱稱
    })

}

function leaveMethod(){
    $("#leave-btn").on('click',function(a){
        $("#leave-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('離開')
        $('#modal').modal('show');
    })

    $("#leave-btn").on('click',function(a){
        if (localData.status === 1)
            $('#leave-modal-form modal-body p').text('確定停止等待嗎？');
        else if (localData.status === 2)
            $('#leave-modal-form modal-body p').text('確定要離開遊戲嗎？');
        else if (localData.status === 3)
            $('#leave-modal-form modal-body p').text('確定要離開房間嗎？');
    })

    $("#leave-modal-form").on('submit',function(e){  
        e.preventDefault();
        if (localData.status === 0)
            return false

        else if (localData.status === 1){
            $.ajax({
                type: 'GET',
                url: '/chat/leave',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        localData.waiting_time= '', localStorage.waiting_time = '';
                        localData.status = 0, localStorage.status = '0', refreshStatus();
                        theUI.showSys('已停止等待')
                        $('#modal').modal('hide');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        }else if (localData.status === 2){
            $.ajax({
                type: 'GET',
                url: '/chat/leave_game',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        localData.status = 0, localStorage.status = '0', refreshStatus();
                        localData.player_dict = {}, localStorage.player_dict = '{}', localData.onoff_dict = {}, localStorage.onoff_dict = '{}';
                        theWS.callLeaveGame();  // 自行離開
                        theUI.showSys('已離開遊戲')
                        $('#modal').modal('hide');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        }else if (localData.status === 3){
            $.ajax({
                type: 'GET',
                url: '/chat/leave_match',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        localData.status = 2, localStorage.status = '2', refreshStatus();
                        theWS.callLeaveMatch();
                        theUI.showSys('已離開房間')
                        $('#modal').modal('hide');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        } 
        // 不同的status 所傳的ajax會不一樣 而且在modal上顯示也會不同
    })


}

function startMethod(){
    $("#start-btn").on('click',function(e){  // no modal form, only use notice-modal
        if (localData.status !== 0)
            return false
        else if (localData.name.length===0){
            showNoticeModal('尚未取新的遊戲暱稱。');
            return false
        }else if (localData.school.length===0){
            showNoticeModal('尚未選擇所在城市。');
            return false
        }

        $.ajax({
            type: 'GET',
            url: '/chat/start_game',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    localData.status = 1, localStorage.status = '1', refreshStatus();
                    if (!0 === data['start']){
                        theWS.callStartGame();
                    }else{
                        theUI.clearChatLogs();
                        theUI.showSys('等待時間: <span class="a-clock a-point"></span>'), theUI.showClock();
                        $('#sidebar').offcanvas('hide');
                    }
                }else{
                    showNoticeModal(data['msg']);
                }
            },
            error: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

function bindFileUpload(){  // LARP用不到 刪掉
    $("#send-img").fileupload({
        dataType: "json",
        formData: function (form) {
            $('#send-hidden').attr('value',localData.uuid.substr(0,8));
            (0 === localData.status) ? $('#send-tag').attr('value', true): $('#send-tag').attr('value', false);
            return form.serializeArray();
        },
        done: function(e, data) {
            if (3 === localData.status)
                ('img_url' in data.result) ? theWS.msgSendWs(data.result['img_url'],!0) : console.log(data.result['error']);
            else if (0 === localData.status)
                ('img_url' in data.result) ? (theUI.clearChatLogs(), processAdult(data.result['img_url'])) : console.log(data.result['error']);
        },
        always:function(e, data) {
            $('#send-hidden').attr('value','');
            $('#send-tag').attr('value','');
        }
    })
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });
}

function processAdult(img_url){  // 刪掉
    theUI.showQuestion('是否確定使用此圖片?<p class="text-center"><img class="img-fluid a-img" src=' +img_url+'alt="refresh again"></img></p>', ['更改','確定'], 2);
    $('.a-q .a-0').on('click',function(e) {
        setTimeout($('#send-img').click(), 200);
    })
    $('.a-q .a-1').on('click',function(e) {
        localData.imgUrl_adult = img_url, localStorage.imgUrl_adult = img_url;
        theTerminal.adult(img_url);
        setTimeout(theTerminal.match(), 1000); // todo adult還未存入會影響後續的match() 故應該在後端執行 cmd_test或cmd_wait
    })
}


var checkGate = function(){
    function itr(){  // 不能用 需要改版
        var dialog;
        if (localData.name.length===0 && loginData.isLogin === !1)
            dialog = ['歡迎來到Acard！😂 這是一個由學生新創團隊開發的校園交友平台，這裡的<span class="a-point">所有動作都以指令執行</span>', !1]
        else
            dialog = ['歡迎回來！',!1]
        return dialog
    }
    function tut(){  // 改成 是否登入
        var dialog;
        if (localData.school.length===0)
            dialog = ['請先前往你想交友的<span class="a-point">學校</span>吧！ 輸入/go sch_id (學校縮寫例如:NTU, NCCU等)', !1]
        else if(localData.name.length===0)
            dialog = ['接著請輸入你的<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>。 輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)', !1]
        else if(loginData.isLogin === !1)
            dialog = ['朋友你還沒登入帳號哦', !1]
        return dialog
    }

    function grt(){
        $.ajax({
            type: 'GET',
            url: '/chat/greet',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    var li = data['dialog'];
                    if (0 === localData.status)
                        li.splice(1,0, itr(), tut()); // insert theGate into data['dialog']
                    else if(1 === localData.status)
                        li.splice(1,0, itr());
                    theUI.showMsgsAsync(li);
                }else{
                    showNoticeModal(data['msg']);
                }
            },
            error: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNoticeModal('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    }

    return {
        tutor:tut,
        intro:itr,
        greet:grt
    }
}


function timeAMPM(date) {
    var hours = date.getHours(), minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function msgReplacing(msg){
    msg = msg.replace(/(\/[a-zA-Z]+ )/g,'<span class=\"a-cmd\">$1 </span>');
    msg = msg.replace(/(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g, '<a onclick=\"window.open("$1","_blank")\">$1</a>');
    msg = msg.replace(/\n/g, '<br>');
    return msg
}

var chatUI = function(){
    function sm(msg){
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgReplacing(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        st(newElmt,1);
        localData.lastSaid = 'self',localStorage.lastSaid='self',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSelfMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function m(msg){  // todo: 特殊符號', ", <, >等會不會有問題
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgReplacing(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        localData.lastSaid = 'anon',localStorage.lastSaid = 'anon',ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function sy(msg){
        var newElmt_text = '<div class="a-chat text-center"><p class="a-dialogdiv a-sys a-clr"><span class="a-sys a-font">'+msgReplacing(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        localData.lastSaid = 'sys',localStorage.lastSaid = 'sys',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSys_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function q(question, choice_list, choice_num=2){  // todo 回答完題目後回饋 像是你與多少人的回答相同
        if (2 == choice_num){
            var newElmt_text = 
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div></div>'
        }else if(4 == choice_num){
            var newElmt_text =  
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-mid a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-2">'+choice_list[2]+'</p><p class="a-choice a-right d-inline-flex a-3">'+choice_list[3]+'</p></div></div>'
        }else if(1 == choice_num){
            var newElmt_text =
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-top d-inline-flex a-0">'+choice_list[0]+'</p></div></div>'
        }else{
            console.log('select: 1,2,4 for choice_num(param)');
            return false
        }
        var newElmt = $(newElmt_text).addClass('d-none');
        $('#writing').before(newElmt), localData.lastSaid = 'anon',localStorage.lastSaid = 'anon', ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        return newElmt
    }


    function wn(isWriting){
        (!0==isWriting) ? $('#writing').removeClass('d-none'):$('#writing').addClass('d-none');
        toggle.focus == !0 && toggle.scroll == !1 &&(n(), ut(!0));
    }
    function st(myElmt,num){
        var st ={
            2:'(已送達)',1:'(傳送中)',0:'(未送達)'
        }
        myElmt.find('.a-status>span:eq(0)').text(st[num])   
    }
    function n(){
        toggle.scroll = !0;
        $('.outer-scrollbar').animate({
            scrollTop:$('#dialog').height()
        },{
            duration:500,
            complete:function(){
                toggle.scroll = !1;
            }, 
        });
    }

    function si(imgUrl){
        var imgElmt = '<img class="img-fluid a-img" src='+imgUrl+' alt="send again please!"></img>';
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+imgElmt+'</span></p></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt);
        st(newElmt,1);
        localData.lastSaid = 'self',localStorage.lastSaid='self',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSelfImg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function i(imgUrl){
        var imgElmt = '<img class="img-fluid a-img" src='+imgUrl+' alt="send again please!"></img>';
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+imgElmt+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        localData.lastSaid = 'anon',localStorage.lastSaid = 'anon',ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showImg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function c(startTime=null){
        function time(){
            var date = new Date();
            var offsetTime = (date-start)/ 1000;
            var s = parseInt(offsetTime % 60), m = parseInt((offsetTime / 60) % 60), h = parseInt((offsetTime / 60 / 60) % 100);
            h = (h < 10) ? ("0" + h) : h;
            m = (m < 10) ? ("0" + m) : m;
            s = (s < 10) ? ("0" + s) : s;

            var duration = m+':'+s;
            $('.a-clock').text(duration);
            
            (1===localData.status) && (term.timerId_clock = setTimeout(time, 1000));  // time-conuting only in status:1
        } 
        var start = (null!==startTime)?(new Date(startTime)):(new Date());
        localData.waiting_time = start.Format('YYYY-MM-DD hh:mm:ss'), localStorage.waiting_time = localData.waiting_time;
        (null !== term.timerId_clock) && clearTimeout(term.timerId_clock);
        setTimeout(time, 50);
    }

    function ut(hasRead){
        hasRead?(unreadMsg=0, document.title=TITLE):(unreadMsg+=1, document.title='('+unreadMsg+')' + TITLE)
    }

    function cl(){
        var last = $('#writing');
        for (let i = 0;i<5;i++)
            localData['chatLogs'+i.toString()] = '', localStorage['chatLogs'+i.toString()] = '';
        localData.chatLogsMaxNum = 250,localStorage.chatLogsMaxNum = localData.chatLogsMaxNum.toString() ,localData.chatLogsNum=0,localStorage.chatLogsNum='0';
        $('#dialog').empty(),$('#dialog').append(last);
    }

    function ll(n=null){
        if ('undefined' !== typeof(Storage)){
            var last = $('#writing');
            $('#dialog').empty(), $('#dialog').append(last);
            if(localData.chatLogsNum>=250){
                var index = (Number(localData.chatLogsNum/50) % 5);  // index最多為0~4共5個 多出來的部分會進行輪轉 
            }else{
                var index = 4;
            }            
            for (let i = 0;i<5;i++){ 
                var elmts = $(localData['chatLogs'+index.toString()]);
                if(n===null || n>elmts.length){
                    $('#writing').before(elmts);
                    n = n - elmts.length;
                }else{ // n<=elmts.length
                    elmts = elmts.filter(function(i){
                        return i>=elmts.length-n 
                    })
                    $('#writing').before(elmts);
                    n = 0;
                }
                if(n===0)
                    break;
                index--;
                (index === -1)&&(index = 4)
            }
            term.chatLogsTag = (n===null)? 0 :(n>localData.chatLogsNum)? 0 :localData.chatLogsNum-n;
        }
    }
    function sl(elmt_text, n=1){ // todo 目前先用50個dialogdiv換行 塞滿200個dialogdiv後開始刪減 之後在用Blob找準確大小
        var index = parseInt(localData.chatLogsNum/50) % 5, isFull = (localData.chatLogsNum>=localData.chatLogsMaxNum)?!0:!1;
        if (isFull){  // todo 測試超過250句
            localData['chatLogs'+index.toString()] = '',localStorage['chatLogs'+index.toString()] = '';
            localData.chatLogsMaxNum = localData.chatLogsMaxNum +50, localStorage.chatLogsMaxNum = localData.chatLogsMaxNum.toString();
        }
        localData['chatLogs'+index.toString()] = localData['chatLogs'+index.toString()]+elmt_text, localStorage['chatLogs'+index.toString()] = localStorage['chatLogs'+index.toString()]+elmt_text;
        localData.chatLogsNum+= n, localStorage.chatLogsNum = localData.chatLogsNum.toString();
    }

    function go(callback=null){  // async function: callback after function has completed
        if (''!==localData.school){
            var extn = '.png';
            var img_url = school_url+localData.school+extn;
            var time1,time2;
            $('#mark-after>img').attr('src', img_url);
            $('#circle').addClass('a-fadein')
    
            time1 = $('#circle.a-fadein').css('transition-duration');
            time1 = parseFloat(time1)*1000;
            setTimeout(function(){
                $('#circle').removeClass('a-invisible-frame').addClass('a-visible-frame');
                $('#mark-before').addClass('d-none'),$('#mark-after').removeClass('d-none');
                $('#mark-before>img').attr('src', img_url);
                $('#circle').removeClass('a-fadein').addClass('a-fadeout');
                time2 = $('#circle.a-fadeout').css('transition-duration');
                time2 = parseFloat(time2)*1000;
                setTimeout(function(){
                    $('#circle').removeClass('a-visible-frame').addClass('a-invisible-frame');
                    $('#mark-after').addClass('d-none'),$('#mark-before').removeClass('d-none');
                    $('#circle').removeClass('a-fadeout');
                    if ('function'===typeof(callback)){
                        callback();
                    }
                }, time2);
            },time1)
        }
    }

    function ms(msg_List, interval=500, callback=null){  // async function 
        var s = 0, elmts_text = '';
        for (let t of msg_List){
            setTimeout(function(){
                (!0 == t[1])?(i(t[0]), elmts_text += term.showImg_text):(m(t[0]), elmts_text += term.showMsg_text);
            }, s*interval);
            s++;
        }
        setTimeout(function(){
            term['showMsgs_text'] = elmts_text;
            if ('function'===typeof(callback)){
                callback();  
            }
        }, s*interval);
        
    }


    return{
        showSelfMsg:sm,
        showMsg:m,
        showSys:sy,
        showStatus:st,
        showSelfImg:si,
        showImg:i,
        showClock:c,
        showQuestion:q,  // 刪掉
        scrollToNow:n,
        showWritingNow:wn,
        unreadTitle:ut,
        clearChatLogs:cl,
        loadChatLogs:ll,
        storeChatLogs:sl,
        gotoSchoolAsync:go,
        showMsgsAsync:ms
    }
}

function installToolTip() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

Date.prototype.Format = function (fmt) {
    var o = {
    "M+": this.getMonth()+1,
    "D+": this.getDate(),
    "h+": this.getHours(),
    "m+": this.getMinutes(),
    "s+": this.getSeconds(),
    "S": this.getMilliseconds()
    };
    if (/(Y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for (var k in o){
        var str = '(' + k + ')';
        if (new RegExp(str).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00"+o[k]).substr((""+o[k]).length)));
    }
    return fmt;
}

var loginData,
    TITLE = "ACard - AnonCard | 2021年台灣校園交友平台",
    unreadMsg = 0,
    school_url = '/static/img/mark/',
    schoolImgSet = new Set([
        'NCCU', 'NTU', 'SCU', 'PCCU', 'FJU', 'TKU', 'NTHU', 'NCTU', 'NCKU'
    ]), 
    chatSocket = null,
    theWS = WSManager(),
    theUI = chatUI(), 
    theGate = checkGate(),
    localData = getLocalData(),
    term = getTermData(),
    toggle = getToggle()
    
$(document).ready(function() {
    bindMsgSend(), bindFileUpload(), installToolTip(), bindModalHide();   
    loginMethodSet(), profileMethodSet(), leaveMethod(), startMethod(), settingsMethod();
    // bindModalPopup(), bindBtnClick(), bindFormSubmit(), loadDataWidget() 易讀性較差 
    // 改為依據用戶的功能分組 login相關, profile相關, game相關 如此就不會有chatroom和game重名問題 改名為methodSet

    loadLocalData(),loadLoginStatus();
});

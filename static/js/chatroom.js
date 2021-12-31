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
            if (!0===[2,3].includes(loginData.status)){
                loginData.onoff_dict[loginData.uuid] = 1;
            }
        };

        chatSocket.onclose = function(e) {
            console.log('WS disconnected. code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            (!1===loginData.isBanned) && setTimeout(chatroomWS, 15000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            console.log('receive: '+ data.type);
            switch (data.type){
                case 'WN':
                        theUI.showWritingNow(data.wn);
                    break;
                case 'ST':
                    var elmt;
                    while(localData.elmt_for_status.length>0){
                        elmt = localData.elmt_for_status.pop();
                        theUI.showStatus(elmt, data.num);
                    }
                    localStorage.elmt_for_status = '[]';
                    break;
                
                case 'MSG':
                    var text_only = $('#snippet').html(data.msg).text();
                    var dialog = [text_only, false, 'a'];  // data.isImg is false, sending img hasn't been available.
                    theUI.showOneMsg(dialog), theUI.storeChatLogs(dialog);                        
                    theWS.statusRespWs(data.sender, 2);
                    break;

                case 'MSGS':
                    var dialog = data.msgs.map(li => [$('#snippet').html(li[0]).text(), false, 'a']);  // data.isImg is false, sending img hasn't been available.
                    theUI.showMsgsAsync(data.msgs, 0, function(){
                        theUI.storeChatLogs(dialog, dialog.length);
                    });
                    theWS.statusRespWs(data.sender, 2);
                    break;

                case 'ERROR':
                    console.log(data.error);
                    break;

                case 'START':
                    showNotice('遊戲開始！');
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.href = "/chat/start_game/"+data['game']; 
                    });
                    break;

                case 'OUT':  // 通知其他人離開遊戲
                    var css_id = position[data.sender];  // position is from game_{gamename}.js
                    (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off').text('');
                    var name = $(css_id).find('.a-title').text();
                    $(css_id).find('.a-title').attr('data-bs-original-title', name + '(已退出)');
                    refreshGameSingle(self[3], css_id, 'OUT');  // self variable is from game_{gamename}.js

                    loginData.onoff_dict[data.sender] = -1;
                    var sender_name = loginData.player_dict[data.sender][0],
                        sender_role = loginData.player_dict[data.sender][2];
                    theUI.showSys('<span class="a-point">'+sender_name+'('+sender_role+')</span>' + ' 已離開遊戲。');
                    
                    break;
                case 'OUTDOWN':  // 通知其他人離開遊戲後自己才能重新導向到/chat                    
                    showNotice('你已離開遊戲'), theUI.showSys('你已離開遊戲。');
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.href = "/chat"; 
                    }); 
                    break;

                case 'ENTER':
                    showNotice(' 進入房間');
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.assign(window.location.href);
                    }); 
                    /*
                    loginData.player_list = data['player_list'];
                    loginData.waiting_time = data['waiting_time'];
                    console.log(data['waiting_time']);
                    loginData.status = 3, refreshStatus(3), refreshGameStatus(self[3], 3);

                    var anons_list = [...loginData.player_list];
                    anons_list.remove(loginData.uuid);
                    if (void 0 !== data.sender){
                        var name = loginData.player_dict[data.sender][0];
                        theUI.showSys('<span class="a-point">'+name+'</span>'+'邀請你進入房間');
                    }else{
                        var name_list = anons_list.map( uuid => loginData.player_dict[uuid][0] )
                        theUI.showSys('<span class="a-point">'+name_list.join(',')+'</span>'+' 已進入房間');
                    }
                    */
                    break;

                case 'LEAVE': // 通知其他人離開match
                    loginData.player_list = data['player_list'];
                    var name = loginData.player_dict[data.sender][0];
                    var empty_msg = (loginData.player_list.length === 1)?'房間內剩你一人':'';
                    showNotice(name + ' 已離開房間...' + empty_msg), theUI.showSys('<span class="a-point">'+name+ '</span>'+' 已離開房間...'+empty_msg);
                    break;

                case 'LEAVEDOWN': // 通知其他人離開match後自己離開
                
                    /*
                    loginData.player_list = [];
                    loginData.status = 2, refreshStatus(2), refreshGameStatus(self[3], 2);
                    */

                    (!0 === data['timeout'])?showNotice('時間到！ 即將自動關閉房間...'):showNotice(' 你已離開房間...');;
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.assign(window.location.href);
                    }); 
                    break;
                case 'DISCON':
                    var css_id = position[data.sender];
                    (!$(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').addClass('a-off');
                    var name = $(css_id).find('.a-title').text();
                    $(css_id).find('.a-title').attr('data-bs-original-title', name + '(離線)');
                    (2 === loginData.status) && refreshGameSingle(self[3], css_id, 'DISCON');

                    loginData.onoff_dict[data.sender] = 0;
                    var sender_name = loginData.player_dict[data.sender][0];
                    // theUI.showSys('<span class="a-point">'+sender_name+'</span> 已下線...');

                    if (loginData.status === 3 && loginData['player_list'].includes(data.sender))
                        toggle.discon = !0;
 
                    break;
                case 'CONN':
                    var css_id = position[data.sender];
                    ($(css_id).find('.a-circle').hasClass('a-off')) && $(css_id).find('.a-circle').removeClass('a-off');
                    var name = $(css_id).find('.a-title').text();
                    $(css_id).find('.a-title').attr('data-bs-original-title', name);
                    (2 === loginData.status) && refreshGameSingle(self[3], css_id, 'CONN');

                    loginData.onoff_dict[data.sender] = 1;
                    var sender_name = loginData.player_dict[data.sender][0];
                    // theUI.showSys('<span class="a-point">'+sender_name+'</span> 已上線！');

                    if (loginData.status === 3 && loginData['player_list'].includes(data.sender)){
                        toggle.discon = !1;
                        if(localData.text_in_discon.length>0){
                            theWS.msgsSendWs(localData.text_in_discon); // todo need to update for multiplayer match
                            localData.text_in_discon=[],localStorage.text_in_discon='[]';
                        }
                    }
                    break;

                case 'OVER':
                    showGameNotice('OVER', data['isOver']), theUI.showSys('玩家可按"離開"鍵 並準備進行下一場遊戲。');
                    disabledGameBtns();
                    break;

                case 'ALIVE':
                    showGameNotice('ALIVE', self[3]);
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.assign(window.location.href)
                    });
                    break;

                case 'INFORM':
                    var msg = $('#snippet').html(data['msg']).text();
                    showNotice(msg);
                    break;
                case 'MESSAGE':
                    if (true === data.toMe){
                        showNotice('訊息成功送達！');
                    }else{
                        var begin_str = gameGate.message();
                        if (loginData.status === 2){
                            for (let msg of data['msgs']){
                                msg = $('#snippet').html(begin_str + msg).text();
                                theUI.showMsg(msg);
                            }
                        }
                        var dialogs = data['msgs'].map(msg => [$('#snippet').html(begin_str + msg).text(), !1, 'a']);
                        if (1===dialogs.length)
                            theUI.storeChatLogs(dialogs[0], 1, 'gameLogs');
                        else
                            theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');
                    }
                    break;
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
            localData.text_in_discon.push([msg, isImg]), localStorage.text_in_discon = JSON.stringify(localData.text_in_discon);
        }
        var elmt, dialog = [$('#snippet').html(msg).text(), isImg, 'm'];
        elmt = theUI.showOneMsg(dialog), theUI.storeChatLogs(dialog);
        theUI.showStatus(elmt, 1);
        localData.elmt_for_status.push(elmt), localStorage.elmt_for_status = JSON.stringify(localData.elmt_for_status);
    }
    function mss(msg_list){  //  the matcher is disconnected, so send mag_list instead of msg in next connection.
        if(!1 === toggle.discon){
            chatSocket.send(JSON.stringify({
                'msgs':msg_list
            }))
        }
    }
    function st(sender, num=2){
        if(!1 === toggle.discon){
            chatSocket.send(JSON.stringify({
                'st':num,
                'backto':sender
            }))
        }
    }
    function wn(isWriting){
        if(!1 === toggle.discon){
            chatSocket.send(JSON.stringify({
                'wn':isWriting
            }))
        }
    }
    // 在後端仍需檢驗資料的正確性
    function cs(call, ...KwJSON){
        var json = { 
            'call':call 
        };
        if (void 0 !== KwJSON){
            for(let li of KwJSON){
                json[li[0]] = li[1];
            }
        }
        chatSocket.send(JSON.stringify(json))
    }

    return{
        msgSendWs:ms,
        msgsSendWs:mss,
        statusRespWs:st,
        writingNowWs:wn,
        callSendWs:cs
    }
}

function getLocalData(){
    var data = {
        name: '取個暱稱吧',
        school: '',  // 改掉 school改成city
        lastSaid: 's',
        text_in_discon: [],
        elmt_for_status:[],
        imgUrl_adult: '',
        chatLogs:[],
        gameLogs:[]
    };

    if ('undefined' !== typeof(Storage)){
        if ('true'===localStorage.isSaved){ 
            data.name = localStorage.name,
            data.school = localStorage.school,
            data.lastSaid = localStorage.lastSaid,
            data.text_in_discon = JSON.parse(localStorage.text_in_discon),
            data.elmt_for_status = JSON.parse(localStorage.elmt_for_status),
            data.imgUrl_adult = localStorage.imgUrl_adult,
            data.chatLogs = JSON.parse(localStorage.chatLogs),
            data.gameLogs = JSON.parse(localStorage.gameLogs);

        }else{
            localStorage.isSaved = 'true',
            localStorage.name = '取個暱稱吧',
            localStorage.school = '',
            localStorage.lastSaid = 's',
            localStorage.text_in_discon = '[]',
            localStorage.elmt_for_status = '[]',
            localStorage.imgUrl_adult = '',
            localStorage.chatLogs = '[]',
            localStorage.gameLogs = '[]';
        }
    }else{
        console.log('瀏覽器不支援或已關閉Storage功能，無法離線保留聊天記錄。');
    }
    return data
}

function getTermData(){
    var term = {
        timerId_clock: null,
        timerId_writing: null,
        chatLogs_remain:0,
        gameLogs_remain:0
    };
    return term
}
function getToggle(){
    var toggle = {
        writing:!1, // avoid duplicate entries in send-text
        uploading:!1, // avoid duplicate uploads in send-img
        focus:!1, // focus on send-text
        click:!1, // 為避免多次重複點擊
        scroll:!1, // 表示捲軸正在滾動
        text:!0, // todo 當出現bootbox時 離線後上線是否還要停留在bootbox
        problem:!1, // todo 表示自己網路出現問題 會跟開頭畫面一起使用
        discon:!1,  // at least one player disconnected in match
        first:!0
    };
    return toggle
}

function appearElmtCss(elmt_css){  // just show()
    ($(elmt_css).hasClass('d-none')) && $(elmt_css).removeClass('d-none');
}
function disappearElmtCss(elmt_css){  // just hide() 
    (!$(elmt_css).hasClass('d-none')) && $(elmt_css).addClass('d-none');
}

function disabledElmtCss(elmt_css){
    (void 0 === $(elmt_css).attr('disabled')) && $(elmt_css).attr('disabled', true);
}
function enabledElmtCss(elmt_css){
    (void 0 !== $(elmt_css).attr('disabled')) && $(elmt_css).removeAttr('disabled');
}


function loadLoginData(){ // login and logout followed by redirect, so loginData will be loaded then.
    if (!0 === loginData.isLogin){
        var url = (loginData.game.length > 0)? ('/chat/start_game/' + loginData.game) : '/chat/';
        if (url !== window.location.pathname)
            window.location.href = url;
        setTimeout(chatroomWS, 500);

        appearElmtCss('#user-info'), appearElmtCss('#logout-btn'), appearElmtCss('#change-pwd-btn');
        disappearElmtCss('#signup-btn'), disappearElmtCss('#login-btn'), disappearElmtCss('#reset-pwd-btn');
        $('#user-info>span:eq(0)').text(loginData.email);
        $('#user-info>span:eq(1)').text( '性別:' + ((loginData.gender === 'm')?'男':'女') );
        $('#user-tag').addClass( ((loginData.gender === 'm')? 'a-male':'a-female') ).removeClass('a-off');
        localData.name = loginData.name, localStorage.name = loginData.name;
        localData.school = loginData.school, localStorage.school = loginData.school;
        unavailableBtn(),refreshStatus(loginData.status);
    }else{
        appearElmtCss('#signup-btn'), appearElmtCss('#login-btn'), appearElmtCss('#reset-pwd-btn');
        disappearElmtCss('#user-info'), disappearElmtCss('#logout-btn'), disappearElmtCss('#change-pwd-btn');
        refreshStatus(0);
    }
    
}

function unavailableBtn() {
    if (loginData.gender==='m'){
        $('#female-radio').click(),disabledElmtCss('#male-radio'), disabledElmtCss('#female-radio');
    }else{
        $('#male-radio').click(),disabledElmtCss('#male-radio'), disabledElmtCss('#female-radio');
    }
    $('#adult-radio').click(), disabledElmtCss('#adult-radio'), disabledElmtCss('#normal-radio');
}

function loadLocalData(){  // loadLocalData just handle theUI work 會跟loginData合併
    refreshProfile(), theUI.gotoSchoolAsync();
    $('#send-text').focus();
}

function refreshProfile(){  // handle text of navbar and sidebar
    var school_name = localData.school+' '+schoolSet[localData.school];
    $('#school').text(school_name).attr('data-bs-original-title', school_name);
    $('#user-tag').text(localData.name[0]);
    $('#user-role').text('(還未進入遊戲)');
    $('#user-name').text(localData.name).attr('data-bs-original-title', localData.name);   
}

function setNavTitle(msg){
    $('.navbar-text.a-font').html(msg);
}

function refreshStatus(status){  // handle all UI work about status
    switch (status){  // status改用字元取代整數 當需要擴充插入先狀態時比較方便
        case 0:
            enabledElmtCss('#goto-btn'), enabledElmtCss('#name-btn');
            enabledElmtCss('#normal-radio'), enabledElmtCss('#adult-radio'), enabledElmtCss('#male-radio'), enabledElmtCss('#female-radio');
            enabledElmtCss('#start-btn'), $('#start-btn').text('開始遊戲');
            disabledElmtCss('#leave-btn');
            var school_text = (0 === localData.school.length)?'':'('+localData.school+')';
            setNavTitle('A-LARP匿名劇本殺 '+school_text);

            (localData.gameLogs.length>0) && theUI.clearChatLogs('gameLogs');
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);
            break;
            
        case 1:
            disabledElmtCss('#goto-btn'), disabledElmtCss('#name-btn');
            disabledElmtCss('#normal-radio'), disabledElmtCss('#adult-radio'), disabledElmtCss('#male-radio'), disabledElmtCss('#female-radio');
            disabledElmtCss('#start-btn'), $('#start-btn').text('等待中...');
            enabledElmtCss('#leave-btn');
            setNavTitle('等待其他玩家中...  <span class="a-clock a-point"></span>'); // theUI.showClock變為NaN:NaN (safari)
            
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);
            theUI.showSys('等待時間: <span class="a-clock a-point"></span>'), theUI.showClock();
            break;
        case 2:
            disabledElmtCss('#goto-btn'), disabledElmtCss('#name-btn');
            disabledElmtCss('#normal-radio'), disabledElmtCss('#adult-radio'), disabledElmtCss('#male-radio'), disabledElmtCss('#female-radio');
            enabledElmtCss('#leave-btn');
            // navtitle and chatlog is controlled by refreshGameStatus() 
            // becasuse some data varies due to role
            break;

        case 3:
            disabledElmtCss('#goto-btn'), disabledElmtCss('#name-btn');
            disabledElmtCss('#normal-radio'), disabledElmtCss('#adult-radio'), disabledElmtCss('#male-radio'), disabledElmtCss('#female-radio');
            enabledElmtCss('#leave-btn');
            // navtitle and chatlog is controlled by refreshGameStatus() 
            // becasuse some data varies due to role
            break;
    }
}

function refreshGameStatus(){  // will be overloaded by game_{gamename}.js
    console.log("will be overloaded by game_{gamename}.js");
}

function refreshGameSingle(){  // will be overloaded by game_{gamename}.js
    console.log("will be overloaded by game_{gamename}.js");
}

function bindMsgSend() {
    $("#send-text").on('keypress',function(a){
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();
            (void 0 !== text && null !== text &&'' !== text) && (3 === loginData.status) ? theWS.msgSendWs(text) : theUI.showSys('你還未進入房間哦！');
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }
    })
    $("#send-text").on('input',function(a){
        if (3 === loginData.status){
            (!1 === toggle.writing) && (theWS.writingNowWs(!0), toggle.writing = !0);

            (null !== term.timerId_writing) && clearTimeout(term.timerId_writing);
            term.timerId_writing = setTimeout(function(){ theWS.writingNowWs(!1); },10000);  // 當時間超過10秒再發送 theWS.writingNowWs(!1)
        }

    })
    $("#send-text").on('focus',function(a){
        toggle.focus = !0;
        // theUI.scrollToNow(), theUI.unreadTitle(!0);
    })
    $("#send-text").on('blur',function(a){
        toggle.focus = !1;
        if (3 === loginData.status){
            (!0 === toggle.writing) && (theWS.writingNowWs(!1), toggle.writing = !1);
        }
    })
    $("#send-btn").on('click',function(a){
        a.preventDefault();
        var e = $.Event("keypress");
        e.which = 13, $("#send-text").trigger(e);
        $("#send-text").focus();
    })
}

function bindModalHide(){
    $('#modal').on('hidden.bs.modal', function(e) {
        $('#modal').find('form').each(function(a){
            (!$(this).hasClass('d-none')) && $(this).addClass('d-none');
        });
        $('#modal .a-error').text('');
    });
}

function bindUpMore(){
    $("#show-more-btn").on('click',function(a){
        var isMore = (2 === loginData.status)?theUI.loadChatLogsMore('gameLogs'):theUI.loadChatLogsMore('chatLogs');
        (!0 === isMore)?appearElmtCss('#show-more'): disappearElmtCss('#show-more');
    }) 
}

function showNotice(msg){
    $('#modal').modal('hide');
    $('#notice-modal-form .modal-body p').text(msg);
    $('#notice-modal').modal('show');
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
        formArray.push({name:"goto-input",value: localData.school});
        formArray.push({name:"name-input",value: localData.name});

        $(this).find('.modal-footer button[type="submit"]').text('等待中...').attr('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/chat/signup',
            data: formArray,
            dataType: "json",
            success: function(data) {  
                if (!0 === data['result']){
                    showNotice(data['msg']);  // msg由後端移到前端 因為只有不成功時才能有msg
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
            url: '/chat/login',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    for (let prep in data['loginData']){  // 如果要重新導向 則資料不用傳入
                        loginData[prep] = data['loginData'][prep];
                        localStorage[prep] = data['loginData'][prep];  // 不要用localData和ocalStorage 改直接存入loginData
                    }
                    refreshProfile(), loginData.isLogin = !0, loadLoginData(); // refreshProfile()刪除 因為已合併到loadLoginData
                    showNotice(data['msg']);  // msg由後端移到前端 因為只有不成功時才能有msg
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.href = "/chat";
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
            url: '/chat/logout',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.isLogin = !1, loadLoginData();  // 如果要重新導向 則資料不用傳入
                    
                    showNotice(data['msg']);
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.href = "/chat";
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
            url: '/chat/change_pwd',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    
                    showNotice(data['msg']);
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.href = "/chat";
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
            url: '/chat/reset_pwd',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){  // todo 寄信需要提醒用戶等一下
                    
                    showNotice(data['msg']);
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
        }else if (name.length === 0){
            $('#name-modal-form p.a-error').text('暱稱不能空白');
            return false
        }
        // 不能傳'   ' (全為空) 不能傳html語法(轉譯問題) 

        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: '/chat/post_name',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    (!0 === loginData.isLogin) && (loginData.name = data['name']);
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
        }else if (!schoolImgSet.has(schoolId)){
            $('#goto-modal-form p.a-error').text('抱歉，所在城市還未開放。');
            return false
        }
        var formArray = $(this).serializeArray();
        $.ajax({
            type: 'POST',
            url: '/chat/post_school',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    (!0 === loginData.isLogin) && (loginData.school = data['school']);
                    localData.school = data['school'], localStorage.school = data['school'], refreshProfile();
                    var school = localData.school;
                    theUI.clearChatLogs();
                    theUI.gotoSchoolAsync(function(){
                        var li = data['dialogs'];
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
        // url: '/chat/settings'
        // change to start_game modal form
    })

}

function leaveMethod(){
    $("#leave-btn").on('click',function(a){
        $("#leave-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('離開')
        if (loginData.status === 1)
            $('#leave-modal-form .modal-body p:eq(0)').text('確定停止等待嗎？');
        else if (loginData.status === 2)
            $('#leave-modal-form .modal-body p:eq(0)').text('確定要離開遊戲嗎？');
        else if (loginData.status === 3)
            $('#leave-modal-form .modal-body p:eq(0)').text('確定要離開房間嗎？');
        $('#modal').modal('show');
    })

    $("#leave-modal-form").on('submit',function(e){  
        e.preventDefault();
        if (loginData.status === 1){
            $.ajax({
                type: 'GET',
                url: '/chat/leave',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        loginData.waiting_time= '', loginData.status = 0, refreshStatus(loginData.status);
                        theUI.showSys('已停止等待');
                        $('#modal').modal('hide');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        }else if (loginData.status === 2){
            $.ajax({
                type: 'GET',
                url: '/chat/leave_game',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        theWS.callSendWs('leave_game');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        }else if (loginData.status === 3){
            $.ajax({
                type: 'GET',
                url: '/chat/leave_match',
                dataType: "json",
                success:function(data) {
                    if (!0 === data['result']){
                        theWS.callSendWs('leave_match');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        } 
    })


}

function startMethod(){
    $("#start-btn").on('click',function(e){  // no modal form, only use notice-modal
        if (loginData.status !== 0)
            return false
        else if (localData.name.length===0){
            showNotice('尚未取新的遊戲暱稱。');
            return false
        }else if (localData.school.length===0){
            showNotice('尚未選擇所在城市。');
            return false
        }

        $.ajax({
            type: 'GET',
            url: '/chat/start_game',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    if (!0 === data['start']){
                        theWS.callSendWs('start_game');
                    }else{
                        loginData.status = 1, refreshStatus(loginData.status); // into waiting phase
                        loginData.waiting_time =  data['waiting_time'];
                    }
                    $('#sidebar').offcanvas('hide');
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
}

var checkGate = function(){
    function itr(isDirected=false){  // 不能用 需要改版
        var dialog;
        if (localData.name.length===0 && loginData.isLogin === !1){
            dialog = ['歡迎來到Acard！😂 這是一個由學生新創團隊開發的校園交友平台，這裡的<span class="a-point">所有動作都以指令執行</span>', !1];
        }
        else{
            dialog = ['歡迎回來！',!1];
        }
        (!0 === isDirected) && theUI.showMsg(dialog[0]);
        return dialog
    }
    function tut(isDirected=false){  // 改成 是否登入
        var dialog;
        if (localData.school.length===0)
            dialog = ['請先前往你想交友的<span class="a-point">學校</span>吧！ 輸入/go sch_id (學校縮寫例如:NTU, NCCU等)', !1];
        else if(localData.name.length===0)
            dialog = ['接著請輸入你的<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>。 輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)', !1];
        else if(loginData.isLogin === !1)
            dialog = ['朋友你還沒登入帳號哦', !1];
        else{
            dialog = ['當前資料為：... 可以直接進行遊戲哦', !1];
        }
        (!0 === isDirected) && theUI.showMsg(dialog[0]);
        return dialog
    }

    function grt(){
        $.ajax({
            type: 'GET',
            url: '/chat/greet',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    var li = data['dialogs'];
                    if (0 === loginData.status)
                        li.splice(1,0, itr(), tut()); // insert theGate into data['dialog']
                    else if(1 === loginData.status)
                        li.splice(1,0, itr());
                    theUI.showMsgsAsync(li);
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    }

    return {
        tutor:tut,
        intro:itr,
        greet:grt
    }
}

function msgWrapper(msg){
    var msg_text = msg.replace(/\n/g, '<br>').replace(/(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g, '<a href=\'$1\' target=\'_blank\'>$1</a>');
    return msg_text
}

function imgWrapper(imgUrl){
    var imgElmt = '<img class="img-fluid a-img" alt="refresh website or send again please!"></img>';
    imgElmt.attr('src', imgUrl);
    return imgElmt
}

var chatUI = function(){
    function mm(msg){
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgWrapper(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt), st(newElmt,1);
        localData.lastSaid = 'm',localStorage.lastSaid='m';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function mi(imgUrl){
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+imgWrapper(imgUrl)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt), st(newElmt,1);
        localData.lastSaid = 'm',localStorage.lastSaid='m';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function m(msg){
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgWrapper(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'a',localStorage.lastSaid = 'a';
        ut(!1), toggle.focus === !0 && toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function i(imgUrl){
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+imgWrapper(imgUrl)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'a',localStorage.lastSaid = 'a';
        ut(!1), toggle.focus === !0 && toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function sm(msg){
        var newElmt_text = '<div class="a-chat text-center"><p class="a-dialogdiv a-sys a-clr"><span class="a-sys a-font">'+msgWrapper(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 's',localStorage.lastSaid = 's';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function si(imgUrl){
        var newElmt_text = '<div class="a-chat text-center"><p class="a-dialogdiv a-sys a-clr"><span class="a-sys a-font">'+imgWrapper(imgUrl)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 's',localStorage.lastSaid = 's';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function om(dialog, direction='down'){
        var newElmt;
        var content = (!0 === dialog[1])? imgWrapper(dialog[0]): msgWrapper(dialog[0]);
        switch (dialog[2]){
            case 'm':
                newElmt = $('<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+content+'</span></p></div>');
                st(newElmt, 1);
                break;
            case 'a':
                newElmt = $('<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+content+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>');
                break;
            case 's':
                newElmt = $('<div class="a-chat text-center"><p class="a-dialogdiv a-sys a-clr"><span class="a-sys a-font">'+content+'</span></p></div>');
                break;
        }
        localData.lastSaid = dialog[2], localStorage.lastSaid=dialog[2];
        ('down'=== direction)?$('#writing').before(newElmt): $('#show-more').after(newElmt);
        ut(!1), (toggle.focus === !0)&& (toggle.scroll === !1) && (now(), ut(!0));
        return newElmt
    }

    function q(question, choice_list, choice_num=2){
        if (2 == choice_num){
            var newElmt_text = 
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div></div>'
        }else if(4 == choice_num){
            var newElmt_text =  
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-mid a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-2">'+choice_list[2]+'</p><p class="a-choice a-right d-inline-flex a-3">'+choice_list[3]+'</p></div></div>'
        }else if(1 == choice_num){
            var newElmt_text =
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-top d-inline-flex a-0">'+choice_list[0]+'</p></div></div>'
        }else{
            console.log('select: 1,2,4 for choice_num(param)');
            return false
        }
        var newElmt = $(newElmt_text).addClass('d-none');
        $('#writing').before(newElmt), localData.lastSaid = 'a',localStorage.lastSaid = 'a';
        ut(!1), toggle.focus == !0 && toggle.scroll == !1 && (now(), ut(!0));
        return newElmt
    }

    function wn(isWriting){
        (!0 === isWriting) ? $('#writing').removeClass('d-none'): $('#writing').addClass('d-none');
        toggle.focus === !0 && toggle.scroll === !1 && (now(), ut(!0));
    }
    function st(myElmt,num){
        var st ={  // st[0] haven't been used.
            2:'(已送達)',1:'(傳送中)',0:'(傳送失敗)'
        }
        myElmt.find('.a-status>span:eq(0)').text(st[num]);
    }
    function now(){
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

    function clk(timePoint=null, countDown=false){
        function time(){
            var date = new Date();
            var offsetTime = (!1 === countDown)?((date-point)/ 1000) : ((point-date)/ 1000);
            var s = parseInt(offsetTime % 60), m = parseInt((offsetTime / 60) % 60), h = parseInt((offsetTime / 60 / 60) % 100);
            h = (h < 10) ? ("0" + h) : h;
            m = (m < 10) ? ("0" + m) : m;
            s = (s < 10) ? ("0" + s) : s;

            var display = m+':'+s;
            $('.a-clock').text(display);
            
            (1===loginData.status || 3===loginData.status) && (term.timerId_clock = setTimeout(time, 1000));  // time-conuting only in status:1 and status:3
        } 
        var point = (null !== timePoint)?(new Date(timePoint)):(new Date());
        (null !== term.timerId_clock) && clearTimeout(term.timerId_clock);
        setTimeout(time, 50);
    }

    function ut(hasRead){
        hasRead?(unreadMsg=0, document.title=TITLE): (unreadMsg+=1, document.title='('+unreadMsg+')' + TITLE)
    }

    function cl(log_name='chatLogs'){
        localData[log_name] = [], localStorage[log_name] = '[]';
        $('#dialog>div').not('#show-more').not('#writing').remove();
        sm('已清除對話紀錄');
    }

    function ll(log_name='chatLogs', n=30){
        $('#dialog>div').not('#show-more').not('#writing').remove();
        var reversed = localData[log_name].slice().reverse();
        var dialog, elmt, isMore, cnt = 0, atmost = (n<=reversed.length)?n-1: reversed.length-1;
        while(cnt<reversed.length && cnt<n){
            dialog = reversed[atmost-cnt];
            elmt = om(dialog), cnt++;
            (dialog[2] === 'm') && (cnt>localData.text_in_discon.length) && st(elmt, 2); // some dialogs haven't sent.
            
        }
        (reversed.length>cnt)?(term[log_name+'_remain'] = (reversed.length-cnt), isMore=!0): (term[log_name+'_remain'] = 0, isMore=!1);
        return isMore
    }

    function llm(log_name='chatLogs', n=30){  // used by '#show-more'
        var reversed = localData[log_name].slice(0, term[log_name+'_remain']).reverse();
        var dialog, elmt, isMore, cnt = 0;
        while(cnt<reversed.length && cnt<n){
            dialog = reversed[cnt];
            elmt = om(dialog, 'up'), cnt++;
            (dialog[2] === 'm') && st(elmt, 2);
        }
        (reversed.length>cnt)?(term[log_name+'_remain'] = (reversed.length-cnt), isMore=!0): (term[log_name+'_remain'] = 0, isMore=!1);
        return isMore
    }

    function sl(dialog, n=1, log_name='chatLogs'){
        (n === 1)? localData[log_name].push(dialog) : localData[log_name] = localData[log_name].concat(dialog);
        localStorage[log_name] = JSON.stringify(localData[log_name]);
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

    function mgs(msg_List, interval=500, callback=null){  // async function 
        var s = 0;
        for (let t of msg_List){
            setTimeout(function(){
                om([...t, 'a']);
            }, s*interval);
            s++;
        }
        setTimeout(function(){
            if ('function'===typeof(callback)){
                callback();  
            }
        }, s*interval);
        
    }

    function sty(dialog_list, interval=1500, callback=null){
        var s = 0, elmts_text = '';
        for (let t of dialog_list){
            setTimeout(function(){
                ('w' !== t[2])&& om(t);  // 'w' means 'waiting' for delay effect
            }, s*interval);
            s++;
        }
        setTimeout(function(){
            if ('function'===typeof(callback)){
                callback();  
            }
        }, s*interval);
    }
    return{
        showSelfMsg:mm,
        showSelfImg:mi,
        showMsg:m,
        showImg:i,
        showSys:sm,
        showSysImg:si,
        showOneMsg:om,
        showStatus:st,
        showClock:clk,
        showQuestion:q,
        scrollToNow:now,
        showWritingNow:wn,
        unreadTitle:ut,
        clearChatLogs:cl,
        loadChatLogs:ll,
        loadChatLogsMore:llm,
        storeChatLogs:sl,
        gotoSchoolAsync:go,
        showMsgsAsync:mgs,
        showStoryAsync:sty
    }
}

function installToolTip() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function timeAMPM(date) {  // time_str = timeAMPM(new Date())  output: '1:01 pm'
    var hours = date.getHours(), minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

Date.prototype.Format = function (fmt) {  // time_str = (new Date()).Format('YYYY-MM-DD hh:mm:ss')  output: '2020-12-12 01:01:01'
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

Array.prototype.remove = function(val) { 
    var index = this.indexOf(val); 
    if (index > -1) { 
        this.splice(index, 1); 
    }
}

var loginData = JSON.parse(document.getElementById('loginData').textContent),
    TITLE = "ACard - AnonCard | 2021年台灣校園交友平台",
    unreadMsg = 0,
    school_url = '/static/img/mark/',  // 換成city
    schoolImgSet = new Set([  // 換成city
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
    bindMsgSend(), installToolTip(), bindModalHide(), bindUpMore(); 
    loginMethodSet(), profileMethodSet(), leaveMethod(), startMethod(), settingsMethod();
    loadLoginData(), loadLocalData(); 
});

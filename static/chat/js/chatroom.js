function chatroomWS(){
    if (null===chatSocket){
        var ws_name = ("https:" === window.location.protocol)? 'wss://': 'ws://';
        var wsUrl = ws_name + window.location.host+'/ws/chat/'; 
        if (!window.WebSocket){  // todo 改用protocols_whitelist替代
            console.log('瀏覽器版本不支援或已關閉websocket功能');
            return false
        }
        chatSocket = new WebSocket(wsUrl);
        chatSocket.onopen = function(){
            if (!0===[2,3].includes(loginData.status)){
                console.log("WS connected in game.");
                theWS.callSendWs('update');
            }else{
                console.log("WS connected.");
                theWS.callSendWs('redirect');
            }
        };

        chatSocket.onclose = function(e) {
            console.log("WS disconnected. code:"+e.code+"  ,reason:"+e.reason), chatSocket = null;
            (!1===loginData.isBanned) && setTimeout(chatroomWS, 1000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            /*
            if ('token' in data){
                console.log(data.token);
                if (!1 === localData.cache[data.token])
                    localData.cache[data.token] = !0, localStorage.cache = JSON.stringify(localData.cache);
                else
                    return false
            }
            */

            console.log('receive: '+ data.type);
            switch (data.type){
                case 'WN':
                        theUI.showWritingNow(data.wn);
                    break;
                case 'ST':
                    // opposite players are still in connection
                    var elmt;
                    while(term.elmt_for_status.length>0){  
                        elmt = term.elmt_for_status.pop();
                        theUI.showStatus(elmt, data.st_type);
                    }
                    
                    // opposite players have been disconnected
                    if (localData.text_in_discon.length>0){
                        var discon_index = -(localData.text_in_discon.length+1);  // counting backwards from last one
                        $('#dialog').find('.a-chat:has(.a-dialogdiv.a-self):gt('+discon_index+')').each(function(a){
                            theUI.showStatus($(this), data.st_type);
                        });
                        localData.text_in_discon=[],localStorage.text_in_discon='[]';
                    }
                    break;
                
                case 'MSG':
                    var text_only = $('#snippet').html(data.msg).text();
                    var dialog = [text_only, false, 'a'];  // data.isImg is false, sending_img hasn't been available.
                    theUI.showOneMsg(dialog), theUI.storeChatLogs([dialog]);                        
                    theWS.statusRespWs(data.sender, 2);  // have received msg and then response st_type:2(已送達)
                    if (!1 === localData.isMuted && !1 === toggle.focus){
                        document.getElementById("audio-inform").play();
                    }
                    break;

                case 'MSGS':
                    var dialog = data.msgs.map(li => [$('#snippet').html(li[0]).text(), false, 'a']);  // data.isImg is false, sending_img hasn't been available.
                    theUI.showMsgsAsync(data.msgs, 0, function(){
                        theUI.storeChatLogs(dialog, dialog.length);
                    });
                    theWS.statusRespWs(data.sender, 2); // have received msgs and then response st_type:2(已送達)
                    if (!1 === localData.isMuted && !1 === toggle.focus){
                        document.getElementById("audio-inform").play();
                    }
                    break;

                case 'ERROR':
                    console.log(data.error);
                    break;

                case 'UPDATE': // probably cause error: sequence of update and prolog 
                    loginData.player_dict = data.player_dict, loginData.onoff_dict = data.onoff_dict;
                    loginData.tag_int = data.tag_int, loginData.tag_json = data.tag_json;
                    loadTagfromDB(loginData.tag_json['role']);

                    refreshPlayerAll();
                    if (2 === loginData.status){
                        (null !== loginData.tag_int && null !== loginData.tag_json) && refreshGameTagAll();
                        var num_on = gameGate.playerNum();
                        setNavTitle(num_on);
                    }else if(3 === loginData.status){
                        disablePlayerBtnAll();
                        setNavTitle('恭喜配對成功！');
                    }
                    break;

                case 'REDIRECT':
                    if (!0 === [2,3].includes(data.status)){
                        var url = '/chat/start_game/' + data.game;
                        (url !== window.location.pathname) && (window.location.href = url);
                    }
                    break;

                case 'START':
                    showNotice('遊戲開始！');
                    if (!1 === localData.isMuted && !1 === toggle.focus){
                        document.getElementById("audio-enter").play();
                    }

                    (null !== term.timerId_later) && (clearTimeout(term.timerId_later), term.timerId_later=null);
                    ('later' in localData.time_str) && (delete localData.time_str['later'], localStorage.time_str = JSON.stringify(localData.time_str));

                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.href = "/chat/start_game/"+data['game']; 
                    });
                    break;

                case 'OUT':  // 通知其他人離開遊戲
                    loginData.onoff_dict[data.sender] = -1;
                    refreshGameSingle('OUT', data.sender);

                    if (3 === loginData.status && loginData['player_list'].includes(data.sender)){
                        toggle.discon = !0;
                    }
                    break;

                case 'OUTDOWN':  // 通知其他人離開遊戲後自己才能重新導向到/chat/                  
                    showNotice('你已離開遊戲'), theUI.showSys('你已離開遊戲。');
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.href = "/chat/"; 
                    }); 
                    break;

                case 'ENTER':
                    showNotice(' 進入房間');
                    if (!1 === localData.isMuted && !1 === toggle.focus){
                        document.getElementById("audio-enter").play();
                    }
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.assign(window.location.href);
                    }); 
                    break;

                case 'LEAVE': // 通知其他人 '自己即將離開'
                    loginData.player_list = data['player_list'];
                    var name = loginData.player_dict[data.sender][0];
                    var empty_msg = (loginData.player_list.length === 1)?'房間內剩你一人':'';
                    showNotice(name + ' 已離開房間...' + empty_msg), theUI.showSys('<span class="a-point">'+name+ '</span>'+' 已離開房間...'+empty_msg);
                    break;

                case 'LEAVEDOWN': // 通知其他人 '自己即將離開' 後再自己離開
                    (!0 === data['timeout'])?showNotice('時間到！ 即將自動關閉房間...'):showNotice(' 你已離開房間...');;
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.assign(window.location.href);
                    }); 
                    break;

                case 'DISCON':
                    loginData.onoff_dict[data.sender] = 0;
                    refreshGameSingle('DISCON', data.sender);

                    if (3 === loginData.status && loginData['player_list'].includes(data.sender)){
                        toggle.discon = !0;
                    }
                    break;

                case 'CONN':
                    loginData.onoff_dict[data.sender] = 1;
                    refreshGameSingle('CONN', data.sender);

                    if (3 === loginData.status && loginData['player_list'].includes(data.sender)){
                        toggle.discon = !1;
                        if(localData.text_in_discon.length > 0){
                            setTimeout(function(){
                                theWS.msgsSendWs(localData.text_in_discon);
                            },1000);
                            ; // todo: need to update for multiplayer match
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
                        window.location.assign(window.location.href);
                    });
                    break;

                case 'INFORM':
                    informGameMessage(data);
                    break;
            }
        };
    }
}

var WSManager = function(){
    function ms(msg, isImg=false){
        if(!1===toggle.discon){
            setTimeout(function(){
                chatSocket.send(JSON.stringify({  //todo: 傳訊息時觸發onerror 而webSocket突然自動關閉
                    'msg':msg,
                    'isImg':isImg
                }))
                if (queuedMsg >= 1)
                    queuedMsg -= 1;
            }, queuedMsg*200);
            queuedMsg += 1;
        }else{
            localData.text_in_discon.push([msg, isImg]), localStorage.text_in_discon = JSON.stringify(localData.text_in_discon);
        }
        var elmt, dialog = [$('#snippet').html(msg).text(), isImg, 'm'];
        elmt = theUI.showOneMsg(dialog), theUI.storeChatLogs([dialog]);
        theUI.showStatus(elmt, 1), term.elmt_for_status.push(elmt);

    }
    function mss(msg_list){  //  the matcher is disconnected, so send mag_list instead of msg in next connection.
        if(!1 === toggle.discon){
            chatSocket.send(JSON.stringify({
                'msgs':msg_list
            }))
        }
    }
    function st(sender, type=2){
        if(!1 === toggle.discon){
            chatSocket.send(JSON.stringify({
                'st':type,
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

    function cs(call, ...KwJSON){  // after ajax for GET or POST is success, the player still need to call other players.
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
        school: '',
        city: '',
        lastSaid: 's',
        text_in_discon: [],
        imgUrl_adult: '',
        chatLogs: [],
        gameLogs: [],
        answers: {},
        cache: {},
        time_str: {},
        isMuted: false,
        version: VERSION
    };

    var storage = {
        isSaved: 'true',
        name: '取個暱稱吧',
        school: '',
        city: '',
        lastSaid: 's',
        text_in_discon: '[]',
        imgUrl_adult: '',
        chatLogs: '[]',
        gameLogs: '[]',
        answers: '{}',
        cache: '{}',
        time_str: '{}',
        isMuted: 'false',
        version: VERSION
    };

    if ('undefined' !== typeof(Storage)){
        for (let key in data){
            if (void 0 === localStorage[key]){
                localStorage[key] = storage[key];
            }else{
                switch (typeof(data[key])){
                    case 'string':
                        data[key] = localStorage[key];
                        break;
                    case 'object':
                        data[key] = JSON.parse(localStorage[key]);
                        break;
                    case 'boolean':
                        data[key] = ('true'===localStorage[key])? true : false;
                        break;
                }
            }
        }

        /*
        if ('true'===localStorage.isSaved){
            try{
                data.name = localStorage.name,
                data.school = localStorage.school,
                data.city = localStorage.city,
                data.lastSaid = localStorage.lastSaid,
                data.text_in_discon = JSON.parse(localStorage.text_in_discon),
                data.imgUrl_adult = localStorage.imgUrl_adult,
                data.chatLogs = JSON.parse(localStorage.chatLogs),
                data.gameLogs = JSON.parse(localStorage.gameLogs),
                data.answers = JSON.parse(localStorage.answers),
                data.cache = JSON.parse(localStorage.cache),
                data.time_str = JSON.parse(localStorage.time_str),
                data.isMuted = ('true'===localStorage.isMuted)? true : false,
                data.version = localStorage.version;
            }catch(e){
                if(e instanceof SyntaxError){
                    localStorage.isSaved = 'false';
                    window.location.assign(window.location.href);
                }
            }

        }else{
            localStorage.isSaved = 'true',
            localStorage.name = '取個暱稱吧',
            localStorage.school = '',
            localStorage.city = '',
            localStorage.lastSaid = 's',
            localStorage.text_in_discon = '[]',
            localStorage.imgUrl_adult = '',
            localStorage.chatLogs = '[]',
            localStorage.gameLogs = '[]',
            localStorage.answers = '{}',
            localStorage.cache = '{}',
            localStorage.time_str = '{}',
            localStorage.isMuted = 'false',
            localStorage.version = '1.0.8_20220505';
        }
        */

    }else{
        console.log('瀏覽器不支援或已關閉Storage功能，無法離線保留聊天記錄。');
    }
    updateVersion();
    return data
}
function updateVersion(){
    if (localStorage.version !== void 0 && localStorage.version !== VERSION) {
        localStorage.version = VERSION;
        location.reload();
    }
}

function getTermData(){
    var term = {
        timerId_clock: null,
        timerId_writing: null,
        timerId_later: null,
        chatLogs_remain:0,
        gameLogs_remain:0,
        elmt_for_status:[]
    };
    return term
}
function getToggle(){
    var toggle = {
        writing:!1, // avoid duplicate entries in send-text
        uploading:!1, // avoid duplicate uploads in send-img
        focus:!1, // focus on send-text
        scroll:!1, // web page is scrolling, it's only used in chatUI.
        discon:!1,  // at least one player disconnected in match
        first:!0,  // avoid duplicate greet when open websocket again
        problem:!1, // todo 表示自己網路出現問題 會跟開頭畫面一起使用
        didReload:!1
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

function disabledElmtCssAll(elmt_css_list){
    for (elmt_css of elmt_css_list){
        disabledElmtCss(elmt_css);
    }
}

function enabledElmtCssAll(elmt_css_list){
    for (elmt_css of elmt_css_list){
        enabledElmtCss(elmt_css);
    }
}

function changeBtnColor(css_id, class_name){  
    // class_name:btn-primary, btn-secondary, btn-success, btn-danger, btn-warning, btn-info, btn-light, btn-dark
    if ($(css_id).hasClass('btn')){
        $(css_id).removeClass().addClass('btn '+ class_name);
    }
}

function changeStripBtnTitle(css_id, title=null){
    if ($(css_id).parents('#stripbar').length > 0){
        var parent = $(css_id).parent();
        var str = (void 0 === $(elmt_css).attr('disabled'))? '': '(disabled)';
        (null === title) && ( title = parent.attr('data-bs-original-title').replace('(disabled)','') );
        parent.attr('data-bs-original-title', title+str);
    }
}

function bindStripbarBtn(){
    var stripbar_btn = $('#stripbar-btn');
    stripbar_btn.on('click',function(e){
        if ('false' === stripbar_btn.attr('ishided')){ // to hide stripbar-btn
            stripbar_btn.find('.material-icons-outlined').text('arrow_forward_ios');
            $('.a-footer,.navbar').animate({
                left: '5px'
            },{ duration:300, easing:"swing"});
            $('.a-section').animate({
                left: '0px'
            },{ duration:300, easing:"swing"});
            $('.a-stripbar').animate({
                left: '-60px'
            },{ duration:300, easing:"swing"});

            stripbar_btn.attr('ishided', 'true');

        }else{  // to show stripbar-btn
            stripbar_btn.find('.material-icons-outlined').text('arrow_back_ios');
            $('.a-footer,.navbar').animate({
                left: '65px'
            },{ duration:300, easing:"swing",});
            $('.a-section').animate({
                left: '60px'
            },{ duration:300, easing:"swing"});
            $('.a-stripbar').animate({
                left: '0px'
            },{ duration:300, easing:"swing"});

            stripbar_btn.attr('ishided', 'false');
        }
    })
}

function loadLoginData(){ // login and logout will redirect, so loginData will be loaded then.
    if (!0 === loginData.isLogin){
        setTimeout(chatroomWS, 500);

        appearElmtCss('#user-info'), appearElmtCss('#logout-btn'), appearElmtCss('#change-pwd-btn');
        disappearElmtCss('#signup-btn'), disappearElmtCss('#login-btn'), disappearElmtCss('#reset-pwd-btn');

        $('#user-info>span:eq(0)').text(loginData.email);
        $('#user-info>span:eq(1)').text( '性別:' + ((loginData.gender === 'm')?'男':'女') );
        $('#user-tag,#user-strip-tag').removeClass('a-off').addClass( ((loginData.gender === 'm')? 'a-male':'a-female') );
        localData.name = loginData.name, localStorage.name = loginData.name;
        localData.city = loginData.city, localStorage.city = loginData.city;

        (!0 === loginData.isAdult)? $('#adult-check').prop('checked', true): $('#normal-check').prop('checked', true);
        (!0 === loginData.isHetero)? $('#hetero-check').prop('checked', true): $('#homo-check').prop('checked', true);

        refreshStatus(loginData.status);
    }else{
        appearElmtCss('#signup-btn'), appearElmtCss('#login-btn'), appearElmtCss('#reset-pwd-btn');
        disappearElmtCss('#user-info'), disappearElmtCss('#logout-btn'), disappearElmtCss('#change-pwd-btn');

        refreshStatus(0);
    }
}

function loadLocalData(){  // loadLocalData just handle theUI work and it's called after loadLoginData
    refreshProfile(), theUI.gotoPlaceAsync();
    $('#send-text').focus();
}

function refreshProfile(){  // handle text of navbar and sidebar
    var city_name = citySet[localData.city] + ' ' + localData.city;
    $('#city').text(city_name).attr('data-bs-original-title', city_name);
    if (0===loginData.status){
        // var sub_text = (0 === localData.city.length)?'':'('+citySet[localData.city]+')';
        // setNavTitle('A-LARP匿名劇本殺 ' + sub_text);
        setNavTitle('A-LARP匿名劇本殺');
    }
    
    $('#user-tag,#user-strip-tag').text(localData.name[0]);
    $('#user-name').text(localData.name).attr('data-bs-original-title', localData.name);
    $('#user-role').text('(還未進入遊戲)');
}

function setNavTitle(msg){
    $('.navbar-text.a-font').html(msg);
}

function refreshStatus(status){  // handle all UI work about status
    switch (status){  // status: change IntegerField to CharField
        case 0:
            // enabledElmtCss('#goto-btn'), enabledElmtCss('#name-btn'), enabledElmtCss('#start-btn');
            enabledElmtCssAll(['#goto-btn', '#name-btn', '#start-btn', '#goto-strip-btn', '#name-strip-btn', '#start-strip-btn']);
            disabledElmtCss('#leave-btn');

            changeStripBtnTitle('#goto-strip-btn'), changeStripBtnTitle('#name-strip-btn');
            $('#start-btn').text('開始遊戲');
            changeStripBtnTitle('#start-strip-btn', '開始遊戲');

            (localData.gameLogs.length>0) && theUI.clearChatLogs('gameLogs');
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);
            break;
            
        case 1:
            // disabledElmtCss('#goto-btn'), disabledElmtCss('#name-btn'), disabledElmtCss('#start-btn');
            disabledElmtCssAll(['#goto-btn', '#name-btn', '#start-btn', '#goto-strip-btn', '#name-strip-btn', '#start-strip-btn']);
            enabledElmtCss('#leave-btn');

            changeStripBtnTitle('#goto-strip-btn'), changeStripBtnTitle('#name-strip-btn');
            $('#start-btn').text('等待中...');
            changeStripBtnTitle('#start-strip-btn', '等待中...');

            setNavTitle('等待其他玩家.. <span class="a-clock a-point"></span>');
            (null === term.timerId_clock) && theUI.showClock(); // theUI.showClock 顯示 NaN:NaN (safari)？
            
            (!0 === toggle.first) && (theGate.greet(), toggle.first = !1);

            if ('later' in localData.time_str){
                var time = localData.time_str['later'] - new Date().getTime();
                (time>0) && (term.timerId_later = setTimeout(function(){ theStart.later_start(); }, time));
            }

            setTimeout(function(){ theWS.callSendWs('waiting'); }, 5000);
            break;

        case 2:
        case 3:
            // disabledElmtCss('#goto-btn'), disabledElmtCss('#name-btn');
            disabledElmtCssAll(['#goto-btn', '#name-btn', '#goto-strip-btn', '#name-strip-btn']);
            enabledElmtCss('#leave-btn');
            changeStripBtnTitle('#goto-strip-btn'), changeStripBtnTitle('#name-strip-btn');
            break;
    }
}

function showGameNotice(){  // will be overloaded by game_{gamename}.js
    console.log("will be overloaded by game_{gamename}.js");
}

function refreshGameSingle(){  // will be overloaded by game_{gamename}.js
    console.log("will be overloaded by game_{gamename}.js");
}

function informGameMessage(){  // will be overloaded by game_{gamename}.js
    console.log("will be overloaded by game_{gamename}.js");
}

function bindMsgSend() {  // probably to be overloaded by bindGameMsgSend() in game_{game_name}.js
    $("#send-text").on('keypress',function(a){
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();
            if (void 0 !== text && null !== text &&'' !== text){
                (3 === loginData.status) ? theWS.msgSendWs(text) : ((2 === loginData.status) ? theUI.showSys('你還未進入房間，目前只能使用左側名單的角色功能。') : theUI.showSys('你還未進入房間哦！'));
                theUI.scrollToNow();
            } 
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }
    })

    $("#send-text").on('input',function(a){  // writes something in <input>
        if (3 === loginData.status){
            (!1 === toggle.writing) && (theWS.writingNowWs(!0), toggle.writing = !0);

            (null !== term.timerId_writing) && clearTimeout(term.timerId_writing);
            term.timerId_writing = setTimeout(function(){ theWS.writingNowWs(!1); },10000);  // when it's over 10 seconds, theWS.writingNowWs(!1)
        }
    })
    $("#send-text").on('focus',function(a){
        toggle.focus = !0;
        theUI.unreadTitle(!0);
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
        var pwd1 = $(this).find('input[name="signup-input-password"]').val(),
            pwd2 = $(this).find('input[name="signup-input-confirm"]').val();
        if (pwd1 !== pwd2){
            $('#nsignup-modal-form p.a-error').text('密碼與確認密碼不ㄧ致！');
            return false
        }

        var formArray = $(this).serializeArray();
        formArray.push({name:"goto-input",value: localData.city});
        formArray.push({name:"name-input",value: localData.name});

        $(this).find('.modal-footer button[type="submit"]').text('等待中...').attr('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/chat/signup',
            data: formArray,
            dataType: "json",
            success: function(data) {  
                if (!0 === data['result']){
                    showNotice('已成功將註冊認證信寄到你的信箱了哦！');
                }else{
                    $('#signup-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#signup-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#signup-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            complete: function(data, code) {  
                $('#signup-modal-form button[type="submit"]').text('確定').removeAttr('disabled');
            }
        })
    })

    $('#login-modal-form').on('submit', function(e) {
        e.preventDefault();
        // verify email&password format by html 
        $.ajax({
            type: 'POST',
            url: '/chat/login',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    showNotice('帳號登入成功！');
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.assign(window.location.href);
                    });
                }else{
                    $('#login-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#login-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#login-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
                    showNotice('帳號已登出！');
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.assign(window.location.href);
                    });
                }else{
                    $('#logout-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#logout-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#logout-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#change-pwd-modal-form').on('submit', function(e) {
        e.preventDefault();
        var pwd1 = $(this).find('input[name="change-pwd-input-password"]').val(),
            pwd2 = $(this).find('input[name="change-pwd-input-confirm"]').val();
    if (pwd1 !== pwd2){
        $('#change-pwd-modal-form p.a-error').text('新密碼與確認密碼不ㄧ致！');
        return false
    }
        $.ajax({
            type: 'POST',
            url: '/chat/change_pwd',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    showNotice('變更密碼成功！');
                    $('#notice-modal').on('hide.bs.modal', function(e) {
                        window.location.assign(window.location.href);
                    });
                }else{
                    $('#change-pwd-modal-form p.a-error').text(data['msg'])
                }
            },
            error: function(data) { $('#change-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#change-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#reset-pwd-modal-form').on('submit', function(e) {
        e.preventDefault();
        // verify email format by html
        $(this).find('.modal-footer button[type="submit"]').text('等待中...').attr('disabled', true);
        $.ajax({
            type: 'POST',
            url: '/chat/reset_pwd',
            data: $(this).serializeArray(),
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    showNotice('已成功將重設密碼信寄到你的信箱了哦！');
                }else{
                    $('#reset-pwd-modal-form p.a-error').text(data['msg'])
                }
            },
            error: function(data) { $('#reset-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#reset-pwd-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
        
    })
}

function profileMethodSet(){
    var modalName = {
        'goto':'前往城市',
        'name':'遊戲暱稱'
    }
    for (let prop in modalName){
        // $("#"+prop+"-btn")
        $('#'+prop+'-btn,#'+prop+'-strip-btn').on('click',function(a){
            $("#"+prop+"-modal-form").removeClass('d-none');
            $('#modal .modal-title').text(modalName[prop]);
            $('#modal').modal('show');
        })
    }

    $('#name-modal-form').on('submit', function(e) {
        e.preventDefault();
        var name = $(this).find('input[name="name-input"]').val();
        if (name.length>20){
            $('#name-modal-form p.a-error').text('暱稱太長了，不能超過20個字元');
            return false
        }else if (name.trim().length === 0){
            $('#name-modal-form p.a-error').text('暱稱不能空白');
            return false
        } 

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
                    var text_only = $('#snippet').html(localData.name).text();
                    theUI.showSys('名稱：<span class="a-point">'+text_only+'</span> 已修改完畢');
                    theGate.tutor(true);
                    $('#modal').modal('hide');
                }else{
                    $('#name-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#name-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#name-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })

    $('#goto-modal-form').on('submit', function(e) {
        e.preventDefault();
        var cityOption = $(this).find('input[name="goto-input"]').val();
        var cityId = (cityOption.includes(' '))? cityOption.split(' ')[1]: cityOption;

        if (cityId === localData.city){
            $('#goto-modal-form p.a-error').text('你目前已經在'+citySet[cityId] +'了哦');
            return false
        }else if (!cityImgSet.has(cityId)){
            $('#goto-modal-form p.a-error').text('抱歉，此城市還未開放。');
            return false
        }
        var formArray = $(this).serializeArray();
        formArray[1] = ({name:"goto-input",value: cityId});
        $(this).find('input[name="goto-input"]').val('');
        $.ajax({
            type: 'POST',
            url: '/chat/post_place',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    var city = data['city'];
                    (!0 === loginData.isLogin) && (loginData.city = city);
                    localData.city = city, localStorage.city = city, refreshProfile();
                    theUI.clearChatLogs();
                    theUI.gotoPlaceAsync(function(){
                        var li = data['dialogs'];
                        li.splice(0,0,['已抵達<span class="a-point">'+ citySet[city] +'</span>了😎',!1], theGate.tutor()); // insert msg into data.dialog
                        theUI.showMsgsAsync(li);
                    });
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    $('#goto-modal-form p.a-error').text(data['msg']);
                }
            },
            error: function(data) { $('#goto-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { $('#goto-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    })
    var city_name, option_elmt;
    for (let city of cityImgSet){
        city_name = citySet[city] + ' ' + city;
        option_elmt = $('<option>').val(city_name);
        $('#city-options').append(option_elmt);
    }
}

function leaveMethod(){
    $("#leave-btn").on('click',function(a){
        $("#leave-modal-form").removeClass('d-none');
        $('#modal .modal-title').text('離開');
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
                        (null !== term.timerId_clock) && (clearTimeout(term.timerId_clock), term.timerId_clock = null);
                        (null !== term.timerId_later) && (clearTimeout(term.timerId_later), term.timerId_later = null);
                        ('later' in localData.time_str) && (delete localData.time_str['later'], localStorage.time_str = JSON.stringify(localData.time_str));
                        $('#modal').modal('hide');
                    }else{
                        $('#leave-modal-form p.a-error').text(data['msg']);
                    }
                },
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
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
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
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
                error: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); },
                timeout: function(data) { $('#leave-modal-form p.a-error').text('目前網路異常或其他原因，請稍候重新再試一次。'); }
                
            })
        } 
    })


}

var startMethod = function(){
    function b(){
        // $("#start-btn")
        $("#start-btn,#start-strip-btn").on('click',function(e){
            $("#start-modal-form").removeClass('d-none');
            $('#modal .modal-title').text('開始遊戲');
            $('#modal').modal('show');
            disabledElmtCss('#normal-check'), disabledElmtCss('#adult-check');  // need to push 'mode-radio' data to formArray
        })
    
        $("#start-modal-form").on('submit',function(e){  
            e.preventDefault();
            if (loginData.status !== 0)
                return false
            else if (localData.name.length===0){
                $('#start-modal-form p.a-error').text('你尚未取新的遊戲暱稱哦！');
                return false
            }else if (localData.city.length===0){
                $('#start-modal-form p.a-error').text('你尚未選擇所在城市哦！');
                return false
            }
    
            var formArray = $(this).serializeArray();
            formArray.push({name:"mode-radio",value: '1'});  // cuz mode-radio has been disabled
            formArray.push({name:"isLater",value: '0'});
            sendJson(formArray);
        })
    }

    function sendJson(formArray){
        $.ajax({
            type: 'POST',
            url: '/chat/start_game',
            data: formArray,
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    if (!0 === data['start']){
                        prepareMethod(data['game']);
                    }else{
                        if (!0 === data['later']){
                            term.timerId_later = setTimeout(function(){
                                formArray[3] = ({name:"isLater",value: '1'});
                                sendJson(formArray);
                            }, 2*60000);  // 2 mins later_start

                            var later_time_str = (new Date( (new Date()).getTime() + 2*60000 )).getTime();
                            localData.time_str['later'] = later_time_str, localStorage.time_str = JSON.stringify(localData.time_str);
                        }
                        loginData.status = 1, refreshStatus(loginData.status); // into waiting phase
                        console.log('start_game later:'+data['later']);
                    }
                    $('#modal').modal('hide'), $('#sidebar').offcanvas('hide');
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
        })
    }

    return {
        later_start: function(){
            var formArray = [
                {name: 'csrfmiddlewaretoken', value: $('input[name="csrfmiddlewaretoken"]').val()},
                {name:'sex-radio', value: $('input[name="sex-radio"]:checked').val()},
                {name:'mode-radio', value: $('input[name="mode-radio"]:checked').val()},
                {name:'isLater', value: '1'}
            ];
            sendJson(formArray);
        },
        bind:b
    }
}

function prepareMethod(game_id){
    $.ajax({
        type: 'GET',
        url: '/chat/prepare_game/'+game_id,
        dataType: "json",
        success: function(data) {
            if (!0 === data['result']){
                theWS.callSendWs('start_game');
                setTimeout(function(){
                    showNotice('遊戲開始！');
                    if (!1 === localData.isMuted && !1 === toggle.focus){
                        document.getElementById("audio-enter").play();
                    }
                    $('#notice-modal').on('hide.bs.modal', function(e) { 
                        window.location.href = "/chat/start_game/"+data['game']; 
                    });
                }, 10000);
            }
        },
        error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
        timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
    })
}

function settings(){
    $("input[name='sound-radio']").change(function() {
        if (this.value === '1'){
            localData.isMuted = !0, localStorage.isMuted = 'true';
        }else{
            localData.isMuted = !1, localStorage.isMuted = 'false';
        };
    });
}

var checkGate = function(){
    function itr(isDirected=false){
        var dialog;
        if (localData.name.length===0 && loginData.isLogin === !1){
            dialog = ['歡迎來到A-LARP匿名劇本殺！😂 這是一個由台灣大專院校學生團隊開發的校園交友平台，目前仍處於測試版beta', !1];
        }else{
            dialog = ['歡迎回來！',!1];
        }
        (!0 === isDirected) && theUI.showMsg(dialog[0]);
        return dialog
    }
    function tut(isDirected=false){
        var dialog;
        if (localData.city.length===0)
            dialog = ['請先點擊左上角圓圈圖示來開啟選單，前往你想交友的<span class="a-point">城市</span>！', !1];
        else if(localData.name.length===0)
            dialog = ['同樣點擊左上角圓圈圖示來開啟選單，輸入你在遊戲中的<span class="a-point">暱稱</span>。 <span class="a-point">暱稱</span>不會綁定，每場遊戲開始前都能更改。', !1];
        else if(loginData.isLogin === !1)
            dialog = ['在開始劇本殺遊戲前，必須先登入帳號！請點選右上角人頭圖示<span class="a-point">註冊</span>或<span class="a-point">登入</span>帳號。', !1];
        else{
            dialog = ['當前所在城市：<span class="a-point">'+ citySet[localData.city]+'</span>  你的暱稱為：<span class="a-point">'+ localData.name +'</span>  請點擊左上角圓圈圖示來開啟選單來<span class="a-point">進行遊戲</span>吧！', !1];
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
                        li.splice(1,0, itr(), tut()); // insert dialogs of theGate into data['dialog']
                    else if(1 === loginData.status)
                        li.splice(1,0, itr());
                    theUI.showMsgsAsync(li);
                }else{
                    showNotice(data['msg']);
                }
            },
            error: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); },
            timeout: function(data) { showNotice('目前網路異常或其他原因，請稍候重新再試一次。'); }
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
        var newElmt_text = '<div class="a-chat justify-content-end d-flex js-generated"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgWrapper(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt), st(newElmt,1);
        localData.lastSaid = 'm',localStorage.lastSaid='m';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function mi(imgUrl){
        var newElmt_text = '<div class="a-chat justify-content-end d-flex js-generated"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+imgWrapper(imgUrl)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt), st(newElmt,1);
        localData.lastSaid = 'm',localStorage.lastSaid='m';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function m(msg){
        var newElmt_text = '<div class="a-chat d-flex js-generated"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgWrapper(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'a',localStorage.lastSaid = 'a';
        ut(!1), toggle.focus === !0 && toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function i(imgUrl){
        var newElmt_text = '<div class="a-chat d-flex js-generated"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+imgWrapper(imgUrl)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'a',localStorage.lastSaid = 'a';
        ut(!1), toggle.focus === !0 && toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function sm(msg){
        var newElmt_text = '<div class="a-chat text-center js-generated"><p class="a-dialogdiv a-sys a-clr"><span>'+msg+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 's',localStorage.lastSaid = 's';
        ut(!1), toggle.focus === !0 &&toggle.scroll === !1 && (now(), ut(!0));
        return newElmt
    }

    function si(imgUrl){
        var newElmt_text = '<div class="a-chat text-center js-generated"><p class="a-dialogdiv a-sys a-clr"><span>'+imgWrapper(imgUrl)+'</span></p></div>';
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
                newElmt = $('<div class="a-chat justify-content-end d-flex js-generated"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+content+'</span></p></div>');
                st(newElmt, 1);
                break;
            case 'a':
                newElmt = $('<div class="a-chat d-flex js-generated"><p class="a-dialogdiv a-matcher a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+content+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>');
                break;
            case 's':
                if (!1 === dialog[1])
                    content = dialog[0];
                newElmt = $('<div class="a-chat text-center js-generated"><p class="a-dialogdiv a-sys a-clr"><span>'+content+'</span></p></div>');
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
            '<div class="a-chat flex-column d-flex a-q js-generated"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div></div>'
        }else if(4 == choice_num){
            var newElmt_text =  
            '<div class="a-chat flex-column d-flex a-q js-generated"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+ msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-mid a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-2">'+choice_list[2]+'</p><p class="a-choice a-right d-inline-flex a-3">'+choice_list[3]+'</p></div></div>'
        }else if(1 == choice_num){
            var newElmt_text =
            '<div class="a-chat flex-column d-flex a-q js-generated"><div class="a-dialogdiv a-matcher a-question a-clr d-inline"><p class="m-2">'+msgWrapper(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-clr justify-content-evenly d-flex"><p class="a-choice a-top d-inline-flex a-0">'+choice_list[0]+'</p></div></div>'
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
    function st(myElmt, type){
        var st ={  // st[0] haven't been used.
            2:'(已送達)',1:'(傳送中)',0:'(傳送失敗)'
        }
        myElmt.find('.a-status>span:eq(0)').text(st[type]);
    }
    function now(){
        toggle.scroll = !0;
        $('.a-container>.outer-scrollbar').animate({
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
            elmt = om(dialog);
            (dialog[2] === 'm') && (cnt<=atmost-localData.text_in_discon.length) && st(elmt, 2); // probably some dialogs haven't sent.
            cnt++;
        }
        (reversed.length>cnt)?(term[log_name+'_remain'] = (reversed.length-cnt), isMore=!0): (term[log_name+'_remain'] = 0, isMore=!1);
        return isMore
    }

    function llm(log_name='chatLogs', n=30){  // used by '#show-more'
        var reversed = localData[log_name].slice(0, term[log_name+'_remain']).reverse();
        var dialog, elmt, isMore, cnt = 0;
        while(cnt<reversed.length && cnt<n){
            dialog = reversed[cnt];
            elmt = om(dialog, 'up');
            // todo if localData.text_in_discon.length > n, llm() 可能發生問題
            (dialog[2] === 'm') && st(elmt, 2); // probably some dialogs haven't sent.
            cnt++;
        }
        (reversed.length>cnt)?(term[log_name+'_remain'] = (reversed.length-cnt), isMore=!0): (term[log_name+'_remain'] = 0, isMore=!1);
        return isMore
    }

    function sl(dialog, n=1, log_name='chatLogs'){  // save dialogs in conversation format: ['dialog'(str), isImage(bool), who(str)]
        // (n === 1)? localData[log_name].push(dialog) : localData[log_name] = localData[log_name].concat(dialog); no matter is 1 or not
        localData[log_name] = localData[log_name].concat(dialog);
        localStorage[log_name] = JSON.stringify(localData[log_name]);
    }
    
    function go(callback=null){  // async function: callback after function has completed
        if (''!==localData.city){
            var extn = '.png';
            var img_url = place_url+localData.city+extn;
            var time1, time2;
            $('#mark-after>img').attr('src', img_url);
            $('#circle').addClass('a-fadein');
    
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

    function sty(dialog_list, interval=1500, callback=null){ // dialog_list is conversation format: ['dialog'(str), isImage(bool), who(str)]
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
        gotoPlaceAsync:go,
        showMsgsAsync:mgs,
        showStoryAsync:sty
    }
}

function installToolTip() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, {
            trigger : 'hover'
            });
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
    TITLE = "A-LARP - 匿名劇本殺 | 2022年台灣校園交友平台",
    VERSION = '1.0.8_20220505',
    unreadMsg = 0,
    queuedMsg = 1,
    place_url = '/static/chat/img/mark/';
    
var chatSocket = null,
    theWS = WSManager(),
    theUI = chatUI(), 
    theGate = checkGate(),
    localData = getLocalData(),
    term = getTermData(),
    toggle = getToggle(),
    theStart = startMethod();  // to use private method from startMethod
    
$(document).ready(function() {
    bindMsgSend(), installToolTip(), bindModalHide(), bindUpMore(), bindStripbarBtn();
    loginMethodSet(), profileMethodSet(), leaveMethod(), theStart.bind();
    settings(), loadLoginData(), loadLocalData();
});

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
            chatSocket.send(JSON.stringify({
                'cmd':'open',
                'uuid': localData.uuid,
                'isFirst':toggle.first
            }));
            (!0 === toggle.first) && (toggle.first = !1);

            if('true'===localStorage.isSaved){
                var data = {};
                var li = ['name', 'matchType', 'school', 'anonName', 'room', 'isBanned', 'status', 'testResult', 'waiting_time'];
                for (let i of li){
                    if(localData[i])
                        data[i] = localData[i];
                }
                chatSocket.send(JSON.stringify({
                    'cmd':'import',
                    'data': data
                }));
            }    
        };
        // todo 增加開頭畫面：可篩選不符合條件的瀏覽器 另外流量超載就自動斷線

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            console.log('receive: '+ data.type);
            if (3 === localData.status){
                switch (data.type){
                    case typeSet.wn:
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
                        localData.room = '', localStorage.room ='';
                        // todo 返回房間外或等待房都加上dialog 故會訪問資料庫 anonName變更回管理員 theUI.refreshProfile()
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
                    case typeSet.greet: 
                        localData.anonName=data.anonName, localStorage.anonName=data.anonName, theUI.refreshProfile();
                        var li = data.dialog;
                        if (0 === localData.status)
                            li.splice(1,0,theGate.intro(), theGate.tutor()); // insert theGate into data.dialog
                        else // 2 === localData.status
                            li.splice(1,0,theGate.intro());
                        theUI.showMsgsAsync(li);
                        break;

                    case typeSet.goto:
                        localData.school = term.schoolId, localStorage.school = term.schoolId;
                        var school =  localData.school;
                        theUI.clearChatLogs();
                        theUI.gotoSchoolAsync(function(){
                            var li = data.dialog;
                            li.splice(0,0,['已抵達<span class="a-point">'+school + schoolSet[school] +'</span>了😎',!1]); // insert msg into data.dialog
                            theUI.showMsgsAsync(li);
                        });
                        break;

                    case typeSet.profile:
                        localData.name = term.name, localStorage.name = term.name, localData.matchType = term.matchType, localStorage.matchType = term.matchType, theUI.refreshProfile();
                        var m = [];
                        for (x of localData.matchType){
                            'm'==x?m.push('(男)'):m.push('(女)')
                        }
                        theUI.showSys('名稱：<span class="a-point">'+localData.name+'</span> 配對：<span class="a-point">'+localData.matchType[0]+m[0] +'找'+ localData.matchType[1]+m[1]+'</span> 基本資料已確認完畢');
                        break;

                    case typeSet.rename:
                        localData.name = term.name, localStorage.name = term.name, theUI.refreshProfile();
                        theUI.showSys('名稱：<span class="a-point">'+localData.name+'</span> 已修改完畢');
                        break;

                    case typeSet.test:
                        if (data.questions.length>0){
                            localData.status = 1, localStorage.status = '1';
                            localData.testQuestions = data.questions, localStorage.testQuestions=JSON.stringify(localData.testQuestions);
                            theUI.clearChatLogs();
                            theUI.showSys('==========<span class="a-point">配對遊戲：共5題</span>==========');
                            theUI.showMsg('以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對<span class="a-point">測試結果相近者進行配對</span>。');
                            processTest(data.questions);
                        }
                        break;
                    case typeSet.wait:
                        localData.status = 2, localStorage.status = '2';
                        localData.room = '', localStorage.room ='';
                        // todo 可能是/change而返回等待房 故anonName要做變更 需做theUI.refreshProfile()
                        theUI.clearChatLogs();
                        ('' !== localData.imgUrl_adult) && theUI.showSys('照片已儲存！ 將以成人模式進行配對👌')
                        theUI.showSys('等待時間: <span class="a-clock a-point"></span>'),theUI.showClock();
                        break;
                    case typeSet.enter:
                        localData.status = 3, localStorage.status = '3';
                        localData.room = data.room, localStorage.room = data.room, localData.waiting_time = '', localStorage.waiting_time = '';
                        localData.anonName = data.matcherName, localStorage.anonName = localData.anonName, theUI.refreshProfile();
                        theUI.clearChatLogs();
                        theUI.showSys('與<span class="a-point">'+localData.anonName+'</span>在<span class="a-point">'+localData.school+'</span>相遇');
                        break;
                    case typeSet.back:
                        var prev = localData.status;
                        localData.status = 0, localStorage.status = '0';
                        theUI.clearChatLogs();
                        theUI.showSys('已離開 <span class="a-point">'+ st[prev]+'</span>');
                        break;
                    case typeSet.reset:
                        localStorage.isSaved = 'false', localData = getLocalData(), loadLocalData();
                        chatSocket = null;
                        (!1===localData.isBanned) && chatroomWS();

                        theUI.clearChatLogs(), theUI.showSys('重置完成!');
                        break;
                    case typeSet.error:
                        console.log(data.error);
                        break;
                }
            }
        };
        chatSocket.onclose = function(e) {
            console.log('WS disconnected. code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            (!1===localData.isBanned) && setTimeout(chatroomWS, 15000);
            // todo 最後用theUI.showSys來表示已經斷線且目前連不上
        };
    }
}

function LocalData(){
    this.uuid = $.uuid(),
    this.name = '',
    this.matchType = '',
    this.isBanned = !1,
    this.status = 0, // 1:inTest, 2:inWaiting, 3:inRoom
    this.lastSaid = 'sys',
    this.anonName = '',
    this.room = '',
    this.school = '',
    this.testQuestions = [],
    this.testResult = [],
    this.waiting_time = '',
    this.text_in_discon = [],
    this.imgUrl_adult = '',
    this.chatLogsNum = 0,
    this.chatLogsMaxNum = 250
    for (let i = 0;i<5;i++)
        this['chatLogs'+i.toString()] = ''
}

function getLocalData(){
    var data = new LocalData();
    if (void 0 !== typeof(Storage)){
        if ('true'===localStorage.isSaved){ 
            data.uuid = localStorage.uuid,
            data.name = localStorage.name,
            data.matchType = localStorage.matchType,
            data.isBanned = ('true'===localStorage.isBanned)?!0:!1,
            data.status = +localStorage.status,
            data.lastSaid = localStorage.lastSaid,
            data.anonName = localStorage.anonName,
            data.room = localStorage.room,
            data.school = localStorage.school,
            data.testQuestions = JSON.parse(localStorage.testQuestions),
            data.testResult = JSON.parse(localStorage.testResult),
            data.waiting_time = localStorage.waiting_time,
            data.text_in_discon =  JSON.parse(localStorage.text_in_discon),
            data.imgUrl_adult = localStorage.imgUrl_adult,
            data.chatLogsNum = +localStorage.chatLogsNum,
            data.chatLogsMaxNum = +localStorage.chatLogsMaxNum
            for (let i = 0;i<5;i++)
                data['chatLogs'+i.toString()] = localStorage['chatLogs'+i.toString()]
        }else{
            localStorage.isSaved = 'true',
            localStorage.uuid = data.uuid,
            localStorage.name = '',
            localStorage.matchType = '',
            localStorage.isBanned = 'false',
            localStorage.status = '0',
            localStorage.lastSaid = 'sys',
            localStorage.anonName = '',
            localStorage.room = '',
            localStorage.school = '',
            localStorage.testQuestions = '[]',
            localStorage.testResult ='[]',
            localStorage.waiting_time = '',
            localStorage.text_in_discon = '[]',
            localStorage.imgUrl_adult = '',
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

function loadLocalData(){  // loadLocalData just do theUI work (chatSocket.onopen had sent localData to back-end)
    theUI.refreshProfile();
    theUI.gotoSchoolAsync();
    switch (localData.status){
        case 1:  // inTest 配對遊戲中
            theUI.clearChatLogs();
            theUI.showSys('==========<span class="a-point">配對遊戲：共5題</span>==========');
            theUI.showMsg('以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對<span class="a-point">測試結果相近者進行配對</span>。');
            (localData.testQuestions.length>0)&&processTest(localData.testQuestions);
            break;
        case 2:  // inWaiting 等待中
            theUI.clearChatLogs();
            (''!==localData.waiting_time)&&(theUI.showSys('等待時間: <span class="a-clock a-point"></span>'),theUI.showClock(localData.waiting_time));
            break;
        case 3:  // inRoom 連線中
            theUI.loadChatLogs(30);  //todo '顯示更多'功能
            theUI.showSys('你與<span class="a-point">'+localData.anonName+'</span>待在一起');
            // 重開只會顯示最後十行 其餘要點擊顯示更多 (必須要能夠辨識chatLog之中的元素個數)
            break;
    }
    $('#send-text').focus();
}

function installToolTip() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

function disableBackSpace() {
    $(document).keydown(function(e) {
        (8 == e.which || 8 == e.keyCode) && "text" != e.target.type  && e.preventDefault();
    })
}

function bindMsgSend() {
    $("#send-text").on('keypress',function(a) {
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
        term.timerId_writing = setTimeout(theWS.writingNowWs(!1),10000);
    })
    $("#send-text").on('focus',function(a) {
        toggle.focus = !0;
        theUI.scrollToNow(), theUI.unreadTitle(!0);
    })
    $("#send-text").on('blur',function(a) {
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

function cmdBySidebar(elmt){
    var text = $(elmt).find('.a-cmd').text();
    text = text.split(' ')[0]
    $("#send-text").val(text);
    $("#sidebar .btn-close").click();
}

function bindFileUpload(){
    $("#send-img").fileupload({
        dataType: "json",
        formData:function (form) {
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

var chatWS = function(){
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

    return{
        msgSendWs:ms,
        msgsSendWs:mss,
        statusRespWs:st,
        writingNowWs:wn,
    }
}

function processAdult(img_url){
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

function processTest(questions){
    for (let q of questions){ // q為{content:... ,choices:[y,n]}的物件
        theUI.showQuestion(q.content, q.choice, q.type);

    }
    theUI.showQuestion('是否提交答案?', ['提交'], 1).find('.a-0').removeClass('a-0').addClass('a-submit')
    localData.testResult = []
    localStorage.testResult=JSON.stringify(localData.testResult);

    for (let s = 0;s<4;s++){
        var classStr = '.a-' + s.toString();
        $(classStr).on('click',function(e) {
            e.preventDefault;
            var parent = $(this).closest('.a-q');
            var index = $('#dialog>.a-q').index(parent);
            var next = parent.next('.a-q');
            localData.testResult[index] = s.toString();
            localStorage.testResult=JSON.stringify(localData.testResult);

            if (next.length>0 && next.hasClass('d-none'))
                next.removeClass('d-none'),theUI.scrollToNow(),theUI.unreadTitle(!0);
        })
    }
    $('.a-submit').on('click', function(e){
        theTerminal.wait();
    })
    $('#dialog>.a-q:eq(0)').removeClass('d-none');
}

var checkGate = function(){
    function itr(){
        var dialog;
        if (localData.name.length===0 && localData.matchType.length===0)
            dialog = ['歡迎來到Acard！😂 這是一個由學生新創團隊開發的校園交友平台，這裡的<span class="a-point">所有動作都以指令執行</span>', !1]
        else
            dialog = ['歡迎回來！',!1]
        return dialog
    }
    function tut(){
        var dialog;
        if (localData.school.length===0)
            dialog = ['請先前往你想交友的<span class="a-point">學校</span>吧！ 輸入/go sch_id (學校縮寫例如:NTU, NCCU等)', !1]
        else if(localData.name.length===0)
            dialog = ['接著請輸入你的<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>。 輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)', !1]
        else if(localData.matchType.length===0)
            dialog = ['請重新輸入你的<span class="a-point">配對類型</span>以及<span class="a-point">名稱</span>。 輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)', !1]
        else if(localData.testResult.length===0)
            dialog = ['已確認你所選擇的<span class="a-point">學校('+localData.school+')</span>與<span class="a-point">基本資料('+localData.name+', '+localData.matchType +')</span>  開始進行配對吧～朋友！ 輸入/m ', !1]
        else if(localData.room.length===0)
            dialog = ['是否要進行下一次配對 輸入/m \n或選擇重新測試 輸入/t \n或更改配對用的名稱 輸入/n name \n或移動到其他學校 輸入/go sch_id', !1]
        return dialog
    }
    return {
        tutor:tut,
        intro:itr
    }
}

var chatTerminal = function(){  // 用戶發送不合規定資料而斷線時是否會影響其他用戶
    function cmd(totalStr){  // 若由'#send-text'發出 則必須透過cmd()作分流 ; 若由介面或其他元件發出 則直接調用方法
        var listStr = totalStr.split(' ');
        var cmdStr = listStr[0];
        var wrongMsg = '指令為：<span class="a-point">'+totalStr+'</span> 未符合 '+cmdStr+ ' 指令格式';

        console.log('type in: ' + totalStr);
        
        if (commandSet.goto === cmdStr.toLowerCase())
            (listStr.length===2 && listStr[1].length>0) ? go(listStr[1]) : theUI.showSys(wrongMsg+'：空格後加上前往的學校縮寫哦 <span class="a-point">/go xxx</span>');

        else if (commandSet.image === cmdStr.toLowerCase())
            _a();
        else if (commandSet.change === cmdStr.toLowerCase())
            cg();
        else if (commandSet.leave === cmdStr.toLowerCase())
            le();
        else if (commandSet.profile === cmdStr.toLowerCase())
            (listStr.length===3 &&listStr[1].length>0 && listStr[2].length>0) ? p(listStr[1], listStr[2]) : theUI.showSys(wrongMsg+'：必須依序填入配對用的名稱與配對類型 <span class="a-point">/p 我的名字 fm</span>');
        else if (commandSet.rename === cmdStr.toLowerCase())
            (listStr.length==2 &&listStr[1].length>0) ? n(listStr[1]) : theUI.showSys(wrongMsg+'：空格後填入欲修改的名稱 <span class="a-point">/n 我的名字</span>');
        else if (commandSet.match === cmdStr.toLowerCase())
            m(),localData.imgUrl_adult = '', localStorage.imgUrl_adult = '';  // to distinguish normal mode from adult mode
        else if (commandSet.adult === cmdStr.toLowerCase())
            a();
        else if (commandSet.retest === cmdStr.toLowerCase())
            t();
        else if (commandSet.reset === cmdStr.toLowerCase())
            r();
        else
            theUI.showMsg('目前沒有 <span class="a-point">'+cmdStr+'</span> 這項指令😭');
    }

    function go(schoolId){
        if (0!==localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>移動到其他學校，必須先輸入/le (/leave)。');
        }else{   // 0 === localData.status
            schoolId = schoolId.toUpperCase();
            if (!(schoolImgSet.has(schoolId))){
                theUI.showSys('目前尚未開放此學校: <span class="a-point">'+schoolId+'</span>');
                theUI.showSys('目前開放的學校為:<span class="a-point">'+[...schoolImgSet].join(', ')+'</span>');
                return false
            }
            if (schoolId === localData.school){
                theUI.showMsg('你目前已經在 <span class="a-point">'+schoolId +schoolSet[schoolId] +'</span> 了哦');
                return false
            }
            chatSocket.send(JSON.stringify({
                'cmd':'goto',
                'school':schoolId
            }));
            term.schoolId = schoolId;
        }

    }
    function p(name, matchType){
        if (0!==localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>設定暱稱或配對類型，必須先輸入/leave(/le)。');
        }else{  // 0 === localData.status
            if (name.length>20){
                theUI.showSys('暱稱的字數長度不能超過: <span class="a-point">20</span>字元。');
                return false
            }
            if (!(['mf','mm','fm','ff'].includes(matchType.toLowerCase()))){
                theUI.showSys('配對類型只能選擇: <span class="a-point">fm, mf, mm, ff </span> 四種(分別為女找男, 男找女, 男找男, 女找女)');
                return false
            }
            chatSocket.send(JSON.stringify({
                'cmd':'profile',
                'name':name,
                'matchType':matchType.toLowerCase()
            }));
            term.name = name, term.matchType = matchType;

        }
    }
    function n(name){
        if (0!==localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>跟改暱稱哦，必須先輸入/leave(/le)。');
        }else{  // 0 === localData.status
            if (name.length>20){
                theUI.showSys('暱稱的字數長度不能超過: <span class="a-point">20</span>字元。');
                return false
            }
            chatSocket.send(JSON.stringify({
                'cmd':'rename',
                'name':name,
            }));
            term.name = name;
        }
    }
    function m(){  // is called by /match only in status 0
        if (1 === localData.status || 2 === localData.status){
            theUI.showSys('你已經在進行<span class="a-point">配對</span>了哦。');
        }else if (3 === localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>進行配對哦，必須先輸入/le (/leave)。');
        }else{  // 0 === localData.status
            if (localData.name.length===0 || localData.matchType.length===0){
                theUI.showSys('必須先設定<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>才能進行配對，請輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)')
                return false
            }else if (localData.school.length===0){
                theUI.showSys('必須先<span class="a-point">前往學校</span>才能進行配對哦，請輸入/go school_id');
                return false
            }
            ( 0!==localData.testResult.length && localData.testQuestions.length===localData.testResult.length)?w():t();
        }
        
    }
    function t(){  // is called by /match or /retest only in status 0
        if (1 === localData.status){
            theUI.showSys('你已經在<span class="a-point">重新作答</span>了哦。');
        }else if (2 ===localData.status || 3 === localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>重新作答哦，必須先輸入/le (/leave)。');
        }else{  // 0 === localData.status
            if (localData.name.length===0 || localData.matchType.length===0){
                theUI.showSys('必須先設定<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>才能進行配對，請輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)')
                return false
            }else if (localData.school.length===0){
                theUI.showSys('必須先<span class="a-point">前往學校</span>才能進行配對哦，請輸入/go school_id');
                return false
            }

            chatSocket.send(JSON.stringify({
                'cmd':'test'
            }));
        }
    }

    function w(){  // is called by /match in status 0 and processTest() in status 1
        if(0 === localData.status || 1 === localData.status){
            chatSocket.send(JSON.stringify({
                'cmd':'wait',
                'testResult':localData.testResult
            }));
        }
    }
    function le(){
        if (0===localData.status){
            theUI.showSys('你目前不在等待中也沒有與任何人連線哦😎');
        }else{  // 0 !== localData.status
            chatSocket.send(JSON.stringify({
                'cmd':'leave'
            }));
        }
    }
    function cg(){
        if (0===localData.status){
            theUI.showSys('你目前不在等待中也沒有與任何人連線哦😎');
        }else{  // 0 !== localData.status
            chatSocket.send(JSON.stringify({
                'cmd':'change'
            }));
        }
    }
    function a(imgUrl=null){
        if (1 === localData.status || 2 === localData.status){
            theUI.showSys('你已經在進行<span class="a-point">成人模式配對</span>了哦。');
        }else if (3 === localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>使用成人模式進行配對哦，必須先輸入/le (/leave)。');
        }else{
            if (localData.name.length===0 || localData.matchType.length===0){
                theUI.showSys('必須先設定<span class="a-point">暱稱</span>與<span class="a-point">配對類型</span>才能進行成人模式配對，請輸入/p name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)')
                return false
            }else if (localData.school.length===0){
                theUI.showSys('必須先<span class="a-point">前往學校</span>才能進行成人模式配對哦，請輸入/go school_id');
                return false
            }
            if (null === imgUrl){
                theUI.showSys('確定開啟成人模式嗎？😂 使用成人模式需要先上傳任意照片。 提醒：為保護使用者安全，請不要上傳任何容易透露個人真實訊息的照片。');
                setTimeout($('#send-img').click(), 2000);
            }else{
                chatSocket.send(JSON.stringify({
                    'cmd':'adult',
                    'imgUrl':imgUrl
                }));
            }
        }
    }
    function r(){
        if (0!==localData.status){
            theUI.showSys('不能在<span class="a-point">'+st[localData.status]+'</span>重置身份，必須先輸入/le (/leave)。');
        }else{  // 0 === localData.status
            chatSocket.send(JSON.stringify({
                'cmd':'reset'
            }));
        }
    }
    function _a(){
        if (3 !== localData.status){
            theUI.showSys('必須與人連線後你才能用將圖傳對方哦');
        }else{  // 3 === localData.status
            setTimeout($('#send-img').click(), 500);
        }
        
    }

    return{
        command:cmd,
        goto:go,
        profile:p,
        rename:n,
        match:m,
        test:t,
        wait:w,
        leave:le,
        change:cg,
        adult:a,
        reset:r,
        image:_a
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
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-pa a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgReplacing(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        st(newElmt,1);
        localData.lastSaid = 'self',localStorage.lastSaid='self',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSelfMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function m(msg){  // todo: 特殊符號', ", <, >等會不會有問題
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-pa a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgReplacing(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        (newElmt) && $('#writing').before(newElmt); 
        localData.lastSaid = 'anon',localStorage.lastSaid = 'anon',ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function sy(msg){
        var newElmt_text = '<div class="a-chat text-center"><p class="a-dialogdiv a-sys a-pa a-clr"><span class="a-sys a-font">'+msgReplacing(msg)+'</span></p></div>';
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
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div></div>'
        }else if(4 == choice_num){
            var newElmt_text =  
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-mid a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-2">'+choice_list[2]+'</p><p class="a-choice a-right d-inline-flex a-3">'+choice_list[3]+'</p></div></div>'
        }else if(1 == choice_num){
            var newElmt_text =
            '<div class="a-chat flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-top d-inline-flex a-0">'+choice_list[0]+'</p></div></div>'
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
        var newElmt_text = '<div class="a-chat justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-pa a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+imgElmt+'</span></p></div>';
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
        var newElmt_text = '<div class="a-chat d-flex"><p class="a-dialogdiv a-matcher a-pa a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+imgElmt+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
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

            var duration = h + ":" + m+':'+s;
            $('.a-clock').text(duration);
            
            (2===localData.status) && (term.timerId_clock = setTimeout(time, 1000));
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
        if (void 0 !== typeof(Storage)){
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

    function rp(){
        $('.navbar-text.a-font>.a-matcher').text(localData.anonName);
        $('.navbar-text.a-font>.a-self').text(localData.name);
        if (''!==localData.matchType){
            var self = ('m'===localData.matchType[0])?'man':'woman';
            var matcher = ('m'===localData.matchType[1])?'man':'woman';
            var inRoom = (localData.status === 3)?'graphic_eq':'keyboard_arrow_right';
            $('.navbar-text.a-type .material-icons:eq(0)').text(self);
            $('.navbar-text.a-type .material-icons:eq(1)').text(inRoom);
            $('.navbar-text.a-type .material-icons:eq(2)').text(matcher);
        }
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
        showQuestion:q,
        scrollToNow:n,
        showWritingNow:wn,
        unreadTitle:ut,
        clearChatLogs:cl,
        loadChatLogs:ll,
        storeChatLogs:sl,
        refreshProfile:rp,
        gotoSchoolAsync:go,
        showMsgsAsync:ms
    }
}


!function(a){
    a.uuid = function() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
            var t = 16 * Math.random() | 0;
            return ("x" == a ? t : t &0x3|0x8).toString(16)
        })
    }
}(jQuery);


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

var TITLE = "ACard - AnonCard | 2021年台灣校園交友平台",
    unreadMsg = 0,
    school_url = '/static/img/mark/',
    schoolImgSet = new Set([
        'NCCU', 'NTU', 'SCU', 'PCCU', 'FJU', 'TKU', 'NTHU', 'NCTU', 'NCKU'
    ]),
    typeSet = {
        greet:'GREET',
        goto:'GOTO',
        profile:'PROFILE',
        rename:'RENAME',
        test:'TEST',
        wait:'WAIT',
        enter:'ENTER',
        leave:'LEAVE',
        back:'BACK',
        msg: 'MSG',
        msgs:'MSGS',
        img:'IMG',
        wn:'WN',
        st:'ST',
        reset:'RESET',
        discon:'DISCON',
        conn:'CONN',
        error:'ERROR'
    }, 
    commandSet = {
        goto:'/go',
        adult:'/a',
        leave:'/le',
        change:'/cg',
        profile:'/p',
        match:'/m',
        rename:'/n',
        retest:'/t',
        reset:'/r',
        image:'/@'
    },
    st = {
        1:'配對遊戲中',2:'等待中',3:'連線中'
    }
    toggle ={
        writing:!1, // 為避免input欄多次重複輸入
        uploading:!1, // 為避免圖片檔多次重複上傳
        click:!1, // 為避免多次重複點擊
        focus:!1, // 表示focus正在input欄
        scroll:!1, // 表示捲軸正在滾動
        text:!0, // todo 當出現bootbox時 離線後上線是否還要停留在bootbox
        discon:!1,  // 表示對方斷線 重連時直接從後端抓取資料
        problem:!1, // todo 表示自己網路出現問題 會跟開頭畫面一起使用
        first:!0 // 為避免每次chatSocket重連就GREET一次
    },
    term = {
        name:'',
        matchType:'',
        schoolId:'',
        showSelfMsg_text:'',
        showMsg_text:'',
        showSelfImg_text:'',
        showImg_text:'',
        showSys_text:'',
        showMsgs_text:'',
        emlt_for_status:[],
        timerId_clock: null,
        timerId_writing: null
    },
    chatSocket = null,
    theUI = chatUI(),
    theWS = chatWS(),
    theTerminal = chatTerminal(),
    theGate = checkGate(),
    localData = getLocalData(),
    csrftoken = $('input[name=csrfmiddlewaretoken]').val();

$(document).ready(function() {
    chatroomWS(), bindMsgSend(), bindFileUpload(), disableBackSpace(), installToolTip(), loadLocalData()
});

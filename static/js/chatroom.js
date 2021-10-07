function chatroomWS(){
    if (null==chatSocket){
        var wsUrl = 'ws://'+window.location.host+'/ws/chat/'; 
        chatSocket = new WebSocket(wsUrl);
        chatSocket.onopen = function(){
            console.log("WS connected.");
            chatSocket.send(JSON.stringify({
                'cmd':'open',
                'uuid': localData.uuid
            }));
            if('true'===localStorage.isSaved){
                var data = {};
                var li = ['name', 'matchType', 'school', 'room', 'isBanned', 'status', 'testResult', 'waiting_time'];
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
        // todo 可增加開頭畫面：可篩選不符合條件的瀏覽器 另外流量超載就自動斷線
        // todo 處理後端的自動斷線問題
        // todo localStorage和localData可能造成修改資料的風險 例如修改完localStroge後重開

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            switch (data.type){
                case typeSet.greet: 
                    localData.anonName=data.anonName, localStorage.anonName=data.anonName;
                    theUI.refreshProfile();
                    theUI.showMsgsAsync(data.dialog,function(){  // todo 改用 前端加後端 整合為新的GREET
                        theUI.storeChatLogs(term.showMsgs_text, data.dialog.length);
                        delete term.showMsgs_text;
                        toggle.cmd = !0;
                    });
                    break;

                case typeSet.goto:
                    localData.school = term.schoolId, localStorage.school = term.schoolId;
                    var school =  localData.school.toUpperCase();
                    theUI.gotoSchoolAsync(function(){
                        theUI.showMsg('已抵達'+school + schoolSet[school] +'了😎');
                        theUI.showMsgsAsync(data.dialog,function(){  // todo 改用前端回應就好
                            toggle.cmd = !0;
                        });
                    });
                    break;

                case typeSet.profile:
                    localData.name = term.name, localStorage.name = term.name, localData.matchType = term.matchType, localStorage.matchType = term.matchType;
                    theUI.refreshProfile();
                    var m = [];
                    for (x of localData.matchType){
                        'm'==x?m.push('(男)'):m.push('(女)')
                    }
                    theUI.showSys('名稱：<span class="a-point">'+localData.name+'</span> 配對：<span class="a-point">'+localData.matchType[0]+m[0] +'找'+ localData.matchType[1]+m[1]+'</span> 基本資料已確認完畢');
                    toggle.cmd = !0;
                    break;

                case typeSet.rename:
                    localData.name = term.name, localStorage.name = term.name;
                    theUI.refreshProfile();
                    theUI.showSys('名稱：<span class="a-point">'+localData.name+'</span> 已修改完畢');
                    toggle.cmd = !0;
                    break;

                case typeSet.test:
                    term.testQuestions = data.questions;
                    theUI.clearChatLogs();
                    theUI.showSys('==========<span class="a-point">配對遊戲：共5題</span>==========');
                    theUI.showMsg('以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對<span class="a-point">測試結果相近者進行配對</span>。');
                    processTest(data.questions);
                    localData.status = 1, localStorage.status = '1';
                    localData.inTest=!0,localStorage.inTest='true'; //delete
                    toggle.cmd = !0;
                    break;
                case typeSet.wait:
                    theUI.clearChatLogs();
                    theUI.showSys('等待時間: <span class="a-clock a-point"></span>'),theUI.showClock();
                    localData.status = 2, localStorage.status = '2';
                    localData.isWaiting=!0,localStorage.isWaiting='true'; //delete
                    toggle.cmd = !0;
                    break;
                case typeSet.enter:
                    theUI.clearChatLogs();
                    theUI.showSys('進入聊天室');
                    localData.status = 3, localStorage.status = '3';  // todo 進入坊間後不能進行profile或rename
                    localData.isWaiting=!1,localStorage.isWaiting='false'; //delete
                    toggle.cmd = !0;
                    break;
                case typeSet.leave:
                    theUI.clearChatLogs();
                    theUI.showSys('你已離開聊天室');
                    setTimeout(function(){
                        theUI.showSys('/match即可開始下一次的配對，或用/goto前往其他學校。')
                    },1000)
                    localData.status = 0, localStorage.status = '0';
                    localData.inRoom=!1,localStorage.inRoom='false'; //delete
                    break;
                case typeSet.left:
                    theUI.showSys('對方已離開聊天室');
                    localData.status = 0, localStorage.status = '0';
                    localData.inRoom=!1,localStorage.inRoom='false'; //delete
                    setTimeout(function(){
                        theUI.showSys('可用/match開始下一次的配對 或用/goto前往其他學校')
                    },1000)
                    break;
                case typeSet.wn:
                    // 處理toggle.writing問題 是否內入localData
                    if (data.wn)
                    theUI.showWritingNow(!0);
                    else
                    theUI.showWritingNow(!1); // 可能：打到一半突然停下來 或 將#send-text訊息刪掉
                    break;
                case typeSet.msg:
                    theUI.showWritingNow(!1);
                    theUI.showMsg(data.msg),theUI.unreadTitle($('#send-text').is(':focus'));
                    break;
                case typeSet.msgs: //  後端還未寫MSGS
                    theUI.showWritingNow(!1);
                    var subdata; 
                    for (let i in data.msgs)
                        subdata = data.msgs[i], theUI.showMsg(subdata.msg),theUI.unreadTitle($('#send-text').is(':focus'));
                    break;
                case typeSet.img:
                    theUI.showWritingNow(!1);
                    theUI.showImg(data.img),theUI.unreadTitle($('#send-text').is(':focus'));
                    break;

                case typeSet.error:
                    console.log(data.error); 
                    // 最後會刪掉 不符合的指令在前端就被擋下來 或 若用戶成功繞過前端傳入後讓server自動斷線
            }
        };
        chatSocket.onclose = function(e) {
            console.log('WS disconnected. code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            // 若user沒有被禁用時, 即!0==localData.retry 則自動重連 chatSocket=null ,chatroomWS() 
            // todo 自動重連:用setInterval() 或setTimeout() 最後用theUI.showSys來表示已經斷線且目前連不上
            // todo 自動重連:不能啟動GREET 因此GREET必須修正 只有打開網站的第一次才要GREET
        };
    }
}

function LocalData(){
    this.uuid = $.uuid(),
    this.name = '',
    this.matchType = '',
    this.isBanned = !1,
    this.status = 0, // 1:inTest, 2:isWaiting, 3:inRoom
    this.inTest = !1, // test階段不要有GREET 但wait階段則要有GREET
    this.isWaiting = !1,
    this.inRoom = !1,
    this.hasTested = !1,
    this.lastSaid = 'sys',
    this.anonName = '',
    this.room = '',
    this.school = '',
    this.testResult = [],
    this.waiting_time = '',
    this.chatLogsNum = 0,
    this.chatLogsMaxNum = 250
    for (let i = 0;i<5;i++)
        this['chatLogs'+i.toString()] = ''
}

function getLocalData(){
    var data = new LocalData();
    if (void 0 !== typeof(Storage)){
        if ('true'==localStorage.isSaved){ 
            data.uuid = localStorage.uuid,
            data.name = localStorage.name,
            data.matchType = localStorage.matchType,
            data.isBanned = ('true'===localStorage.isBanned)?!0:!1,
            data.status = +localStorage.status,
            data.inTest = ('true'===localStorage.inTest)?!0:!1,
            data.isWaiting = ('true'===localStorage.isWaiting)?!0:!1,
            data.inRoom = ('true'===localStorage.inRoom)?!0:!1,
            data.hasTested = ('true'===localStorage.hasTested)?!0:!1,
            data.lastSaid = localStorage.lastSaid,
            data.anonName = localStorage.anonName,
            data.room = localStorage.room,
            data.school = localStorage.school,
            data.testResult = JSON.parse(localStorage.testResult),
            data.waiting_time = localStorage.waiting_time,
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
            localStorage.inTest = 'false',
            localStorage.isWaiting = 'false',
            localStorage.inRoom = 'false',
            localStorage.hasTested = 'false',
            localStorage.lastSaid = 'sys',
            localStorage.anonName = '',
            localStorage.room = '',
            localStorage.school = '',
            localStorage.testResult = JSON.stringify(data.testResult),
            localStorage.waiting_time = '',
            localStorage.chatLogsNum = '0',
            localStorage.chatLogsMaxNum = '250'
            for (let i = 0;i<5;i++)
                localStorage['chatLogs'+i.toString()] = ''
            
        }
    }else{
        //todo: 開頭頁面推薦使用最新版的chrome或safari瀏覽器 能支持保留頁面功能 
    }
    return data
}

function loadLocalData(){  // 所有數據已經通過import傳到後端 只需要做theUI就好
    theUI.refreshProfile();
    (''!==localData.school)&&theUI.gotoSchoolAsync();
    switch (localData.status){
        case '1':  // inTest
            theUI.showSys('==========<span class="a-point">配對遊戲：共5題</span>==========');
            theUI.showMsg('以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對<span class="a-point">測試結果相近者進行配對</span>。');
            processTest(data.questions);
            break;
        case '2':  // isWaiting
            theUI.showSys('等待時間: <span class="a-clock a-point"></span>'),theUI.showClock(localData.waiting_time);
            break;
        case '3':  // inRoom
            //pass
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

function bindMsgSending() {
    $("#send-text").on('keypress',function(a) {
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();  
            (void 0 != text && null != text &&"" != text) && text.match(/(\/[a-zA-Z@1-9]+)/i)? (!0==toggle.cmd && theTerminal.command(text)) : (3 === localData.status) ? theWS.msgSendWs(text) : theUI.showSys('你還未完成配對哦!');
            $("#send-text").val('');
            $("#send-text").blur(), $("#send-text").focus();
        }
    })
    $("#send-text").on('input',function(a){
        if (!1 == toggle.writing){
            theWS.writingNowWs(!0), toggle.writing = !0;
        }
    })
    $("#send-text").on('focus',function(a) {
        toggle.focus = !0;
        theUI.scrollToNow(), theUI.unreadTitle(!0);
    })
    $("#send-text").on('blur',function(a) {
        toggle.focus = !1;
        if (!0 == toggle.writing){
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

var chatWS = function(){
    function ms(msg){
        chatSocket.send(JSON.stringify({  //todo: 傳訊息時觸發onerror 而webSocket自動關閉
            'msg':msg
        }))
    }
    function wn(isWriting){
        isWriting = isWriting?'true':'false'
        chatSocket.send(JSON.stringify({
            'wn':isWriting
        }))
    }

    function is(imgUrl){
        chatSocket.send(JSON.stringify({
            'img':imgUrl
        }))
    }

    return{
        msgSendWs:ms,
        writingNowWs:wn,
        imgSendWs:is
    }
}

function bindFileUpload(){
    $("#send-img").fileupload({
        dataType: "json",
        formData:function (form) {
            $('#send-hidden').attr('value',localData.uuid.substr(0,8));  // todo 改傳uuid前8碼
            return form.serializeArray();
        },
        done: function(e, data) {
            if (localData.status === 3)
                ('img_url' in data.result) ? (theUI.showSelfImg(data.result['img_url']),theWS.imgSendWs(data.result['img_url'])):console.log(data.result['error']);
        },
        always:function(e, data) {
            $('#send-hidden').attr('value','');
        }
    })
    $(document).on('drop dragover', function (e) {
        e.preventDefault();
    });
}

function processTest(questions){
    for (let q of questions){ // q為{content:... ,choices:[y,n]}的物件
        theUI.showQuestion(q.content, q.choice, q.type);
    }
    theUI.showQuestion('是否提交答案?', ['提交'], 1).find('.a-0').removeClass('a-0').addClass('a-submit')
    localData.testResult = [], localData.testResult.length = questions.length;
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
        localData.hasTested = !0, localStorage.hasTested = 'true', theTerminal.wait();
    })
    $('#dialog>.a-q:eq(0)').removeClass('d-none');
}

var checkGate = function(){
    // todo:增加中繼站概念 在每次執行玩指令後查看localData 提醒玩家下一步要做什麼 用於取代目前後端dialog
    // 也可作為二次到訪用戶的動態開頭 會紀錄上一次玩家的設定值(存放在localStorage)

    function upd(step = currentStep){
        for (let x in step){
            term[x] && (step[x] = (term[x] === localData[x])?1:2); // 直接在指令中判別就好 之後刪掉
            step[x] = (0===localData[x].length)?0:1;
        }
    }
    function resp(){  // todo 將checkGate.resp()改為checkGate() 其餘upd()和run()不需要
        var dialogs = [];
        if (localData.school.length===0){
            dialogs.push('請先移動到你想交友的學校吧！ 輸入/goto xxx (學校縮寫例如:NTU, NCCU等)')
        }else if(localData.name.length===0){
            dialogs.push('接者請輸入你的配對名稱與配對類型。 輸入/profile name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)')
        }else if(localData.matchType.length===0){
            dialogs.push('請重新輸入你的配對類型與名稱。 輸入/profile name type (配對類型為:fm, mf, mm, ff 四種。 分別為女找男, 男找女, 男找男, 女找女)')
        }else if(localData.testResult.length===0){
            dialogs.push('已確認你所選擇的學校('+localData.school+')與基本資料('+localData.name+', '+localData.matchType +')接者請開始配對吧！ 輸入/match')
        }else if(localData.room.length===0){
            dialogs.push('是否要進行下一次配對 輸入/match \n或選擇重新測試 輸入/retest \n或更改配對用的名稱 輸入/rename \n或移動到其他學校 輸入/goto')
        }
        return dialogs // array 比較適合內容延展
    }
    function run(){
        upd(nextStep);
        var dialogs = resp();
        currentStep = {...nextStep};
        return dialogs
    }

    return {
        update:upd,
        response:resp,
        run:run
    }
}

var chatTerminal = function(){
    function cmd(totalStr){  // 若由'#send-text'發出 則必須透過command()作分流 若由UI發出 則直接調用方法
        var listStr = totalStr.split(' ');
        var cmdStr = listStr[0];
        var wrongMsg = '指令為：<span class="a-point">'+totalStr+'</span> 未符合 '+cmdStr+ ' 指令格式';
        if (commandSet.goto.includes(cmdStr))
            (listStr.length===2 && listStr[1].length>0) ? go(listStr[1]) : theUI.showSys(wrongMsg+'：空格後加上前往的學校縮寫哦 <span class="a-point">/go xxx</span>')
        else if (commandSet.adult.includes(cmdStr))
            a();
        else if (commandSet.leave.includes(cmdStr))
            le();
        else if (commandSet.change.includes(cmdStr))
            cg();
        else if (commandSet.profile.includes(cmdStr))
            (listStr.length===3 &&listStr[1].length>0 && listStr[2].length>0) ? p(listStr[1], listStr[2]) : theUI.showSys(wrongMsg+'：必須依序填入配對用的名稱與配對類型 <span class="a-point">/p 我的名字 fm</span>');
        else if (commandSet.rename.includes(cmdStr))
            (listStr.length==2 &&listStr[1].length>0) ? n(listStr[1]) : theUI.showSys(wrongMsg+'：空格後填入欲修改的名稱 <span class="a-point">/n 我的名字</span>');
        else if (commandSet.retest.includes(cmdStr))
            t();
        else if (commandSet.match.includes(cmdStr))
            m();
        else if (commandSet.reset.includes(cmdStr))
            r();
        else if (commandSet.image.includes(cmdStr))
            _a();
        else
            console.log(cmdStr+" isn't a command."), theUI.showMsg('目前沒有 <span class="a-point">'+cmdStr+'</span> 這項指令😭');
    }

    function go(schoolId){
        schoolId = schoolId.toUpperCase();
        if (!(schoolId in schoolSet)){
            theUI.showSys('目前尚未開放此學校: <span class="a-point">'+schoolId+'</span>');
            return false
        }
        if (schoolId === localData.school){
            theUI.showMsg('你目前已經在 <span class="a-point">'+schoolId +schoolSet[schoolId] +'</span> 了哦');
            return false
        }
        chatSocket.send(JSON.stringify({
            'cmd':'goto',
            'school':schoolId.toLowerCase()
        }));
        term['schoolId'] = schoolId.toLowerCase();
        toggle.cmd = !1;
    }
    function p(name, matchType){ //todo name必須有字數限制 才不會發生問題
        if (!(['mf','mm','fm','ff'].includes(matchType.toLowerCase()))){
            theUI.showSys('配對類型只能選擇: <span class="a-point">fm, mf, mm, ff </span> 四種(分別為女找男, 男找女, 男找男, 女找女)');
            return false
        }
        chatSocket.send(JSON.stringify({
            'cmd':'profile',
            'name':name,
            'matchType':matchType.toLowerCase()
        }));
        term['name'] = name, term['matchType'] = matchType;
        toggle.cmd = !1;
    }
    function n(name){
        chatSocket.send(JSON.stringify({
            'cmd':'rename',
            'name':name,
        }));
        term['name'] = name;
        toggle.cmd = !1;
    }
    function m(){
        (!1==localData.hasTested)?t():w()
    }
    function t(){
        chatSocket.send(JSON.stringify({
            'cmd':'test'
        }));
        toggle.cmd = !1;
    }
    function w(){
        chatSocket.send(JSON.stringify({
            'cmd':'wait',
            'testResult':localData.testResult
        }));
        toggle.cmd = !1;
    }
    function le(){
        chatSocket.send(JSON.stringify({
            'cmd':'leave'
        }));
        toggle.cmd = !1;
    }
    function cg(){
        chatSocket.send(JSON.stringify({
            'cmd':'change'
        }));
        toggle.cmd = !1;
    }
    function a(){

    }
    function r(){

    }
    function _a(){
        if (localData.status === 3)
            $('#send-img').click();
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
        var newElmt_text = '<div class="mb-2 justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-pa a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgReplacing(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        st(newElmt,1);
        localData.lastSaid = 'self',localStorage.lastSaid='self',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSelfMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt, newElmt_text 
    }

    function m(msg){  // todo: 特殊符號', ", <, >等會不會有問題
        var newElmt_text = '<div class="mb-2 d-flex"><p class="a-dialogdiv a-matcher a-pa a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgReplacing(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'anon',localStorage.lastSaid = 'anon',ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showMsg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function sy(msg){
        var newElmt_text = '<div class="mb-2 text-center"><p class="a-dialogdiv a-sys a-pa a-clr"><span class="a-sys a-font">'+msgReplacing(msg)+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt); 
        localData.lastSaid = 'sys',localStorage.lastSaid = 'sys',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSys_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function q(question, choice_list, choice_num=2){  // todo 回答完題目後要有回饋 像是你與多少人的回答相同
        if (2 == choice_num){
            var newElmt_text = 
            '<div class="mb-2 flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div></div>'
        }else if(4 == choice_num){
            var newElmt_text =  
            '<div class="mb-2 flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+ msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-mid a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-0">'+choice_list[0]+'</p><p class="a-choice a-right d-inline-flex a-1">'+choice_list[1]+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-left d-inline-flex a-2">'+choice_list[2]+'</p><p class="a-choice a-right d-inline-flex a-3">'+choice_list[3]+'</p></div></div>'
        }else if(1 == choice_num){
            var newElmt_text =
            '<div class="mb-2 flex-column d-flex a-q"><div class="a-dialogdiv a-matcher a-question a-pa a-clr d-inline"><p class="m-2">'+msgReplacing(question)+'</p></div><div class="a-dialogdiv a-matcher a-answer a-pa a-clr justify-content-evenly d-flex"><p class="a-choice a-top d-inline-flex a-0">'+choice_list[0]+'</p></div></div>'
        }else{
            console.log('不符合格式')
            return false
        }
        var newElmt = $(newElmt_text).addClass('d-none');
        $('#writing').before(newElmt), localData.lastSaid = 'anon',localStorage.lastSaid = 'anon', ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showQuestion_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }


    function wn(isWriting){
        0!==isWriting ?$('#writing').removeClass('invisible'):$('#writing').addClass('invisible')
        (toggle.focus = !0)&& (n(), ut(!0));
    }
    function st(myElmt,num){
        var st ={
            2:'(已送達)',1:'(傳送中)',0:'(未送達)'
        }
        myElmt.find('.a-status:eq(0)').text(st[num])   
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
        var newElmt_text = '<div class="mb-2 justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-pa a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+imgElmt+'</span></p></div>';
        var newElmt = $(newElmt_text);
        $('#writing').before(newElmt),st(newElmt,1);
        localData.lastSaid = 'self',localStorage.lastSaid='self',ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        term['showSelfImg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function i(imgUrl){
        var imgElmt = '<img class="img-fluid a-img" src='+imgUrl+' alt="send again please!"></img>';
        var newElmt_text = '<div class="mb-2 d-flex"><p class="a-dialogdiv a-matcher a-pa a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+imgElmt+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        var newElmt = $(newElmt_text);
         $('#writing').before(newElmt); 
        localData.lastSaid = 'anon',localStorage.lastSaid = 'anon',ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        term['showImg_text'] = newElmt_text; // for storeChatLogs()
        return newElmt
    }

    function c(startTime=null){
        function time(){
            var date = new Date();
            var offsetTime = (date-start)/ 1000;
            var s = parseInt(offsetTime % 60), m = parseInt((offsetTime / 60) % 60), h = parseInt(offsetTime / 60 / 60);
            h = (h < 10) ? ("0" + h) : h;
            m = (m < 10) ? ("0" + m) : m;
            s = (s < 10) ? ("0" + s) : s;
            
            var duration = h + ":" + m;
            $('.a-clock').text(duration);
            
            setTimeout(time, 1000*60);
        } 
        var start = (null!==startTime)?(new Date(startTime)):(new Date());
        localData.waiting_time = start.Format('YYYY-MM-DD hh:mm:ss'), localData.Storage = localData.waiting_time;
        time();
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

    function ll(){
        if (void 0 !== typeof(Storage)){
            var index = (localData.chatLogsNum>=250)?((localData.chatLogsNum/50)%5)+1 : 0 ;
            var last = $('#writing');
            $('#dialog').empty(), $('#dialog').append(last);
            for (let i = 0;i<5;i++){
                (index>=5)&&(index=index-5);
                $('#writing').before(localData['chatLogs'+index.toString()]);
                index++;
            }
        }
    }
    function sl(elmt_text, n=1){ // todo 目前先用50個dialogdiv換行 塞滿200個dialogdiv後開始刪減 之後在用Blob找準確大小
        var index = parseInt(localData.chatLogsNum/50) % 5, isFull = (localData.chatLogsNum>=localData.chatLogsMaxNum)?!0:!1;
        if (isFull){
            localData['chatLogs'+index.toString()] = '',localStorage['chatLogs'+index.toString()] = '';
            localData.chatLogsMaxNum = localData.chatLogsMaxNum +50, localStorage.chatLogsMaxNum = localData.chatLogsMaxNum.toString();
        }
        localData['chatLogs'+index.toString()] = localData['chatLogs'+index.toString()]+elmt_text, localStorage['chatLogs'+index.toString()] = localStorage['chatLogs'+index.toString()]+elmt_text;
        localData.chatLogsNum+= n, localStorage.chatLogsNum = localData.chatLogsNum.toString();
    }

    function rp(){  // todo 加上動畫
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

    function go(callback=null){  //async function
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

    function ms(dialogList, callback=null){  // async function: callback after function has completed
        var i = 0, elmts_text = '';
        for (let dialog of dialogList){
            setTimeout(function(){
                m(dialog),elmts_text +=term.showMsg_text;
            }, i*500);
            i++;
        }
        
        setTimeout(function(){
            term['showMsgs_text'] = elmts_text;
            if ('function'===typeof(callback)){
                callback();  
            }
        }, i*500);
        
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


Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
    "M+": this.getMonth(),
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

var TITLE = "ACard - AnonCard",
    school_url = '/static/img/mark/',
    typeSet = {
        greet:'GREET',
        goto:'GOTO',
        profile:'PROFILE',
        rename:'RENAME',
        test:'TEST',
        wait:'WAIT',
        enter:'ENTER',
        leave:'LEAVE',
        left:'LEFT',
        msg: 'MSG',
        msgs:'MSGS',
        img:'IMG',
        wn:'WN',
        error:'ERROR'
    }, 
    schoolSet = {
        'NCCU':'政治大學',
        'NTU':'臺灣大學',
        'NTNU':'臺灣師範大學',
        'YM':'陽明大學',
        'TNUA':'臺北藝術大學',
        'NTUE':'臺北教育大學',
        'UTAIPEI':'臺北市立大學',
        'SCU':'東吳大學',
        'PCCU':'中國文化大學',
        'SHU':'世新大學',
        'MCU':'銘傳大學',
        'USC':'實踐大學',
        'TTU':'大同大學',
        'TMU':'臺北醫學大學',
        'UKN':'康寧大學',
        'TCPA':'臺灣戲曲學院',
        'NTUST':'臺灣科技大學',
        'NTUT':'臺北科技大學',
        'NTUNHS':'臺北護理健康大學',
        'NTUB':'臺北商業大學',
        'CUTE':'中國科技大學',
        'TAKMING':'德明財經科技大學',
        'CUST':'中華科技大學',
        'TPCU':'臺北城市科技大學',
        'NTPU':'臺北大學',
        'NTUA':'臺灣藝術大學',
        'DILA':'法鼓文理學院',
        'MMC':'馬偕醫學院',
        'FJU':'輔仁大學',
        'TKU':'淡江大學',
        'HFU':'華梵大學',
        'AU':'真理大學',
        'OIT':'亞東技術學院',
        'LIT':'黎明技術學院',
        'MKC':'馬偕醫護管理專科學校',
        'CTCN':'耕莘健康管理專科學校',
        'TNU':'東南科技大學',
        'HWU':'醒吾科技大學',
        'JUST':'景文科技大學',
        'HWH':'華夏科技大學',
        'CHIHLEE':'致理科技大學',
        'HDUT':'宏國德霖科技大學',
        'TUMT':'台北海洋科技大學',
        'MCUT':'明志科技大學',
        'SJU':'聖約翰科技大學',
        'NOU':'空中大學',
        'NTOU':'臺灣海洋大學',
        'CUFA':'崇右影藝科技大學',
        'CKU':'經國管理暨健康學院',
        'NTSU':'體育大學',
        'NCU':'中央大學',
        'CYCU':'中原大學',
        'CGU':'長庚大學',
        'YZU':'元智大學',
        'KNU':'開南大學',
        'UCH':'健行科技大學',
        'VNU':'萬能科技大學',
        'CGUST':'長庚科技大學',
        'NANYA':'南亞技術學院',
        'HSC':'新生醫護管理專科學校',
        'LHU':'龍華科技大學',
        'MUST':'明新科技大學',
        'MITUST':'敏實科技大學',
        'NTHU':'清華大學',
        'NCTU':'交通大學',
        'NYCU':'陽明交通大學',
        'HCU':'玄奘大學',
        'CHU':'中華大學',
        'YPU':'元培醫事科技大學',
        'NUU':'聯合大學',
        'YDU':'育達科技大學',
        'JENTE':'仁德醫護管理專科學校',
        'NTCU':'臺中教育大學',
        'NTUPES':'臺灣體育運動大學',
        'NCHU':'中興大學',
        'THU':'東海大學',
        'FCU':'逢甲大學',
        'PU':'靜宜大學',
        'CSMU':'中山醫學大學',
        'CMU':'中國醫藥大學',
        'ASIA':'亞洲大學',
        'NUTC':'臺中科技大學',
        'NCUT':'勤益科技大學',
        'HUST':'修平科技大學',
        'CYUT':'朝陽科技大學',
        'HK':'弘光科技大學',
        'LTU':'嶺東科技大學',
        'CTUST':'中臺科技大學',
        'OCU':'僑光科技大學',
        'NCUE':'彰化師範大學',
        'DYU':'大葉大學',
        'MDU':'明道大學',
        'CCUT':'中州科技大學',
        'CTU':'建國科技大學',
        'TUNTECH':'雲林科技大學',
        'NFU':'虎尾科技大學',
        'TWU':'環球科技大學',
        'NCNU':'暨南國際大學',
        'NKUT':'南開科技大學',
        'NCYU':'嘉義大學',
        'TTC':'大同技術學院',
        'CCU':'中正大學',
        'NHU':'南華大學',
        'TOKO':'稻江科技暨管理學院',
        'CJC':'崇仁醫護管理專科學校',
        'WFU':'吳鳳科技大學',
        'NCKU':'成功大學',
        'TNNUA':'臺南藝術大學',
        'NUTN':'臺南大學',
        'TSU':'台灣首府大學',
        'CTBC':'中信金融管理學院',
        'CJCU':'長榮大學',
        'NTIN':'臺南護理專科學校',
        'CNU':'嘉南藥理大學',
        'TUT':'台南應用科技大學',
        'FEU':'遠東科技大學',
        'HWAI':'中華醫事科技大學',
        'MHCHCM':'敏惠醫護管理專科學校',
        'STUST':'南臺科技大學',
        'KSU':'崑山科技大學',
        'NSYSU':'中山大學',
        'NKNU':'高雄師範大學',
        'NUK':'高雄大學',
        'ISU':'義守大學',
        'KMU':'高雄醫學大學',
        'NKUHT':'高雄餐旅大學',
        'NKUST':'高雄科技大學',
        'KYU':'高苑科技大學',
        'WZU':'文藻外語大學',
        'TF':'東方設計大學',
        'FOTECH':'和春技術學院',
        'SZMC':'樹人醫護管理專科學校',
        'YUHING':'育英醫護管理專科學校',
        'STU':'樹德科技大學',
        'FY':'輔英科技大學',
        'CSU':'正修科技大學',
        'OUK':'高雄市立空中大學',
        'NPTU':'屏東大學',
        'NPUST':'屏東科技大學',
        'TZUHUI':'慈惠醫護管理專科學校',
        'TAJEN':'大仁科技大學',
        'MEIHO':'美和科技大學',
        'NTTU':'臺東大學',
        'NTC':'臺東專科學校',
        'NDHU':'東華大學',
        'TCU':'慈濟大學',
        'CIT':'臺灣觀光學院',
        'TCUST':'慈濟科技大學',
        'DAHAN':'大漢技術學院',
        'NIU':'宜蘭大學',
        'FGU':'佛光大學',
        'FIT':'蘭陽技術學院',
        'SMC':'聖母醫護管理專科學校',
        'NPU':'澎湖科技大學',
        'NQU':'金門大學'
    },
    schoolImgSet = new Set([
        'NCCU', 'NTU', 'SCU', 'PCCU', 'FJU', 'TKU', 'NTHU', 'NCTU', 'NCKU'
    ]),
    commandSet = {
        goto:['/goto','/go'],
        adult:['/adult','/a'],
        leave:['/leave','/le'],
        change:['/change','/cg'],
        profile:['/profile','/p'],
        rename:['/rename','/n'],
        match:['/match','/m'],
        retest:['/retest','/t'],
        reset:['/reset','/r'],
        image:['/image','/@']
    },
    toggle ={  // 不會放在localData中 只為配合eventHandler 只在同一個function有效
        writing:!1,
        click:!1,
        focus:!1,
        scroll:!1,
        cmd:!0,  // 取代localData.cmdEnabled和localData.textEnabled 差別在於需要離線保存或每次上線都重新載入
        text:!0 // todo 當出現bootbox時 離線後上線是否還要停留在bootbox
    },
    unreadMsg = 0, // 取代 localData.unreadMsg
    term = {},
    chatSocket = null,
    theUI = chatUI(),
    theWS = chatWS(),
    theTerminal = chatTerminal(),
    theGate = checkGate(),
    localData = getLocalData(),
    currentStep = {
        name:(0===localData.name.length) ? 0 : 1,
        school:(0===localData.school.length) ? 0 : 1,
        matchType:(0===localData.matchType.length) ? 0 : 1,
        testResult:(0===localData.testResult.length) ? 0 : 1,
        room:(0===localData.room.length) ? 0 : 1
    },
    nextStep = {...currentStep}, // todo 刪除 只要留currentStep就好
    csrftoken = $('input[name=csrfmiddlewaretoken]').val();

$(document).ready(function() {
    chatroomWS(), bindMsgSending(), bindFileUpload(), disableBackSpace(), installToolTip(),loadLocalData()
});

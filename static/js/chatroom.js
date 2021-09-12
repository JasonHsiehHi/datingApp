function chatroomWS(){
    if (null==chatSocket){
        var wsUrl = 'ws://'+window.location.host+'/ws/chat/'; 
        chatSocket = new WebSocket(wsUrl);
        chatSocket.onopen = function(){
            console.log("WS connected.")
            chatSocket.send(JSON.stringify({
                'cmd':'open',
                'uuid': localData.uuid
            }));
            $("#send-text").focus();
        };
        // todo 可增加開頭畫面：可篩選不符合條件的瀏覽器 另外流量超載就自動斷線

        chatSocket.onmessage = function(e) {
            var data = JSON.parse(e.data);
            switch (data.type){
                case typeSet.greet: 
                    localData.anonName=data.anonName, localStorage.anonName=data.anonName;
                    theUI.showDialogsAsync(data.dialog,function(){
                        localData.cmdEnabled = !0, localStorage.cmdEnabled = 'true';
                    });
                    break;
                case typeSet.goto:
                    theUI.gotoSchoolAsync(term.schoolId,function(){
                        localData.school = term.schoolId, localStorage.school = term.schoolId;
                        theUI.showDialogsAsync(data.dialog,function(){
                            localData.cmdEnabled = !0, localStorage.cmdEnabled = 'true';
                        });
                    });
                    delete term.schoolId;
                    break;
                case typeSet.profile:
                    localData.name = term.name, localStorage.name = term.name, localData.matchType = term.matchType, localStorage.matchType = term.matchType;
                    var m = [];
                    for (x of term.matchType){
                        'm'==x?m.push('(男)'):m.push('(女)')
                    }
                    theUI.showSys('名稱：'+term.name+' 配對：'+term.matchType[0]+m[0] +'找'+ term.matchType[1]+m[1]+' 基本資料已確認完畢'); // todo:輸入的關鍵字要變色
                    localData.cmdEnabled = !0, localStorage.cmdEnabled = 'true';
                    delete term.name, delete term.matchType;
                    break;                
                case typeSet.name:
                    localData.name = term.name, localStorage.name = term.name;
                    theUI.showSys('名稱：'+term.name+' 已修改完畢');
                    localData.cmdEnabled = !0, localStorage.cmdEnabled = 'true';
                    delete term.name;
                    break;
                case typeSet.test:
                    const testQuestions = data.questions;
                    processTest(testQuestions);
                    localData.cmdEnabled = !0, localStorage.cmdEnabled = 'true';
                    break;
                case typeSet.wait:
                    // 加上等待計時時鐘 theUI.showClock()
                    !1==localData.isWaiting&&(theUI.clearChatLogs(),theUI.showSys('計時開始'),localData.isWaiting=!0,localStorage.isWaiting='true');
                    break;
                case typeSet.enter:
                    !0==localData.isWaiting&&(theUI.clearChatLogs(),theUI.showSys('進入聊天室'),localData.isWaiting=!1,localStorage.isWaiting='false');
                    break;
                case typeSet.leave:
                    !0==localData.inRoom&&(theUI.showSys('你已離開聊天室'),localData.inRoom=!1,localStorage.inRoom='false');
                    break;
                case typeSet.left:
                    !0==localData.inRoom&&(theUI.showSys('對方已離開聊天室'),localData.inRoom=!1,localStorage.inRoom='false');
                    setTimeout(function(){
                        theUI.showSys('可用/match開始下一次的配對 或用/goto前往其他學校')
                    },1000)
                    break;
                case typeSet.msg:
                    theUI.showWritingNow(!1);
                    theUI.showMsg(data.msg);
                    theUI.unreadTitle($('#send-text').is(':focus'));
                    break;
                case typeSet.msgs: //  後端還未寫MSGS
                    theUI.showWritingNow(!1);
                    var subdata; 
                    for (let i in data.msgs)
                        subdata = data.msgs[i], theUI.showMsg(subdata.msg);
                    theUI.unreadTitle($('#send-text').is(':focus'));
                    break;
                case typeSet.wn:
                    // 處理toggle.writing問題 是否內入localData
                    if (data.wn)
                    theUI.showWritingNow(!0);
                    else
                    theUI.showWritingNow(!1); // 可能：打到一半突然停下來 或 將#send-text訊息刪掉
                    break;
                case typeSet.error:
                    console.log(data.error);
            }
        };
        chatSocket.onclose = function(e) {
            console.log('WS disconnected code:'+e.code+"  ,reason:"+e.reason), chatSocket = null;
            // 若user沒有被禁用時, 即!0==localData.retry 則自動重連 chatSocket=null ,chatroomWS() 
            // 自動重連:用setInterval() 或setTimeout()
        };
    }
}

function LocalData(){
    this.uuid = $.uuid(),
    this.name = '',
    this.isBanned = !1,
    this.isWaiting = !1,
    this.inRoom = !1,
    this.hasTested = !1,
    this.unreadMsg = 0,
    this.lastSaid = 'sys',
    this.textEnabled = !0, // bootbox觸發時不能輸入
    this.cmdEnabled = !0, // 不能重複輸入command
    this.anonName = '',
    this.room = '',
    this.school = '',
    this.schoolImg = '', // LocalStorage也要加上
    this.matchType = 'mf',
    this.testResult = [],
    this.chatLogs = {},
    this.chatNum = 0
}

function getLocalData(){
    var data = new LocalData();
    if (void 0 !== typeof(Storage)){
        if ('true'==localStorage.isSaved){ 
            data.uuid = localStorage.uuid,
            data.name = localStorage.name,
            data.isWaiting = ('true'===localStorage.isBanned)?!0:!1,
            data.isWaiting = ('true'===localStorage.isWaiting)?!0:!1,
            data.inRoom = ('true'===localStorage.inRoom)?!0:!1,
            data.hasTested = ('true'===localStorage.inRoom)?!0:!1,
            data.unreadMsg = +localStorage.unreadMsg,
            data.lastSaid = localStorage.lastSaid,
            data.textEnabled = ('true'===localStorage.textEnabled)?!0:!1,
            data.cmdEnabled = ('true'===localStorage.cmdEnabled)?!0:!1,
            data.anonName = localStorage.anonName,
            data.room = localStorage.room,
            data.school = localStorage.school,
            data.matchType = localStorage.matchType,
            data.testResult = JSON.parse(localStorage.testResult),
            data.chatLogs = JSON.parse(localStorage.chatLogs),
            data.chatNum = +localStorage.chatNum
        }else{
            localStorage.uuid = data.uuid,
            localStorage.name = '',
            localStorage.isBanned = 'false',
            localStorage.isWaiting = 'false',
            localStorage.inRoom = 'false',
            localStorage.hasTested = 'false',
            localStorage.unreadMsg = '0',
            localStorage.lastSaid = 'sys',
            localStorage.textEnabled = 'true',
            localStorage.cmdEnabled = 'true',
            localStorage.anonName = '',
            localStorage.room = '',
            localStorage.school = '',
            localStorage.matchType = 'mf',
            localStorage.testResult = JSON.stringify(data.testResult),
            localStorage.chatLogs = JSON.stringify(data.chatLogs),
            localStorage.chatNum = '0',
            localStorage.isSaved = 'true'
        }
    }else{
        //bootbox 推薦使用最新版的chrome或safari瀏覽器 能支持保留頁面功能 
    }
    return data
}

function setLocalStorage(dataObj){
    for (var prop in dataObj){
        var value = dataObj[prop], valueType = typeof(value);
        if ('string' === valueType)
            localStorage.setItem(prop, value);
        else if ('boolean' === valueType)
            !0==value?localStorage.setItem(prop, 'true'):localStorage.setItem(prop, 'false');
        else if ('number' === valueType)
            localStorage.setItem(prop, value.toString());
        else if ('object' === valueType)
            localStorage.setItem(prop, JSON.stringify(value));
        else
            console.log(prop+": unable to convert string.")
    }
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
    $("#send-text").on('keypress',function(a) { // todo: input的資料是否可能構成XSS攻擊 以及直接用console提交資料的問題
        if (13 == a.which || 13 == a.keyCode){
            a.preventDefault();
            var text = $("#send-text").val();
            (void 0 != text && null != text &&"" != text) && text.match(/(\/[a-zA-Z]+)/i)? (!0==localData.cmdEnabled && theTerminal.command(text)) : (!0==localData.inRoom) ? theWS.msgSendWs(text) : theUI.showSys('你還未完成配對哦!');
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

    return{
        msgSendWs:ms,
        writingNowWs:wn,
    }
}

function bindFileUpload(){
    $("#send-img").fileupload({
        url:'/chat/upload_photo',
        type:'POST',
        dataType: "json",
        headers: {
            'X-CSRFToken': csrftoken
        },
        done: function(e, data) {
            //theUI.showSelfImg(data.result['img_url'])
        }
    })
}

function processTest(questions){
    for (let q of questions){ //q為{content:... ,choice:....}的物件
        
    }
    
    // 不使用 theUI.showMsg() 因為對話框不一樣且必須能回傳答案 改用theUI.showQuestion()

    $('#dialog').find('.a-question').each(function(){ //每一個都要加上eventhandler
        // 先用.addClass('d-none')藏起來 在慢慢放出來.removeClass('d-none') 
        $(this).find('.yes').on('click',function(e) {

        })
        $(this).find('.no').on('click',function(e) {

        })
    })
    // 當localData.testResult.length >= questions.length時觸發傳送並清除題目
    // theTerminal.wait() 和 theUI.clearChatLogs()

}
// todo:增加中繼站概念 在每次執行玩指令後查看localData 提醒玩家下一步要做什麼
var chatTerminal = function(){
    function cmd(totalStr){  // 若由'#send-text'發出 則必須透過command()作分流 若由UI發出 則直接調用方法
        var listStr = totalStr.split(' ');
        var cmdStr = listStr[0];
        if (commandSet.goto.includes(cmdStr))
            (2==listStr.length)?go(listStr[1]):theUI.showSys('未符合指令格式'); // todo:可改為多了或少了會有不同的狀況
        else if (commandSet.test.includes(cmdStr))
            t();
        else if (commandSet.adult.includes(cmdStr))
            a();
        else if (commandSet.leave.includes(cmdStr))
            le();
        else if (commandSet.change.includes(cmdStr))
            cg();
        else if (commandSet.profile.includes(cmdStr))
            (3==listStr.length)?p(listStr[1], listStr[2]):theUI.showSys('未符合指令格式');
        else if (commandSet.name.includes(cmdStr))
            (2==listStr.length)?n(listStr[1]):theUI.showSys('未符合指令格式');
        else if (commandSet.match.includes(cmdStr))
            m();
        else if (commandSet.reset.includes(cmdStr))
            r();
        else if (commandSet.image.includes(cmdStr))
            _a();
        else
            console.log(cmdStr+" isn't a command.");
    }

    function go(schoolId){
        if (!(schoolId.toUpperCase() in schoolSet)){
            theUI.showSys('目前尚未開放: '+schoolId);
            return false
        }
        chatSocket.send(JSON.stringify({
            'cmd':'goto',
            'school':schoolId.toLowerCase()
        }));
        term['schoolId'] = schoolId;
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function p(name, matchType){
        if (!(['mf','mm','fm','ff'].includes(matchType.toLowerCase()))){
            theUI.showSys('只能選擇: mf(男找女), mm(男找男), fm(女找男), ff(女找女)');
            return false
        }
        chatSocket.send(JSON.stringify({
            'cmd':'profile',
            'name':name,
            'matchType':matchType.toLowerCase()
        }));
        term['name'] = name, term['matchType'] = matchType;
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function n(name){
        chatSocket.send(JSON.stringify({
            'cmd':'profile',
            'name':name,
        }));
        term['name'] = name;
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function m(){
        (!1==localData.hasTested)?t():w()
    }
    function t(){
        chatSocket.send(JSON.stringify({
            'cmd':'test'
        }));
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function w(){
        // test全部的問題填答完後會自動發送theTerminal.wait()
        chatSocket.send(JSON.stringify({
            'cmd':'wait',
            'result':localData.testResult
        }));
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function le(){
        chatSocket.send(JSON.stringify({
            'cmd':'leave'
        }));
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function cg(){
        chatSocket.send(JSON.stringify({
            'cmd':'change'
        }));
        localData.cmdEnabled = !1, localStorage.cmdEnabled = 'false';
    }
    function a(){

    }
    function r(){

    }
    function _a(){
         
    }
    return{
        command:cmd,
        goto:go,
        profile:p,
        name:n,
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
    msg = msg.replace(/(\/[a-zA-Z]+ )/g,"<span class=\"a-cmd\">$1 </span>");
    msg = msg.replace(/(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g, "<a onclick=\"window.open('$1','_blank')\">$1</a>");
    return msg
}

var chatUI = function(){
    function sm(msg){
        var status = null;
        var newElmt = '<div class="mb-2 justify-content-end d-flex"><span class="a-status a-self text-end"><span class="d-block"></span><span class="d-block">'+timeAMPM(new Date())+'</span></span><p class="a-dialogdiv a-self a-pa a-clr d-inline-flex"><span class="a-tri a-self"></span><span>'+msgReplacing(msg)+'</span></p></div>';
        st(newElmt,1);
        newElmt = $('#writing').before(newElmt), localData.lastSaid = 'self',localStorage.lastSaid='self';
        localData.chatNum++,localStorage.chatNum++,localData.chatLogs[localData.chatNum] = [0,newElmt],localStorage.chatLogs[localStorage.chatNum] = [0,newElmt];
        ut(!1);
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
        return newElmt

    }

    function m(msg){
        var newElmt = '<div class="mb-2 d-flex"><p class="a-dialogdiv a-matcher a-pa a-clr d-inline-flex"><span class="a-tri a-matcher"></span><span>'+msgReplacing(msg)+'</span></p><span class="a-status a-matcher">'+timeAMPM(new Date())+'</span></div>';
        newElmt = $('#writing').before(newElmt), localData.lastSaid = 'anon',localStorage.lastSaid = 'anon';
        localData.chatNum++,localStorage.chatNum++,localData.chatLogs[localData.chatNum] = [1,newElmt],localStorage.chatLogs[localStorage.chatNum] = [1,newElmt];
        ut(!1);
        toggle.focus == !0 && toggle.scroll == !1 && (n(), ut(!0));
        return newElmt
    }

    function sy(msg){
        var newElmt = '<div class="mb-2 text-center"><p class="a-dialogdiv a-sys a-pa a-clr"><span class="a-sys a-font">'+msgReplacing(msg)+'</span></p></div>'
        newElmt = $('#writing').before(newElmt), localData.lastSaid = 'sys',localStorage.lastSaid = 'sys';
        localData.chatNum++,localStorage.chatNum++,localData.chatLogs[localData.chatNum] = [2,newElmt],localStorage.chatLogs[localStorage.chatNum] = [2,newElmt];
        ut(!1);
        
        toggle.focus == !0 &&toggle.scroll == !1 && (n(), ut(!0));
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

    }

    function i(imgUrl){

    }

    function c(){

    }

    function ut(hasRead){
        hasRead?(localData.unreadMsg=0,localStorage.unreadMsg=0, document.title=TITLE):(localData.unreadMsg+=1,localStorage.unreadMsg+=1, document.title='('+localData.unreadMsg+')' + TITLE)
    }

    function cl(){
        $('#dialog').empty(),localData.chatLogs={},localStorage.chatLogs={},localData.chatNum=0,localStorage.chatNum=0
    }


    function ll(){
        if (void 0 === typeof(Storage)){
            $('#dialog').empty();
            for (let l in localData.chatLogs)
                $('#writing').before(l[1]);
        }
        n();
    }

    function go(school_id, callback){  //async function
        var img_url = school_url+school_id+'.png';
        $('#mark-after>img').attr('src', img_url);
        
    }

    function d(dialogList, callback){  // async function: callback after function has completed.
        var i = 0; 
        for (let dialog of dialogList){
            setTimeout(function(){
                m(dialog);
            }, i*500);
            i++;
        }
        if ('function'===typeof(callback)){
            setTimeout(function(){
                callback()
            }, i*500);
        }
    }
    function q(){

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
        gotoSchoolAsync:go,
        showDialogsAsync:d

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


var TITLE = "ACard - AnonCard",
    school_url = '/static/img/mark/',
    typeSet = {
        greet:'GREET',
        goto:'GOTO',
        profile:'PROFILE',
        name:'NAME',
        test:'TEST',
        wait:'WAIT',
        enter:'ENTER',
        leave:'LEAVE',
        left:'LEFT',
        msg: 'MSG',
        msgs:'MSGS',
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
        name:['/name','/n'],
        test:['/test','/t'],
        match:['/match','/m'],
        reset:['/reset','/r'],
        image:['/image','/@']
    },
    toggle ={  // 不會放在localData中 只為配合eventHandler 只在同一個function有效
        writing:!1,
        click:!1,
        focus:!1,
        scroll:!1
    },
    term = {},
    chatSocket = null,
    theUI = chatUI(),
    theWS = chatWS(),
    theTerminal = chatTerminal(),
    localData = getLocalData(),
    csrftoken = $('input[name=csrfmiddlewaretoken]').val();

$(document).ready(function() {
    chatroomWS(), bindMsgSending(), bindFileUpload(), disableBackSpace(), installToolTip()
});

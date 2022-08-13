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
        for(let [key, value] of Object.entries(loginData.onoff_dict)){
            (value !== 1) && li_others.remove(key);
        }

        var text;
        if (0 === li_others.length){
            text = '目前房間內剩你一人...';
        }else{
            var name_list = li_others.map(uuid => loginData.player_dict[uuid][0]);
            text = '<span class="a-point">'+name_list.join(', ')+'</span> 目前待在房間中';
        }
        (!0 === isDirected) && theUI.showSys(text);
        return text
    }

    function art(name, btn_css_id, isDirected=false){  //something may be gain and won't put into inventory
        var text = '獲得物品<a style="text-decoration:none;" onclick="$(\''+ btn_css_id +'\').click()" class="a-point">'+ name+ '[查看]</a>！';
        if (!0 === isDirected){
            theUI.showSys(text);
            if (!1 === localData.isMuted && !1 === toggle.focus){
                document.getElementById("audio-obtain").play();
            }
        }
        return text     
    }

    function arn(article_name, isDirected=false){  // the article of the player be put into inventory
        var article = loginData.tag_json[article_name];
        $('#atag-'+article_name).removeAttr('onclick').removeAttr('id');
        // gameLogs的資料沒變 重整後會回到原來的狀況 影響不大

        var text = '獲得物品<a style="text-decoration:none;" id="atag-'+article_name+'" onclick="$(\'#'+ article_name +'-btn\').click()" class="a-point">'+ article[0]+ '[查看]</a>！';
        if (!0 === isDirected){
            theUI.showSys(text);
            if (!1 === localData.isMuted && !1 === toggle.focus){
                document.getElementById("audio-obtain").play();
            }
        }
        return text
    }

    function ari(article_name){
        var article = loginData.tag_json[article_name];
        var dialogs = [[arn(article_name), !1,'s']];
        var part_di = article[1].map( msg => [msg, !1, 's'] );
        dialogs = dialogs.concat(part_di);
        return dialogs
    }

    function arp(article_name, indexs, listToDialogs = true){
        var article = loginData.tag_json[article_name];
        var result = [];
        if ( !0 === listToDialogs ){
            var part_di;
            for (let i of indexs){
                if (article[i].length > 0) {
                    part_di = article[i].map( msg => [msg, !1, 'a'] );
                    result = result.concat(part_di);  // result :[[msg1, !1, 'a'],[msg2, !1, 'a'],[msg3, !1, 'a']....]
                }
            }
        }else{
            var text_li = [];
            for (let i of indexs){
                if (article[i].length > 0) {
                    text_li = text_li.concat(article[i]);
                    text_li.push('<br>');
                }
            }
            text_li.pop();
            result = [[text_li.join('<br>'), !1, 'a']];
        }
        return result
    }

    function prl(){
        $.ajax({
            type: 'GET',
            url: '/chat/start_game/cheat_game/prolog',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    loginData.tag_int = data.tag_int, refreshStartBtn();
                    loginData.tag_json = data.tag_json, refreshGameTagAll();
                    loadSidebarbyRole(loginData.tag_json['role']);
                    replyMethod(),  retakeMethod();
                    
                    var li = [...story_dialogs, ...data.guest_dialogs, ...ari('card'), ...ari('paper'), ...arp('paper', [3])];
                    
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
        articleName:arn,
        articleInfo:ari,
        articlePart:arp,
        prolog:prl,
        
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
                        loginData.tag_json['interact'][player_uuid] = 2, refreshGameTag(player_uuid);
                        loginData.tag_int = 2;
                        loginData.tag_json['retake'] = [player_uuid, data['time']];
                        refreshStartBtn();

                        showNotice('已將紙條傳給 '+others[player_uuid][0]+' ！');
                        theWS.callSendWs('inform',['target', player_uuid], ['meInGroup', false], ['message', 'pass'],['hidden', player_uuid] ,['tag', 2]);
                        $('#sidebar').offcanvas('hide');
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
                    loginData.tag_json['interact'] = data['self_interact'], refreshGameTagAll();
                    loginData.tag_int = 0;
                    refreshStartBtn();
                    loginData.tag_json['paper'] = data['self_paper'];
                    loadTagfromDB(loginData.tag_json['role']);
                    refreshInventory('paper');

                    theWS.callSendWs('inform',['target', 'room'], ['meInGroup', true], ['message', data['opposite_data']],['hidden', player_uuid], ['tag', 3]);
                    showNotice('成功與 '+others[player_uuid][0]+' 互換紙條！');
                    var di = [[gameGate.articleName('paper'), !1, 's'],...gameGate.articlePart('paper', [3, 4], false)];
                    theUI.showStoryAsync(di, interval=0);
                    theUI.scrollToNow();
                    theUI.storeChatLogs(di, di.length, 'gameLogs');
                    $('#sidebar').offcanvas('hide');

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
                $('#match-modal-form p.a-error').text('你已寄送配對邀請或已將紙條傳給其他人！（但對方可能還沒接受）');
                return false
            }
            if (!1 === [0,1].includes(loginData.tag_int)){  // the last check
                $('#match-modal-form p.a-error').text('你現在不能寄送配對邀請哦！');
                return false
            }
            if (7 === loginData.tag_json['interact'][player_uuid]){
                $('#match-modal-form p.a-error').text('對方已經與其他人成功配對了');
                return false
            }
            if (4 !== loginData.tag_json['interact'][player_uuid]){  // the last check
                $('#match-modal-form p.a-error').text('對方現在不能與你配對！');
                return false
            }

            $.ajax({
                type: 'GET',
                url: '/chat/start_game/cheat_game/match/' + player_uuid,
                dataType: "json",
                success: function(data) {
                    if (!0 === data['result']){
                        loginData.tag_json['interact'][player_uuid] = 5; refreshGameTag(player_uuid);
                        loginData.tag_int = 2;
                        loginData.tag_json['retake'] = [player_uuid, data['time']];
                        refreshStartBtn();

                        showNotice('已送出配對邀請給 '+others[player_uuid][0]+' ！');
                        theWS.callSendWs('inform', ['target', player_uuid], ['meInGroup', false], ['message', 'match'], ['hidden', player_uuid], ['tag', 4]);
                        $('#sidebar').offcanvas('hide');
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
        if (3 === loginData.tag_int){  // the last check
            showNotice('你已經接受過其他人的配對了哦！');
            return false
        }
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
                    loginData.tag_json['interact'][player_uuid] = 7, refreshGameTag(player_uuid);
                    loginData.tag_int = 3;
                    refreshStartBtn();

                    showNotice('與 '+others[player_uuid][0]+' 成功配對。 已建立房間，等待中...');
                    theWS.callSendWs('inform', ['target', 'room'], ['meInGroup', true], ['message', data['isWon']],['hidden', player_uuid], ['tag', 5]);
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

function replyMethod(){
    if (!0 === hasBound_replyMethod)
        return false
    hasBound_replyMethod = !0;
    $("#send-form").on('submit',function(e){
        e.preventDefault();

        if (0 !== loginData.tag_int){
            theUI.showSys('朋友冷靜，你已經在這張<span class="a-point">紙條</span>上留過答案或是已寄送配對邀請了哦！');
            //theUI.scrollToNow();
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
                    loginData.tag_json['paper'][4].push(data.answer);
                    var text = '感謝你的回答！ 你已在<span class="a-point">紙條</span>上留下答案，可開啟左側玩家名單將<span class="a-point">紙條</span>傳給其他人。';
                    theUI.showSys(text);
                    theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
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

function retakeMethod(){
    if (!0 === hasBound_retakeMethod)
        return false
    hasBound_retakeMethod = !0;
    // $('#start-btn')
    $('#start-btn,#start-strip-btn').off('click');
    $('#start-btn,#start-strip-btn').on('click',function(e){
        var retake_uuid = loginData.tag_json['retake'][0];
        var tag = loginData.tag_json['interact'][retake_uuid];
        var retake_str = (2===tag)?'紙條':'邀請';
        if (2 !== loginData.tag_int){  // last check
            showNotice('你還沒有把紙條傳出去或寄送出配對邀請哦！');
            return false
        }
        if (-1 !== loginData.onoff_dict[retake_uuid] && new Date() < new Date(loginData.tag_json['retake'][1])){  // last check
            showNotice('對方可能正在猶豫與思考，必須超過3分種，才能收回你的'+retake_str+'哦！');
            return false
        }

        $.ajax({
            type: 'GET',
            url: '/chat/start_game/cheat_game/retake',
            dataType: "json",
            success: function(data) {
                if (!0 === data['result']){
                    if (-1 !== loginData.onoff_dict[retake_uuid])
                        loginData.tag_json['interact'][retake_uuid] -= 1, refreshGameTag(retake_uuid);
                    else
                        refreshPlayer(retake_uuid);

                    loginData.tag_int = 1; 
                    loginData.tag_json['retake'] = ['', null];
                    refreshStartBtn();
                    
                    showNotice('收回了寄給'+others[retake_uuid][0]+'的'+retake_str+'！');
                    theWS.callSendWs('inform', ['target', retake_uuid], ['meInGroup', false], ['message', retake_str],['hidden', retake_uuid], ['tag', 6]);
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

function bindGameMsgSend() {  // to overload bindMsgSend() in chatroom.js
    if (2 === loginData.status){
        $("#send-text").attr('placeholder', '在此回答問題...');
    }else if (3 === loginData.status){
        $("#send-text").attr('placeholder', '說點什麼呢...');
    }
    
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

function articleMethod(name){
    // $('#'+name+'-btn')
    $('#'+name+'-btn,#'+name+'-strip-btn').on('click',function(a){
        var article = loginData.tag_json[name];
        var article_name = article[0].split('').map(s => s+' ').join('');
        $('#inventory-modal .modal-title').text(article_name);
        var part_con, part_elmt, elmts='';
        elmts += '<div class="modal-body a-picture"><img src="/static/chat/img/'+ game_name +'/' + name + '.png" alt="'+ name + '"></div>'
        for (let part of article.slice(2)){
            if (part.length > 0){
                part_con = part.map( msg => '<p>'+msg+'</p>').join('');
                part_elmt = '<div class="modal-body">'+ part_con +'</div>';
                elmts += part_elmt;
            }
        }
        $('#inventory-modal-content').html(elmts);
        $('#inventory-modal').modal('show');
    })

}

function putIntoInventory(name){
    var article = loginData.tag_json[name];
    var article_name = article[0].split('').map(s => s+' ').join('');
    var sidebarElmt_text = '<div class="list-group-item a-div d-flex js-generated" id="article-'+ name+'"><div class="a-circle a-sidebar"><img src="/static/chat/img/'+ game_name +'/' + name + '.png" alt="'+ name + '"></div><div class="ps-1 pt-1 flex-grow-1"><div class="d-flex justify-content-between"><div class="mb-0 a-article a-sidebar"><span class="a-title a-sidebar" data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="'+article_name+'">'+article_name+'</span></div><button class="btn btn-warning a-sidebar btn-sm" id="'+name+'-btn" type="button">查看</button></div></div></div>';
    var stripbarElmt_text = '<div data-bs-toggle="tooltip" data-bs-placement="right" data-bs-original-title="查看"><button type="button" class="btn my-1 js-generated" id="'+name+'-strip-btn"><div class="a-circle"><img src="/static/chat/img/'+ game_name +'/' + name + '.png" alt="'+ name + '"></div></button></div>';
    $('#game-inventory').append($(sidebarElmt_text));
    $('#stripbar-inventory').append($(stripbarElmt_text));
    articleMethod(name);
}

function refreshInventory(name){
    var article = loginData.tag_json[name];
    var article_name = article[0].split('').map(s => s+' ').join('');
    $('#article-'+name+' .a-title.a-sidebar').attr('data-bs-original-title', article_name).text(article_name);
}

function loadTagfromDB(role){
    loginData.tag_json['card'] = card;  // from db_cheat_game.js, same contents for everyone
    var r = (role === '槍手')?1 :0 ;
    loginData.tag_json['paper'][1] = paper['dialog'][r];
    loginData.tag_json['paper'][2] = paper['explain'][r];
}

function loadSidebarbyRole(role){
    loadTagfromDB(role);
    $('#user-role').text( '('+role+')');
    putIntoInventory('card'), putIntoInventory('paper'), installToolTip();
}

function loadRoleData(){  // to display sidebar content according to individual role
    /* use loginData.player_dict to display sidebar content and establish variables(self, others, position) */
    self = loginData.player_dict[loginData.uuid];
    // [name, gender(m, f or n)]
    others = JSON.parse(JSON.stringify(loginData.player_dict)), delete others[loginData.uuid];  // except self
    // {uuid:[name, gender(m,f,n), status],...}
    
    var i = 1, css_id, name, gender;
    for (let uuid in others){
        css_id = '#player-' + i.toString();
        name = others[uuid][0], gender = (others[uuid][1]==='m')? 'a-male':((others[uuid][1]==='f')?'a-female': 'a-nogender');
        
        $(css_id+','+css_id+'-strip').removeClass('d-none');
        $(css_id).data('uuid', uuid), position[uuid] = css_id;  // bind the variable player's css_id to player's uuid
        $(css_id+','+css_id+'-strip').find('.a-circle').addClass(gender).text(name[0]);
        $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name);
        i++;
    }

    if ( localData.gameLogs.length > 0 && null !== loginData.tag_int && null !== loginData.tag_json){
        loadSidebarbyRole(loginData.tag_json['role']);
    }
    refreshStartBtn();
    refreshGameStatus(loginData.status);
}

function refreshStartBtn(){
    if (2 === loginData.tag_int){
        var retake_uuid = loginData.tag_json['retake'][0];
        var retake_str = (2===loginData.tag_json['interact'][retake_uuid])?'收回紙條':'收回邀請';

        enabledElmtCssAll(['#start-btn','#start-strip-btn']);
        changeBtnColor('#start-btn', 'btn-danger'), $('#start-btn').text(retake_str);
        changeStripBtnTitle('#start-strip-btn', retake_str);
    }
    else{
        disabledElmtCssAll(['#start-btn', '#start-strip-btn']);
        changeBtnColor('#start-btn', 'btn-warning'), $('#start-btn').text('行 動');
        changeStripBtnTitle('#start-strip-btn', '行 動');
    }
}

function refreshGameStatus(status){  // refresh status, tag_json and tag_int according to dividual role
    refreshPlayerAll();  // first, refresh other players on/off
    loginData.onoff_dict[loginData.uuid] = 1; // cuz the websocket's connect() too late to cause error

    switch (status){   // second, refresh self status as well as tag_json and tag_int
        case 2:
            (null !== loginData.tag_int && null !== loginData.tag_json) && refreshGameTagAll();  
            // refresh player css btn according to current tag_json or tag_int
            // replyMethod only on status=2, when status=3 with theWS.msgSendWs(text)

            var num_on = gameGate.playerNum();
            setNavTitle(num_on);

            (localData.chatLogs.length>0) && theUI.clearChatLogs('chatLogs'); 
            if (localData.gameLogs.length === 0){  // the first time to enter game
                gameGate.prolog();
            }else{
                var isMore = theUI.loadChatLogs('gameLogs');  // game dialogs are on status=2 only
                (!0 === isMore) && appearElmtCss('#show-more');
                replyMethod(), retakeMethod();
                // gameGate.player();
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
            (!$(css_id+','+css_id+'-strip').find('.a-circle').hasClass('a-off')) && $(css_id+','+css_id+'-strip').find('.a-circle').addClass('a-off');
            $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(離線)');
            $(css_id).find('.a-onoff').text('(離線)');

            disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-warning btn-sm');
            changeStripBtnTitle(css_id+'-strip-btn');
            
            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !0);
            break;
        case 1:
            ($(css_id+','+css_id+'-strip').find('.a-circle').hasClass('a-off')) && $(css_id+','+css_id+'-strip').find('.a-circle').removeClass('a-off');
            $(css_id).find('.a-title').attr('data-bs-original-title', name);
            $(css_id).find('.a-onoff').text('');

            enabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeStripBtnTitle(css_id+'-strip-btn');

            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !1);
            break;
        case -1:
            (!$(css_id+','+css_id+'-strip').find('.a-circle').hasClass('a-off')) && $(css_id+','+css_id+'-strip').find('.a-circle').addClass('a-off');
            $(css_id).find('.a-title').text(name).attr('data-bs-original-title', name + '(已退出)');
            $(css_id).find('.a-onoff').text('(已退出)');
            $(css_id+','+css_id+'-strip').find('.a-circle').text(' ');

            disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-warning btn-sm'), $(css_id+'-btn').text('已退出');
            changeStripBtnTitle(css_id+'-strip-btn', '已退出');

            (loginData.status === 3 && loginData.player_list.includes(player_uuid)) && (toggle.discon = !0);
            break;
    }
}

function disablePlayerBtnAll(){  // like refreshGameTagAll(), but don't use tag_json&tag_int
    for (let uuid in position){
        (1 === loginData.onoff_dict[uuid]) && (disabledElmtCssAll([position[uuid]+'-btn', position[uuid]+'-strip-btn']), changeStripBtnTitle(position[uuid]+'-strip-btn'));
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
    switch(loginData.tag_json['interact'][player_uuid]){
        case null:
            break;
        case 0:  // '傳遞前未填完'
        case 1:  // '傳遞前已填完'
            enabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-warning btn-sm'), $(css_id+'-btn').text('傳紙條'), passMethod(css_id+'-btn,'+css_id+'-strip-btn', player_uuid);
            changeStripBtnTitle(css_id+'-strip-btn', '傳紙條');
            break;
        case 2:
            disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']); 
            $(css_id+'-btn').text('已傳遞');
            changeStripBtnTitle(css_id+'-strip-btn', '已傳遞');
            break;
        case 3:
            enabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-danger btn-sm'), $(css_id+'-btn').text('換紙條'), changeMethod(css_id+'-btn,'+css_id+'-strip-btn', player_uuid);
            changeStripBtnTitle(css_id+'-strip-btn', '換紙條');
            break;
        case 4:
            enabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-warning btn-sm'), $(css_id+'-btn').text('配對'), matchMethod(css_id+'-btn,'+css_id+'-strip-btn', player_uuid);  
            changeStripBtnTitle(css_id+'-strip-btn', '配對');
            break;
        case 5:
            disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            $(css_id+'-btn').text('已邀請');
            changeStripBtnTitle(css_id+'-strip-btn', '已邀請');
            break;
        case 6:
            enabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-danger btn-sm'), $(css_id+'-btn').text('接受'), acceptMethod(css_id+'-btn,'+css_id+'-strip-btn', player_uuid);
            changeStripBtnTitle(css_id+'-strip-btn', '接受');
            break;
        case 7:
            disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
            changeBtnColor(css_id+'-btn', 'btn-warning btn-sm'), $(css_id+'-btn').text('已配對');
            changeStripBtnTitle(css_id+'-strip-btn', '已配對');
            break;
    }
    if (3 === loginData.tag_int){
        disabledElmtCssAll([css_id+'-btn', css_id+'-strip-btn']);
        changeStripBtnTitle(css_id+'-strip-btn');
    }
}

function refreshGameSingle(ws_type, player_uuid, ...args){  // refresh one player status, only be called in websocket.onmessage
    if(2===loginData.status){
        var num_on = gameGate.playerNum();
        setNavTitle(num_on);
    }

    switch (ws_type){  // react the ws_type according to induvidual role
        case 'CONN':
            refreshPlayer(player_uuid);
            if (2===loginData.status){  // (status is 2 or 3)
                refreshGameTag(player_uuid);
            }else{
                disabledElmtCssAll([position[player_uuid]+'-btn', position[player_uuid]+'-strip-btn']);
                changeStripBtnTitle(position[player_uuid]+'-strip-btn');
            }  
            // tag_json & tag_int will affect the result only if the player is online.
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
    switch (ws_type){  // react the ws_type according to 'role'
        case 'OVER':  // args[0]: data.isOver
            (!0 === args[0])? showNotice('遊戲結束，可按右上方"離開"鍵 並準備進行下一場遊戲。'): showNotice('出局！可按右上方"離開"鍵 並準備進行下一場遊戲。');
            break;
        case 'ALIVE':  // args[0]: self_group
            showNotice('遊戲即將進入下一輪。');
            break;
    }
}

function disabledGameBtns(){  // only be called in websocket.onmessage 'OVER'
    var css_id; 
    for (let uuid in position)
        css_id = position[uuid], disabledElmtCssAll([css_id+'-btn',css_id+'-strip-btn']), changeStripBtnTitle(css_id+'-strip-btn');
    
    // disabledElmtCss('#start-btn');
    disabledElmtCssAll(['#start-btn', '#start-strip-btn']), changeStripBtnTitle('#start-strip-btn');

    $('body').off('click', "#leave-btn");
    $("#leave-btn").on('click',function(a){  // status is still 2 on front-end until redirect to /chat  
        window.location.href = "/chat"; 
    })
}

function informGameMessage(data){  // only be called in websocket.onmessage 'INFORM'
    if (0 === data.tag){
        var msgs_li = data.msgs;
        var dialogs = msgs_li.map(msg => [msg, !1, 'a']);
        theUI.showStoryAsync(dialogs, interval=0);
        theUI.scrollToNow();
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');
        
    }else if (1 === data.tag){
        if (!1 === data.toSelf){
            // loginData.player_dict[data.from][2] = 1;
            (!0 === [0,2,3].includes(loginData.tag_json['interact'][data.from])) && (loginData.tag_json['interact'][data.from] = 1, refreshGameTag(data.from));
            var text = '<span class="a-point">'+others[data.from][0]+'</span>已作答完畢，可交換<span class="a-point">作弊紙條</span>！';
            (2===loginData.status) && (theUI.showSys(text), theUI.scrollToNow());
            theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
            if (!1 === localData.isMuted && !1 === toggle.focus){
                document.getElementById("audio-inform").play();
            }
        }

    }else if (2 === data.tag){
        if (!1 === data.toSelf){
            loginData.tag_json['interact'][data.from] = 3, refreshGameTag(data.from);
            var text = '<span class="a-point">'+others[data.from][0]+'</span>傳紙條給你！';
        }else{
            var text = '已將紙條傳給 <span class="a-point">'+others[data.hidden][0]+'</span>！';
        }
        (2===loginData.status) && (theUI.showSys(text), theUI.scrollToNow());
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
        if (!1 === localData.isMuted && !1 === toggle.focus){
            document.getElementById("audio-inform").play();
        }

    }else if (3 === data.tag){
        var di = [];
        if (!0 === data.toSelf){
            // pass
        }else if (loginData.uuid === data.hidden){
            //loginData.player_dict[data.from][2] = 0;
            loginData.tag_int = 0, refreshStartBtn();
            loginData.tag_json['interact'] = data.msgs['interact'], refreshGameTagAll();
            loginData.tag_json['paper'] = data.msgs['paper'];
            loadTagfromDB(loginData.tag_json['role']);
            refreshInventory('paper');

            showNotice('成功與 '+others[data.from][0]+'互換紙條！');
            di = [[gameGate.articleName('paper'), !1, 's'],...gameGate.articlePart('paper', [3, 4], false)];
        }else{
            var intToChange = false;
            [loginData.tag_json['interact'][data.from], intToChange] = refresh_after_change(loginData.tag_json['interact'][data.from], intToChange), refreshGameTag(data.from);
            [loginData.tag_json['interact'][data.hidden], intToChange] = refresh_after_change(loginData.tag_json['interact'][data.hidden], intToChange), refreshGameTag(data.hidden);
            if (!0 === intToChange && loginData.tag_int !== 3)
                loginData.tag_int = (loginData.tag_json['interact'][loginData.uuid]===1)? 1: 0;
                refreshStartBtn();
        }
        var text = '<span class="a-point">'+loginData.player_dict[data.hidden][0]+'</span> 和 <span class="a-point">'+loginData.player_dict[data.from][0]+'</span> 成功交換了紙條。';
        di.push([text,!1,'s']);

        (2===loginData.status) && (theUI.showStoryAsync(di, interval=0), theUI.scrollToNow());
        theUI.storeChatLogs(di, di.length, 'gameLogs');

        if (!1 === localData.isMuted && !1 === toggle.focus){
            document.getElementById("audio-inform").play();
        }

        function refresh_after_change(value, intToChange){
            if (!0 === [2,5].includes(value))
                intToChange = true;
            if (!0 === [1,2,3].includes(value))
                value = 0;
            else if (!0 === [5,6].includes(value))
                value = 4;

            return [value, intToChange]
        }

    }else if (4 === data.tag){
        if (!1 === data.toSelf){
            loginData.tag_json['interact'][data.from] = 6, refreshGameTag(data.from);
            var text = '<span class="a-point">'+others[data.from][0]+'</span>想與你配對！';
        }else{
            var text = '已送出配對邀請給<span class="a-point">'+others[data.hidden][0]+'</span>！';
        }
        (2===loginData.status) && (theUI.showSys(text), theUI.scrollToNow());
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
        if (!1 === localData.isMuted && !1 === toggle.focus){
            document.getElementById("audio-inform").play();
        }

    }else if (5 === data.tag){
        var text = '<span class="a-point">'+loginData.player_dict[data.hidden][0]+'</span> 和 <span class="a-point">'+loginData.player_dict[data.from][0]+'</span> 已成功配對，';
        var text2;
        var msgs_li = [];
        if (!0 === data.msgs){
            text2 = '槍手已被找到！';
            msgs_li.push(text+text2);
            var winText = (!0 === [data.hidden, data.from].includes(loginData.uuid))? '遊戲勝利！': '遊戲失敗，你未能領先其他人找到槍手。';
            msgs_li.push(winText);
        }else{
            text2 = '兩人都不是槍手，目前槍手還混在玩家之中。';
            msgs_li.push(text+text2);
        }

        var dialogs = msgs_li.map(msg => [msg, !1, 's']);
        (2===loginData.status) && (theUI.showStoryAsync(dialogs, interval=0), theUI.scrollToNow());
        theUI.storeChatLogs(dialogs, dialogs.length, 'gameLogs');

        if (!1 === localData.isMuted && !1 === toggle.focus){
            document.getElementById("audio-inform").play();
        }
        if (!0 === data.toSelf){
            // pass
        }else if (loginData.uuid === data.hidden){
            loginData.tag_int = 3, loginData.tag_json['interact'][data.from] = 7, refreshGameTag(data.from);
            showNotice('與 '+others[data.from][0]+' 成功配對。 已建立房間，等待中...');
            theWS.callSendWs('enter_match');
        }else{
            loginData.tag_json['interact'][data.from] = 7, refreshGameTag(data.from);
            loginData.tag_json['interact'][data.hidden] = 7, refreshGameTag(data.hidden);
            if (loginData.tag_int !== 3)
                loginData.tag_int = (loginData.tag_json['interact'][loginData.uuid]===1)? 1: 0;
            refreshStartBtn();
        }
        
    }else if (6 === data.tag){
        var retake_str = data.msgs;
        if (!1 === data.toSelf){
            loginData.tag_json['interact'][data.from] -= 2, refreshGameTag(data.from);
            var text = '<span class="a-point">'+others[data.from][0]+'</span>收回了'+retake_str+'！';
        }else{
            var text = '已收回寄給<span class="a-point">'+others[data.hidden][0]+'</span>的'+retake_str+'！';
        }
        (2===loginData.status) && (theUI.showSys(text), theUI.scrollToNow());
        theUI.storeChatLogs([[text, !1, 's']], 1, 'gameLogs');
        if (!1 === localData.isMuted && !1 === toggle.focus){
            document.getElementById("audio-inform").play();
        }
    }
}

var GAMETITLE = '作弊遊戲',
    game_name = 'game_cheat_game',
    gameGate = gameCheckGate(),
    self = [],
    others = {},
    position = {},
    hasBound_replyMethod = !1,
    hasBound_retakeMethod = !1
    
$(document).ready(function(){
    loadRoleData(), bindGameMsgSend();  // load the data about role respectively and establish the variable: self, others, position
})

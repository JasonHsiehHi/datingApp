// game_.js可以自行選擇是否彈出modal或直接執行
// UI加上 互動鍵 行動鍵 並把遊戲開始鍵隱藏

$("#interact-form").on('submit',function(e){
    e.preventDefault();
    // 針對role做判別 每個人能做的事不同
    // 針對不同劇本且特定角色才有的標記 例如偵探要全部都訪問完 Player 增加tag_int 之後增加tag_char tag_json

})

$("#action-btn").on('click',function(e){  //彈出 deduce-modal-form (偵探)
    // 針對role做判別 每個人能做的事不同

    $("#deduce-modal-form").removeClass('d-none');
    $('#modal .modal-title').text('推理環節')
    $('#modal').modal('show');
})

$("#deduce-modal-form").on('submit',function(e){
    e.preventDefault();

})

var game = function(){
    // bindModalPopup, bindFormSubmit... 必須寫在模組中 避免全域受污染
    function bdmp(){

    }

    function bdfs(){

    }

    function lddl(){

    }

    function ldpd(){
        // 決定html架構 誰有按鍵誰沒有 看player_dict的group決定:偵探為1 其餘為0
    }

    function rfpd(){
        // 填入playerdict資料
    }

    function rfs(){
        // 互動鍵與行動鍵都需要綁status 如此才不會有太多例外
    }

    return {
        bindModalPopup:bdmp,
        bindFormSubmit:bdfs,
        loadDatalist:lddl,
        loadPlayerDict:ldpd,
        refreshPlayerDict:rfpd,
        refreshStatus:rfs
    }
}


var theGame = game()

$(document).ready(function(){
    // 除了load之後 也要做故事情節dialog 
    // 加上loginUserid 用以判定身份 加上localData.group 用以表示playerdict的顯示方式
})

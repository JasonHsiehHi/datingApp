// 可以自行選擇是否彈出modal或直接執行
// 關閉更名鍵與前往學校鍵 且 開啟離開鍵
// UI加上 互動鍵 行動鍵 並把遊戲開始鍵隱藏
$("#interact-form").on('submit',function(e){  //直接執行 需要像start-form改為form submit
    e.preventDefault();
    // 針對role做判別 每個人能做的事不同
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

// refreshPlayerList();  // 需要針對劇本選擇行動鍵與互動鍵 故會在game中進行

// 互動鍵與行動鍵應該要分開來寫 不同劇本才能獨立
// 互動鍵與行動鍵都需要綁status 如此才不會有太多例外
// 針對不同劇本且特定角色才有的標記 例如偵探要全部都訪問完 Player 增加tag_int 之後增加tag_char tag_json

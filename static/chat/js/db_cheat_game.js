const story_dialogs = [
    ['<span class="a-point">作弊遊戲</span><br>(designed by: <span class="a-point">雪人清酒</span>)', !1, "s"]
];

const card = [
    '遊戲規則卡', 
    [
        '這是一場考題太難而你又沒有準備的考試，你唯一能依靠的方式只有<span class="a-point">作弊</span>。而想要在考試中<span class="a-point">作弊</span>，最簡單也最直接的方法就是找到潛伏在你們之中的<span class="a-point">槍手</span>！'
    ],[
        '這是一場考題太難而你又沒有準備的考試，你唯一能依靠的方式只有<span class="a-point">作弊</span>！',
        '而想要在考試中<span class="a-point">作弊</span>，最簡單也最直接的方法就是找到潛伏在你們之中的<span class="a-point">槍手</span>！'
    ],[
        '<span class="a-point">遊戲規則1</span>：玩家之中會有至少一位是<span class="a-point">槍手</span>，無論如何，<span class="a-point">槍手</span>的答案永遠是對的。',
        '<span class="a-point">遊戲規則2</span>：遊戲中僅能向一位玩家寄送邀請，如果對方接受邀請則成功配對。',
        '<span class="a-point">遊戲規則3</span>：只要能找到<span class="a-point">槍手</span>，寄送邀請並完成配對，則該名玩家勝利。',
        '<span class="a-point">遊戲規則4</span>：若<span class="a-point">槍手</span>主動找其他玩家寄送邀請，則接受配對的該名玩家勝利。',
        '<span class="a-point">遊戲規則5</span>：如果要寄送邀請，只能選擇有在你<span class="a-point">現在拿到的紙條</span>留下答案的玩家。(沒有留下答案，怎麼能知道這個人是不是<span class="a-point">槍手</span>呢！)',
        '<span class="a-point">遊戲規則6</span>：遊戲過程中系統不會透露性別。',
        '<span class="a-point">遊戲規則7</span>：在異性模式下，<span class="a-point">槍手</span>往往是性別人數較少的那一方。在同性模式下，則會從所有玩家中隨機抽出一位。'
    ]

];

const paper = {
    'dialog':[
        [
            '你發現了一道題目不太會寫、不太有把握，你應該竭盡所能地將可能的答案填上去，後再將考卷上的一題撕下來揉成球狀，傳給你認為是<span class="a-point">槍手</span>的人。'
        ],[
            '你就是混在考場中的<span class="a-point">槍手</span>，無論如何你的答案永遠是對的，你可以選擇要幫助哪位考生通過這次考試。(槍手的身份只有你知道)'
        ]
    ],
    'explain':[
        [
            '每個人一開始所獲得的<span class="a-point">作弊紙條</span>都不一樣。',
            '自己的紙條作答完後，可開啟左側選單找尋你認為是<span class="a-point">槍手</span>的玩家，<span class="a-point">傳紙條</span>給他，若對方選擇<span class="a-point">換紙條</span>，則成功與他交換手上的紙條，即可查看對方的答案。'
        ],[
            '每個人一開始所獲得的<span class="a-point">作弊紙條</span>都不一樣。',
            '自己的紙條作答完後，可開啟左側選單找尋任何你感興趣的玩家，<span class="a-point">傳紙條</span>給他，若對方選擇<span class="a-point">換紙條</span>，則成功與他交換手上的紙條，即可查看對方的答案。'
        ]
    ]
}

const end_dialogs = [
    ["", !1, "w"],
    ["", !1, "w"],
    ["", !1, "w"],
    // 還需要寫一個勝利或失敗宣言
    //["問題環節結束！請打開左側玩家選單，向一位參加者寄送邀請。 如果不想與任何參加者配對，則可按右上方的離開鍵。", !1, "s"],
    ["平台目前仍在處在beta階段，目前還沒有適合的劇本可以使用，非常想要獲得大家的意見，也歡迎對平台有興趣的朋友加入！ https://forms.gle/Z4HBacchG9yif3QGA",!1, "s"]
];
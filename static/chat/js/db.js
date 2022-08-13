const citySet = {
    '':'選擇你喜歡的城市',
    'Northern':'北部地區',
    'Central':'中部地區',
    'Southern':'南部地區',
    'Eastern':'東部及離島',
    'Keelung':'基隆',
    'Taipei':'台北',
    'New_Taipei':'新北',
    'Taoyuan':'桃園',
    'Taichung':'台中',
    'Tainan':'台南',
    'Kaohsiung':'高雄',
    'Hsinchu':'新竹',
    'Miaoli':'苗栗',
    'Changhua':'彰化',
    'Nantou':'南投',
    'Yunlin':'雲林',
    'Chiayi':'嘉義',
    'Pingtung':'屏東',
    'Yilan':'宜蘭',
    'Hualien':'花蓮',
    'Taitung':'台東',
    'Penghu':'澎湖',
    'Green_Island':'綠島',
    'Orchid_Island':'蘭嶼',
    'Kinmen':'金門',
    'Matsu':'媽祖'
    },
    cityImgSet = new Set([
        'Northern',
        'Central',
        'Southern',
        'Eastern',
        'Keelung',
        'Taipei',
        'New_Taipei',
        'Taoyuan',
        'Taichung',
        'Tainan',
        'Kaohsiung',
        'Hsinchu',
        'Miaoli',
        'Changhua',
        'Nantou',
        'Yunlin',
        'Chiayi',
        'Pingtung',
        'Yilan',
        'Hualien',
        'Taitung',
        'Penghu',
        'Green_Island',
        'Orchid_Island',
        'Kinmen',
        'Matsu'
    ]),
    dramas = [
        ['隨機劇本：<span class="a-point">《作弊遊戲》</span><br><br>\
        <span class="a-point">遊戲規則1</span>：玩家之中會有至少一位是<span class="a-point">槍手</span>，無論如何，<span class="a-point">槍手</span>的答案永遠是對的。<br>\
        <span class="a-point">遊戲規則2</span>：遊戲中僅能向一位玩家寄送邀請，如果對方接受邀請則成功配對。<br>\
        <span class="a-point">遊戲規則3</span>：只要能找到<span class="a-point">槍手</span>，寄送邀請並完成配對，則該名玩家勝利。<br>\
        <span class="a-point">遊戲規則4</span>：若<span class="a-point">槍手</span>主動找其他玩家寄送邀請，則接受配對的該名玩家勝利。<br>\
        <span class="a-point">遊戲規則5</span>：如果要寄送邀請，只能選擇有在你<span class="a-point">現在拿到的紙條</span>留下答案的玩家。(沒有留下答案，怎麼能知道這個人是不是<span class="a-point">槍手</span>呢！)<br>\
        <span class="a-point">遊戲規則6</span>：遊戲過程中系統不會透露性別。<br>\
        <span class="a-point">遊戲規則7</span>：在異性模式下，<span class="a-point">槍手</span>往往是性別人數較少的那一方。在同性模式下，則會從所有玩家中隨機抽出一位。'
        , !1]
    ];
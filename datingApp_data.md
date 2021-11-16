# todo_list LARP
完成sidebar
完成navbar
完成modal
完成信箱註冊與登入功能
修改background 
完成多人數配對
完成隨機生成內容的方式
完成theGate.tutor教學

變數轉譯問題 (name和msg都是由用戶填寫且會傳送到其他用戶的數據 要確保不會有xss攻擊)
RWD調整
GCE上線部署

# 架構圖 LARP


# 手動測試流程 LARP


# model data LARP











# todo_list
## 目前todo
'顯示更多...','chatLog250句限制', 
'防止用ws做script攻擊(html語法)','傳送時斷線', 
'/leave和/change都要加上dialog 並變更anonName(由房間出來時)',
'禁止連續上傳圖片', '房間內限制上傳圖片數量'

'加上信箱註冊功能 並修改更新多數方法'
'改版後加上後端檢測變數 以防用戶透過console傳送資料'
'刪除cmd-/r 因為信箱註冊後便不能直接做更動'
'修改並統一用語：尤其是status的部分 配對和成人模式都不好聽'
‘應該用遊戲概念包裝 並加入遊戲元素：改掉配對遊戲這個怪名稱’
'男女生的標誌 應改用想youtube一樣的顏色亮燈'

'ga', 'seo'
'nginx'
'開頭畫面 處理流量過載'

## 未來todo

'瀏覽器不支援websocket功能 需用protocols_whitelist替代'
'回答題目的回饋'
'dialog GOTO 動態資訊'
'dialog GREET in status2'
'新增互動動畫'

# 架構圖:
架構圖為描述程式碼的各項物件功能 流程圖則針對用戶的使用過程

chatSocket.onopen
負責與後端建立連線並匯入localData資料 傳送open指令和import指令

chatSocket.onmessage
接收後端訊息data做分流後再依據status來調用theUI做回應 或theWS傳訊息給對方
並更新用戶的status與其他localData值 
唯一能變更status的時候 因為必須跟後端的self.player_data同步

  (onmessage)typeSet.greet
  只有greet是連線後自動觸發 故必須進行status辨識 其餘typeSet.都是用戶自行輸入指令後回傳

chatSocket.onclose
斷線後進行重連

bindFileUpload() - $("#send-img").fileupload({done:})
接收後端訊息data(表示後端已經做好圖檔的改名與存取) 等同於chatSocket.onmessage
因此可以調用theUI做回應 或theWS傳訊息給對方

localData
用於存放用戶身份(uuid,name...), 狀態status, 保留系統chatLogs,以及其他需存入後端資料庫的field

localStorage
所有物件都只能設置不能取用 只有在getLocalData時才能取用來設置localData

loadLocalData()
針對用戶的status和其他localData值 調用theUI來進行載入用戶介面 

theTerminal.cmd()
分流器 判別用戶輸入的指令以及是否符合指令格式(參數多寡或是否含有空格)

(theTerminal.) *
判別輸入的指令參數是否符合內容規範(參數內容必須是規定的範圍內) 並判別status來決定是否要把訊息送到後端
theTerminal只能傳送一次訊息到後端 不能使用theUI(由後端存取資料完後的chatSocket.onmessage使用)

theTerminal.match()
自己不做傳送 因此可以呼叫theTerminal.test()和theTerminal.wait()
如此仍符合每個指令只做一次傳送的規則

(theUI.) clearChatLogs(), storeChatLogs(), loadChatLogs()
不能被其他theUI調用 只能供外部調用 (一般為後端存取資料完後的chatSocket.onmessage使用)

theWS.msgSendWs()
在房間內(status===3)使用: 除了向對方傳訊息之外 也會進行theUI的showSelfMsg(msg)和showSelfImg(msg)

theWS.msgsSendWs()
一次向對方傳多個訊息 不會進行theUI的showSelfMsg()和showSelfImg() 因為通常是對方斷線未能收到訊息才會用theWS.msgsSendWs()補傳

processTest()和processAdult()
只為處理theUI.showQuestion()的按鍵(.a-0, .a-1 ...)綁定 如果要傳資料到後端需要調用theTerminal來實現


# 手動測試流程
status_0
  // DOM ready
  init localData (getLocalData())
  * check: (wrong log) {if browser can't use Storage}

  init chatSocket object (chatroomWS())
  * check: (wrong log) {if browser can't use WebSocket}
  
  send uuid to backend (chatSocket.onopen)
  * check: (uuid in db)
  
  send data to backend (chatSocket.onopen)
  * check: (data in db) {if it's second or more connection}

  receive GREET from backend (chatSocket.onmessage)
  * check: (anonName in storage, localData, profile)
  * check: (dialog) {data.dialog with theGate}
  * check: (dialogdiv size in RWD)
    
    show dialog from backend (def cmd_open())
    * check:(msg) {in different time}

    show dialog from theGate (theGate.intro() and theGate.tutor())
    * check: (tutor msg) {before cmd-/go}
    * check: (tutor msg) {after cmd-/go before cmd-/p}
    * check: (tutor msg) {after cmd-/p before cmd-/m}
    * check: (tutor msg) {after cmd-/m with testResult}

    * check: (intro msg) {before cmd-/p}
    * check: (intro msg) {after cmd-/p}

  init chatSocket object again (chatSocket.onclose)
  * check: (log)

  do theUI work after loading website (loadLocalData())
  * check: (profile, mark and dialog)
  * check: (profile size and mark size in RWD)

  // cmd 
  type in /go school_id(theTerminal.goto())
  * check: (dialog for wrong form) {/go ntu ntu}
  * check: (dialog for wrong id) {/go nxu}
  * check: (dialog for the same id) {/go ntu again}
  * check: (school in storage, localData)
  * check: (school in db)
  * check: (mark and dialog) {/go ntu and /go nccu}

  type in /p name mf (theTerminal.profile())
  * check: (dialog for wrong form) {/p jason}
  * check: (dialog for wrong matchType) {/p jason rr}
  * check: (dialog for wrong length) {/p jasonjasonjasonjason rr}
  * check: (name and matchType in storage, localData)
  * check: (name and matchType in db)
  * check: (dialog) {/p jason mf}

  type in /n name (theTerminal.rename())
  * check: (dialog for wrong form) {/n jason jason}
  * check: (dialog for wrong length) {/n jasonjasonjasonjason}
  * check: (name in storage, localData)
  * check: (name in db)
  * check: (dialog) {/n jason}

  type in /t (theTerminal.retest())
  * check: (QUESTION_ID_LIST randomly) {by utils.get_question_id_list_randomly()}
  * check: (QUESTION_ID_LIST specifiedly) {by setting caches:QUESTION_ID_LIST manually}

  * check: (testResult and hasTested in storage, localData)
  * check: (testResult and score in db)
  * check: (testResult and hasTested in storage, localData) {with uncompleted test}
  * check: (testResult and score in db) {with uncompleted test}

  type in /m (theTerminal.match() and theTerminal.wait())
  * check: (dialog for wrong step) {before cmd-/go and cmd-/p}

  type in /a (theTerminal.adult())
  * check: (unloaded picture div of processAdult)
  * check: (unloaded picture div of processAdult) {replace the old one by new one}
  * check: (most 2 unloaded picture in db)
  * check: (dialog for repeated upload) {type in /a repeatedly and fast}  # 先不用 因為還不知道用戶的使用習慣 而且$('#send-img').click()本來就有setTimeout
  * check: (showQuestion div of processTest) {if haven't finished testResult}
  * check: (showClock div) {if have finished testResult}


  Drag-and-drop the picture to unload (bindFileUpload())
  * check: (no reaction) # 只能在cmd-/a時上傳圖片


status_1
  // DOM ready
  do theUI work after loading website (loadLocalData())
  * check: (no dialog from GREET)  # 信箱註冊後可解決
  * check: (no change in anonName)  # 信箱註冊後可解決 兩者都是receive: typeSet.greet執行

  init localData (getLocalData())
  * check: (the same data)
  * check: (status in storage, localData)
  * check: (status in db)

  recieve TEST from backend (chatSocket.onmessage) 
  * check: (showQuestion div of processTest)


  type in /le (theTerminal.leave())
  * check: (status in storage, localData)
  * check: (status in db)

  type in /cg (theTerminal.change())
  * check: (status in storage, localData)
  * check: (status in db)
  * check: (empty testResult in storage, localData)
  * check: (empty testResult in db)


status_2
  // DOM ready 
  do theUI work after loading website (loadLocalData())


  recieve GREET from backend (chatSocket.onmessage) 
  * check:(no tutor msg from GREET)

  recieve WAIT from backend (chatSocket.onmessage) 
  * check: (begin with 00:00 in showClock div)
  * check: (then 00:01 in showClock div)
  * check: (status and waiting_time in storage, localData)
  * check: (status and waiting_time in db)


  type in /le (theTerminal.leave())
  * check: (status in storage, localData)
  * check: (status in db)
  * check: (begin with 00:00 in showClock div) {type in /le and then /m fast}
  * check: (then 00:01 in showClock div)

  type in /cg (theTerminal.change())
  * check: (status in storage, localData)
  * check: (status in db)
  * check: (begin with 00:00 in showClock div)
  * check: (then 00:01 in showClock div)


status_3
  // DOM ready 
  do theUI work after loading website (loadLocalData())

  send msg to matcher (theWS.msgSendWs())
  * check: (msg without script) {send msg with html or javascript script}

  type in /le (theTerminal.leave())
  * check: (status in storage, localData)
  * check: (status in db)

  type in /cg (theTerminal.change())




# model_data:
## Dialogue model:
action sub speaker number dialog
GREET mo 3 1
["歡迎來到Acard！😂",
 "這是一個由多位學生因興趣而自主開發的陌生交友平台",
 "這裡的所有動作都是以指令構成，請先移動到你想交友的學校吧！ 輸入\/goto 學校縮寫 (例如:NTU, NCCU等)"
]

GREET t05-08 3 1 ['我的朋友 現在上線也太早了吧！',0]
GREET t08-12 3 1 ['歡迎所有早上蹺課蹺班的朋友～',0]
GREET t12-17 3 1 ["下午這段時間很悠閒吧！",0]
GREET t17-19 3 1 ["現在是晚餐時間呢！",0]
GREET t19-22 3 1 ["晚上好！",0]
GREET t22-03 3 1 ["深夜聊天時間～",0]
GREET t03-05 3 1 ["你在一個很奇怪的時間點上線呢！",0]

GREET sch 3 1 ["{}是現在最多人前往的學校",0]
GREET sch 3 2 ["推薦你去{}！ 目前做多人使用",0]
GREET sch 3 3 ["如果我是你，我就去{}！ 畢竟人多機會多～",0]

參考:
動態-時間:早上 晚上 深夜(第一句) 

動態-目前使用人數:較少 普通 較多 高峰(值域必須等上線後才能決定)
動態-最多使用者學校:ntu, nccu...等(人數必須高過門檻才使用 如果都很少就不使用)

如果等待時間太長可以考慮前往其他學校哦！


## Robot model:
id name 
'1', '正在念大六的Acard開發者'
'2', '愛喝拿鐵的社畜OL'
'3', '不加糖拿鐵'

參考:
'大刀面前耍關公'
'鉛筆盒裡沒筆'


## Question model:
id content type choice
'1s', '依據圖片判斷，這個人可能從事的職業為何？<p class="text-center"><img class="img-fluid a-img" src="/static/img/question/1s.png" alt="refresh again"></img></p>', 's', '["藥品製造商","高中老師"]'

'2s', '依據圖片判斷，以下何者更能代表此圖的意境？<p class="text-center"><img class="img-fluid a-img" src="/static/img/question/2s.jpg" alt="refresh again"></img></p>', 's', '["維護留言區的言論自由","發言後選擇堅守立場"]'

'3s', '請問何者才是瑞典著名家具品牌IKEA的正確念法？ s ["一ki呀","愛ki呀"]

'4s', '依據圖片判斷，你認爲這個人最有可能的人格特質為何？<p class="text-center"><img class="img-fluid a-img" src="/static/img/question/4s.jpeg" alt="refresh again"></img></p>', 's', '["冷靜且心思縝密","大膽且心狠手辣"]'

'5s', '依據圖片判斷，你認為何者才是此圖所要表達的意境？<p class="text-center"><img class="img-fluid a-img" src="/static/img/question/5s.jpeg" alt="refresh again"></img></p>', 's', '["委婉地拒絕別人","當對方講了一個很糟的笑話時"]'

'6s', '如果只有這二種選擇，哪一個網路論壇對你更有吸引力？', 's', '["DCARD","PTT"]'

'7s', '如果只有這二種選擇，哪一個社交平台你較喜歡？', 's', '["instagram","twitter"]'

'8s', '如果要買遊戲機，不考慮價格差異下你會選擇哪一台？', 's', '["switch","PS5"]'

'9s', '如果你只拿到這二間公司的offer，在薪資福利條件都相近的情況下，你會如何選擇？', 's', '["apple","google"]'

'10s', '有相同的飲食習慣會是兩個人是否契合的關鍵。以下兩種你會如何選擇？', 's', '["奶茶","咖啡"]'

'11s', '有相同的飲食習慣會是兩個人是否契合的關鍵。以下兩種你會如何選擇？', 's', '["麥當勞","摩絲漢堡"]'

'12s', '有相同的飲食習慣會是兩個人是否契合的關鍵。以下兩種你會如何選擇？, 's', '["牛排","壽司"]'

'13s', '有相同的飲食習慣會是兩個人是否契合的關鍵。以下兩種你會如何選擇？', 's', '["燒烤","火鍋"]'

'14s', '請問何者才是美國知名大型量販店品牌costco的正確念法？', 's', '["咖斯扣","摳斯扣"]'

'1l', '在一場朋友的聚會中你認識了A男與B男：
A男-崇尚現實主義，將家庭擺在第一位，極具領袖魅力，在大型電影公司擔任副製片人
B男-浪漫主義的嬉皮士，空軍背景，創業成立小規模的航運公司並擔任CEO與飛行員
依據以上描述，請問你認為何人在聚會中對女性更有吸引力？',
'l', '["A男","B男"]'

2l 再探討不同因素對制度發展的影響時，還努力找出背後的規律與因果關係。
請問這最有可能是哪個時期的學者思考問題的傾向？
l ["宗教改革時期","啟蒙運動時期"]

3l 認為保持體制的穩定比經濟改革或社會革命更為重要，主張不中斷當前制度，即使已認知到該制度有諸多不合理之處。
請問這樣的政治觀點最有可能是？
l ["保守主義,"社會主義"]

4l 如果有天警察通知你，在你認識的朋友當中有地下集團的不法份子，而你的這位朋友已在該集團做到二把手的位置。
依據以下敘述，哪位朋友更有可能是警察追緝的對象？
l ["喜愛看推理劇的日式料理店廚師","平時假裝冒冒失失的中小學班主任"]

5l 朋友聚餐決定要吃海產店，但因為菜單上都沒有寫價格使你非常苦惱。
請問這時你應該如何在不被坑錢的情況下，點到物超所值的品項？
l ["不在乎面子也不嫌麻煩地一個一個詢價，直到點完餐為止","在附近找看看有沒有比較懂海的陌生人，請他幫忙推薦"]

'6l', '你的一位友人因為家裡漏水，決定自行處理，後發現是部分水管過於老舊的問題：
這位友人決定更換漏水的水管，請問你會推薦你使用哪一個尺寸大小的水管呢？'
,'l', '["長度18cm,寬度3.5cm","長度13cm,寬度5cm"]'

'7l', '你的朋友剛從國外回來，決定邀請所有IG上的好友來辦一場迎風派對。
但你到現場時卻發現只有你一人，此時你會怎麼做？'
,'l' , '["想辦法開溜並告知朋友臨時有事","努力炒熱氣氛並試圖安慰這位朋友"]'

8l 你的女性朋友最近因為相親認識了兩位條件優質的對象：
A男-有十足的企圖心，懂得控制時間，律師背景，創業成立顧問公司，專門處理法務問題
B男-生活相當自律，心思縝密且細膩，會在固定的時間點回到家，在連鎖百貨公司工作
依據以上描述，請問你會推薦她選擇誰？
l ["Ａ男","B男"]

9l 李尖尖
l ["",""]


性向問題-動漫,電影,遊戲,知名人物 你比較信任誰？ 
生活知識問題-致命毒師 哪位人物符合敘述？
流行問題-梗圖 
(如果只有梗圖則難以延伸 會導致千篇壹律)

指考專科問題-歷史題與國文題
調情問題-螺絲釘



# 
所有內容都必須跟學生習習相關 dcard會是很重要的參考依據
大致上來源於梗圖版與有趣版

女性腳色要在對話中夾帶食物與日常生活

以下測試題目都沒有標準答案，僅為測量個人的人格特質與價值觀，並對測試結果相近者進行配對。

# test-db.js與test-db.sqlite3
## Dialogue model:
action sub speaker number dialog
GREET mo 1 1
[['test:hello',0],['test:introduce a-card',0], ['test:novice teaching',0]]

## Robot model:
1 '測試人員(test)'
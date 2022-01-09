# 版本
macOS 11.4 (關於這台電腦)
anaconda 4.9.2 (conda -V)
python 3.8.8 (python)
django 3.2 (python -m django --version)
channel 3.0.3 (conda list)
channel-redis 3.2.0 (conda list)
jquery 3.6.0 (查看JS檔)
bootstrap 5.0.2 (查看JS檔)
uwsgi
nginx
docker 20.10.7 (docker version)
npm 6.14.12 (npm -v)
jest 27.3.1 (package.json)
selenium 4以上

# todo_list LARP
完成sidebar
完成navbar
完成modal
完成信箱註冊與登入功能
完成多人數配對
上線與離線的user-tag
完成房間計時器
完成theGate.tutor教學
完成隨機生成內容gameevent
完成chatlog

完成background 進入遊戲後可變更背景 增加由原顏色到淺色的css動畫
將school改為city 且school不用刪掉

上限前JS必須進行防盜措施
GCE上線部署
架設監控系統 以防突發狀況

例行檢查項目：
手機與其他瀏覽器的RWD調整
變數轉譯問題 預防xss攻擊
前端loginData, localData, term, toggle
後端ddatabase
微調輸出三大方法:notice, chatlog, navtitle
驗證所有前端JS和後端django的物件與流程


測試項目：
遊戲進行中變更密碼或登出？ (是否直接用urlpatterns導向)


未來完成：
完成settings-form 之後換成start-game的選項
篩選不符合條件的瀏覽器 通知
流量超載就自動斷線 通知


# 2022年 競爭對手 LARP
tinder：可免費使用 最多人使用
wootalk：不露臉 匿名聊天 最多人使用
goodnight：不露臉 語音聊天 最多人使用
柴犬：不露臉 話題輔助 認真交友 顏值不高 自介認真
CMB：限制每日可查看數量 符合條件才推薦 複雜自介過濾用戶
zuvio：校園交友
緣圈：過五關配對

bumble： 女生先發言 (類tinder)
探探：頭像認證 (類tinder)
omi：頭像認證 年齡層較低 大學生為主 (類tinder)
monchats：不露臉 語音聊天 (類goodnight)
cheers：不露臉 語音聊天 (類goodnight)
heymandi：匿名聊天 (類wootalk)
meetunnel：可傳圖 沒有手機版本 (類wootalk)
meet：定位功能
skout：東南亞居多
OkCupid：問卷配對
wetouch：UX很差
rooit：不露臉 話題輔助 UX很差 沒有維護 即時聊天
underCover： UX很差 rooit續作
beebar：使用人數較少
hinge：使用人數較少
WEJO薇揪：定位功能 付費使用
wedate：綁定社群帳號 付費使用
justDating：業配很多 評價很差 付費使用
pairs：
eatgather：
sweetRing：
koudai：
slowly：
miniDot：
moodii：
meloop：
facebar：
antiland：



參考：
(重點在於如何找出最多人關注的文章寫法)
可用搜索話題 https://www.dcard.tw/topics/XXXX

交友app 心得
交友app 推薦
使用交友app的經驗
wootalk
meetunnel
劇本殺
匿名聊天
校園交友 app

# 宣傳文 LARP
可供宣傳推廣的網站： dcard-(心情版, 感情版, 閒聊版, 女孩版, 有趣版, 梗圖版...)
因為要在dcard宣傳 故僅用由dcard文作為參考

可能的宣傳重點： 鎖定客群target
1.當下有生理上的需求 但又因其他因素不能發展穩定關係的群體
  配對流程 讓每個人能找到正常可約懂聊色的對象

2.擴張交友圈 針對交友圈太小又沒時間社交的群體 
  真心交友 年齡層以大學生為主

3.只是無聊想隨便聊聊 針對劇本殺娛樂性的群體
  認真想認識異性 強調遊戲能塑造單純的交友環境 

以閒聊方式行銷通廣：
閒聊版-主要講述遇到的趣事 再不經意的露出平台畫面


如何避開約砲男？ 開頭三大常見句點：
約嗎? 壞壞嗎? 有男友嗎? 慾望大嗎? 身材好嗎 住哪? 幾歲? 加line嗎 可傳圖嗎 
有沒有約過？ 以前約過嗎？ 來找什麼？ 為什麼來玩這個？

灌輸一班人都應該使用交友軟體的觀念：
各位女性應當自強！！！ 性事上男女是平等的
如果對方有錢長得帥 完全不吃虧
約砲普及化 大部分女生都有約過炮的經驗
YOLO(You Only Live Once), 活在當下

記得分母要大：
可以多嘗試不同的交友軟體 或是多聊幾個 多刷幾個 一定能找到喜歡又適合的類型
網路上有失敗的經驗 也有成功的經驗 只看自己是不是警慎 
不要聊一下就衝腦 貿然約見面被騙砲 
雖然約砲的人多 但一定也有想正常交友的人
穩聊 有相同的默契 有共同的愛好 優質條件好 暈船 開始暈 上得了船下不了船

思考一般人使用交友軟體的狀況:
交友軟體載一堆 註冊完後發現配不到人 
好不容易配到了人 又要開始硬聊一些話題 過不久後就刪掉了
交友軟體大部分都是約砲的 玩到後面開始心累

許多交友軟體都會有機器人帳號丟罐頭訊息 或是必須付錢看訊息
即使有照片也沒用 因為大部分人都會放照騙 見過2次網友 約見面後都會發現差很多= =

目前僅在大專院校推廣：
人數較少 用戶群體也比較單純
可減少配對到8+9或+9妹的機會 瞎妹 跩妹 也可以避開許多騙錢投資或騙IG追蹤的人
玩交友軟體的用意還是找到對的人 (無論你想找的是哪種對的人)
人數少才更能提高配對到優質對象的機會


與業配文做出差異：改善其他交友軟體的業配感

與其他替代軟體的差異：試想你的平台的優點
大部分交友軟體的行銷重心都放在吸引男生 因此應改為吸引女生為主

與現實交友的差異 
遊戲內比現實中更容易認識別人


團隊夥伴徵文:
我們也歡迎志同道合的夥伴加入：
具備基礎前端或後端開發能力的朋友
正在學習UI/UX設計的朋友
熱衷於寫各種18禁和非18禁劇情的朋友
對劇本殺和類似桌遊玩法有興趣的朋友

找尋推廣劇本殺的社群或團體

== == == == == == == == == ==
西施版PO文：target為有約砲需求的群體
本文的重點著重於：劇本殺 這是其他類似的交友平台沒有的特色
關鍵：如何讓別人點連接 必須將其他人由外部網站連進來

標題：


正文：
來分享一下系上團隊正在寫的約跑交友平台～😎

2022年
校園匿名交友約跑平台 校園匿名約跑劇本殺-測試版beta

有鑒於女性友人的過往約跑經驗🙌
使用交友app 害怕留資料放照片會遇到怪人騷擾 
而且還會遇到一堆廣告,業務或假帳號
玩匿名聊天 發現上面的人都講類似的話又很不好聊 
根本很難找到正常可約懂聊色的對象

因此我們結合了劇本殺模式與匿名聊天～
讓使用者以一人對多人的方法保證成功配對 
並能更快更有效的找到適合自己的對象😎 

且在1v1匿名聊天時
用戶之間已在劇情中認識彼此 可減少不必要的詢問式尬聊～

Live Action Role Playing(LARP) 劇本殺
臨場劇本遊戲 源於北美著名桌上遊戲DND與其後衍伸的互動文學
每個人在劇本中都會被賦予不同的角色 
每個人都不知道事件的全貌 只憑一開始的劇情做判斷
彼此間要做探索又需要隱藏秘密 且隨者背後謎團的揭曉慢慢推進故事
劇本殺的故事題材常使用脫離一般人生活的場景 
而成人劇本殺則更著墨在18禁成人劇情上

我們定位為校園交友型的wootalk 可用於認識不同校系或已畢業的朋友
目前處於測試版beta 僅在少部分校系測試過
目前僅在大專院校推廣 人數較少 用戶群體也比較單純
(讓只想要單純約跑的朋友 可以減少遇到假帳號或機器人帳號的風險)

往後的規劃是發展為校園交友類獨立遊戲
有沒有喜歡看西斯版內容，又熱衷於寫各種18禁成人劇情或正常劇本殺劇情的朋友想加入～

google表單：
針對劇本殺流程之意見提供

針對使用體驗的回饋建議：
 您認為平台需要改善的地方，等待時間過程、使用流程太複雜、等...

是否有興趣加入團隊：
 熱衷於寫各種18禁成人劇情或正常劇情並想加入的朋友，或對劇本殺和類似桌遊玩法有興趣的朋友，您可以留下信箱等資訊～ 另外對於web app有基礎開發能力或有興趣的朋友也歡迎交流討論。


關鍵字：匿名聊天 wootalk meetunnel 交友軟體 約砲 劇本殺 匿名 校園 



# 架構圖 LARP
1.obj_name 以物件為主體 描述使用方法與其他物件的關聯性
2.process_name 以流程為主體 描述執行順序及原因

obj_name:
  used_by:
  to_use:

process_name:

login和logout都會重新導向一次window.location.href="/chat" 
此時才會重新做loadLoginData()

loadLocalData, loadRoleData都只會在ready時執行 其餘狀態都使用refresh進行
但loadLoginData則在登入登出時仍會再進行

consumer分為二種function:
function receive from other consumer(來自其他用戶)
function called by receive_json(來自前端)

localData

loginData

  loadLoginData()->loadLocalData()：因為localData需要存取 loginData.name和loginData.school
  此時loadLoginData()會把loginData給予localData 在做loadLocalData()來進行refreshProfile

  loadLoginData執行reftreshStatus 和 loadRoleData執行refreshGameStatus：兩者都會執行
  refresh (load只會在一開始讀取網頁時執行 而refresh則可能在讀取網頁後執行)

  refreshStatus和refreshGameStatus負責處理當前status所要顯示的內容：players_btn->navTitle->chatLogs

term

toggle

chatroomWS

WSManager

chatUI

checkGate

gameCheckGate



# 手動測試流程 LARP


# model data LARP


# LARP
互動鍵 與 行動鍵：會隨角色而而異
當不能執行互動或行動時直接將btn隱藏

dialog彈出時間不變 但應該加上語助詞讓過程更生動 例如：'。。。', '$'...


主題：畢業舞會後的畢業女孩 graduate_girl
best_ratio為[5,1] threshold_ratio為[3,1]

呈堂證物與揭露證據先不做 因為可以直接使用圖床來進行 而且怕變成完全看臉的交友方式
審問室與審問時間 加上審訊不公開與審訊公開兩種按鍵
當所有玩家都審問完就可以進行 '推理' 取消與確定放最下面

偵探：互動鍵 - 審問 與 行動鍵 - 推理
其他人：互動鍵 - 互動(偵探) 行動鍵 - None

偵探
嫌疑人
其中只有一位是真正發生關係的渣男


["以下劇本是由<span class='a-point'>偵探</span>的視角進行",0,"s"],
["",0,"w"],
["===大學畢業晚會===",0,"s"],
["(今天是我們最後一天待在學校了 突然有點感傷...)",0,"m"],
["(突然有人叫住我...)",0,"m"],
["<span class='a-point'>好姐妹</span>：誒！過了今天我們就不再是大學生了耶！ 要不要來做一些特別的事～",0,"a"],
["說什麼呀 妳是喝醉了哦？",0,"m"],
["<span class='a-point'>好姐妹</span>：哈哈 等等要不要跟他們去續攤呀？",0,"a"],
["他們...？",0,"m"],
["<span class='a-point'>好姐妹</span>：你傻呀！就是剛剛那群人呀！ 我看妳剛剛也玩得很開心呀",0,"a"],
["哪有！ 那他們要去哪續攤？",0,"m"],
["<span class='a-point'>好姐妹</span>：妳看妳明明就很有興趣！ 我去問一下好了，我猜應該是學校旁邊的酒吧！ 妳真的要去齁？",0,"a"],
["應該可吧！ 但我不能玩太晚哦",0,"m"],
["好姐妹：知道啦，我們走吧！",0,"a"],
["",0,"w"],
["",0,"w"],
["。",0,"m"],
["。。",0,"m"],
["。。。",0,"m"],
["====隔天早上====",0,"s"].
["(我在宿舍醒來...)",0,"m"],
["我怎麼......",0,"m"],
["<span class='a-point'>好姐妹</span>：誒 妳昨天很誇張耶！ 真看不出來妳比我還會玩～ 哈哈",0,"a"],
["我...？",0,"m"],
["<span class='a-point'>好姐妹</span>：對呀 還被帥哥帶出場～",0,"a"],
["怎麼可能！？",0,"m"],
["<span class='a-point'>好姐妹</span>：真的呀！ 連我也嚇了一跳 認識妳四年 都沒看過妳這麼主動哈哈哈",0,"a"],
["為什麼我完全沒印象......",0,"m"],
["<span class='a-point'>好姐妹</span>：哈哈哈我也沒仔細看！ 喝到最後很多人都茫了～",0,"a"],
["(這個男生是誰呀？ 完全記不起來...... 總之先回去那間酒吧看看吧)",0,"m"],
["",0,"w"]


role-偵探： (group=1)
["妳是這場遊戲的<span class='a-point'>偵探</span>", 0,"s"],
["<span class='a-point'>審問</span>：<br>
左側名單是昨晚與妳待在酒吧的<span class='a-point'>嫌疑人</span>，只有其中一位是真正發生關係的渣男，請選擇任何一位嫌疑人單獨進行<span class='a-point'>審問</span>吧！<br>
<span class='a-point'>推理</span>：<br>
每一輪最後偵探將進行<span class='a-point'>推理</span>，若成功識別個別嫌疑人昨晚酒後失態所做的事，則該名嫌疑人失敗出局，直到找出嫌疑人中的渣男則偵探勝利，成功破案遊戲結束。",0,"s"]

role-其他人： (group=0)
["你是這場遊戲的<span class='a-point'>{0}-{1}</span>，你昨晚在酒吧<span class='a-point'>{2}</span>", 0,"s"],
["<span class='a-point'>調查</span>：<br>
你可以<span class='a-point'>調查</span>左側名單上的嫌疑人，查看對方昨晚可能做的事，藉此協助<span class='a-point'>偵探</span>辦案。<br>
若<span class='a-point'>偵探</span>成功找出嫌疑人中的渣男，則其餘嫌疑人勝利，成功洗刷罪名。 反之嫌疑人中的渣男未被找出，則渣男勝利，成功躲過。<br>
<span class='a-point'>線索</span>：<br>
可向偵探傳送一句話做為線索，除此之外偵探會對每一位嫌疑人進行審問，你必須想辦法不讓<span class='a-point'>偵探</span>識別昨晚自己酒後失態所做的事，若被成功識別則該名嫌疑人失敗出局。<br>
",0,"s"]



以下劇本是由<span class="a-point">偵探</span>的視角進行

===畢業晚會結束===
我：(突然有人叫住我...)
好姐妹：誒！過了今天我們就不再是大學生了耶！ 要不要來做一些特別的事～
我：說什麼呀 妳是喝醉了哦？
好姐妹：哈哈 等等要不要跟他們去續攤呀？
我：他們...？
好姐妹：你傻呀！就是剛剛那群人呀！ 我看妳剛剛也玩得很開心呀
我：哪有！ 那他們要去哪續攤？
好姐妹：妳看妳明明就很有興趣！ 我去問一下好了，我猜應該是學校旁邊的酒吧！ 妳真的要去齁？
我：應該可吧！ 但我不能玩太晚哦
好姐妹：知道啦，我們走吧！


====隔天早上====
我：(我在宿舍醒來...)
我：我怎麼......
好姐妹：誒 妳昨天很誇張耶！ 真看不出來妳比我還會玩～ 哈哈
我：我...？
好姐妹：對呀 還被帥哥帶出場～
我：怎麼可能！？
好姐妹：真的呀！ 連我也嚇了一跳 認識妳四年 都沒看過妳這麼主動哈哈哈
我：為什麼我完全沒印象......
好姐妹：哈哈哈我也沒仔細看！ 喝到最後很多人都茫了～
我：(這個男生是誰呀？ 完全記不起來...... 總之先回去那間酒吧看看吧)

左側是昨晚與妳待在酒吧的<span class='a-point'>嫌疑人</sapn>：
只有其中一位是真正發生關係的渣男，請選擇任何一位嫌疑人單獨進行<span class='a-point'>審問</sapn>吧！

'昨晚與偵探發生關係'


以下是與嫌疑人相關的線索：

酒吧外面有嘔吐物，如果不是我，就是有人酒量不好吐了滿地。
'在酒吧外面吐了滿地'

酒吧裡有打鬥的痕跡，看來有人在這邊發生過爭執。
'與其他人發生爭執'

有堆疊過的靠墊，可能有人喝醉後就直接在這睡著了。
'不勝酒力直接睡在酒吧'

地上有滿地食物，是不是有人不小心打翻了食物？
'打翻了桌上的食物'

桌上有雜亂的僕克牌堆，有人昨天打了一晚上的牌。
'打牌輸了一堆錢'

酒吧內有小狗的咬痕，看來有人帶狗狗來續攤了。
'連小狗都帶來擋酒'

廁所內有用過的保險套，難怪好姐妹昨天在廁所待這麼久。
'與偵探的好姐妹待在廁所'

桌上有落下的手機，竟然有人這麼健忘，連手機都忘了帶走。
'醉到把酒杯誤認為手機帶走'

酒吧外面有掛著男生內褲，昨天有人玩那麼兇嗎？...
'打賭輸了跑去裸奔'

桌上有落下的筆電，什麼事那麼急，需要帶筆電到酒吧來做...
'不知為何想在酒吧上網課'

有被插滿的飛鏢箭靶，有人玩了一晚上的射飛鏢。
'邊緣到一個人玩飛鏢'

廁所有被塗鴉寫字的鏡子，內容感覺像是在對一個我不認識的女生告白
'喝醉後胡亂告白'

沙發區有男生的長褲跟襯衫，昨天他們到底玩了什麼遊戲...
'喝醉後開始跳脫衣舞'

桌上有微積分運算的筆跡，聽說有些男生喝醉時喜歡算數學，看來是真的...
'在酒吧高談闊論微積分'


要在玩一局嗎？除了故事背景之外，所有角色與他們當時所做的事都是隨機生成的，不會有完全重複的內容。

偵探
打工的同事
必修課教授
愛當人的教授
系上學長
系上學弟
系上邊緣人
他系學伴
工具人
社團學長
社團講師
富豪同學
通識課同學
好姐妹的男友
好姐妹的友人
校草
舞會男伴
舞會主持人
籃球系隊隊長
排球系隊隊長
酒吧老闆
酒吧吧檯


目前只開放成人模式

主題：校園愛情故事

好友：
我：

偵探
嫌疑人
其中只有一位是傳給你匿名訊息的暗戀者

課堂小老師
數學天才
語文天才
富豪同學
籃球校隊隊長
網球校隊隊長
導師
班長
風紀股長
康樂股長
國文老師
數學老師
體育老師
社團同學
社團老師
訓導主任
大學霸
大學渣
校草
邊緣人
隔壁班同學
隔壁班老師


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
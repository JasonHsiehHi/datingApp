# 程式原則
## 內聚力與耦合性
內聚力cohesion
指模組內部的函式只少使用到少數該外部模組的變數或方法則內聚力越高 也就是獨立性越好
耦合性dependency(coupling)
不同功能模組之間相互依賴的程度 也就是當其他模組發生問題時不會受其影響或影響程度較小

一般而言兩者密切相關 內聚力越高則耦合性越低 維護上與易讀性都會更好

## 針對資料庫的ACID原則 
Atomicity(原子性) 表示任何動作都是不可分割 沒有部份成功 只有整個行為成功或失敗
Consistency(一致性) 任何動作都必須符合資料庫架構 
Isolation(隔離性) 充許多個洞作同時訪問資料庫 且能確保不會使數據不一致
Durability(耐久性) 當動作完成後資料的保存就是永久的 

## 物件導向的 S.O.L.I.D原則(針對class類別)
單一職責原則 (Single Responsibility Principle)
類別命名要言簡意賅且只能有一種職責 就如同方法只能做一件事

開放封閉原則 (Open-Close principle) 為追求低耦合性 類別或方法之間都是彼此獨立的
修改具有封閉性 修改程式時要想辦法避開能影響其他程式碼的部分
擴充具有開放性 擴充程式時盡可能不動到原程式碼

里氏替換原則 (Liskov substitution principle)
物件在做繼承時 被override的部分不會影響原先針對父類別的測試結果
也就是子類別只做擴張不做修改 針對父類別的測試施加在子類別也應該要有相同結果

接口遠離原則 (Interface segregation principle)
介面不應該提供多種方法 只能提供全部繼承子類別的基本方法
因為介面的方法子類別必須要實作 如此就容易導致空方法的出現
(介面方法必須實作的原因是：確保外部在調用方法時都不會出錯)
而所謂的基本方法也就是針對全部子類別而言 此方法都不會為空(都會被使用到)

解決方法就是建立多個介面讓子類別實作 有空方法出現就移到其他介面 
(不同於父類別只能繼承一個 介面則可實作多個)

依賴反轉原則 (Dependency inversion principle)
當引用第三方套件時 不應該直接在主程式調用其方法或類別 而是需要透過配飾器的adapter
如此當第三方套件更動時才不會導致影響主程式 我們只要修改adapter就好
依賴反轉指的是當第三方更動時 我們仍不需要更動主程式 而是只要反向的調整在adapter中的第三方套件方法即可

控制反轉Inversion of Control (IOC) 和 依賴注入Dependency Injection (DI)：
用戶直接使用A程式 但A程式依賴於B程式和C程式 當B或C更動時會導致問題發生
此時可以用IoC Container來使用A,B,C程式 此時就能把A從原本的依賴關係獨立出來 
這就是將控制權全部反轉導Container上 以此降低程式的耦合程度

A程式依賴於B程式 當有一天B程式發生變動而改用C程式時 此時就需要A程式的維護成本
此時就能用DI 將被依賴物件注入被動接受物件中 也就是將B程式當成參數引入A程式中
此時只要規範C程式與B程式實作同一種介面 就能確寶C程式也當成參數注入時不會出錯

這種將物件作為參數的方法有點類似strategy pattern
但stg模式主要訴求更多樣性的物件 而DI則是為了降低耦合程度

## 多版本控制
將介面作為參數 此時所有實作該介面的物件都可以被引用進去
用介面做為參數的好處是當你需要修改物件時時 你不需要動到所有依賴於此物件的程式
方法為用另一個物件來實作介面 如果確定修改完成後再把原物件刪除即可
而不同版本可直接使用不同物件 並讓所有物件都統一實作相同介面即可

## 測試驅動開發 (TDD)
測試程式和產品程式一起被撰寫 且在未完成產品前就先完成測試 往後修改程式時可直接用測試查看問題
也就是藉由測試過程一步一步找出問題 如此可用於總結軟體的各種例外處理

## F.I.R.S.T. Principle
fast:測試速度越快越好
independent:每個測試彼此獨立 因為若其中一個failure 也不會影響到其他測試的公正性
repeatable:任何環境下其結果都要相同 不會因作業系統或網路環境而改變
self-validating:最終都應該輸出boolean 讓測試者能夠輕易分辨
thorough:測試應該想到所有可能的情境 一切可能遇到的用戶非預期行為或各種環境下的可能行為
timely: TDD的概念 測試應在產品之前寫完

## 檔案轉碼相關
base64：為6 bits為一單位 故共有2^6=64種可列印字元 
(因為英文A-Za-z0-9共有62個 之後再加上'+', '/'常用字元 故早期時已包含所有可用字元)

ascii：編碼方式為英文字為1個byte(8 bits) 中文字為3個bytes(共24 bits)
由於 3*8 = 4*6 =24 此時base64和ascii兩種編碼能剛好對應 
也就是將3個英文字換成base64編碼需要4個字元 同理1個中文字以base64編碼就需要4個字元
若英文字不足3個(也就是只有8位元或16位元) 則其餘位元都用0填滿 在用base64編碼 
(但會跟000000=>'A'衝突 故改用'='代替 這也是為何base64最後常見'='的原因)

latin1和latin2由ascii延伸而來
ascii為8 bits為一單位 故最多能夠有256個可顯示字元
除了英文A-Za-z0-9共有62個之外 再加上' ', '!', ',', '.'等標點符號還有現在不用的控制字元 共128個
也就是還有128個字元沒被用到 故latin1再加上96個字元供西歐國家的拉丁字母使用 latin2則多加中歐國家的拉丁字母
latin1和latin2不是再延伸關係 兩者是不同的編碼字元體系
由於latin1使用到8bits內的所有編碼 故最適合傳輸與存取(MySQL默認latin1作為編碼)

UTF-8(unicode):
由於ascii的8bits只有256可顯示字元 不能包含多個國家 故應此有了萬國碼(unicode) 
常出現的亂碼就是編碼方式不同所造成 

因為unicode只是符號集 若全世界所有國家的字元都用最大位元空間來存取的話 就會造成許多浪費(英文字只需要1個byte即可)
故用UTF-8做為存取字元的規範 可隨不同國家的字元而自動調整存取的位元空間(英文字為1byte, 中文字為3bytes)

- - - ------------------------------------------------

# python語法補充：
class TestError(Exception):  # 一般自訂的例外都是繼承Exception類別 表示任何程式發生的例外都能捕捉
  def __init__(self, code):
    super().__init__(code)
    self.code = code  # 通常exception會有一個code屬性 用於通知log發生什麼事
try:
  ......
except TestError as e:
  raise TestError2() form e  # 表示TestError2是因為TestError引發而起
except TestError as e:
  raise TestError2()  # 則表示先觸發TestError再觸發TestError2
  print(e.code)
try..except...用於當error發生時使用 效能非常差 但try-except的好處是可以跳出當前的線程
if...raise... 則必須符合if提件時發生 效能很好 故能用if判別式就盡量不要用try-except

python中例外的頂層父類別為BaseException 而直接繼承BaseException的類別有：
SystemExit(系統終止), KeyboardInterrupt(鍵盤中斷), GeneratorExit(生產器關閉), Exception(程式邏輯問題)
 
在例外處理中 繼承關係極為重要 故可用__mro__找上層父類別：
Exception.__mro__  # output: (<class 'Exception'>, <class 'BaseException'>, <class 'object'>) 

每個模組都應該有自己定義的exception 
通常後綴名使用Error 像是ClientError('error message')

try-except:raise則表示再丟一個exception給上一層 (若不用raise則表示在該層就處理好不會再往上一層)
像是utils.py不處理exception 而是raise ClientError('error message') 給 consumers.py

不要不指定exception (except:) 會導致所有例外都被用同一種方式回應
except:只能用於測試階段 正式上線就就必須捕抓完整的例外

此外盡量不要用在同一個try:區塊 標記多種exception
except HTTPError as e:
except ConnectionError as e:
except Timeout as e:
就好的作法是找其中的父輩來寫 以上三中exception都是繼承自RequestException 故改為：
except RequestException as e:

標記多種exception只可能是會因為excetion的不同而有不同的處理方式的時候
像是可能Timeout不僅多出訊息 還會協助重傳一次


JSON在server端解析完後為dict:
dict_data = json.loads(data)
message = dict_data['message']  
此時若沒有key值會發生問題 
故可改用dict_data.get('message',None)取值 不存在key值時會自動回傳None
同理 針對物件亦有getattr(object,'message', None)取值 當不存在attr時回傳None
python中當屬性可能為undefined時 必須用getattr(), setattr(), hasattr()取代直接存取

message = dict_data['message']  等同：__getitem__(key)
dict_data['message'] = message  等同：__setitem__(key, value)

tuple()不能只存放單一元素 此時可以用(elmt,)來表示

model常用的set集合:
setA = {3,5,7,9}  = set(3,5,7,9)
用set{}與list[]和tuple()做區分 set不能使用index找element 但可以做集合運算:
(setA|setB)聯集 (setA&setB)聯集 (setA-setB)聯集 (setA^setB)聯集

class Test():
  def __repr__(self):  # >>> a output: the repr
    return "the repr"
  def __str__(self):  # >>> print(a) output:the str
    return "the str"


strftime()和strptime()兩種方法中的差別 f 和 p 分別對應著 format（格式）和 parse（解析）
%w為0,1,2,...,6(0為星期天)  %a為Sun,Mon,...,Sat (英文縮寫abbreviated name) %A為Sunday,Monday...,Saturday 不會用於轉換成時間strptime() 而是用於輸出字串strftime()
%d為01,02,...,31 %m為01,02,...12 %Y為2017,2018... 這是最常用的單位 (%y為17,18,...)
%b為Jan,Feb,... %B為January,February,...  應該是由%a和%A延伸而來 
%H:%M:%S 為13:01:01 這是最常見的使用單位 (要用 %I(%p) => 01(PM) 才能取代 %H => 13 並不方便)
%f為ms datetime的ms共有6碼 111111, 111112

## python常用dict與list方法:
javascript - 刪除array.pop()/array.shift()/array.slice(), 新增array.push(value), 合併array1.concat(array2)
javascript - 刪除delete object[key], 新增object[key] = value, 合併object3 = Object.assign({}, o1, o2)

與之對比 javascript 常用object與array方法:
python - 刪除list.pop(index), 新增list.append(), 合併list.extend()
python - 刪除dict.pop(key)/ del dict[key], 新增dict[key] = value, 合併dict.update()

## python regex正則表示法
正則表示法使用'\' 是為了避免與http格式的'/'混淆
re.match(pattern, string) 每一個re都是一組pattern 並放入要驗證的string

針對單一字符的規範：
[abc]表示只充許a,b,c三種字符 (數量透過{}決定) ; [^abc]則表示除a,b,c之外都充許
\w匹配任何字符 等同[a-zA-Z0-9] ; \d匹配任何數字 等同[0-9] ; \s匹配任何空白字符 等同[ \t\n\r\f\v]
.可以取代大部分的字元 除了\n以外的任何字元[^\n] \+用於所有被限制的字元 等同[+]
\W 則為[^a-z A-Z 0-9] \D和\S則同理
{m,n}表示字符出現數量在m,n之間
+:等同{1,} 至少出現一次以上 ; *等同{0,} 可充許不出現或任何次數 ; ?等同{0,1} 有或沒有且最多一個
(abc)+ 此時不已單一字元來計算次數 abc是一組 只充許 abc, abcabc,......
用(...)匹配到的字串會放入match.group()中 可以由.group(1) .group(2)找尋先後被匹配到的字串


~http_url re網址的正則:
/(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/g
其中： /^https?:\/\//  等同: /^(http|https):\/\//
其中的s? 即為s{0,1} 表示此字元有或沒有都符合
/g: 表示全文查找 若只有/(https?:\/\/[^ ;|\\*'"!,()<>]+\/?)/ 則只找符合的第一項
/i: 則為忽略大小寫
/m: 則為多行查找 用於有換行符的string

~常用的password正則
re.match(r"^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[@#$])[\w\d@#$]{6,12}$", password)

~常用的檔案篩選正則
/^.*\.md$/ 批對資料夾內所有md副檔名

(?=...)為lockahead：本身不佔用任何字元 僅用於判別是否符合 
abc(?=[1-9]) // output: 'abc1'中的'abc'(lockahead不佔字元) 'abcw'則不符合

r"^(?=.*[\d])[\w\d@#$]" 由於lockahead前面沒有字元 會導致錯誤 必須加上^開頭
同理r"[\w\d@#$](?<=.*[\d])$" lockbehind若放在最後要加上$結尾

(?<=...)為lockbehind：因為(?=...)只能檢測字串右側 若要檢測字串左側 則用(?<=...)
(?<=[1-9])abc // output: '1abc'中的'abc'(lockbehind不佔字元) 'abc'則不符合

(?P<name>)和(?P=name):
被匹配到的字串可透過<name>來設置別名 設置完後便可重複使用
(?P<n>a|b|c)1234(?P=n) => a1234a

針對字串或多個RE的規範：
'^{start' 開頭必須是{start才能匹配 ; 'end}$' 結尾必須是end}才能匹配
EX: r'ws/chat/(?P<room_name>\w+)/$' 網頁很常用'/$' 即表示開頭的URL不考慮 只要結尾符合就可以連接

# python_concise(便捷性)：
i = 5 if a > 7 else 0
同JSㄧ樣 if-else也可以用簡寫方式 以避免過多的換行

y = [1,2,3,4,5,6] 
[(i*2) for i in y ]  # output:[2, 4, 6, 8, 10, 12]
用for迴圈完成list

y_list = ['assss','dvv']
[print(i) for y in y_list for i in y]  # output: a s s s s d v v
亦可用for迴圈完成巢狀結構 (有點不合語法 其原因為for y in y_list：必須要有明確的變數 故y_list會先放在前面)

a = [51,27,13,56]
a_dict ={i:x for i,x in enumerate(a)} # 同理也可以用在dict中
enumerate(list) 會直接回傳tuples(index, a[index])的格式 對於list非常方便

x = 3
(lambda k: k+3)(x)  # output: 6
用(lambda 參數: 表達式) 來取代傳統命名的函式
def func(x):
  return x+3

map(lambda x: x * 2, [1, 2, 3, 4, 5])  # output:[2, 4, 6, 8, 10]
map()可針對參數做映射 故最後回傳的大小長度都會跟放入的參數相同

lambda能與zip()一同使用 但易讀性較差
即： map(lambda t: t[0]*t[1], zip(input_a, input_b)) 
不如用：[x*y for x,y in zip(input_a, input_b)]

lambda也能處理多個變數 必須在其後擴充相同長度的參數
map(lambda x, y: x + y, [1, 3, 5, 7, 9], [2, 4, 6, 8, 10])

all()和any()都必須放可迭代物件
any([-1,0,[]]) # output:True  ( list中只要有一個True any()為True)
all([-1,0,[]]) # output:False  ( list中必須全為True all()為True )

zip()則用於同時處理多個可迭代物件 可將其組合成tuple並供使用
x,y = [1,2,3,4],['a','b','c']
 [x+y for x, y in zip(x, y)]

print（['Yes! '] * 3 + ['very good!']） python的list可直接用'*'以重複相同的串列
list的'*'和'+'等單運算子都是為了方便運算 '*'可用for-loop替代 '+'則可用extend()替代
另外python的range：並不是只能用在for-loop上面 實際上的range()的用途也是產出list變數型態

可執行iteration的物件都是iterable(list) 都能被for-loop使用：
iterator為迭代工具：但已經被封裝在list或dict可迭代物中 故應該層面不會直接使用
iterator提供一種方法為next() 當執行next()時會返回done:的布林值 直到done:True則停止繼續做iterator.next() 另一觀點上iterator像是針對iterable的指標 如果next()沒有指向下一個則停止


- - ---------------------------------------------
# python非同步作法：
python和JS相同都是單線程語言 python有所謂GIL(全局解釋器鎖)
故即使進行非同步方法 將function放入event_loop中 pytohn仍是單線程執行(會讓多個線程並行並交替執行來達到多線程的效果)

loop.run_until_complete()和loop.run_forever() 前者等到任務完成後會自行關閉 後者則不會關閉需要用loop.stop()來停止

協程(coroutine) 強調是他可以中途改變原程序：可中斷 可復原 可引入參數 可做回傳  "能在中途中斷、中途恢復、中途傳入參數的函數、中途返回值給其他協程"
所有非同步方法本質就是一種協程：在async function之中的await 就是中途拿取其他協程的返回值

django中可使用async def func_name() 來達成非同步視圖
若是基於class的使用：則可用async def __call__() (不能用__init__()或as_view())

import asyncio
loop = asyncio.get_event_loop()  # 建立event loop

async def get(url):  # 該方法本身就是coroutine：因此不能直接調用 需要放入event_loop中 或 用前綴await
  print('hello')
  await asyncio.sleep(1)  # await用在此方法並不能馬上執行且需要等待的時候 
  print('world')  # 下一條會等awiat結束後才執行

只要方法內部有使用到await 都必須用async def func()
換一個角度來看：也因為有需要await的function存在 才需要使用非同步函數調用 (因為時間被拉長)

可用sleep()來實現JS的setTimeout
當async_function執行await function時 會等到await的執行時間結束後才繼續執行此下一條function
(await即是存取不同的事件循環event_loop到此執行緒 循環中有許多function等待存取)
若要像JS的setTimeout()一樣讓同步事件先於非同步事件處理： 需要使用到create_task()

res = await loop.run_in_executor(None,requests.get,url)
print(res)
(第一參數用於指定executor None表示用default executor)
(第二參數放func() 第三參數之後方則放func(a,b,...)的參數a,b,...)

如果要連續進行async的方法 應該用event_loop代替await 
因為await本來就是為讓async融入到sync之中 而不是處理多個async

event loop四大常用方法
loop.is_running() 判定一個Event loop是否還在運作。
loop.is_closed() 判定一個Event loop是否已經被close掉。
loop.stop() stop一個Event loop。
loop.close() close掉一個Event loop。

tasks = []
for i in range(10):
  task = loop.create_task(send_req(url))  # 此時還沒有開始執行 只建立task 並放入同一個event loop
  tasks.append(task)  # 目前共共有tasks[0], tasks[1], tasks[2]... 共10個tasks放在一個event loop中

不使用loop.create_task()：
await send_req(url)
await send_req(url)  # 因不在同一個event_loop：故需先等待上一條完成後 再等待下一條完成
因此這兩個await是在同一個async_function區塊中的

使用loop.create_task()：
await tasks[0]
await tasks[1]  # 在同一個event_loop：兩事件會同時執行 但會依據event_loop順序存取 

coroutines = asyncio.wait(tasks)  # 表示不只有一個task協程 有多個task時就用asyncio.wait() 表示可以中途暫停給其他協程執行
loop.run_until_complete(coroutines)  # 直到run_until_complete才開始執行

Task對象是從Future對象繼承過來的 所以Future對象所擁有的method Task對象也有 
但是這兩個對象被發明出來的目的是很不一樣的 之前所使用的都是task對象
future對象並不是coroutine 而task對象才是coroutine 可以說task對象是繼承future對象而來並能使用coroutine的方法
future對象有一點像是javascript的promise：
future.set_result()相當於js promise裡面的resolve()
future.set_exception()相當於js promise裡面的reject()

from asgiref.sync import async_to_sync, sync_to_async
這兩個都是python原生的 關於操作ASGI的lib

async def get_data_async(...): 非同步函數
    ...

sync_get_data = async_to_sync(get_data_async)  # 將非同步轉成同步 
可直接在原先的程式區域執行 且非同步函數會在與原本的程式區域之不同的線程上執行

def get_data_sync(...): 同步函數
 ...

async_function = sync_to_async(get_data_sync, thread_sensitive=True)
results = await async_function(...)    #同理 async function必須要用await才能調用

results = await sync_to_async(get_data_sync, thread_sensitive=True)(...) # 也可直接調用

thread_sensitive=True  # 默認為True 表示會將所有透過sync_to_async()做轉換的function放入同一個線程
thread_sensitive=False  # 則為在開一個全新的線程 結束後自動關閉


- - ---------------------------------------------
# settings.py
為避免專案中的特定資料夾位置變更而導致錯誤 
所有在settings.py的路經都應從root開始('/'...) 故使用BASE_DIR
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
 __file__表示為終端機中invoke Python時 使用的python_script名稱: python settings.py
os.path.dirname(__file__)表示在哪個上層資料夾啟用此script 為相對位置
os.path.abspath(__file__) 因為動用os.getcwd() 即使invoke時只有檔名也能找到絕對位置

新版python的路徑相關lib:
from pathlib import Path
BASE_DIR = Path(__file__).resolve().parent.parent
用Path()轉成pathlib模組的類別 如此才能用parent屬性找根目錄
resolve()則用於將相對路徑轉成從root開始的絕對路徑

os.path.join(BASE_DIR, 'db.sqlite3') 將路徑串起來 一般而言sqlite3檔會放在根目錄
由於BASE_DIR為pathlib的類別 故可直接用 BASE_DIR/'db.sqlite3' 表示路徑的串連
以下三種方法其結果都相同：
this_folder = Path(__file__) / '..' 
等同： this_folder = Path(__file__, '..')
等同： this_folder = Path(__file__).parent

path = Path('foo/ber/baz/boo/boom') 用相對路徑找parent
path.parent // output: Path('foo/ber/baz/boo/')
list(path.parents)  parents則會回傳多個路徑類別的list 
直到執行時的當前所在位置：Path('.') 為止
//output: [PosixPath('foo/ber/baz/boo'), PosixPath('foo/ber/baz'), PosixPath('foo/ber'), PosixPath('foo'), PosixPath('.')]

DEBUG=True 才會導向error page (上半部黃色下半部traceback的頁面)
但因為有後端資料且會影響運行速度 故上線後會改DEBUG=False

ALLOWED_HOSTS=[] 可填入部署的虛擬主機IP或直接用"*"

設置SECRET_KEY：
SECRET_KEY可用於製作salt 對於加密功能極其重要

import os
SECRET_KEY = os.environ['SECRET_KEY']  # Read SECRET_KEY from an environment variable
可用os.environ.get('DJANGO_SECRET_KEY', 'cg#p$g+j9tax!#a3cup@1$8obt2_+&k3q+pmu)5%asj6yjpkag')代替
表示如果'DJANGO_SECRET_KEY'不存在 則改用第二參數代替
'DJANGO_SECRET_KEY'則可以在部署的server上設定 
若用heroku:
heroku config:set DJANGO_SECRET_KEY=<your_secret_key>

web上傳的數據或cookies都一定要經過資料清洗：以避免XSS攻擊(Cross site scripting)
xss即在inputfield欄中寫入可能惡意連接的代碼 進而影響伺服器後台

表單加上{% csrf_token %} 可以確保上傳資料時一定要由特定頁面進行：
以避免CSRF(cross-site request forgery) 即將惡意上傳文件丟給管理員並誘使他啟用

SSL(Secure Sockets Layer)即保證 網路連接安全 與 將資料加密保護直到送到指定端點
TSL (Transport Layer Security)同樣是SSL 只是使用更新的技術
HTTPS(HTTP Secure)即使用SSL加密的HTTP網站
另外有WSS 即為使用SSL作加密的WebSocket HTTP之於HTTPS 就像WS之於WSS


MIDDLEWARE=[] 與INSTALLED_APPS=[]相同 都必須講究順序
例如：authentication和messages都需要cookie-session才行使用 故必須放在其下面

middleware指的是中介軟體 在request/response傳輸架構之間的加工處理框架
python的框架上的middleware基本都是建立在WSGI之上
可用於處理cookie-session, security, csrf, authentication, message等
MiddlewareStack 表示有多個middleware堆疊起來 即request或response需經過多個middleware
處理方式為：input一個request 而後output一個request 最後再給view處理
class SimpleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # One-time configuration and initialization.
    def __call__(self, request):
        response = self.get_response(request)
        # Code to be executed for each request/response after the view is called.
    return response
 __init__() is called only once, when the Web server starts. 只有第一次啟用
 __call__() method which is called once per request. 每次有request都會啟用 很適合用來處理middleware


INSTALLED_APPS = [ , ,...]
當app不只一種時 可自由選擇想要配載或停用的app

- - - --------------------------------------------------
## INSTALLED_APPS: admin, sessions, auth, contenttypes, messages, staticfiles
auth APP:
~contrib.auth 在views.py中
若有用django.contrib.auth:
則經過view的request物件中會有user實例 可用request.user.is_authenticated等功能

admin APP:
~admin在admin.py中

sessions APP:
原先的cookie將key-value pair都存放在client端
但因為cookie可被修改或刪除 故改用session將資料存放在server端

若有用django.contrib.sessions:
則經過view的request物件中會有session物件 可用於處理相關變數 
另外auth的用戶登入登出也需要使用到session功能

後端的session_key會對應到前端的cookie 故同一台電腦的同一個瀏覽器只會存一組session
故只要前段送來內有特定cookie的請求 經過session的middleware就對自動進行匹對 此時就能維持用戶的登入狀態

def setCookie(request,key=None,value=None):
  response.set_cookie(key,value)
  response = HttpResponse('Cookie 儲存完畢')
  return response
def getCookie(request,key=None):
  if key in request.COOKIES:
      return HttpResponse('%s:%s' % (key,request.COOKIES[key]))
  else:
      return HttpResponse('Cookie 不存在!')

def setSession(request):
  request.session['is_login'] = True  # session為dict資料類別 可讓用戶透過view將資料存在其中
  response = HttpResponse('session 儲存完畢')
  return response

def getSession(request):
  if 'is_login' in request.session:
    status = request.session.get('is_login')
  response = HttpResponse('You have been login' + status)
return response

request.session.get('fav_color', 'red') 'red'為預設值
request.session.pop('fav_color', 'blue') 'blue'為預設值 如果沒有資料則為'blue'
request.session.set_expiry(300) 用於設置過期時間 參數以秒為單位：300秒

request.session.clear() 只清除當前request物件的session屬性 不會變更資料庫
request.session.flush() 做完clear()後再進行delete() 此時才會清掉資料庫的instance

request.session.clear_expired() 一次清除所有過期session
request.session.cycle_key()指的是當key過期時直接換一個新key

for key in request.session.keys(): 可以用 keys()或items()來進行session的遍及操作
  del request.session[key]

使用SessionStore：
from django.contrib.sessions.backends.db import SessionStore
SessionStore 用於將用戶的session_dict以encode()的方式 轉成 session_data 以方便傳入db中

s = SessionStore()
s['last_login'] = '2019/1/1'  # 將資料以dict的形式存入
s.create()  # 將session_dict轉成session_data 並生成session_id 

s = SessionStore(session_key='2b1189a188b44ad18c35e113ac6ceead')  # 可用SessionStore()類別來提取session_dict

使用Session model：
from django.contrib.sessions.models import Session
s = Session.objects.get(pk='2b1189a188b44ad18c35e113ac6ceead')
session_data = s.session_data  # 若直接由Session model中提取資料 則只會有session_data
s.get_decoded()  # 必須再用get_decode()轉成session_dict 

修改session[key]後必須手動變更request.session.modified = True
當view結束後才會再存入db之中

messages APP：
用於網頁的一次性彈出訊息(notification message) 針對使用者行為來給予相對應的訊息(success,info,warning,error等)
DEBUG的error頁面需有messages
針對用戶行為直接從後端生成對應資料 常用於需要進行DEBUG的web app
並與html5相同的semantic element語境化色彩元素(語義化)

在view中加上add_message():
from django.contrib import messages
messages.add_message(request, messages.INFO, 'Hello world.')

並在html加上messages相關的模板語言:
必須在TEMPLATES中 加上context_processors.messages才能使用
{% if messages %} 
<ul class="messages">
    {% for message in messages %}
    <li {% if message.tags %} class="{{ message.tags }}"{% endif %}>{{ message }}</li>
    {% endfor %}
</ul> 
{% endif %}

可在module_name自建context_processors.py：
from django.conf import settings
def site(request):
    return {'SITE_URL': settings.SITE_URL}  # 用於提供變數給templates

並要在TEMPLATES中的context_processors參數加上：
"module_name.context_processors.site" 才能使用

contenttypes APP：
所有創建的model都是ContentType的實例(必須要有contenttypes才能使用model) 
任何model的物件都能用ContentType的方法來取的
from django.contrib.contenttypes.models import ContentType
user_type = ContentType.objects.get(app_label='auth', model='user')
user_type  # output : <ContentType: user>

user = user_type.get_object_for_this_type(username='Jason')
user  # output : <User: Jason>

可用ContentType來製造model的泛型(generic):
from django.contrib.contenttypes.fields import GenericForeignKey
class SchoolPerson(models.Model):
  tag = models.SlugField()

  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')
  (重點在於content_object 其餘content_type, object_id都是為創建GenericForeignKey())

當兩個模型很相近 如Teacher和Student 並要進行同樣的方法 如打卡點名
此時可以用這種泛型model類別 便不需要特別針對這兩個類別而寫兩次相似的方法

t1 = Teacher.objects.get(username='Jason')
s1 = Student.objects.get(username='Smith')
g1 = SchoolPerson(content_object=t1, tag='teacher1')  # 將物件變數存入generic中 並加上tag
g2 = SchoolPerson(content_object=s1, tag='student1')

- - - ------------------------------------------------
## 其他settings參數
AUTH_PASSWORD_VALIDATORS = []
用於查看用戶在網頁上所輸入的密碼是否符合要求：
與輸入的帳號過於相似, 字符少於標準位數, 密碼重複性太高強度不夠, 密碼全部為數字...等

STATICFILES_DIRS 用於收集不同app資料夾中的static檔 
STATIC_ROOT 收集完後再用manage.py collectstatic執行 轉入STATIC_ROOT中
當development時應直接使用STATICFILES_DIRS 
而當deployment時應用collectstatic指令 部署到STATIC_ROOT

STATICFILES_FINDERS =[,] 並在development時要加上FINDERS做查找
如此就不需要事先執行manage.py collectstatic

STATIC_URL = '/static/' 只負責做templates中變數代換(in-HTML Templates)
{% load static %}
<img src="{% static 'my_app_pic/example.jpg' %}" alt="My image">
啟用靜態文件服務後 就能在template中使用{% static%}
並加圖檔放在 my_app/static/my_app_pic/example.jpg


**USE_I18N** 為internationalization 目的是提供第二種語言版本
需要在settings.py添加LANGUAGES=() 表示備用語言
此外在TEMPLATES, MIDDLEWARE, LOCALE_PATHS都要有相關設定
若LANGUAGES未提供用戶所需語言 則使用LANGUAGE_CODE的設定

**USE_L10N** 為localization 目的使不同區域設定的使用者會有不同格式的數字,時間與日期
主要影響django的模板語言 由python的datatime模板導入html的部分
USE_L10N只影響時間格式 USE_TZ與TIME_ZONE才會影響網頁呈現的時間

**USE_TZ** 為使用TIME_ZONE的設定作為預設時間 
所有與時間相關的內部處理都是以TIME_ZONE的時間為準 但在最後渲染時會轉換成當地時間
常見作法為統一使用USE_TZ=true且TIME_ZONE='UTC' 當要使用不同地區的時間時要做轉換
USE_TZ=false 則等同使用python預設的時區作當前時間(即等同datetime.datetime.now())

t = int(datetime.datetime.now().strftime('%H'))
if 5 <= t < 17: / else: 常用此變數來判斷早上/晚上

timezone.now() 無論TIME_ZONE設在哪都會用'UTC'時區的時間 用於存入資料庫
統一時區 表示不會因為用戶所在時區不同而導致重疊
timezone.localtime()則依據TIME_ZONE的值而反賄當地時間

在其他py檔中使用settings.py的設定：
from django.conf import settings
settings本身為物件 而非模組 故不能單獨使用其中的變數
from django.conf.settings import DEBUG  # This won't work.


django自身的模板語言(in-HTML Templates):
才能在原先靜態的html內容 加上server端動態的內容
除了django template之外 亦可引進其他第三方的模板語言
靜態與動態的差別：只在於前者內容固定 後者會隨使用者狀態邊更呈現內容

js,py都是直譯式語言 一行一行動態編譯
但C語言家族為編譯式語言 在執行前會先做編譯 前置時間較長但效率較高


- - - -------------------------------------------------------
# urls.py(外部urls.py 和 內部urls.py):

外部的urls.py用include()導到內部catalog的urls.py 
而非catalog app的功能則會使用外部的urls.py:
path('admin/', admin.site.urls)  # admin site
path('accounts/', include('django.contrib.auth.urls'))  # 授權相關 包含login,logout...等

因為URL的命名(name=)在不同的app內部時常重複 故用不同的app來創建命名空間(URL-namespaces)至關重要


使用path('accounts/', include('django.contrib.auth.urls'))時
預設templates資料夾應設在最外層
並在settings.py 的 TEMPLATES中增加：'DIRS': [os.path.join(BASE_DIR, 'templates')]
且每個app都用獨立folder 可以區分與view.py連動的templates(catalog/templates)

除此之外 官方APP(像是django.contrib.admin)的相關template則會放於django的模組包中 
此時APP_DIRS=True(預設)就會自動尋找

path('book/<int:pk>', views.BookDetailView.as_view(), name='book-detail'),
<int:pk> 可將pk變數傳給第二參數的view

path('', RedirectView.as_view(url='/catalog/', permanent=True)),
RedirectView.as_view()用於導向指定的url 意即將用'/catalog/'做為首頁 取代域名網址''

- - - -------------------------------------------------------

# models.py
Django's ORM 為自帶的關聯式資料庫(Object-Relational Model)
Model即為自動生成的database-access API 其目的是為讓開發者不用自行訪問資料庫
所有相關的方法都是同步的(sync) 若要改採非同步方式則需使用：
channels.db.database_sync_to_async 就是專門處理model的同步至非同步轉換
(類似於asgiref.sync.sync_to_async：因訪問DB需額外建連接 故改採database_sync_to_async更好)

關聯式資料庫ORM的重點在外鍵(ForeignKey) 用於減少每筆資料的重複屬性
假設現在用唯一的大表格(model)且以BookId作為主鍵：則會有許多重複的genre 此時genre就可用外鍵連結以減少重複性
而其他與genre相關的屬性同樣會有重複性問題 故應轉到genre的model上 (ex:相同類別的書會放在相同書架上)
(假設每本書都只能有一種genre 即不考慮ManyToManyField())

外鍵(ForeignKey)是一種recursive和lazy關係：
recursive：在lookups操作上可以透過多個外鍵來查找不同model的資料 
lazy：當抓取此model類別的資料時外鍵的資料不會事先被存取

class Car(models.Model):
  name = models.CharField(max_length=100)
  manufacturer = models.ForeignKey('Manufacturer', null=True, on_delete=models.SET_NULL, related_name='car', related_query_name='car')
class Manufacturer(models.Model):
  name = models.CharField(max_length=100)

on_delete 表示當該筆外鍵紀錄(record)刪除後 連結此外鍵的model應如何處理 
models.CASCADE(默認)
表示資料不完整 故一同將所有連接此外鍵紀錄的筆數都刪除
models.SET_NULL, null=True
資料不完整也無所謂 可直接轉為null 通常表示此外鍵屬性不影響資料完整性

related_name屬性用於manufacturer的反向關係名稱
可用manufacturer.car.all() 表示querySet
若不使用related_name 則預設為manufacturer.car_set.all()

此外related_name若用於OneToOneField欄位
擇用可用manufacturer.car即可代表唯一的instance 故不會返回querySet

而related_query_name屬性用於反向filter中的名稱
Manufacturer.objects.filter(car__name='car1')
一定要加上related_query_name 才充許反向filter


## select_related()和prefetch_related()
當有使用外鍵連接的結構時使用(ForeignKey或ManyToManyField) 為減少多次訪問數據庫而存在
當使用querySet抓取數據時 Article.objects.all()會訪問一次
但此時只有該model的field值 其餘外鍵連結的model則無資料 
像是 {{article.category.name}}或 {% for tag in article.tags.all %} 此時又需要訪問數據庫

select_related()專門處理ForeignKey結構:
Article.objects.all().select_related('category') querySet抓取資料時就涵蓋外鍵model資料
Article.objects.select_related('author__name').get(id=13) querySet只抓取id=13的article及其外鍵author的資料
Article.objects.select_related('category', 'author__name').get(id=13) 可抓取多個外鍵model資料

prefetch_related()則處理ManyToManyField結構：
因為直接當成ForeignKey處理 會導致最終生成的表格過於巨大
Article.objects.all().prefetch_related('tags__name') 用法與select_related完全相同
Article.objects.all().prefetch_related(
    Prefetch('tags__name',  # Prefetch()可以篩選外鍵model的record 
    queryset=Tag.objects.filter(name__startswith="P")),
    to_attr='article_p_tag' # 最後將其加到Article的field中 (只會在querySet 不會寫入資料庫)
)

每個模型的屬性都是資料庫的一項field 而每個field會被映射到資料庫內的column：
model之間的關係可分為:一對一,一對多,多對多 這三種
其中一對多最常見 可用：ForeignKey() 
另外有 一對一:OneToOneField()  多對多:ManyToManyField()

OneToOneField就是unique=True的ForeignKey 
將兩表分開的原因不是因為重複性 而是可設置不同的權限以方便資訊管理
另外有時不想修改現成的model時 也可以OneToOneField將新的model與此做連結 (常用於User模型的擴充)

ManyToManyField重點在於改善原先ForeignKeyㄧ對多的局限性 使關係改為多對多
django會自行生成源model與目標model之映射關係的中間表
中間表將兩個model的pk合併作為該表的pk 如此新的pk就不會重複

authors = models.ManyToManyField(Author, through='BookAuthor')
through屬性可為中間表命名 如此可增加其他屬性(但中間表一般只有在database中使用)

b=Book.objects.get(id=1) 
b.author.all()  如同ForeignKey 可由源model去查做目標model的操作
a = Author.objects.get(id=1)
a.book_set.all() 不同於ForeignKey 亦可由目標model去反查源model

除以上三種關係之外 則全部用model的屬性表示即可 不用再加外鍵
model資料欄類別：
name = models.CharField(max_length=200)
mex_length為其必要屬性 因為若不合標準會自動觸發MaxLengthValidator
django的model封裝了Validator 為避免不合規定的資料寫入

txt1 = "My name is {fname}, I'm {age}".format(fname = "John", age = 36)
txt2 = "My name is {0}, I'm {1}".format("John",36)
txt3 = "My name is {}, I'm {}".format("John",36)
可在資料庫存放{} 如此就能用填入動態資訊

name = models.CharField(max_length=2, choices=SELECTITEM)
choices在admin上會為選項 而不是原本的文字欄

num = models.IntegerField(primary_key=True)
amount = models.BigIntegerField()  差別只在於BigIntwger為64位元 範圍比較大

price = models.DecimalField(max_digits=5, decimal_places=2) 用於需要明確到小數點到幾位 用於財務相關領域
max_digits為最大總數 decimal_places為小數點後位數 若不符合規定則無法通過驗證而引發error

capacity = models.FloatField() 可當成一般浮點數來做運算 儲存空間較小
三種小數型態最大的差別在最大精准度 float和double相對而言較小 因此效能表現上也較好
此外float和double是以二進位儲存 decimal則以十進位儲存
Float-32 bit (7 digits) Double-64 bit (15-16 digits) 
Decimal-128 bit (28-29 significant digits) 


uuid = models.UUIDField(primary_key=True, default=uuid.uuid4)
uuid常做為主鍵使用 具有唯一性(unique=True)且不可為空(null=False) 故可作為外鍵的連結
所有的資料欄類別都會有主鍵 若未指定則model會額外自行生成主見以供外鍵取用
default作為預設值 故用戶不需要自行填寫此欄
此field不是在model創建時寫入數據：都應該設置default 表示不用額外填入undifined值

若沒有指定主鍵(primary_key=True) 則自行生成id作為主鍵
等同：id = models.BigAutoField(primary_key=True) 
id本來就會遞增 故也可直接查id知道目前所創建的房間數(不是房間總數)

除了primary_key之外 並沒有資料是一定要輸入的(required=True) 比較接近的方法為(null=False) 此為預設
因此有些資料為符合辨識功能 可用(unique=True)確保唯一性

null=False和blank=False:
null=False表示資料庫內的該欄不能用null儲存(預設) blank=False表示在admin或view輸入時會經過驗證不能填空
另外null=True常用於sparse model 可節省許多不用的空間

last_modified = DateField(auto_now=True)
create_date = DateField(auto_new_add=True)
auto_now表示每次QuerySet.save()時都會自動以當前時間來儲存
auto_now_add則表示只在建立物件的當下儲存
但auto_now和auto_now_add都會自動附上editable=False 和 blank=True 導致不能做更改

pub_date = models.DateTimeField(default=timezone.now)
故可改用default的方式 如此就能事後修改
亦可用：default=datetime.date.today (即datetime.date.today())

TimeField 儲存python的time.time()物件
DateField 儲存python的datetime.date()物件 
DateTimeField 則儲存python的datetime.datetime()物件
time和datetime為python的不同模組 而有些通用的方法

title = CharField(max_length=10, unique_for_date="pub_date")
model中必須要有DateField或DateTimeField才能用
表示相同的pub_date 只有有一筆title存取 (用於限制同一日只能有一筆資料 當有超過一筆時則無法通過驗證)
同理：unique_for_month(同月只能有一筆), unique_for_year(同年只能有一筆)


大部分的field屬性都跟validators相關
def validate_even(value):  # 可以寫validate function來作為validators的參數
  if value % 2 != 0:
    raise ValidationError(
      _('%(value)s is not an even number'),
      params={'value': value},
    )
  
even_field = models.IntegerField(validators=[validate_even])

import uuid (python)
uuid.uuid4() 可以隨機生成常見的char(32)字串 不包含4個引號'-'

upload = models.FileField(upload_to='uploads/')
FileField不同於字串或數值變數 故需要提供存放位置 (因性能考量 media檔案不會存放在資料庫中) 
並可用object.name和object.size 取得檔案名稱與檔案大小

upload_to屬性會接在MEDIA_ROOT之後
若MEDIA_ROOT = BASE_DIR / 'media' 則最後會存放在：BASE_DIR / 'media/uploads/'
class Photo(models.Model):
  image = models.ImageField(upload_to='uploads/')
ImageField為FileField的子類 且多加了驗證是否為圖片的步驟

photo.image.name  //output: 'uploads/originalName.jpg'
photo.image.path  //output: '/media/uploads/originalName.jpg' 
photo.image.url  //output: 'http://media.example.com/uploads/originalName.jpg''

path是在FileSystem的位置 url是真正client端要取用的位置
只要改變image.name後image.path和image.url都會改變

等同FileField(upload_to='uploads/') 使用其變數時會調用fieldFile
self.image為fieldFile的子類 因此同樣可以調用相關的API

除了上述的屬性之外 fieldFile也提供修改的方法：
photo.image.save(filename, filecontent, save=True)  # photo.save()為querySet的方法 與此無關
用於先創建model的實例 但還未綁定相關檔案時： 過程相關麻煩
from django.core.files import File
f = open('/path/to/hello.world')
myfile = File(f)
photo = Photo.objects.create(uploader='jason')
photo.image.save('goodImage', myfile)  # 其中myfile變數必須用django.core.files.File物件 不能用python內建的file物件

photo.image.delete(save=True)
用於刪除檔案 save屬性表示刪除檔案後是否將變動存入instance中
預設為save=True 若改為save=False則會導致instance和實際檔案系統不同步


dialog = models.JSONField(null=True)
JSONField用於存放物件objecy或陣列list 
存取為變數時 不需要再做JSON.loads()轉成原形態 會自動進行轉換
models.JSONfield 與 postrgreSQL.fields.JSONfield 兩者是完全相同的


image的編碼方式(base64): 編碼的主要目的是將字元都位元化(0,1)以方便傳輸
檔案轉碼相關
base64：為6 bits為一單位 故共有2^6=64種可列印字元 
(因為英文A-Za-z0-9共有62個 之後再加上'+', '/'常用字元 故早期時已包含所有可用字元)

ascii：編碼方式為英文字為1個byte(8 bits) 中文字為3個bytes(共24 bits)
由於 3*8 = 4*6 =24 此時base64和ascii兩種編碼能剛好對應 
也就是將3個英文字換成base64編碼需要4個字元 同理1個中文字以base64編碼就需要4個字元
若英文字不足3個(也就是只有8位元或16位元) 則其餘位元都用0填滿 在用base64編碼 
(但會跟000000=>'A'衝突 故改用'='代替 這也是為何base64最後常見'='的原因)

latin1和latin2由ascii延伸而來
ascii為8 bits為一單位 故最多能夠有256個可顯示字元
除了英文A-Za-z0-9共有62個之外 再加上' ', '!', ',', '.'等標點符號還有現在不用的控制字元 共128個
也就是還有128個字元沒被用到 故latin1再加上96個字元供西歐國家的拉丁字母使用 latin2則多加中歐國家的拉丁字母
latin1和latin2不是再延伸關係 兩者是不同的編碼字元體系
由於latin1使用到8bits內的所有編碼 故最適合傳輸與存取(MySQL默認latin1作為編碼)

UTF-8(unicode):
由於ascii的8bits只有256可顯示字元 不能包含多個國家 故應此有了萬國碼(unicode) 
常出現的亂碼就是編碼方式不同所造成 

因為unicode只是符號集 若全世界所有國家的字元都用最大位元空間來存取的話 就會造成許多浪費(英文字只需要1個byte即可)
故用UTF-8做為存取字元的規範 可隨不同國家的字元而自動調整存取的位元空間(英文字為1byte, 中文字為3bytes)



url = models.SlugField(max_length=50)
SlugField源於CharField 指的是報紙的短標題 兩者都是放字串變數
但SlugField不能放特殊字元(充許下划線underscores與連字符hyphens) 空白格也不行 因此較適合存放url

def __str__(self):
    return self.title  # 用於print()該模型實例出來的物件變數

直接用function的執行結果作為屬性：
@property  # 不使用@property則不會多ㄧ欄屬性 但仍可在admin或view以其他方法呈現
def is_overdue(self):
    if self.due_back and date.today() > self.due_back:
        return True
    return False


class Meta:
  app_label = 'core'  # 表示存放此model類別的application
  verbose_name = 'message'
  verbose_name_plural = 'messages'  # verbose_name都用於設定顯示於admin的欄位名稱
  ordering = ('-timestamp',)  # 用來排放資料的順序
  unique_together = ('field1', 'field2',)  # 資料庫中不能有重複的tuple組
metadata為後設資料, 中介資料, 元資料 即此資料是用來描述主要資料

title = models.CharField(max_length=50, verbose_name='Title') # field也能設置verbose_name 
除了在admin顯示之外 也可以在對應的form表單上已title屬性表示 title = forms.CharField(max_length=50, title='Title')

QuerySet.get()相關的例外exception (Model.DoesNotExist 和 Model.MultipleObjectsReturned)：
資料庫沒有資料時引發DoesNotExist 
資料庫返回多個物件時引發MultipleObjectsReturned (QuerySet.filter()才能返回多項)

- - - ------------------------------------------------
# admin.py
python3 manage.py createsuperuser
必須先設置superuser 資料會放在auth.models的User類別

models.py中各個model類別的__str__()方法 即為record名稱
而get_absolute_url()方法則返回url 在admin頁面即為VIEW_ON_SITE按鈕

from .models import Book
class BookAdmin(admin.ModelAdmin):
  list_display = ('id', 'name', 'author', 'genre')  # 用於覆蓋在models.py中的__str__()方法
  (當field為ManyToManyField時 為避免資料過多導致讀寫成本 會建議改用method取代原本的field)
  list_display = ('id', 'name', 'display_author', 'genre')

  display_genre.short_description = 'Genre'  # 在select頁面 用'Genre'取代'display_genre'名稱

  (並在models.py中的Book類別加上：)
  def display_genre(self):
    return ', '.join(genre.name for genre in self.genre.all()[:3]) # 只讀取前三項
  
  
list_display的第一項用來取代model的__str__ (如果沒有額外定義ModelAdmin 則用__str__代表record)
admin上的ForignKey顯示方式並不一定是pk(與資料庫不同) 而是以__str__為主 

  list_filter = ('genre',)  # 可加上過濾功能 通常只用於choice的資料欄
  search_fields = ('name',)  # 同樣放在select頁面 加上搜尋功能以避免資料量過多的時候
  ordering = ('-genre',)  # 針對字串開頭來做排序 '-'可用於反序

  fields = ['name','id']  # 不同於list_display在select頁面 fields則在update頁面(add或change)用於改變排版順位 (預設為按照model順序並全部顯示)
  
  fieldsets = (  # 同樣只是改變排版順位 用於取代fields
    (None, {  # 除了欄位排序外還有大標題可以選 也可以為空(None)
        'fields': ('book', 'imprint', 'id')
    }),
    ('Availability', {  # 大標題為'Availability'
        'fields': ('status', 'due_back')
    }),
  )
  exclude = ('create_date', )  ＃ 則為不要顯示的屬性 常用於系統預設的資訊 不充許修改

  在Book類別的頁面可以編輯BooksInstance類別：(常用於fk的field)
  inlines = [BooksInstanceInline]  # update頁面的內聯list

class BooksInstanceInline(admin.TabularInline):  # 也可用admin.StackedInline(垂直) 但排版不好看 故一般用admin.TabularInline(水平)
  model = BookInstance
  extra = 1  # 預設是3個空白關聯表 可改為1個

admin.site.register(Book)  # 不額外指定Admin則使用預設
admin.site.register(Book, BookAdmin)  # 引入model並完成register註冊 並可加入BookAdmin類別參數來做admin頁面客製化
也可直接在BookAdmin類別上 添加:@admin.register(Book)


- - - ---------------------------------------------------
# views.py
from django.shortcuts import render
render()只是一種快捷的寫法(shortcuts) 
response = render(request, template_url, content) 
主要作用為接受HttpRequest物件做參數 並最後回傳HttpResponse物件

若一般不使用render() 改用直接回傳HttpResponse物件:
t = loader.get_template('app/index.html')  # 需要用loader物件來載入template 會變的更麻煩
content = {'name': 'data'}
return HttpResponse(t.render(content, request)) 

因此render()用於回傳完整template資料 
而HttpResponse('You have been login' + status) 只用於ajax這種只需要回傳部分字串的資料
此外JsonResponse(content) 則直接回傳json格式的資料(dict)
這些回傳的資料可在ajax的success callback中提取
$.ajax({
  success:function(data){
    // code
  error:function(request, status){
    // 參數為request 為讓$.ajax當發生錯誤時可以重發一次 而參數status 就是'200'之外的狀態碼
  }
  }});

可以用BookListView類別 繼承generic.ListView
如此就等同是從父類別繼承了render()方法

as_view()是View的classmethod
response = MyView.as_view()(request) 輸入request後會傳回一個response

此時 MyView是繼承generic._View的類別
最後會像index(request)一樣 回傳渲染過的內容render()
此外由於此時request不是引入的參數 故在MyView類別中應改用self.request

view取得變數的方法有二種： 
def index(request, room_name):  # 藉由urls.py引入
  return render(request, 'chat/index.html', {
    'room_name': room_name
  })

def index(request,room_id):  # 從model中取其變數
  room_name = Room.objects.get("room_id")
  return render(request, 'chat/index.html', {
    'room_name': room_name
})


## 在view中使用model資料的方法
Book.objects.all() 所有的Model類別(繼承models.Model) 都能使用.objects的方法
books = Book.objects.all() 表示此model類別的所有紀錄 為最大的查詢集(QuerySet)
books[0],books[1]...可找依照目前排序的每筆record
books[-1] 會發生問題 因為querySet並不完全充許所有內建的list方法

其中：Book 為 Model類別
Book.objects 為Book model中的Manager類別 可以客製化一些方法
Book.objects.all() 則為用此manager 生成的querySet

常用的QuerySet的方法：
Book.objects.all().aggregate(Avg('price'))  aggregate用於找特定屬性的總和值(Avg,Max,Min,Sum...等)
會生成dict且key值為QuerySet查找格式 : {'price__avg': 34.56}

aggregate()用來取單一field數值 若要取整個instance則用order_by()後取first()
Book.objects.order_by('-price').first() 等同取price最高的record
'price'表示遞增 和'-price'表示遞減

Book.objects.all().annotate(number_of_entries=Count('entry')) annotate在每筆record中 除了現有的field之外多增加其他資料欄
q[0].number_of_entries  # 好處是annotate()的資料欄不會寫入database

Book.objects.all().annotate(Count('entry'))  # 可以不用參數名 則命名方式等同QuerySet查找的格式
q[0].entry__count

blogs = Blog.objects.alias(entries=Count('entry')).filter(entries__gt=5)  # alias的結果等同annotate 但最後不會留下屬性
blogs[0].entry__count # raise exception! 因物件沒有此屬性

Entry.objects.order_by('blog').distinct('blog') distinct用於消除重複項的record
Entry.objects.order_by('author', 'pub_date').distinct('author', 'pub_date') 若有多個參數 則要完全一樣才會視為重複項的record
Entry.objects.order_by('author', 'pub_date').reverse() reverse用於將排完後的順序反轉
Entry.objects.order_by('author', 'pub_date').first() order_by()也會與first()或last()連用

Book.objects.filter(pk=4).values() 輸出dict並將所有的field作為key值 
output : {'pk': 4, 'name': 'Beatles Blog', 'tagline': 'All the latest Beatles news.'}
Book.objects.filter(pk=4).values('pk','name') 只選擇其中幾項field
output : {'pk': 4, 'name': 'Beatles Blog'}

Book.objects.filter(type='s').values('pk','name') 如果querySet有多個instance 則會以list形式返回
output : [{'pk': 4, 'name': 'Beatles Blog'},{'pk': 5, 'name': 'Jason Blog'}]

Book.objects.filter(pk=4).values('pk','name',lower_name=Lower('name')) 如同annotate 可自行增加field
Book.objects.filter(pk=4).values_list('pk','name')
output: (4, 'Beatles Blog') tuple取代dict
Book.objects.filter(genre='math').values_list('id', flat=True) 會將多組tuple壓成list

使用字串動態存取field的方式:
通常這種方法用於object的內置屬性 因為object不像dict可以直接取用
getattr(player, field) 能解決 value = player[feild] 如此就能用string指定field
getattr(player, field) 等同 player.__dict__[feild]
setattr(player, field, value) 同理能取代 player[feild] = value


values()和values_list()不能用在單一個instance上 例如：Book.objects.get(pk=4)
只能由Book.objects.filter(pk=4) 或 Book.objects.all()等querySet使用

values()和values_list()因為仍是querySet 故必須用list()轉為python的list形式
同理Entry.objects.all()仍然是querySet 必須用list()才能取其中的各個quertSet

book1 = Book(title="goodbook", author="goodman", summary="it is a good book.")
book1.save()
可在view.py進行創建 並最後要存入database中 
如果欄位是ForeignKey 則也可直接填外表的pk值 (author為ForeignKey 而"goodman"為此Author模型的主鍵)

Book.objects.create(title="goodbook", author="goodman", summary="it is a good book.")
或用create 便可直接存入database中 好處是不用在記憶體中創建book實例 以減少內存肖後

Book.objects.bulk_create([Book(title="goodbook"),Book(title="badbook")])
批量創建 一次放入多個實例的的list

get_or_create(...,defaults={}) 和 update_or_create(...,defaults={}) 對應GET/POST如果沒有檔案則直接創建新的 
會返回querySet和bool值兩項 bool直用來表示是否為新創建的
default屬性存放要做更新的field 若沒有找到則直接創建

Book.objects.get(pk=1)  # 不能為None 如果沒找到會觸發error 返回單一instence
Book.objects.filter(genre="science")  # 充許為None 返回querySet充許繼續縮小範圍
Book.objects.exclude(genre="comic")  # 類似於filter() 返回querySet充許繼續縮小範圍
get(),filter(),exclude() 用於縮小範圍

既然查詢集是一種集合 自然能實現交集,聯集等應用：
Q()可實現'AND'和'OR'的應用 通常filter()與Q()連用
from django.db.models import Q
Book.objects.filter(Q(genre__contains="science")|Q(genre__contains="nature"))

QuerySet也可直接用'|' '&'來做合併
book_math = Book.objects.filter(genre='math')
book_science = Book.objects.filter(genre='science')
books = book_math | book_science

一般用QuerySet查找的格式(Field Lookups)為：field__lookuptype=value
用雙底線'__'取代單底線'_'的原因是避免field中已用單底線命名

Book.objects.get(pk__exact=1) 就是Book.objects.get(pk=1)的原型
Book.objects.get(name__iexact="happy DaY") 不分大小寫
Entry.objects.filter(headline__contains='Lennon') 只要field當中包含此字串即可
Book.objects.filter(enrty__headline__contains='Lennon')  也可用於找ForignKey的field
Entry.objects.filter(headline__startswith='First') 必須由此字串開頭
Entry.objects.filter(headline__endswith='2021') 必須由此字串結尾

filter()最後回傳的內容為querySet 不同於get()的模型實例instance
filter()可能為空 而get()不充許為空
filter()的回傳值可用list()取各個單一實例 而get()的回傳值本身就是單一實例

Book.objects.filter(pk__in=[1,4,7]) 在list中的其中一個
Book.objects.filter(pk__gt=14) pk>14
gt: greater than 和 gte: greater than or equal 
lt: less than 和 lte: less than or equal

from django.db.models import F
F()為field的意思 可用於將同model不同field值來比較 通常filter()與Q()連用
Entry.objects.filter(number_of_comments__gt=F('number_of_pingbacks'))
Entry.objects.filter(rating__lt=F('number_of_comments') + F('number_of_pingbacks'))

Entry.objects.filter(pub_date__year=2010).update(count=F('count') + 1)
除了不同field值比較外 也可進行同field值運算

Book.objects.delete() 會讓database全部刪除 
故一般會先縮小範圍 Book.objects.filter(headline='Lennon').delete()

Book.objects.filter(headline='Lennon').update(genre="sci-fi") 
用於更改內容且必須用filter()鎖定 (即使只要更改單一項也不能用get())  等同: 
book.genre = "sci-fi"
book.save() 需用book = Book.objects.get(pk=1)存入記憶體 導致浪費內存

另外save()會傳送pre_save或post_save這兩種signal 同樣delete()同樣也有pre_delete或post_delete兩種signal
差異在於內存中的實例是否要保有舊資料或直接進行更新

相關的應用：表示在每次Image的實例存入時都會執行相關的方法
@receiver(post_save, sender=Image)
def auto_change_file_path(sender):
  ...


view內部變數：
此時的templates的預設url為:templates/catalog/book_list.html
可用template_name = 'books/my_arbitrary_template_name_list.html'修改預設位置
預設的只有template的路徑 還是要自己加上html檔案

此時的模型預設名為:book_list (or object_list)
book_list用於提取models.py設置的模型
可用context_object_name = 'my_book_list' 修改模型名稱

常用於view.py的function 依據request找使用者ip
get_client_ip(request)
function中使用:
request.META.get('HTTP_X_FORWARDED_FOR')
request.META.get('REMOTE_ADDR')


## contrib.auth在views.py設置權限的方式
設置權限authentication: 用於做限制訪問, 註冊用戶資料, 依據用戶提供特定內容等

使用裝飾器decorators '@'： 
@property  # 意即將對象的方法包裝成屬性 可以在return之前多添加代碼
def dueDate(self):  # @property是為了增加易讀性
  ......
  return dueDate;

使用裝飾器'@'來設置授權：
from django.contrib.auth.decorators import login_required

@login_required
def my_view(request):
  ......

與下面方法等價：@login_required會讓未授權的用戶導向settings.LOGIN_URL 最後?next= 則導向現在的網頁位置

def my_view(request):
  ......
  if not request.user.is_authenticated:  # 當用戶登入後的每一次請求request.user.is_authenticated都會回傳True
    return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
    
只要有auth就可用request.user屬性：
如果當前為登入狀態login 表示後端有對應的session時會回傳User實例 若為登出裝態logout 則只會回傳AnonymousUser實例

除了user.is_authenticated之外 還有user.is_active:
差別在於用戶資料有在資料庫中 但屬於被凍結的狀態 此時is_authenticated為True 但is_active為False
此外當用戶已傳送資料但未完成連結激活前 也可採用is_active=False

同理也與mixins方法等價： (mixins用於類別的繼承 有點類似java的interface)
from django.contrib.auth.mixins import LoginRequiredMixin
class MyView(LoginRequiredMixin, View):
  login_url = settings.LOGIN_URL  # 直接設為屬性即可
  ...

另外login和authenticate之差異在於是否有sessions保留user資料：

def login(request):
  user = authenticate(request, username='john', password='secret')  # 用於一次性驗證帳號密碼 會回傳user實例
  if user is not None:
    login(request, user) # Redirect to a success page.  # 當驗證成功後則需要登入 才能在後端創建sessions保留用戶資料 
    ...
  else:
    # Return an 'invalid login' error message.
    ...

def logout_view(request):
  logout(request)  # Redirect to a success page.  # 登出不需要將user作為參數 因為相對應得user資料已經存在sessions中 且登出後會刪除sessions


使用裝飾器'@'來設置權限許可：
from django.contrib.auth.decorators import permission_required

@permission_required('catalog.can_mark_returned') # catalog.can_mark_returned 為app_name.codename
@permission_required('catalog.can_edit')
def my_view(request):
  ......

permisson是在auth框架的一個model類別
from django.contrib.auth.models import Permission
content_type = ContentType.objects.get_for_model(Comment)
permission = Permission.objects.create(codename='can_comment',name='Can comment',content_type=content_type)  # 這個permission使用在Comment模型

Permission model中有三個field: codename, name, content_type
codename用於判定權限代碼 name則用於顯示權限名稱 content_type則表示使用於哪一個資料庫模型

權限可在模板語言中使用 若user符合權限則可存取區塊內容
{% if perms.myapp.can_comment %}
...
{% endif %}

同理裝飾器@permission_required('codename')可用if取代：
if user.has_perm('codename'):


也可用創建被限制之view的方式來實現：登入前後頁面不同的效果
from django.contrib.auth.mixins import PermissionRequiredMixin
class MyView(PermissionRequiredMixin, generic.View):
  permission_required = ('catalog.can_mark_returned', 'catalog.can_edit')
  ...

同理創建需要權限的view：也能基於不同權限顯示不同內容
class AuthorCreate(PermissionRequiredMixin, CreateView):  # 為創建視圖(view) 而非單一一筆紀錄

{% if user.is_authenticated %}...{%endif%} 或 {% if perms.restaurants.can_comment%}...{%endif%} 
直接使用模板語言可以在相同頁面上依據使用者來呈現不同內容

可以在views.py做裝飾器判別式:
def user_can_comment(user):
  return user.is_authenticated and user.has_perm('restaurants.can_comment')

@user_passes_test(user_can_comment, login_url='/accounts/login/')
def comment(request,id):
  ....

此方法等價於：
@permission_required('restaurants.can_comment')
@login_required
def comment(request,id):
  ....

其中User的管理方法也適用於model的操作：
from django.contrib.auth.models import User
user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')
(此外：from django.contrib.auth.models import Group 此為方便管理多個User的權限許可問題)

其他User model常用訊息field,屬性attr與方法method：
(不同於field可寫入 attr都是唯讀的)
groups - ManyToManyField: 每個user可以分到多個group 每個group也能有多個user
user_permissions - ManyToManyField: 與其上同理 代表可以進行的動作 ex:'can vote'
is_staff - BooleanField: 是否可訪問admin頁面
is_superuser - BooleanField: 是否有所有權限
is_authenticated 為user的屬性 若成功經過AuthenticationMiddleware中介 則為True

可用add()和remove()將user實例加到特定的permission中
user.user_permissions.add(perm)
user.user_permissions.remove(perm)
user.has_perm('codename')  # 用於檢查user實例是否有codename權限
user.clear()  # 用於清除所有權限

group1.permissions.add(p1)
group2.permissions.add(p2)
user.groups.add(group1,group2) # 可以將使用者加到特定的group 此時就擁有此group的權限

django內建的User模型很大一部分在處理permission和group功能
這兩件事一起的:因為可以將permission綁定在特定group 再讓user加入group中

permissions = (("can_mark_returned", "Set book as returned"),)
會放在資料庫model裡面的class Meta:之中


data = self.cleaned_data['originalDate']
會清除不符合規範的資料

接受post請求 並用renew()回應：
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.urls import reverse

def renew(request, pk):
  return HttpResponseRedirect(reverse('all-borrowed') )

redirect用於重新連接到指定的URL(重新走urls.py)
render通常用於post請求 以完成在網站頁面進行驗證等動作 

redirect()和render()都是django.shortcuts的方法 用於view中來返回網頁
用法為：redirect(url) 和render(request, template_name, context_dict)
(template_name必須輸入從BASE_DIR之後的完整路徑 'chat/index.html')

HttpResponseRedirect與redirect的差異：
HttpResponseRedirect()參數只有一個且只能是url 
redirect()則除url之外充許view的function當參數 且redirect('videos_view', video_id=video_id) 充許加入url字串作為參數

reverse_lazy('all-borrowed'))
lazy在程式語言當中通常表示不會馬上執行 以避免發生未加載錯誤
即為延後執行的reverse('all-borrowed') 常用於刪除資料後的重整


HttpResponse參數為html完整資料為字串形式 而HttpResponseRedirect參數為url也為字串形式
## 不同status的常見HttpResponse類別
from django.shortcuts import get_object_or_404
當資料庫中沒有record時 自動引發http404
如果不使用get_object_or_404 則會引發Model.DoesNotExist 再拋出Http404("No Model matches the given query.")
此時會返回 HttpResponseNotFound("<h1>Page not found</h1>") 
使用方法等同status=404的HttpResponse("<h1>Page not found</h1>")

def my_view(request):
  obj = get_object_or_404(MyModel, pk=1)
等價於：
def my_view(request):
  try:
    obj = MyModel.objects.get(pk=1)
  except MyModel.DoesNotExist:
    raise Http404("No MyModel matches the given query.")  

其他HttpResponse類別還有
status=500 為 HttpResponseServerError
status=403 為 HttpResponseForbidden
status=410 為 HttpResponseGone

## 用view做寄信功能：
from django.core.mail import send_mail, send_mass_mail
send_mail()寄送單一信件 而send_mass_mail()連續寄送多份信件 
差別在於send_mail()每次都要重開SMTP服務 而send_mass_mail()則只開第一次

send_status = send_mail()  # 回傳0或1表示是否寄件成功
send_status = send_mass_mail() # 回傳整數表示寄件成功的件數


msg ='thank you the registration!' 直接在郵件中傳送text訊息

template = loader.get_template('email.html')
html_msg = template.render({"msg": "123456"}) 或可在郵件中做html渲染

gmail要由帳號開啟SMTP授權才能使用

- - - ---------------------------------------------------
# forms.py
Form類別的用法為快速在view上建立輸入表單
widget幫忙進行輸入表單時的檢測 若不符合model中field的格式則無法輸入 (form widget)
class ExpenseModelForm(forms.ModelForm):  # 通常Form類別會與Model類別同開頭 兩邊的field會有對應關係
  category = forms.ModelChoiceField(queryset=Category.objects.all(), label='類別', widget=forms.Select(attrs={'class':'form-control'}))
  description = forms.CharField(label='細節', widget=forms.Textarea(attrs={'class': 'tinymceTextarea'}))

  在每一個<input>都加上class='form-control' ('form-control'是bs4的語法)
  def __init__(self, *args, **kwargs):
    super(FriendForm, self).__init__(*args, **kwargs)
    ## add a "form-control" class to each form input 
    for name in self.fields.keys():
        self.fields[name].widget.attrs.update({   // widget指的就是<input>
            'class': 'form-control',
        })

  class Meta:  # 除了用上述變數的方式來設置 也能用Meta類別設置 Meta的功用只為便利性而已
    model = Expense  
    fields = ('name', 'price') # 表示可供輸入的資料欄 若為全部則用fields = '__all__'

    widgets = {  # 表示顯示在html上的輸入格式 (用在form = ExpenseModelForm()) 故如果沒有要用template的話 並不需要另外設置widgets
      'name': forms.TextInput(attrs={'class': 'form-control'}),  # attrs使用html的屬性 
      'price': forms.NumberInput(attrs={'class': 'form-control'})
    }  # widgets屬性本來就有預設 額外加上是為了後面option的參數

    labels = {  # 用於修改欄位名稱
      'name': '花費項目',
      'price': '金額'
    }
    help_texts = {
    'name': '花了多少錢',
    }

在views.py中：
def index(request):
  form = ExpenseModelForm()
  expenses = Expense.objects.all()  # 一般來說view會import models和import forms (前者用於呈現數據 後者用於輸入數據)

  if request.method == "POST":  # 用url將client端的request作為參數引入此view 故可用request.method來判別請求方法
    form = ExpenseModelForm(request.POST)  # 為將POST表單資料傳入Form
    if form.is_valid():  # 可能為資料不充許留空null 且又沒有預設值 必須要完全符合對應的model格式才會通過
      form.save()  # 一般處理資料應放在client端 好處是不用另外從database調資料
      return redirect("/expenses") # 最後要用redirect()導回原網址

    else:
      # some form errors occured.
      return JsonResponse({"error": form.errors}, status=400) # 若is_valid()為False 則返回form.errors

    
  return render(request, 'expenses/index.html', {
    'form':form  # key值的字串變數會傳入html模板的{{ form }}
  })

form.cleaned_data 會在form.is_valid後使用：
只要為True表示cleaned_data必定會有所有的field 但若為False則只會留下驗證通過的field
form.full_clean()一般不會直接使用 而是用form.is_valid的bool值判斷使否驗證通過

clean方法主要針對form 等同是model的validate之外在多一層資料清洗的過程 適合用clean方法的資料：
model上的field格式正確但不適合存入資料庫的資料 例如：有敏感字詞需要排除的資料
或是針對form上的其他field來做調整的資料 例如：當fieldA與fieldB重複時 fieldB改為None

驗證過程為讓輸入form中的資料通過驗證器validators: 即內建的正則表示法 若資料不通過時會自動引發ValidationError
form.is_valid的驗證流程分為兩大步 為先做form的clean方法後在做model的clean方法 

可以自訂validators或使用field形式內建的validators
如果不通過validators 則最後回傳的ValidationError會有包含所有validators的message_dict
slug = forms.CharField(validators=[validators.validate_slug, validate_too_long]) 
def validate_too_long(string):
  if len(string) > 20:
    raise ValidationError(
      _(' %(string)s is more then 20 characters'),  # _()表示gettext() 為翻譯成多國語言
      params={'string': string},
    )

可用{{ form.non_field_errors }} 將form.clean()的error作為python的變數傳給前端
同理{{ form.errors }}則為form.clean_<fieldname>()的error 
並為messages_dict形式  例如：{'sender': ['Enter a valid email address.'], 'title': ['This field is required.'] }



用form的好處是GET可以渲染給client端 而POST則可以再將資料存入database 同一個視圖只用一個view搞定
form = ExpenseModelForm() 用於在view中呈現表單
form = ExpenseModelForm(request.POST) 用於上傳表單內容

除了繼承ModelForm類別之外 也可以繼承Form類別：
ModelForm是modal導向 需要在meta中設置model 而Form就是一般表單 不需要設置現存的model 可用於自定義其他field

new_record = form.save() 
ser_instance = serializers.serialize('json', [ new_record, ]) 可用於返回json格式的資料

a = Article.objects.get(pk=1)
form = ArticleForm(request.POST, instance=a) 用於update資料

form = PartialAuthorForm(request.POST)
author = form.save(commit=False)  # commit=False表示不直接存入資料庫 可用於將form物件換成模型實例物件
author.title = 'Mr'
author.save()  # 最後還是要記得儲存

引入的參數request 即HttpRequest物件
if HttpRequest.method == 'POST':  # 可使用相關的屬性做判別
  do_something()

request.POST和request.GET雖然都是QueryDict物件(不是dict 但為dict的子類) 且兩者不會同時出現
僅會針對client端發出的request類型來出現相對應的物件
form元素並不一定要做POST 也可用於提交URL來實現GET <form action="GET">
www.google.com?AGetKey=3&AnotherOne=hello

QueryDict是django的request.POST物件：是dict的子類 可以使用dict所有內建的方法
創建方法： qd = QueryDict('a=1&a=2&c=3', mutable=False) # output: QueryDict: {'a': ['1', '2'], 'c': ['3']}
亦可用： QueryDict.fromkeys(['a', 'a', 'b'], value='val') 不同創建方法 用於指定value

最大的差異在於所有的value都是list形式 因為可能有同鍵多個值的狀況 mutable=False一般用於存儲資料故不充許改變資料
可用:QueryDict.dict() # output: {'a': '3'}   dict(QueryDict) # output: {'a': ['1', '2', '3']}
轉成python的dict 也可用dict(QueryDict)複製一個新的dict 但前者指保留最後一個值 而後者是list形式
QueryDict.lists()  # output: [('a', ['1', '2', '3'])]
轉成python的list 其中元素會以tuple的方式呈現

qb.urlencode()  # output: 'a=1&a=2&c=3' 轉回get的?url形式

- - - ---------------------------------------------------
# api.py
有時會從views.py分出api.py 常用於處理第三方的應用 並要在INSTALLED_APPS加上此application名稱


rest_framework:
可用於將多個相關的views整合成viewset 
並在urls.py使用DefaultRouter()方法來取代原先的urlpattern 需用include(router.urls)引用
但ViewSet本身不提供任何方法 因此有:
GenericViewSet可提供queryset的方法 和 ModelViewSet則提供list(),retrieve(),update()等方法
可在api.py中覆蓋GenericViewSet和ModelViewSet的方法


rest_framework_simplejwt:
JWT內涵的claim 共分為5種:
iss: The issuer of the token，token 是給誰的 (issuer申請者)
sub: The subject of the token，token 主題 (subject主題)
exp: Expiration Time。 token 過期時間，Unix 時間戳記 (expiration過期時間)
iat: Issued At。 token 建立時間， Unix 時間戳記 (issuedat 建立時間)
jti: JWT ID。針對當前 token 的唯一標識 (jwtid 識別碼)
(除此之外也可以放自己的資料 沒有3個字元的限制)


- - ---------------------------------------------
# asgi.py and wsgi.py
皆由CGI而來（Common Gateway Interface,通用網路接口）
就如同使用者介面UI是針對人與機器之間的連接 CGI則是用戶電腦請求到伺服器處理之間的連接
而更正確來講：CGI是web server和application server的連接 有CGI才能提供動態資料

(1) a production-grade WSGI server like Gunicorn+Django for ordinary HTTP requests.
(2) a production-grade ASGI server like Daphne+Channels for WebSocket requests.
Gunicorn和Daphne都是常見網路接口 其提供的服務接近uWSGI 都是位於web server和application server之間

WSGI為python語言針對CGI另外定義的網路接口
ASGI是由WSGI做改良而得 因為近年有許多協定不使用原始的http規範(WebSocket)
提供充許數據能夠在任意時候 被任何進程發送和接受的抽象方法

ASGI會建立一個channel layer (這也是框架為何取名channel的原因)
channel layer的目的是為了讓不同的client端可以透過同一個server端互相溝通
(過去的實現方式：透過database保存一個client端資料 再等其他client端作請求時送出資料)

提供一個可调用方法 channel_layer.send("channel_name", {...})
該方法接受channel_name(即mailbox投遞地點), message_dict(即mail投遞訊息)作為参数
每一個consumer創建時都會有唯一的channel_name
另外可用receive_many參數設定 帶返回的下一條可用訊息應來自哪個channel_name
(藉此來取代原本的輪詢架構 即其他client端一直作請求來要更新資料)

另一種延伸的可調用方法 channel_layer.group_send("group_name", {...})
用group_name取代channel_name 其餘也同樣以message_dict作為參數

因group而出現的方法:
channel_name是每個consumer獨有的 group_name則為管理多個channel_name而創建
channel_layer.group_add("group_name", "channel_name") 將channel_name加入group
channel_layer.group_discard("group_name", "channel_name") 將channel_name移出group
不會再有額外的group類別 所有group相關的操作都由consumer進行 

asgi.py內部：

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'datingApp.settings')
可用來快速轉換設定檔 或是直接繞過設定檔

from django.conf import settings
settings.configure(DEBUG=True)  # 亦可使用configure()以繞過settings.py來變更環境變數
若沒有導入任何設置 當django需要讀取相關的環境變數時 便會發生ImportError例外
若已經設置'DJANGO_SETTINGS_MODULE' 又用configure()覆蓋到其中的環境變數 則為RuntimeError例外
故兩者方法只能使用其一且也不能都不使用 可用settings.configured判斷是否已設定

application = ProtocolTypeRouter({"http":...,"websocket":....})
可用於決定在不同網路協定時的分流處理方式 當需要用到WS時都必須在asgi.py設定

- - ---------------------------------------------
# routing.py
channels中用routing.py取代urls.py來做ws專用的映射(websocket_urlpatterns)
routing路由器的目的是為了作分流: 
asgi.py的ProtocolTypeRouter({"http":  ,"websocket":  }) 讓不同的協定可用不同的方法來處理
兩者協定不同 分別為http:// 和 ws:// (但ws仍使用http的port做連接)
(通常channels只會處理"websocket"的部分 其餘則仍用django原先的預設get_asgi_application())

URLRouter(websocket_urlpatterns) 讓不同的URL 可以用不同的consumer來處理
(之前都只有http 故不會特別考慮這問題)
第一次request-respinse 會回傳101 表示成功完成協定切換http->ws (switching protocol)

亦有依據channel_name來作分流的：
ChannelNameRouter({
  "thumbnails-generate": some_app,
  "thumbnails-delete": some_other_app,
})

routing的用途是為單一consumer提供連接 
因此當連接建立完後 consumers之間event的接收與傳送都與routing無關

routing.py的功能是為ASGI_APPLICATION提供路徑：
websocket_urlpatterns = [  # 此設定會被asgi.py所引用
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
在routing.py的as_asgi() 等同 在urls.py的as_view()
將變數(?P<room_name>\w+)傳給consumer 如同在urls.py的<int:pk>傳給view一樣
(但傳給views.py則作為request之後的第二參數來引用 ex: index(request,pk))
(而傳給consumers.py則以self.scope['url_route']['kwargs']['room_name']來使用)

已命名的(?P<room_name>\w+)和 已編號的(\w+):
self.scope['url_route']['kwargs']為一dict 包含所有已命名(named)的正則變數
亦有：self.scope['url_route']['args']為一list 包含所有編號(numbered)的正則變數 兩者不能同時使用

- - ---------------------------------------------
# consumers.py
channel layer會有channel與group:(channel_layer.send() 和 channel_layer.group_send())
channel 即為個人的server端 負責接受channel_layer發送的訊息
group 用於管理多個channel 可以增加或刪除channel 故可讓channel_layer做同時發送訊息
每個chatroom就等同是一個group 裡面會有許多的channel 讓channel可同時在此收發訊息

當啟用channel_layer後 consumer會自動生成一個唯一性的channel(等同mailbox)
(兩者的差異：channel用於當作接收訊息的地址 而consumer是eventhandler)
consumer 可用於處理同步(sync)與非同步(async) server端有權決定thread線程
基本方法有connect(), disconnect(), receive():

建立single channel的方法：(不能與其他channel通信 偏向於個人的real-time notebook 應用)
class ChatConsumer(WebsocketConsumer):
  def connect(self):  # 建立連線時觸發
    # 每一個consumer在建立連接成功時 都會有scope用來紀錄connection的狀態資料
    if self.scope["user"].is_anonymous:  # connect()常用於驗證user身份
      self.close() # 若要拒絕connection則用close() 表示webSocket只提供給認證身份者
    else:
      Clients.objects.create(channel_name=self.channel_name)  # 在database建立record
      self.accept()  # accept()為connect()的最後一步

accept()會觸發js中的WebSocket.onopen() 而close()則觸發WebSocket.onclose()
大多時間self.close()也會寫在receive()中讓client端傳送對應的關閉訊息(text_data)

前端new WebSocket(wsUrl)建立時會觸發後端consumers.py的connect() 
connect()最後會有self.accept()此時在傳回前端觸發WebSocket.onopen

  def disconnect(self, close_code):  # 關閉時觸發 close_code可用來說明關閉原因
    Clients.objects.filter(channel_name=self.channel_name).delete()  # 刪除之前建立的record

  def receive(self, text_data):  # receive()指的是從client端收到訊息 因由前端的JS傳過來故為JSON格式
    async_to_sync(self.channel_layer.group_send)(  # consumer收到client端的訊息後 會做broadcast將訊息傳到整個group
      "chat",  # 第一參數為group_name 第二參數為message_dict
      { 
        "type": "chat.message", # message_dict['type']用methodName代入 用來觸發eventHandler
        "text": text_data,
      })

後端的self.close()會先觸發前端的chatSocket.onclose() 最後才會觸發disconnect()
當執行disconnect()時 就已經跟前端沒有關係了 故為後續處理

receive()包辦了所有從clinet端的互動方法 
可在text_data['command']中設置client聯繫server的所有方法

加上group的方法：(要使用group 就一定要設置channel_layer (在setting.py設置))
原先channel_layer = channels.layers.get_channel_layer()
但每一個consumer類別都有一個共用的channel_layer 故可直接用self.channel_layer
所有相同類別的consumer_instances 共用一個channel_layer 可管理底下所有的groups或channels
channel_layer的所有method都是async 需先先轉成sync才能用

  def chat_message(self, event):
    self.send(text_data=event["text"])  # 當從channel_layer(來自其他consuner)收到 "chat.message" 事件時觸發

consumer是在server端的eventHandler 而chat_message()即為從channel_layer收到訊息時所觸發的動作
當接收到的message_dict['type']='chat.message'(或為'chat_message'代替 因method不能用'.'命名) 才會觸發

所有chat_的方法都是用於輔助channel_layer.group_send()或channel_layer.send()的方法
而chat_方法的參數event就是group_send()或send()的第二參數message_dict

consumer的self.send() 與self.channel_layer.send() 兩者方向不同
前者是傳給client端 後者是傳給channel_layer上其他的consumer(仍在server端)

self.receive()或self.receive_json() 為分流所有從client端傳來的content_dict並執行相關方法
self.send()或self.send_json() 為負責所有傳送給client端的content_dict
content_dict用於與client端交流 所有的key-value都可自訂 
massage_dict則與其他channel交流 規定第一組一定要是"type"

會特別區分receive()和receive_json()的原因是 webSocket只要是單一字串都能傳
後者就等於是不用多做json.loads()和json.dumps()

另外's'為string的意思：
json.loads()可直接將json與string型態做轉換 json.load()則必須用text_file開啟

with open('mock_data.json', newline='') as jsonfile:
  data = json.load(jsonfile)



event["text"] 可改用 event.get("text",None) 為避免當前內容為空而導致錯誤


所有consumer類別都是繼承SyncConsumer或AsyncConsumer而來
WebsocketConsumer是consumer的通用型 且因為方法都是sync 故為繼承SyncConsumer而來
同理AsyncWebsocketConsumer繼承AsyncConsumer而來 方法都是async
WebsocketConsumer較常用 因可直接使用Django的models功能
AsyncWebsocketConsumer則可提供更好的效能 有thread線程上較好管控
WSC追求資料的準確性 AWSC則用於即時性功能

class EchoConsumer(SyncConsumer):  # 若繼承AsyncConsumer 則所有的方法都要改成async def func():
  def websocket_connect(self, event):  #websocket_connect()指的是從client端收到"websocket.connect"事件而觸發
    self.send({
      "type": "websocket.accept",  ＃會返回"websocket.accept"給client端
    })
  def websocket_receive(self, event):
    self.send({
      "type": "websocket.send",
      "text": event["text"],
    })
consumer類別應用是建立在ASGI規格之上 其中參數event(massage_dict)的在ASGI中有完整的規範
通用型的consumer(ex:WebsocketConsumer)已經在底層處理好所有websocket.methodName 故不需要額外處理

consumer是在server端的eventHandler 而websocket_receive()即為從channel_layer收到訊息時所觸發的動作
當接收到的message_dict['type']='websocket.receive'(或為'websocket_receive'代替 因method不能用'.'命名) 才會觸發


websocket負責處理client端與server端之間的通訊 (server端會有consumer.py 而client端則是JS引用new WebSocket())
channel_layer則建在server端 負責處理訊息的傳遞方向及相關措施(ex:channel_layer.send())
(如果channel是郵箱 那channel_layer就是郵局 而consumer就是收信人)

過去http協定下 :接收到一個request後 會直接丟給view處理 (lookup a view function)
而在websocket協定下: 則由consumer取代view的角色 (lookup a consumer)
(個人開啟的聊天室視窗就是一種視圖：但雖request相同 但在聊天室中每個人的訊息都不同  consumer可作為個人一對一的server端)
http協定使用urls.py做映射,而ws則用routing.py做映射(websocket_urlpatterns=[...])
(即便如此 但仍需要urls.py和views.py幫忙處理http的request)

在http之下： view.py的功能是整合template模板和model資料
在ws之下： view.py仍有用途 一樣是負責整合template模板
而consumer.py的功能是作為ws建立連線者的一對一server端 為eventHadler
用來處理如何傳送及傳給誰Echo/Unicast/Broadcast/Multicast 過程需要用到channel_layer

self.scope(connection's scope) 用以紀錄連接的各種狀態states:
(也因此當連接終止時 self.scope的states亦不得使用)
self.scope["type"]為"websocket"  即以"websocket"為值 傳給asgi
self.scopr["scheme"]為"ws"或"wss" scheme的目的是為告知在':'後面的ur如何解釋

self.scope會超集於self.request 即所有http協定的狀態都會沿用：
self.scope["path"] 為http_request的url
self.scope["headers"] 為[name, value]的迭代對象(iterables) 紀錄http_request的完整標頭內容
self.scope["method"] 為http_request的方法(GET,POST...)

如同view.py本身也有類似的self.request
可針對經過view的request物件做authentication或cookie/session等功能(["user"]和["session"]等)


## process進程與thread線程:
process指的是正在被執行且在載入記憶體的program
每個process都有獨立的資源空間 彼此不會相互干擾：因此若2個以上的process要做溝通會比較難進行
thread指的是process中能進行運算的排程：不同thread因為在同一個process中作業 可以共享資源
ex:前者為多個工廠但裡面只有一個工人 / 後者為一個工廠但裡面有多個工人
進程與線程都目的都是為了使資源利用率極大
最後Coroutine協程 ：為一種透過使用者自行控制thread的方法 取代原先全由OS控制的thread架構


- - ---------------------------------------
# django_test:
用Django的TestCase類別做測試 是為了可以讓你用:
python3 manage.py test 一次系統性的執行 
python3 manage.py test app_name 只執行其中之一的app
(python) manage.py test app_name.tests.BasicTestCase 只執行test.py中的其中一個類別

TestCase的setUpTestData()和setUp()用來存取數據或登入網站
class AuthorModelTest(TestCase):
  def setUp(self):  # Every test needs a client.
    self.client = Client()  # 每次執行test_function都會重新存取一次
    resp = self.client.get(reverse('authors'))  # 應該用selenium取代 可以操作更多交互動作

  def setUpTestData(cls):  # Set up data for the whole TestCase
    cls.foo = Foo.objects.create(bar="Test") 只有建立時才存取 用於整個類別共用的變數
  但不同的test_function並不會相互影響 因封裝了copy.deepcopy()讓每次test的變數彼此獨立

另外python django test 所使用的資料庫是額外建立的 會與真正的資料庫分開
故可用fixtures物件 創建初始數據以供測試使用 常用格式為JSON (data.json)

會將需要同一份setUp()和setUpTestData()的test放在同一個類別(TestCase子類別)
而通常會將被測試類別加上字尾Test 用以表示此類別的測試內容

setUpTestData()由setUpClass()封裝出來的 通常專門處理資料庫相關操作 
除了資料庫存取外 也會像setUp()一樣在每次測試時被調用 用以確保資料完整

setUpClass(cls)和tearDownClass(cls)等同是 jest的BeforeAll()和AfterAll()
同理setUp()和tearDown()就等同jest的BeforeEach()和AfterEach()
另有setUpModule()和tearDownModule()放在TestCase類別之外
處理所有類別都會執行的前置或善後 等同是jest的describe()之外BeforeAll()和AfterAll()

assertEquals(field_label,'first name') 等同assertTrue(field_label == 'first name')
但前者比後者更好：因為測試失敗 會返回標籤上實際的值

field_label = author._meta.get_field('first_name').verbose_name
self.assertEquals(field_label,'first name')
verbose_name為取其標籤名 而_meta.get_field('first_name')為返回field的型態

常用self.assertTrue(), self.assertFalse(), self.assertEquals()
self.assertTrue(form.fields['renewal_date'].label == None or form.fields['renewal_date'].label == 'renewal date')
我們只允許最後呈現的情況是我們預期的 : form.fields['renewal_date'].label只能有 None 或 'renewal date' 兩種狀況
意即：self.assertTrue()必須永遠是對的 self.assertFalse()必須永遠是錯的 self.assertEquals()必須永遠相等

self.assertRedirects(resp, '/accounts/login/?next=/catalog/mybooks/')
驗證resp是否正確導向 通常是測試登入系統
self.assertTemplateUsed(resp, 'catalog/bookinstance_list_borrowed_user.html')
驗證resp是否使用正確的模板
self.assertContains(resp, '<p>歡迎來到餐廳王</p>', html=True) 
專門用於response 查看resp中是否包含此元素 若html=False則將元素當成字串作比對
self.assertIn('To-Do', self.browser.title) 
字串或list中是否包含此變數

login = self.client.login(username='testuser1', password='12345')
resp = self.client.get(reverse('my-borrowed'))  # 測試登入使用者後的頁面

resp = self.client.get(reverse('renew-book-librarian', kwargs={'pk':self.test_bookinstance1.pk,}))  # 將pk參數插入reverse()導向的URL之中

resp = self.client.post(reverse('renew-book-librarian', kwargs={'pk':self.test_bookinstance1.pk,}), {'renewal_date':valid_date_in_future}) # 所有的POST數據都放在第二參數之中

用於添加test時才需要的設定參數
python3 manage.py test --settings=mysite.settings_test 

settings_test.py 
from mysite.settings import *  # 表示settings_test.py設定檔沿用settings的設定
FIXTURE_DIRS = [
    os.path.join(BASE_DIR, 'fixtures')  # fixture物件只會應用在測試中
]


## selenium
selenium屬於web_test工具 必須要用ChromeDriver用以協助瀏覽器執行動作
selenium時常會與django的TestCase並用

from selenium import webdriver 在py檔引用
from selenium.webdriver.common.keys import Keys
python functional_tests.py 直接執行py檔即可

class FunctionalTest(TestCase):
  def setUp(self):  # do something before test start
    self.browser = webdriver.Firefox()  # 使用selenium的webdriver開啟
    (因為每次測試method時會執行一次 可用於驗證不同使用者登入/未登入的差別)

  def tearDown(self):  # do something after test complete
    self.browser.quit()

  def test_get_url(self):  # 所有的test function都需要以test_為開頭
    self.browser.get('http://localhost:8000')
    assert 'To-Do' in self.browser.title

self.browser是selenium的物件 其中的屬性可用於判定是否執行正確
當然也俄直接使用TestCase類別的方法 self.assertTrue()

selenium直接進行js編寫
self.browser.execute_script('return window.localStorage.length;')
self.driver.execute_script("window.localStorage.setItem(arguments[0], arguments[1]);", key, value) // 除了存取外亦可放入變數

selenium重新整理頁面
self.driver.refresh()
self.driver.find_element_by_tag_name('body').send_keys(Keys.COMMAND + 'r')  // 直接使用鍵盤輸入重整鍵


其他selenium用於抓取元素的方法
elmt = self.browser.find_element_by_tag_name('h1')
self.assertEqual('To-Do List', elmt.text)

elmt_input = self.browser.find_element_by_id('new_input')
self.assertEqual('Input New Item', elmt_input.get_attribute('placeholder'))
elmt_input.clear() 清除value屬性值

elmt_list_div = self.browser.find_element_by_id('to-do-list') 
elmt_to_do_list = list_div.find_elements_by_tag_name('li') # 先找父元素後再找其中的子元素

elmt_input.= self.driver.find_element_by_css_selector(“input#username”) 使用css選擇器
elmt_input.send_keys(new_items[0]) # Sends keys to current focused element 用於在input中輸入內容
elmt_input.send_keys(Keys.ENTER) # keys是keysboard的多個鍵
elmt_btn.submit()  # 用於提交input的輸入內容 可用click代替 

btn.click(), btn.click_and_hold(), btn.double_click() click方法

Keys.BACK_SPACE, Keys.SPACE, Keys.TAB, Keys.ESCAPE 其餘常見keys
Keys.CONTROL,'a' 全選 Keys.CONTROL,'x' 剪下 Keys.CONTROL,'c' 複製 Keys.CONTROL,'v 貼上 
用','隔開表示按了兩個鍵


ActionChains(driver).move_to_element(elmt).perform() # actionchains用於存取連續動作 並調用perform()開始執行
ActionChains(driver).click(btn)
改由actionChains物件取代elmt物件調用 故調用方法的參數要放入elmt

測試驅動開發 (TDD)
測試程式和產品程式一起被撰寫 且在未完成產品前就先完成測試 往後修改程式時可直接用測試查看問題
也就是藉由測試過程一步一步找出問題 如此可用於總結軟體的各種例外處理

F.I.R.S.T. Principle
fast:測試速度越快越好
independent:每個測試彼此獨立 因為若其中一個failure 也不會影響到其他測試的公正性
repeatable:任何環境下其結果都要相同 不會因作業系統或網路環境而改變
self-validating:最終都應該輸出boolean 讓測試者能夠輕易分辨
thorough:測試應該想到所有可能的情境 一切可能遇到的用戶非預期行為或各種環境下的可能行為
timely: TDD的概念 測試應在產品之前寫完


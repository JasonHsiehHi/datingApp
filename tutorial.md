

# 五大瀏覽器：GC,FF,SF,IE,OP
一般會忽略opera 因為使用人數太少
pfx = ["webkit", "moz", "MS", "o", ""] 因此有些css也需要有對應的前綴詞
-moz-{屬性}：Firefox 瀏覽器
-webkit-{屬性}：Safari, Chrome, Opera 等瀏覽器
-o-{屬性}： Opera 瀏覽器
-ms-{屬性}： IE 瀏覽器



- - - ---------------------------------------

# design_pattern 設計模式
指的是眾人匯集的程式碼設計經驗 讓程式碼符合大眾普遍的規範
大部分的設計模式來自於"Gang of Four"的Design Patterns這本書
《Design Patterns:Elements of Reusable Object-Oriented Software》
實作時可能會用到多個設計模式 彼此之間並沒有明確的排他性

UML (Unified Modeling Language) UML圖
使用各種箭頭符號 來用於表達物件與物件之間的關係 

將23種設計模式分為三群：
Creational Patterns 規範新物件的創建方式
Structural Patterns 規範物件內部的屬性及方法以達成目的
Behavioural Patterns 規範執行單一行為時多物件間的互動和職責ㄕ

## 1.Creational Patterns
Factory Method Pattern 特別強定method 是因為factory method需用來建構子
將創建方法從物件獨立出來 只有工廠能進行生產
所有物件的生產都必定是由一個唯一性的工廠產生 物件之間的繼承關係會跟工廠之間的繼承關係一致
其中涉及到物件導向的基礎 即繼承的優點：
用於生產物件的子類工廠 能更有效的擴張不同屬性的物件
而被繼承的父類工廠 則能一次性地修改基本方法 減少子類工廠重寫的浪費
存在一個function 能夠大量生產屬性相似的物件 
也就是用Factory Method來取代傳統的Constructor
var response = responseFactory.create_response()  # responseFactory物件或其子類物件可決定不同屬性
var responseJson = responseJsonFactory.create_response() # responseJsonFactory 繼承自responseFactory

Abstract Factory Pattern 用於處理不同環境變數的client需求 (不同環境變數就如同不同風格)
為改進factory method模式而來 不需要為每一種物件都獨立設置類別
抽象工廠旗下有多種風格的實體工廠 而所有產品品項都會有一個抽象產品 
實體工廠所生產的實體產品 則要實作抽象產品的介面 
如此只需要實體工廠類別*3與抽象產品類別*3 就能取代9實體工廠類別*9 當然最後生成的產品類別仍是9個
邏輯與bridge模式類似 但abstract factory模式用於創建多樣化物件 而bridge模式則用於差異化方法
若client希望能獲得新的風格 則會多新增實體工廠與相對應的實體產品：
class ClassicFurnitureFactory(FurnitureFactory): # 實體工廠實作抽象工廠
  def create_table(self): # 仍使用factory method模式
    return ClassicTable()
  def create_chair(self):
    return ClassicChair()
class ClassicTable(Table): # 生產出來的實體產品類別也會實作抽象產品
  def put_stuff_on(self):  # 產品的屬性與方法則在實體產品類別中定義
    return "Client puts stuff on a classic table"
  def showcase_style(self, collaborator: Chair):
    return "{}, and then {}".format(self.put_stuff_on(), collaborator.sit_on())  


Builder Pattern 當產品的屬性數量不一致時使用
存在director跟builder director永遠只能有一個 builder則對每種物件種類具唯一生產的資格
director負責決定物件所需的屬性種類 而builder負責設置屬性值與最後的創建物件
buider pattern好處：則物件不需要的屬性不再需要想辦法處理 早期則大多填入空值
director.builder = car_builder  # 將builder存入director的屬性之中
car = car_builder.get_product()

Prototype Pattern 通常只用在資料相關的物件上(data object) 尤其是有多重巢狀結構的物件
適用的情況會有一個根節點物件 即物件內部的屬性可能會是其他物件 因而往下延伸
而prototype則是一個讓 其根節點延伸出來的物件 都需實作的介面
利用prototype模式的deep_copy()來創建新物件：
根節點物件實作deep_copy() 內部屬性的物件都要進行deep_copy()

Singleton Pattern 單例模式
一個類別只能有一個實體 也就是不需要多個物件來實現功能 常用於database的接口或用戶資料狀態
剛好是factory method模式那種大量生產物件的反向
關鍵在於此物件不能存在兩個以上 會導致資料不一致的狀況
通常會用DBHelper.getInstance() 作為創建實體的唯一辦法 並隱藏物件建構子 即沒有__init__()
並且不會一開始就建立 而是有需求時才做建立 又稱lazy initialization
if self.instance == null:  # 在DBHelper.getInstance()加上判別式 表示只能有一個
  self.instance = DBHelper()


## 2.Structural Patterns
Adapter Pattern 
創建一個抽象類別Adapter 負責處理第三方套件
當引用第三方套件時 不應該直接在主程式調用其方法或類別 而是需要透過配飾器的adapter
如此當第三方套件更動時才不會導致影響主程式 我們只要修改adapter就好
adapter = new ThirdPckageAdapterAdapter()
adapter.execuate()  # client不用知道第三方套件的任何使用方法 只要會用adapter即可

Bridge Pattern 多人協作時最常用到的概念
將一件事分離成Abstraction抽象及Implementor實作 使兩者可以獨立發展
Implementor物件比較接近方法集 本身不會實例化
Abstraction物件則可實例化 且引入Implementor物件作為參數
在用Abstraction物件的方法來調用Implementor的方法集 且Abstraction可搭配不同的Implementor來達成不同的目的
order1 = GoogleOrder(PrinterUsual())  # PrinterUsual()是Implementor GoogleOrder()是Abstraction
order1.printOrderA()  # printOrderA() 會調用self._printer.orderA()

Composite Pattern 結構：Composite物件的內部可包含其他 Composite物件和個體物件
讓 個體物件 與 由個體整合而成的組成物件 都能使用相同的操作介面 常用於繪圖軟體的架構設計
而這個組成物件就是Composite物件 實作與個體物件相同的介面 此外可做add()和remove()來繼續整合其他個體物件

Decorator Pattern 結構：物件內部可用oprate()做遞迴呼叫
採用動態新增或覆蓋原方法的方式 來改善物件繼承之間的靜態關係 
若只是針對某個特定情況而擴展一個新的子類別的話 會導致最後子類別過多而難以維護
物件之間相似性太高：可直接用一種類別來修飾另一種類別 來取代擴展一個新的子類別
原物件類別 和 decorator類別都會有oprate() 且operate()內部再調用 self.other_maker.operate()
decorator類別的屬性都能存放decorator類別的變數(self.other_maker) 如此來做遞迴直到沒有為止

class Worker:
  def operate(self, card_maker):
    card_maker.operater

class CardMaker:
  def __init__(self, other_maker=None):
    self.other_maker = other_maker if other_maker else None
  def operate(self)
    if self.other_maker:
      printf('plain-')
      self.other_maker.operate()
    else:
      printf('card')

class DottedCardMaker(CardMaker):
  def __init__(self, other_maker=None):
    super.__init__(other_maker)
  def operate(self)
    if self.other_maker:
      printf('dotted-')
      self.other_maker.operate()
    else:
      printf('card')

card_maker = DottedCardMaker(CardMaker())
worker.operate(card_maker)

Proxy Pattern 會有一個proxy物件其內部結構需有原物件相同
分為虛擬代理與快取代理 通常是為改善執行效能或使用者體驗而存在
若修正為proxy物件 則必須要跟原物件實作相同的介面 如此才不會因為proxy而發生問題
虛擬代理為占位placeholder而實行 與網路應用的代理主要針對分流routing
const proxyImage = (() => {
  const img = new Image();
  img.onload = function() {  // 在成功載入後才會觸發 此時才將img.src放入setSrc()
    myImage.setSrc(this.src);
  };
  return {
    setSrc(src) {
      img.src = src;  # 此時只是作為屬性先存在img中(img.src)
      myImage.setSrc("/image/placeholder.png");
    }
  }
})();

快取代理則為更好的效能而實行 不浪費運算資源在相同的結果上
const proxySum = (() => {
  const cache = {};  // 當作cache的dict
  return (...numbers) => {  // 等同於python的*args 用於實現不限定數量的參數引用
    const key = numbers.join("+"); 

    if (cache[key] !== undefined) {  // 若已經存在key 則直接回傳value即可
      return cache[key];
    }

    const result = sum(...numbers);
    cache[key] = result;

    return result;
  };
})();

Flyweight Pattern 結構：多個物件共有相同的屬性
多個物件共享同一個狀態 以此達到節省RAM的效果 常用在同時有大量用戶上線的遊戲軟體上
在Database中有點像是foreignKey的應用
將原本的物件分成內存狀態(Intrinsic State)和外存狀態(Extrinsic State)
前者為存放共同狀態的Flyweight物件 可用class variable來產生 後者則是物件之間差異較大的部分
Flyweight不能影響原物件的屬性與方法 也就是外界使用者不用知道內部如何組合物件 
class Chicken  # Ruby語言
  def initialize(color, is_cute, name) # 物件在創建時會存入Flyweight物件
    @name = name
    @chicken_type = ChickenType.for(color, is_cute) # Flyweight物件通常會用Type做後綴詞
  end

class ChickenType
  @@types = {}  # @變數表示物件自己的屬性 @@變數表示整個類別共有的屬性
  def self.for(color, is_cute) # self.method 為ruby的classmethod
    if type = @@types[key(color, is_cute)] 
      type  # 當此組合已經創建過會存放在 @@types 中
    else
      @@types[key(olor, is_cute)] = self.new(color, is_cute)
    end
  end
  def self.key(color, is_cute)  #將字串存入 @@types 中
    if is_cute
      "cute_#{color}_chicken"
    else
      "#{color}_chicken"
  end
end

Facade Pattern 門面 結構：facade介面內部有子系統物件做屬性
當系統過於複雜時 facade可作為整合的工具 提供client方便操作
系統可切分為多個子系統 facade可將其子系統轉為一層層的架構 以降低子系統之間的耦合程度 
與mediator模式有點類似 都用一個抽象物件來隔離依賴
但facade主要減少不同職能物件之間的依賴性 mediator則為減少相同用戶物件之間的依賴性
執行過程則類似command模式 都有一個統一的介面提供client端操作
但facade在於整合多職能物件(結構性) command則為將單一行為分工獨立出命令者與執行者(行為性)

而facade也能將小系統的facade作為物件整合進去
最後完整系統的facade由於過於厚重 必須避免變成god class(職權過於承重的類別)

class HomeTheaterFacade {  # 作為智能家居遙控器
  let amplifier: Amplifier
  let dvdPlayer: DvdPlayer
  let cdPlayer: CdPlayer
  let projector: Projector
  let lights: TheaterLights
  let screen: Screen
  let popper: PopcornPopper
  init(Amplifier, DvdPlayer, CdPlayer){
    //.......
  }

## 3.Behavioural Patterns
Chain of Responsibility Pattern (CoR) 責任鍊
常用來與Decorator Pattern比較 因為兩者都是透過遞迴來處理
用於製作軟體內部各個領域職能的交流池(event stream)
每個接受者handlers都會實作相同的介面 
並能夠判別是否應該接受訊息和控制多個handlers的順序 來提升訊息處理的效能
當加入新訊息時不需要特別去指派給哪個handlers 直接丟入event stream即可

class SushiMaker  # event stream接受外界的事件訊息後 依據順序或其他條件分派給handler
  attr_reader :sushi_lover # 只依賴於第一個人 第二個人由第一個人依賴 以此建立順序關係
  def initialize  
    h1 = SalmonSushiLover.new
    h2 = TunaSushiLover.new  
    sushi_lover = h1
    h1.next_sushi_lover = h2  # 不一定要在event stream將其相連 可以在外界做這件事
  end
  def start
    sushi = make_susshi_with_random_material
    sushi_lover.eat(sushi)
  end
end
class SushiLover  
  attr_reader :next_sushi_lover # handler之間單向依賴 第一人依賴第二人, 第二人依賴第三人...以此類推
  def next_sushi_lover=(next_lover)
    self.next_sushi_lover
  end
  def eat(sushi)
    if next_sushi_lover  # 若有下一個則往下傳 若沒有則不做動作
      next_sushi_lover.eat(sushi)
    end
  end
end

Command Pattern
分為命令發起者client和命令接收者receiver 將兩者的行為彼此獨立 
client只要能拿到結果就好 不需要知道執行過程或由執行的物件 如何實現命令由receiver負責
CoR模式是相同訊息給多人排序流水性處理 command模式則是將行為分成不同的兩部分給二人處理
類似簡易的Visitor模式：Command模式獨立出來的方法只能用於單一類別 Visitor模式則就是為了處理多個類別
cmd就是這個連接兩者的抽象介面 
const methodSet = {  // 會有一個方法集 放單獨不可再分割的方法 
  prepare() {
    console.log("炸雞排");
    return Promise.resolve(this);
  },
  cut() {
    console.log("剪雞排");
    return Promise.resolve(this);
  },
  putSeasoning() {
    console.log("調味");
    return Promise.resolve(this);
  },
  deliver() {
    console.log("銀貨兩訖");
    return Promise.resolve(this);
  }
};
const createCommand = receiver => ({  // receiver用於決定如何組合各個方法
  execute_entire_service() { 
    return receiver
      .prepare()
      .cut()
      .putSeasoning()
      .deliver();
  },
  execute_without_cut() {
    return receiver
      .prepare()
      .putSeasoning()
      .deliver();
  },
});

Command = createCommand(methodSet);  // 這種組合方式為Bridge Pattern
Command.execute_entire_service()  // 外界就是clint 只要能拿到結果就好


Strategy Pattern
定義整族的function 藉由可互換使用概念 來達成在不影響外界的情況下抽換成不同的function
FatbookPrintStg類別 通常類別命名後綴詞加上Stg
class PrinterCustom(Printer):
  _printStg=None
  def __init__(self, printStg=PrintStg):  # 將stg類別作為參數引入物件中 如此就能使用在stg定義好的function
    if printStg is None:
      raise TypeError
    else:     
      self._printStg = printStg 
  def orderA(self):  # 對於外界而言仍是調用PrinterCustom.orderA 而實際上透過stg類別可以抽換不同的function
    self._printStg.printA()
  def orderB(self):
    self._printStg.printB()

stg = FatbookPrintStg()
printerMethod = PrinterCustom(stg)

State Pattern
對於物件所處的狀態 可能會有多種可能的state 
將state各自抽出來 建議多個state物件 並找出state物件之間的共通點 來實作state介面 
其餘部分則為物件的context 外界只能使用context 並不會直接接觸到state 
將與state相關的方法委託給state object來進行 更有利於程式的擴展性
當有新的狀態時不用在原物件增加if-else做辨別 可直接將新的state物件當成參數引用 

state pattern和strategy pattern都是把部分邏輯交給其他物件來實作(state object和 stg object)
但state pattern跟物件的狀態處理相關 而strategy pattern主要為創建不同物件 

self.state='Open' 或 self.state='Close' 兩種可能
轉成stateOpen和stateClose兩種物件 並實作共同的介面

class Ticket {  # java語言
  constructor(seatId: number) {
    this.seatId = seatId;
    this.state = new OpenState(this);
  }
  public addToCart(userId: number): boolean {  # delegate:與state相關的方法委託給state object
    return this.state.addToCart(userId);
  }
}
class OpenState implements State {  # OpenState和CloseState都會實做State介面
  context: Ticket;
  constructor(ticket: Ticket) {
    this.context = ticket;
  }
  public addToCart(userId: number): boolean {
    this.context.userId = userId;
    this.context.setState(new CloseState(this.context));
    return true;
  }
}
ticket.addToCart(user0) # 外界不會知道原物件是否有委託或委託給誰


Visitor Pattern(或稱 Visit Pattern)
由於每次介面新增方法時 就要讓連動所有實作的類別新增此方法
而有些太瑣碎的方法不適合放在介面上 不符合接口遠離原則
將太瑣碎的方法移到visitor介面上 在此介面會有visit()方法 而原介面要用accept()方法來接受visitor介面
不同於原介面由不同的實體來實作 像是Gilr, Man, Womon...等
visitor介面則由不同的方法來實作 像是RunVisitor, WalkVisitor...等
如此一來要加入新方法只要新增類別來實作visitor介面即可

將物件作為參數引入 有點像strategy模式和stage模式 但三者的目的都大不相同
strategy模式再創件的時候就引入物件 initialize() 用於多樣化創建新物件
stage模式則是在更改狀態時引入物件 setState() 用於處理不同狀態的方法
visitor模式則是直到要用時才引入 且不會存在物件中 accept() 用於降低物件實作太瑣碎的方法

class Girl < People # Ruby語言
  def accept(visitor)  # 原物件只要實作accept就好 不用像原本的方法一直新增下去
    visitor.visit_girl(self) # 將visitor作為參數引入 就能使用其方法來替代
  end
end
class Man < People
  def accept(visitor)  # 其方法的參數要使用介面才能引入物件
    visitor.visit_man(self)
  end
end

Template Method Pattern
適合用於多個相似的物件 部分功能重疊性太高只有些微差異
此時可將大功能拆成多個小功能 針對小功能做變更即可
變更方法是建立base class父類別並用sub class子類別來繼承改寫 如此才可避免影響到原功能
猶如在已制定好的模板上挖洞替換一樣

Observer Pattern
存在事件發佈者Publisher與事件觀察者Observer兩種角色 常用於社交軟體
一個帳號是Publisher 來決定其他帳號是否能看到相關訊息
也同樣是Observer 則決定能看到哪些帳號的相關訊息
好處是降低帳號之間的耦合關係 publisher並不需要知道observer是誰 只負責上傳訊息即可
observer用於社群軟體 mediator用於聊天室軟體 兩者接近

Mediator Pattern
任兩位以上用戶要互相溝通時都必須透過中間者 常用於聊天軟體 
存在mediator物件來封裝一組物件的互動過程 好處在於用戶之間不會相互依賴 所有用戶都只會依賴mediator物件
class ChatRoomMediator{  # room可以加入user 也可以傳訊息給user
  private val userList = mutableListOf<ChatRoomUser>()
  fun addUser(user: ChatRoomUser) {
     userList.add(user)
  }
  fun sendMessage(user: ChatRoomUser, msg: String) {
    // 把user發送的訊息傳給聊天室中的其他人
    userList.filter { it.name != user.name }
      .forEach { it.receive(msg) }
  }
}
class ChatRoomUser(val name: String, val mediator: ChatRoomMediator){ # 每位user都會直接綁定一個mediator
  fun send(msg: String) {  # 不用指定其他用戶 因為只會傳給mediator 其餘則看mediator之中的userList
    // 呼叫Mediator來幫它送訊息給別人
    mediator.sendMessage(this, msg)
  }
  fun receive(msg: String) {
    println("$name received: $msg")
  }
}
val mediator = ChatRoomMediator()
val bob = ChatRoomUser("Bob", mediator)
val alice = ChatRoomUser("Alice", mediator) 

mediator.addUser(bob)  # mediator跟user是相互依賴的 user創建時要指定mediator mediator也必須用addUser()
mediator.addUser(alice)


Iterator Pattern 迭代器
存在iterator和iteratable(又稱aggregate聚合器)
iterator專注於尋訪triversal的邏輯(是否要跳過特定元素等) iteratable則專注於如何使用元素的邏輯
Iterator模式目的就是將其功能獨立分開

class Iterator(ABC):  # python要用interface就會變得特別麻煩
  @abstractethod
  def hasNext():  # 需要知道是否有下一個 
  @abstractethod
  def nextOne():  # 存取資料的下一個聚合物
  @abstractethod
  def toNext():  # 存取完後將指標指到下一個
  
class StudentIterator(Iterator):
  def __init__(self, students)
    self.students = students
  def hasNext(self):
    return index < self.students.size 
  def nextOne(self):
    return self.students[index]
  def toNext():  # 針對需求來修改尋訪的邏輯
    index ++
    while (hasNext() && (self.students[index].isSick || self.students[index].isDropout))
      index ++

class ClassRoom:
  self.students = students_list  # 不一定要是有編號的list或有鍵值的key 任何一種資料的聚合體都行
  def getIterator(self):
    return StudentIterator(self.students)
  def start(self):
    iterator = self.getIterator()
    while (iterator.hasNext()) {
      student = iterator.nextOne()
      process(student)
      iterator.toNext()
    }
  def process(self,student):  # 專注於如何使用元素的邏輯
    printf('student.name')


Interpreter Pattern 解讀器
用於將client輸入的特定字串轉換成程式語言 用於製作計算機的input輸入欄
需將特定字串轉換成抽象語法樹Syntax Tree 分為TerminalExpression和NonterminalExpression 
解讀器需要使用for循環與recursion遞迴呼叫 當字串過於複雜 會導致效能急遽下滑
每個規則都需要新的物件類別 當字串涉及太多規則 將難以維護 
protocol IntegerExpression { # sfift語言 以下的Expression都實作此介面
    func evaluate(_ context: IntegerContext) -> Int
    func replace(character name: Character, integerExpression: IntegerExpression) -> IntegerExpression
}
let context = IntegerContext() # context為所有字元的查詢依據

let a = IntegerVariableExpression(name: "a")  # 代表字元'a'運算元
let b = IntegerVariableExpression(name: "b")
let c = IntegerVariableExpression(name: "c")

let expression = PlusExpression(op1: a, op2: PlusExpression(op1: b, op2: c)) # 代表字元'+'運算子

context.assign(expression: a, value: 4)  # 將字元'a'設值為4 也可使用不同的context則其結果不同
context.assign(expression: b, value: 1)
context.assign(expression: c, value: 2)

print(expression.evaluate(context)) # context只需要解讀運算元 因為運算子的邏輯已寫入evaluate()

Memento Pattern 備忘錄
不違反封裝性的前提下 將物件內部的狀態訊息呈現出來 用於遊戲軟體的存讀系統或編輯軟體的上一步功能
存在originator也就是需要被儲存裝態的物件 可針對狀態來生成memento 也可引用memento來回溯物件狀態
而caretaker則為編輯器 只用於儲存多個memento和命令originator進行回溯 本身不參與回溯過程
因為唯一可以改變物件狀態的是originator 如此才能確保兩者職權獨立
memento為data object 本身不會有任何方法 且必須非常輕 才適合用於儲存大量的狀態 
public class Caretaker {
  private Originator originator;
  private Stack<Memento> history;
  public Caretaker(Origniator originator) {
    this.originator = originator;  # 創建時要引入originator物件 和 memento_list
    history = new Stack<Memento>();
  }
  private void doSomething() {  # 每進行一步都會自動儲存 也就是讓originator生成memento
    Memento m = originator.save();
    history.push(m);
  }
  private void undo() {  # 當進行回溯時 要把原本儲存的memento拿出來以避免錯亂
    Memento m = history.pop();
    originator.restore(m);
  }
}
public class Memento{  # originator的狀態被隱藏至memento之中 外界caretaker不會知道  
  private State state;
  public Memento(State state) {  # originator.save()會生成memento並將state包裝在其中
    this.state = state;
  }
  public State getState() {
    return state;
  }
}

## 其他 Patterns
Special Case Pattern 用於思考各種可能的例外狀況
除了一般情況之外 建立一個secial case的物件來做例外處理

Null Object Pattern 就是一種special case pattern
專門傳遞null物件來解決例外狀況 此時調用方法就不需要額外寫判別式來把None排除在外
class AbstractCustomer(ABC):  # ABC指的是AbstractClass 用於使不同的類別能有共同的父輩類別
  @abstractmethod  
  def get_name(self):
    pass  # 不實作任何方法 等同是Java的interface 

class RealCustomer(AbstractCustomer):
  def __init__(self, name):
    self.name = name

  def get_name(self):  # 真正的物件才會實作方法
    return self.name

class NullCustomer(AbstractCustomer):  # 最後多加一個NullObject 並繼承AbstractCustomer
  def get_name(self):
    return "Not Available in Customer Database"
    #如此的好處是不會因為None沒有相關的method而導致error 
    #故調用方法也不需要額外寫判別式 直接回傳NullCustomer即可

- - - -------------------------------------------------------
# 程式原則

**cohesion內聚力**
指物件內部的函式只少使用到一項該物件的變數 若使用到的變數越則內聚力越高

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

解決方法就是建立多個介面讓子類別實作 有空方法出現就移到其他介面 
(不同於父類別只能繼承一個 介面則可實作多個)

依賴反轉原則 (Dependency inversion principle)
當引用第三方套件時 不應該直接在主程式調用其方法或類別 而是需要透過配飾器的adapter
如此當第三方套件更動時才不會導致影響主程式 我們只要修改adapter就好
依賴反轉指的是當第三方更動時 我們仍不需要更動主程式 而是只要反向的調整在adapter中的第三方套件方法即可

控制反轉Inversion of Control (IOC) 和 依賴注入Dependency Injection (DI)：
用戶直接使用A程式 但A程式依賴於B程式和C程式 當B或C更動時會導致問題發生
此時可以用IoC Container來使用A,B,C程式 此時就能把A從原本的依賴關係獨立出來 
這就是將控制權全部反轉導Container上 以此降低程式的耦合程度

A程式依賴於B程式 當有一天B程式發生變動而改用C程式時 此時就需要A程式的維護成本
此時就能用DI 將被依賴物件注入被動接受物件中 也就是將B程式當成參數引入A程式中
此時只要規範C程式與B程式實作同一種介面 就能確寶C程式也當成參數注入時不會出錯

這種將物件作為參數的方法有點類似strategy pattern
但stg模式主要訴求更多樣性的物件 而DI則是為了降低耦合程度

**多版本控制**
將介面作為參數 此時所有實作該介面的物件都可以被引用進去
用介面做為參數的好處是當你需要修改物件時時 你不需要動到所有依賴於此物件的程式
方法為用另一個物件來實作介面 如果確定修改完成後再把原物件刪除即可
而不同版本可直接使用不同物件 並讓所有物件都統一實作相同介面即可

- - - ------------------------------------------------
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
list(path.parents)  parents則會回傳多個路徑類別的list 
直到執行時的當前所在位置：Path('.') 為止
//output: [PosixPath('foo/ber/baz/boo'), PosixPath('foo/ber/baz'), PosixPath('foo/ber'), PosixPath('foo'), PosixPath('.')]

DEBUG=True 才會導向error page (上半部黃色下半部traceback的頁面)
但因為有後端資料且會影響運行速度 故上線後會改DEBUG=False

ALLOWED_HOSTS=[] 可填入部署的虛擬主機IP或直接用"*"

設置SECRET_KEY：
import os
SECRET_KEY = os.environ['SECRET_KEY']  # Read SECRET_KEY from an environment variable
可用os.environ.get('DJANGO_SECRET_KEY', 'cg#p$g+j9tax!#a3cup@1$8obt2_+&k3q+pmu)5%asj6yjpkag')代替
表示如果'DJANGO_SECRET_KEY'不存在 則改用第二參數代替
'DJANGO_SECRET_KEY'則可以在部署的server上設定 
若用heroku:
heroku config:set DJANGO_SECRET_KEY=<your_secret_key>

web上傳的文件或cookies都一定要經過資料清洗：以避免XSS攻擊(Cross site scripting)
在inputfield欄中寫入可能惡意連接的代碼 進而影響伺服器後台

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

admin APP:
~admin在admin.py中

sessions APP:
原先的cookie將key-value pair都存放在client端
但因為cookie可被修改或刪除 故改用session將資料存放在server端

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
  request.session['is_login'] = True
  response = HttpResponse('session 儲存完畢')
  return response

def getSession(request):
  if 'is_login' in request.session:
    status = request.session.get('is_login')
  response = HttpResponse('You have been login' + status)
return response


messages APP：
用於網頁的一次性彈出訊息(notification message) 針對使用者行為來給予相對應的訊息(success,info,warning,error等) 
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

contenttypes APP：
所有創建的model都是ContentType的實例 
任何model的物件都能用ContentType的方法來取的
from django.contrib.contenttypes.models import ContentType
user_type = ContentType.objects.get(app_label='auth', model='user')
user_type  # output : <ContentType: user>

user = user_type.get_object_for_this_type(username='Jason')
user  # output : <User: Jason>

可用ContentType來製造model的泛型(generic): (目前還未看到任何應用)
from django.contrib.contenttypes.fields import GenericForeignKey
class SchoolPerson(models.Model):
  tag = models.SlugField()

  content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
  object_id = models.PositiveIntegerField()
  content_object = GenericForeignKey('content_type', 'object_id')
  (重點在於content_object 其餘content_type, object_id都是為創建GenericForeignKey())


t1 = Teacher.objects.get(username='Jason')
s1 = Student.objects.fet(username='Smith')
g1 = SchoolPerson(content_object=t1, tag='teacher1')  # 將物件變數存入generic中 並加上tag
g2 = SchoolPerson(content_object=s1, tag='student1')

- - - ------------------------------------------------
## 其他settings參數
AUTH_PASSWORD_VALIDATORS = []
用於查看用戶在網頁上所輸入的密碼是否符合要求：
與輸入的帳號過於相似, 字符少於標準位數, 密碼重複性太高強度不夠, 密碼全部為數字...等

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
統一時區 表示不會因為用戶所在時區不同而導致重疊
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

- - - -----------------------------------------
# notation 常見符號的英文 (用於google查尋):
!:exclamation mark
%:percent sign
#:number sign
@:at sign
$:dollar sign
^:XOR operator

+:addition
-:subtraction or dash or hyphen
*:multiplication or asterisk
/:division or forward slash
\:back slash
~:tilde

<>:angle brackets
[]:square brackets
{}:curly brackets
():parentheses
'':quotes
; :semicolon
: :colon

- - - -------------------------------------------
# regex正則表示法
正則表示法使用'\' 是為了避免與http格式的'/'混淆
re.match(pattern, string) 每一個re都是一組pattern 並放入要驗證的string

針對單一字符的規範：
[abc]表示只充許a,b,c三種字符 (數量透過{}決定) ; [^abc]則表示除a,b,c之外都充許
\w匹配任何字符 等同[a-zA-Z0-9] ; \d匹配任何數字 等同[0-9] ; \s匹配任何空白字符 等同[ \t\n\r\f\v]
.最好用 除了\n以外的任何字元[^\n] \+用於所有被限制的字元 等同[+]
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

(?P<name>)和(?P=name):
被匹配到的字串可透過<name>來設置別名 設置完後便可重複使用
(?P<n>a|b|c)1234(?P=n) => a1234a

針對字串或多個RE的規範：
'^{start' 開頭必須是{start才能匹配 ; 'end}$' 結尾必須是end}才能匹配
EX: r'ws/chat/(?P<room_name>\w+)/$' 網頁很常用'/$' 即表示開頭的URL不考慮 只要結尾符合就可以連接

~js_regex js的正則表示法
str.match(re):
var str = 'For more information, see Chapter 3.4.5.1';
var re = /see (chapter \d+(\.\d)*)/i;
var found = str.match(re);  // 回傳一個list 包含一個完整的配對結果(wrap, 即/.../之間) 以及其後多個group的配對結果(即(...)之間)
//['see Chapter 3.4.5.1', 'Chapter 3.4.5.1', '.1', index: 22, input: 'For more information, see Chapter 3.4.5.1' ]

/Jack(?= student| man)/ 其後接student或man的 Jack才會是搜尋目標
/(?!teacher )Jack/ 其前接teacher的則會略過 除此之外的都為搜尋目標

亦可用： 用RegExp物件好處是可以把字串當成參數引用 另外所有特殊字元要用'\\'開頭
var re = new RegExp('see (chapter \\d+(\\.\\d)*)', 'i');
re.test(str); 

var re = /^https?:\/\/.*?\//;
var re = new RegExp("^https?:\\/\\/.*?\\/");  // 除了'\'轉為'\\'之外 其餘都保持不變即可

str.replace(re,"$2,$1"):
若re中有多個group時 則可用$1, $2, $3,...$n選擇特定的group
group的好處是可將被收尋到的字串變數化 RegExp.$1, RegExp.$2...
var re = /(\w+)\s(\w+)/; 
var str = 'John Smith';
var newstr = str.replace(re, "$2,$1");  // "Smith, John" 常用於顛倒順序

var re =/(foo) (bar) \1 \2/;  等同: /(foo) (bar) (foo) (bar)/
\1, \2分別代表(foo)和(bar)這前後兩個group

var newStr = str.replace(re, (match) => { // 'JOHN SMITH' 用於替換大小寫
      return match.toUpperCase();
    });  // 加上function(match) match是符合條件的字串


- - - -------------------------------------------------------
# urls.py(外部urls.py 和 內部urls.py):
外部的urls.py用include()導到內部catalog的urls.py 
而非catalog app的功能則會使用外部的urls.py:
path('admin/', admin.site.urls)  # admin site
path('accounts/', include('django.contrib.auth.urls'))  # 授權相關 包含login,logout...等

使用path('accounts/', include('django.contrib.auth.urls'))時
預設templates資料夾應設在最外層
並在settings.py 的 TEMPLATES中增加：'DIRS': [os.path.join(BASE_DIR, 'templates')]
另外也可以區分與view.py連動的templates(catalog/templates)

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
假設現在用唯一的大表格(model)且以BookId作為主鍵：則會有許多重複的genre 此時genre就可用外鍵連結以減少重複性
而其他與genre相關的屬性同樣會有重複性問題 故應轉到genre的model上 (ex:相同類別的書會放在相同書架上)
(假設每本書都只能有一種genre 即不考慮ManyToManyField())

外鍵(ForeignKey)是一種recursive和lazy關係：
recursive：在lookups操作上可以透過多個外鍵來查找不同model的資料 
lazy：當抓取此model類別的資料時外鍵的資料不會事先被存取

class Car(models.Model):
  manufacturer = models.ForeignKey('Manufacturer', null=True, on_delete=models.SET_NULL)
class Manufacturer(models.Model):
  name = models.CharField(max_length=100)

on_delete 表示當該筆外鍵紀錄(record)刪除後 連結此外鍵的model應如何處理 
models.CASCADE(默認)
表示資料不完整 故一同將所有連接此外鍵紀錄的筆數都刪除
models.SET_NULL, null=True
資料不完整也無所謂 可直接轉為null 通常表示此外鍵屬性不影響資料完整性

每個模型的屬性都是資料庫的一項field 而每個field會被映射到資料庫內的column：
model之間的關係可分為:一對一,一對多,多對多 這三種
其中一對多最常見 可用：ForeignKey() 
另外有 一對一:OneToOneField()  多對多:ManyToManyField()

OneToOneField就是unique=True的ForeignKey 
將兩表分開的原因不是因為重複性 而是可設置不同的權限以方便資訊管理

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
可在資料庫存放{} 如此就能用填入動態資訊

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


uuid = models.UUIDField(primary_key=True,default=uuid.uuid4)
uuid常做為主鍵使用 具有唯一性(unique=True)且不可為空(null=False) 故可作為外鍵的連結
所有的資料欄類別都會有主鍵 若未指定則model會額外自行生成主見以供外鍵取用
default作為預設值 故用戶不需要自行填寫此欄
此field不是在model創建時寫入數據：都應該設置default 表示不用額外填入undifined值

若沒有指定主鍵(primary_key=True) 則自行生成id作為主鍵
等同：id = models.BigAutoField(primary_key=True) 
id本來就會遞增 故也可直接查id知道目前所創建的房間數(不是房間總數)

null=False和blank=False:
null=False表示資料庫內的該欄不能用null儲存(預設) blank=False表示在admin或view輸入時會經過驗證不能填空
另外null=True常用於sparse model 可節省許多不用的空間

last_modified = DateField(auto_now=True)
create_date = DateField(auto_new_add=True)
auto_now表示每次QuerySet.save()時都會自動以當前時間來儲存
auto_now_add則表示只在建立物件的當下儲存
但auto_now和auto_now_add都會自動附上editable=False 和 blank=True 導致不能做更改

pub_date = models.DateTimeField(default=timezone.now)
故可改用default的方式 如此就能事後修改
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
def validate_even(value):  # 可以寫validate function來作為validators的參數
  if value % 2 != 0:
      raise ValidationError(
          _('%(value)s is not an even number'),
          params={'value': value},
      )
even_field = models.IntegerField(validators=[validate_even])

import uuid (python)
uuid.uuid4() 可以隨機生成常見的char(32)字串 不包含4個引號'-'

upload = models.FileField(upload_to='uploads/')
FileField不同於字串或數值變數 故需要提供存放位置 (因性能考量 media檔案不會存放在資料庫中) 
並可用object.name和object.size 取得檔案名稱與檔案大小

upload_to屬性會接在MEDIA_ROOT之後
若MEDIA_ROOT = BASE_DIR / 'media' 則最後會存放在：BASE_DIR / 'media/uploads/'

image = models.ImageField(upload_to='uploads/')
為FileField的子類 但多加了驗證是否為圖片的步驟
self.image.name  //output: 'uploads/originalName.jpg'
self.image.path  //output: '/media/uploads/originalName.jpg' 
self.image.url  //output: 'http://media.example.com/uploads/originalName.jpg''
path是在FileSystem的位置 url是真正client端要取用的位置
只要改變image.name後image.path和image.url都會改變


image的編碼方式(base64): 編碼的主要目的是將字元都位元化(0,1)以方便傳輸

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
由於8bits只有256可顯示字元 不能包含多個國家 故應此有了萬國碼(unicode) 
常出現的亂碼就是編碼方式不同所造成 

因為unicode只是符號集 若全世界所有國家的字元都用最大位元空間來存取的話 就會造成許多浪費(英文字只需要1個byte即可)
故用UTF-8做為存取字元的規範 可隨不同國家的字元而自動調整存取的位元空間(英文字為1byte, 中文字為3bytes)


url = models.SlugField(max_length=50)
SlugField源於CharField 指的是報紙的短標題 兩者都是放字串變數
但SlugField不能放特殊字元(充許下划線underscores與連字符hyphens) 空白格也不行 因此較適合存放url

def __str__(self):
    return self.title  # 用於print()該模型實例出來的物件變數

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
metadata為後設資料, 中介資料, 元資料 即此資料是用來描述主要資料


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

  並在models.py中的Book類別加上：
  def display_genre(self):
    return ', '.join(genre.name for genre in self.genre.all()[:3]) # 只讀取前三項
  display_genre.short_description = 'Genre'  # 在select頁面 用'genre'取代'display_genre'名稱

  list_filter = ('genre',)  # 可加上過濾功能 通常只用於choice的資料欄
  search_fields = ('name',)  # 同樣放在select頁面 加上搜尋功能以避免資料量過多的時候
  ordering = ('-genre',)  # 針對字串開頭來做排序 '-'可用於反序

  inlines = [BooksInstanceInline]  # update頁面的內聯list 在Book類別的頁面可以編輯BooksInstance類別 常用於fk的field
  fields = ['name','id']  # 不同於list_display在select頁面 而fields在update(add或change)頁面用於改變排版順位
  
  fieldsets = (  # 用於取代fields 除了欄位排序外還有大標題可以選 也可以為空('None')
    (None, {
        'fields': ('book', 'imprint', 'id')
    }),
    ('Availability', {
        'fields': ('status', 'due_back')
    }),
  )
  exclude = ('create_date', )  ＃ 則為不要顯示的屬性 常用於系統預設的資訊 不充許修改


class BooksInstanceInline(admin.TabularInline):
  model = BookInstance

admin.site.register(Book, BookAdmin)  # 引入model並完成register註冊 並可加入BookAdmin類別參數來做admin頁面客製化
也可直接在BookAdmin類別上 添加:@admin.register(Book)

- - - ---------------------------------------------------
# views.py
from django.shortcuts import render
render()只是一種快捷的寫法(shortcuts) 
response = render(request, template_url, content) 
主要作用為接受HttpRequest物件做參數 並最後回傳HttpResponse物件

若一般不使用render() 改用直接回傳HttpResponse物件:
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
    // 參數為request 為讓ajax當發生錯誤時可以重發一次 而參數status 就是'200'之外的狀態碼
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

在view中使用model資料的方法
Book.objects.all() 所有的Model類別(繼承models.Model) 都能使用.objects的方法
books = Book.objects.all() 表示此model類別的所有紀錄 為最大的查詢集(QuerySet)
books[0],books[1]...可找依照目前排序的每筆record

常用的QuerySet的方法：
Book.objects.all().aggregate(Avg('price'))  aggregate用於找特定屬性的總和值(Avg,Max,Min,Sum...等)
會生成dict且key值為QuerySet查找格式 : {'price__avg': 34.56}

aggregate()用來取單一field數值 若要取整個instance則用order_by()後取first()
Book.objects.order_by('-price').first() 等同取price最高的record

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

Book.objects.get(pk=4).values() 輸出dict並將所有的field作為key值 
output : {'pk': 4, 'name': 'Beatles Blog', 'tagline': 'All the latest Beatles news.'}
Book.objects.get(pk=4).values('pk','name') 只選擇其中幾項field
output : {'pk': 4, 'name': 'Beatles Blog'}

Book.objects.filter(type='s').values('pk','name') 如果querySet有多個instance 則會以list形式返回
output : [{'pk': 4, 'name': 'Beatles Blog'},{'pk': 5, 'name': 'Jason Blog'}]

Book.objects.get(pk=4).values('pk','name',lower_name=Lower('name')) 如同annotate 可自行增加field
Book.objects.get(pk=4).values_list('pk','name')
output: (4, 'Beatles Blog') tuple取代dict
Book.objects.filter(genre='math').values_list('id', flat=True) 會將多組tuple壓成list

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


Book.objects.get(pk=1)  # 不能為None 如果沒找到會觸發error
Book.objects.filter(genre="science")  # 充許為None
Book.objects.exclude(genre="comic")
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

get()和filter()最後回傳的內容都為querySet 但仍有少許差異
filter()可能為空 而get()不充許為空
filter()的回傳值可用list()取各個querySet 而get()的回傳值本身就是單一的querySet

Book.objects.filter(pk__in=[1,4,7]) 在list中的其中一個
Book.objects.filter(pk__gt=14) pk>14
gt: greater than 和 gte: greater than or equal 
lt: less than 和 lte: less than or equal

from django.db.models import F  # F()為field的意思 可用於將同model不同field值來比較
Entry.objects.filter(number_of_comments__gt=F('number_of_pingbacks'))
Entry.objects.filter(rating__lt=F('number_of_comments') + F('number_of_pingbacks'))

Entry.objects.filter(pub_date__year=2010).update(count=F('count') + 1)
除了不同field值比較外 也可進行同field值運算

Book.objects.delete() 會讓database全部刪除 
故一般會先縮小範圍 Book.objects.filter(headline='Lennon').delete()

Book.objects.filter(headline='Lennon').update(genre="sci-fi") 
用於更改內容且必須用filter()鎖定 (即使只要更改單一項也不能用get())  等同: 
book.genre = "sci-fi"
book.save() 需用book = Book.objects.get(pk=1)存入記憶體 導致浪費內存

另外save()會傳送pre_save或post_save這兩種signal給其他使用此record的實例
差異在於內存中的實例是否要保有舊資料或直接進行更新

view內部變數：
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

~contrib.auth在views.py設置權限的方式
設置權限authentication: 用於做限制訪問, 註冊用戶資料, 依據用戶提供特定內容等

使用裝飾器decorators '@'： 
@property  # 意即將對象的方法包裝成屬性 可以在return之前多添加代碼
def dueDate(self):  # @property是為了增加易讀性
  ......
  return dueDate;

使用裝飾器'@'來設置授權：
from django.contrib.auth.decorators import login_required
@login_required
def my_view(request):
  ......

與其下方法等價：裝飾器會會讓未授權的用戶導向settings.LOGIN_URL 最後?next= 則導向現在的網頁位置
def my_view(request):
  if not request.user.is_authenticated:
    return redirect('%s?next=%s' % (settings.LOGIN_URL, request.path))
  ......

同理也與mixins方法等價： (mixins用於類別的繼承 有點類似java的interface)
from django.contrib.auth.mixins import LoginRequiredMixin
class MyView(LoginRequiredMixin, View):
  login_url = settings.LOGIN_URL
  ...

使用裝飾器'@'來設置權限許可：
from django.contrib.auth.decorators import permission_required
@permission_required('catalog.can_mark_returned')
@permission_required('catalog.can_edit')
def my_view(request):
  ......

也可用創建被限制之view的方式來實現：登入前後頁面不同的效果
from django.contrib.auth.mixins import PermissionRequiredMixin
class MyView(PermissionRequiredMixin, generic.View):
  permission_required = ('catalog.can_mark_returned', 'catalog.can_edit')
  ...

同理創建需要權限的view：也能基於不同權限顯示不同內容
class AuthorCreate(PermissionRequiredMixin, CreateView):  # 用於創建view 而非單一一筆紀錄

{% if user.is_authenticated %}......{%endif%} 和 {% if perms.restaurants.can_comment%}......{%endif%} 
直接使用模板語言可以在相同頁面上依據使用者來呈現不同內容


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

若有用django.contrib.auth:
則經過view的request物件中會有user物件 可用request.user.is_authenticated等功能
若有用django.contrib.sessions:
則經過view的request物件中會有session物件 可用於處理相關變數


permissions = (("can_mark_returned", "Set book as returned"),)
會放在model裡面的class Meta:之中

data = self.cleaned_data['originalDate']
會清除不符合規範的資料

接受post請求 並用renew()回應：
from django.http import HttpResponseRedirect
from django.urls import reverse

def renew(request, pk):
  return HttpResponseRedirect(reverse('all-borrowed') )

通常用於post請求 以完成在網站頁面進行驗證等動作 Redirect用於重新連接到指定的URL
redirect()和render()都是django.shortcuts的方法 用於view中來返回網頁
用法為：redirect(url) 和render(request,template_name,context_dict)
( template_name必須輸入從BASE_DIR之後的完整路徑 'chat/index.html' )

HttpResponseRedirect與redirect的差異：
HttpResponseRedirect()參數只能是url  而redirect()參數除了url外仍可放入其他變數

reverse_lazy('all-borrowed'))
lazy在程式語言當中通常表示不會馬上執行 以避免發生未加載錯誤
即為延後執行的reverse('all-borrowed') 常用於刪除資料後的重整


from django.shortcuts import get_object_or_404
當紀錄不存在時 自動引發http404

- - - ---------------------------------------------------
# forms.py
Form類別的用法為快速在view上建立輸入表單
class ExpenseModelForm(forms.ModelForm):  # 通常Form類別會與Model類別同開頭
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

    widgets = {  # 表示顯示在html上的輸入格式 (用在form = ExpenseModelForm()) 
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
    if form.is_valid():  # 可能為資料不充許留空null 且又沒有預設值 必須要完全符合對應的model格式才會通過
      # 直接save()比較好：
      # 一般處理資料應放在client端 好處是不用另外從databnase調資料
      form.save()
      return redirect("/expenses") # 最後要用redirect()導回原網址

    else:
      # some form errors occured.
      return JsonResponse({"error": form.errors}, status=400) # 若is_valid()為False 則返回form.errors

    
  return render(request, 'expenses/index.html', {
    'form':form  # key值的字串變數會傳入html模板的{{ form }}
  })

form = ExpenseModelForm() 用於在view中呈現表單
form = ExpenseModelForm(request.POST) 用於上傳表單內容

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

request.POST和request.GET雖然都是表單dict物件 但兩者不會同時出現
僅會針對client端發出的request類型來出現相對應的物件
form元素並不一定要做POST 也可用於提交URL來實現GET <form action="GET">
www.google.com?AGetKey=3&AnotherOne=hello

- - - ---------------------------------------------------
# api.py
有時會從views.py分出api.py 常用於處理第三方的應用 並要在INSTALLED_APPS加上此application名稱

rest_framework(不太好用!):
可用於將多個相關的views整合成viewset 
並在urls.py使用DefaultRouter()方法來取代原先的urlpattern 需用include(router.urls)引用
但ViewSet本身不提供任何方法 因此有:
GenericViewSet可提供queryset的方法 和 ModelViewSet則提供list(),retrieve(),update()等方法
可在api.py中覆蓋GenericViewSet和ModelViewSet的方法

- - - ---------------------------------------------------
# http_request請求:

GET: 用於請求指定資源(resource)的資料 只需要URL
HEAD: 與GET方法一樣 但只請求header的部分(跟html中的<head>是不同的東西) 可用於事先確認完整內容的大小
POST: 用於創建或修改資料 會傳送content(key-value pair)給伺服器
PUT: 視為等冪的POST 針對特定的URL所提交之內容 不會因多次提交而影響
PATCH: 用於提供特定URL中的部分屬性資料 (由於PUT只能做完整更新 故又有PATCH來做部分更新)
DELETE: 請求刪除指定資源(resource) 只需要URL
OPTIONS: 詢問伺服器所支持的通訊方法即協定(GET,HEAD,POST...) 通常URL會傳給整站而非其中之一的網頁


CRUD 為 Create(新增)、Read(讀取)、Update(更新)與Delete(刪除)的縮寫
http之中為 POST/ GET / PUT / DELETE 其中只有GET和POST最常用
但實際上POST和PUT兩者都能進行create和update:
在網站的特定URL上新增文章應使用PUT 因為每次都是提交相同內容不影響結果
在網站的特定值做變動應使用POST 因為每次增加減少都會使該值變動 

RESTful風格(Representational State Transfer):
為軟體的一種設計風格 目的使不同程式或軟體能使用統一的一套操作標準來在網路上傳遞資訊
目前主流的三種web設計風格:REST,SOAP,XML-RPC 
而許多新的http標準就是遵從RESTful風格 早期的request只有GET,POST兩種
RESTful:體現在以資源(resource)為基礎 
所有針對web的方法都是對於資源的操作(POST/GET/PUT/DELETE...)等


safe安全性: 即不會修改伺服器資料的方法
GET,HEAD,OPTION等都是安全的 但PUT,DELETE则不是

idempotent等冪性：即不管執行幾次 結果都會跟第一次執行一樣 (若非等冪的方法則會有副作用side effect)
GET,HEAD,PUT,DELETE等都是幂等的 但POST則不是

只要是safe必為idempotent (GET,HEAD...) 而idempotent並不保證safe
ex: 其中 DELETE request 每次做的事都相同 請求內容不會因次數而變
但只有第一次會成功(200) 之後會是沒有資料可刪(204) 
如此也算是idempotent 但因刪除了伺服器資料故不是safe

- - - ---------------------------------------------------
# html的<form>表單：
<form action=url method="post" enctype="multipart/form-data"> 
  <input type="text" name="description" value="some text">
  <input type="file" name="myFile">
  <button type="submit">Submit</button> // 等同<input type='submit'> 功能相同但差在單一tag與前後tags
</form>

但<form>只適用於傳統的request寫法
若要用ajax或ws則必須額外再寫JS的eventHandler

用於決定上傳資造的編碼型別 enctype屬性只有三種
"multipart/form-data" 傳送前不對字元編碼 使用django的form類別需採用此類
'application/x-www-form-urlencoded' 傳送前編碼所有字元 因此不能用於檔案上傳 可用request.POST取得上傳的資料
'text/plain' 不能有任何特殊字元或控制字元 (只充許空格)

POST的content內容：
POST /test.html HTTP/1.1
Content-Length: 68137
Content-Type: multipart/form-data; boundary=---------------------------974767299852498929531610575

---------------------------974767299852498929531610575
Content-Disposition: form-data; name="description"

some text
---------------------------974767299852498929531610575
Content-Disposition: form-data; name="myFile"; filename="testfile.txt"

Content-Type: text/plain

(content of the uploaded file testfile.txt)
---------------------------974767299852498929531610575

其中boundary會在不同的Content-Disposition之間 用於當做封裝訊息的分界
用<input>的name屬性來區分不同的封裝訊息 

- - - ---------------------------------------------------
# http_code代號：
101 switch 轉換協定 (ex:http->ws)

200 OK 伺服器回應成功 
201 created (ex:PUT,POST 成功建立新的內容)
202 accepted （ex:DELETE 成功請求但還未執行)
204 no content (ex:POST 當使用者並未更改資料但仍發送請求時 此時伺服器只會確認此要求但不做更動)

301 目標網頁移到新網址
304 瀏覽器已讀取了所有Data 即目前無更新資料

401 需身分驗證 (SSL key...)
403 無讀取權限
404 伺服器未找到目標網址 檔案不存在
408 瀏覽器請求時間過長

500 伺服器發生錯誤
503 伺服器當掉
505 瀏覽器不支持此html版本

- - - ---------------------------------------------------
# js_原生作法(不使用jquery):
javascript最主要的用途是增加互動性 以彌補html和css的不足

用JS就能達成部分即時性與互動性
function update(){
  ......
}
update();

因為html是DOM樹結構 (Document Object Model)
所以可以用Node.appendChild(), Node.removeChild(), Node.replaceChild()等方法 可以讓結構更明確
Node.appendChild()只能加到最後一個子節點 故又有Node.insertBefore() 讓子節點可以插入在任何一個地方

document.querySelector()和document.querySelectorAll()
前者只拿取文本中的第一個元素 後者會拿取全部元素
document本身就是JS對象 用於表示整個html元素
(目前已經沒有人在用原生JS, 大部分都用jquery$(...)代替 )

元素是構成html的最基本單位:
由兩個前後的標籤(tags)與中間的內容(content)組成

另外除了用querySelector()從html中抓取的對象之外 
也可以用:
var person = {
 name : ['Bob', 'Smith']
 age : 32,
 greeting: function() {  //但json格式中不能含有方法 只能全部為屬性 (故greeting不能用)
   alert('Hi! I\'m ' + this.name[0] + '.');
 }
}  // 這種方式為使用js直接創建變數 一般不用 (通常此方法所創建的物件只需要一個)

此外 JS物件內部方法method可簡化成二種: (與上者使用方法結果相同)
var person = {
  function greeting(){
    alert('Hi! I\'m ' + this.name[0] + '.');
  },
var person = {
  greeting(){
    alert('Hi! I\'m ' + this.name[0] + '.');
  },

可用 if(name in person) 來確認物件內是否有該屬性
同理 for (var prop in person) 則會遍及物件內的所有屬性
 for (var prop in person){
   console.log(person[prop])  //可用此方法輸出value
 }
let iterable = [3, 5, 7]; 
for (let i of iterable) {  
  console.log(i); //output:3, 5, 7  // 若為array則可直接改用for-of讀取value
}
一般物件使用for-in 而array則使用for-of (array中的key就是list的index)
因為in主要用於key 而of是針對value
for-in變數位置在裡面 故表示key或index for-of為屬於物件的變數 故為value

此方法更適何用於switch-case:  
case有多種狀況 此時就可以用此物件來紀錄狀況 (類似於 C#的emun類別)
var Season ={
  spring:"Spring",
  summer:"Summer",
  autumn:"Autumn",
  winter:"Winter"
}
switch (todayWeather){
  case Season.spring:
    break;
  case Season.summer:
    break;
  ......
}


一般創建物件應使用：
function Person(name, age) {  //物件本身也是用function構成的
  this.name = name;
  this.age = age;
  this.greeting = function() {  // 其中this.greeting的function()可直接在裡面創建
    alert('Hi! I\'m ' + this.name + '.');
  //nested function可用於實現private function 即此方法只有此物件能調用
  // 但因為每個物件的方法都不一樣 會導致重複建構而浪費資源 
  };
};

前者只是一個物件變數(variable) 後者可視為物件類別(class) 
可用new Person(name, age)進行實例化
若沒有參數 則 new Person()等同new Person

通常：
function getPerson(GoodOrNot) {  //再用function方法來做創建
  var person = new Person('Bob Smith', 32);
  if (!0==GoodOrNot){  // 這人是好人
    person.name = "goodPerson"  
    person.age = 10
  }else{
    person.name = "badPerson"  
    person.age = 30
  }   
}
用function()建構物件Person(name, age) 再用另一個function()創建對象實例getPerson()
方法與物件的差異在於開頭是否大寫：Person()與getPerson()
另外：Person()最後不會return 而getPerson()最後會return物件(Person())

Person()只用於宣告物件的屬性 getPerson()才做屬性的賦值 如此易讀性更高
此外可充許有多個創建方法來創建同一種物件:getPersonFemale(), getPersonMale()...

- - - ---------------------------------------
# js_truthy 真值表:

if({}), if([])  // 空物件, 空陣列也是true
if("foo"), if(42), if(-42), if(Infinity), if(-Infinity) //負數或infinity都為true
等同if(true)

if("") // 但空字串為false
if(0), if(null), if(undefined) 和 if(NaN) 
等同if(false)

- - - ---------------------------------------

因為'hi' === 'hi '  //false  而'hi'.trim() === 'hi '.trim()  //true
trim用於將前後的空白去除 以避免字串判別受空白格有影響

另外判斷字串是否為空 可直接用if(str) //str = ''則為false
但為追求易讀性 更常用if(str.length == 0)

同理空陣列也都使用到length屬性 if(arr.length == 0)  //判斷空陣列
空物件則須先將keys轉為array在做length屬性判別
if(Object.keys(obj).length == 0)  //判斷空物件

slice(start [, end]) 和 substr(start [, length])
兩者都用於切割字串 差別在於第二參數為擷取到該位置之前 與 擷取總長度

array.splice(start [, deleteCount[, item1]])
則用於在原字串或陣列中間位置刪除元素或插入元素 

**"===" 嚴格比較 "==" 寬鬆比較**
寬鬆比較下將0, '', '0' == false 為true / 將1, 'a' ,'1' == true 為true
寬鬆比較亦會將string自行轉成number做比較  '1' == 1為true
寬鬆比較下 null == undefined為true (null === undefined 為false)
很常用： 因為有些時候還未設值時變數為undefined

(對於JS的便捷性有很大幫助 另外JS沒有分float跟Integer 全部用number)
JS的命名風格比較傾向用"===" 取代 "==" 因為一且已清楚為標準

parsetInt(str),parseFloat(str)與Number(str)都能將string轉成number型態
而差別在於parstInt('123jason') = 123, Number('123jason') = NaN (即not a number)

另外toString()與String()的差異為：
false.toString() = 'false' 0.toString() = '5' 除了null和undefined外的所有資料類型
String(null) = 'null' String(undefined) = 'undefined' 用於處理例外的這二項

嚴格比較將null與undefined視為不同 寬鬆比較將兩者視為相同
任何還未設值的變數都是undefined 非常好用
故對於第一次設值的那次就可以直接用undefined來寫 第二次之後已設好變數便可直接用
如此一來就不用特別編寫設值以前的方法

typeof null // 輸出為object 
typeof new Person() // 輸出為object 最常用於判斷目前是否有此物件


**表達式與聲明式:**
表達式function expression: 表示用此變數表達函數方法
const sayHello = function() {  //用匿名函數將整個func當成是對象 
  console.log('Hello');
};
聲明式function declaration: 用於宣告函數方法
function sayHello(){  // 或用聲明func的方式 此時函數會有特定名稱
  console.log('Hello');
}
表達式與聲明式最大的差異在於： //hoisting 吊裝問題
sayHello()  //declaration可以放在func.的下方 不會發生問題
sayHello(){
  console.log('Hello');
}  //但expression則不行 因為變數還沒有宣告

expression需要事先宣告且會佔用變數空間 適合作為專案中的常用函數集合 
而此方法集只會建立一次 因此也符合匿名函數的使用邏輯
declaration不需要事先宣告但大多數仍會放於專案上層 適合單一功能的函數

function本質上也是對象的一種
name:value 即為function_name:function_code 呼叫了function_name就會執行程式
因此console.log(function_name) 會輸出完整的function_code

html原生的字串變數模板語言：
需要用backticks` `取代原本的字串用的quotes" "
console.log(`string text line 1
string text line 2`);  // `...`不需要用\n表示換行

console.log(`Fifteen is ${a + b} and
not ${2 * a + b}.`);  // `...`可直接用${}進行函數運算或直接帶入變數



var person1 = new Object(); Object()為空對象 較不常使用
也可以使用var person1 = {};
JS中的對象是由多個name-value pair組合而成 有點類似於python的dict

js也能建立array(list):
const data = [];
data.push("people1") (增加到最後一個元素 等同python的list.append())
data.pop() (刪除最後一個元素 與python相同為list.pop())

JS原生的方法創建不可實例化的類別(abstract clasee)： 主要用於調用classMethod
const methodSet = function(){
  function w(a){
    ...
  }
  function t(b){
    ...
  }
  return{  // 最後返回的{} 可用於在物件外部調用方法
    method1:w,
    method2:t
  }
}
methodSet.method1(a_value);


var用於function之中 let用於block之中 const則用於全域變數
var在全域範圍中(global scope)宣告等同const const無論在哪個程式中(local scope)宣告都是const

而直接在最外層使用var 則為全域變數 也就是window物件
遵守這種宣告方式 可避免變數跑到外部

javascript屬於動態定型語言 也就是js的變數可以不是先宣告且僅作為物件的參照 
js不同於其他語言 變數不需要事先指定型態 可直接用var取代int,float,str,bool...
其好處就是list(array), dict(object) 裡面的物件都不需要同一類型
若js變數不事先宣告var 則此變數為全域變數(window物件, 可直接在console使用this.some取得)

for( let i = 0; i < 5; i++ ) {
  window.setTimeout(function() {  // async時會產生問題 但若是同步方法則兩者無異 
    console.log(i);
  }, 1000 * i);
}
此時可以正確的輸出1,2,3,4,5  如果將let改為var 則為5,5,5,5,5
因為每一個let宣告的變數只會在該block存在
但是var會在整個code的區域存在 因此var的變數會覆蓋掉前一個
導致setTimeout()執行時會被變為只有i=5 也因此var在空間運用上會優於let

可用var person1={},person2={},......personlast={}; 寫在同一排
應該將需要同時創建的物件寫在一起 可以節省字元


**JS的例外處理:(Exception)**
try-catch為高耗效能的寫法 應盡量用if-else代替
try {
  throw new Error('Something is wrong!'); // 用throw來產生例外(Error類別)
}
catch (e) {  // 由於try{}中發生Error時會中斷程式 此時會直接接到對應的catch(){}繼續
  logMyErrors(e); // 將例外物件傳給errorHandler
}

要使用throw來拋出Error物件 就一定要在外部搭配try-catch才有意義
若可直接用it-else的情形 則直接用console.log就行了

exception最大的目的是避免function有多個結果：
輸入資料不符合預期, 再不恰當的時刻執行程式等
如果全部都回傳的話 那調用function的程式碼還需要多寫判別式 反而太麻煩

Exception與Error的差異：
基本是相似的 但Exception屬於被考慮到的非預期部分 而Error更偏向不能處理的部分
但在JS中都是創建Error()類別 並只需要引入一個字串變數(message)


- - - ------------------------------------------------
# js_error 例外名稱:
SyntaxError: 語法錯誤 少了';','}',')'...等等
RangeError: 數字超出範圍所產生的的錯誤
ReferenceError: 找不到變數時所發生的錯誤 常發生在拼錯字的狀況 (參照錯誤)
TypeError: 找不到函式所發生的錯誤 嘗試調用一個不存在的方法 (資料型態錯誤)
URIError: 配合encodeURI()或decodeURI()方法使用的錯誤
EvalError: 配合eval()方法使用所產生的錯誤： 但因eval是一個不建議使用的全域方法 故幾乎不會用到


- - - ------------------------------------------------

JS為 prototype-based language 所有創建的實例對象都有一個原型對象
Person.prototype 即指向原型對象(Object)
或用Object.getPrototypeOf(new Foobar()) 即用已創建的實例來指向原型對象
以此類推 所有對象都有上一級對象
如果直到原型對象都沒有這個屬性 則為：undefined
undefined指的是有變數 但還沒有設值 
與null不同 null是指已經設值但其值為空 

有些屬性或方法function Person()可能沒有 而是再Person.prototype之中
此時只有創建出來的實例才會有這些屬性或方法 也就是說prototype主要是針對實例的對象

var person2 = Object.create(person1); 一般都是調用Object的方法做創建

var myH1 = document.createElement('h1');
header.appendChild(myH1);
常用的元素創建方式

Teacher.prototype = Object.create(Person.prototype);
Teacher.prototype.constructor = Teacher;
也可以對prototype做create() 但要把constructor指向新的屬性

Person===Person.prototype.constructor
Person()與Person.prototype.constructor() 完全相同

JS的對象實際上就是變數和方法的集合
person.age與person['age']兩種方法都行表示對象中的變數
後者較實用 因為可以在括號中使用變數
ex: var attrName = nameInput.value
person[attrName]

可以在對象內部用this 表示當前對象(person)
ex: this.name

function Teacher(first, last, age, gender, interests, subject) {
  Person.call(this, first, last, age, gender, interests);
  this.subject = subject;
}
用call()做繼承 第一個參數表示誰this繼承 其餘參數則為Person(...)

var text = document.createTextNode()
大部分的Node都由 elements(元素節點)與text(內容文字節點)兩部分構成
有些插入型Node 不會有text(文字節點) ex:<img>
而TextNode意即包裹在html標籤內的部分
另外也能直接用Node.textContent 修改節點中的TextNode
另外用Node.innerHTML通常是一樣的結果 但因為要先轉解析html故速度較慢
但.textContent用於輸出純文字(text/plain) 而.innerHTML輸出html連結(text/html)

jquery 使用text()代替.textContent 和html()代替.innerHTML
text()只會取純文字部分 而html()則能包含元素標籤
若為<input>等輸入型元素則需用val()取代text()

linkPara.parentNode.removeChild(linkPara);
為刪除自身節點的方法 因為自身無法刪除自身 須透過parentNode幫忙

btn.onclick = function() onclick只用在button上 是button的一種屬性
而addEventListener('click',func)可用在任何一種元素上
.onclick指的是事件(event)或稱事件監聽器(eventListener) 用於JS原生語言 
.click()放於JS的addEventListener()之中 可用來指特定動作的方法(此時不放任何參數)

在jquery中.click(function(){}))可用來表示事件(event) 
同理.click()也可用來表示特定動作的方法
也可用jQuery的方式加上事件: // jQuery使用.click()表示事件監聽器
$("myButton").click(function(){
  //func.
});

$("myButton").unbind('click');  unbind()用於移除事件
$("myButton").unbind(); 不加任何參數可移除所有事件
(新版的jQuery 已被on()/off()取代)


class屬性地目的： 為讓同性質的element可以劃分在一起
故也常被JS的querySelector() 用於辨識element
若沒有要做變數操作 也可用.classname來設置樣式
此外一個element可以有多個class 方便分群管理element

<label for="guessField">Enter a guess: </label>
<input type="text" id="guessField" class="guessField">
label for="id"屬性 用於表示跟哪個input綁在一起
input type有多種樣式 "radio", "text", "submit"

guessField.focus() 表示在載入頁面時 自動將游標放入input
此時點擊鍵盤會觸發guessField的鍵盤事件(eventListener)

<input type="text" id="guessField" class="guessField" readonly>
加上readonly 可用JS控制來鎖定輸入

function setGameOver() {
  guessField.disabled = true; // 等同在<input>元素加上disabled屬性
  guessSubmit.disabled = true;
}
JS中極為重要：用於將部分element停用 以避免產生無法預期的問題

function resetGame() {
  var resetParas = document.querySelectorAll('.resultParas p');
  for (var i = 0 ; i < resetParas.length ; i++) {
    resetParas[i].textContent = '';
  }
}
其中'.resultParas p'表示在"resultParas" class屬性的node中找其中的p標籤的childNode
其選取規則與CSS選擇器相同


- - - ------------------------------------------------
# css_selector選擇器
CSS選擇規則：
最常用： 'tag_name' '.class_name' '#id_name'
亦可連用 "tag_name.class_name"即為找符合class_name的tag_name元素
同理 "tag_name#id_name" 找id=id_name的tag_name元素
而'.class1_name.class2_name'表示需要符合二想class_name的元素
也可用 'a[title]' , 'a[href="https://example.com"]' 找特定屬性的元素
前者找有title屬性的a 元素 而後者找href屬性為"https://example.com"的 a元素

id_name通常用在固定配件 永遠只會有一個元素 ex: container, send_text, send_btn等
大部分<input>元素都會用id_name以方便抓取
class_name則用於會動態生成的配件 ex: contaner內部的chat_dialog內容

'.resultParas p' 其中的" "為選擇其後代所有子節點
'.resultParas>p' 其中的">"為選擇其直接子節點

former_element + target_element { style properties } 相鄰兄弟選擇器
former_element ~ target_element { style properties } 通用兄弟選擇器
第一個元素用於表示其關係(former_element) selector只會選擇第二個元素(target_element)
"+"符合第一元素與第二元素相鄰時 "~"只要符合兩個元素在同一層即可

class與id最主要的差別：
id只會有一個且通常部會改變 class可以有多個較常經由JS的互動而改變(class="hide")

prompt(),alert()這種在window外層的method都盡量不用 風格已經被淘汰

- - --------------------------------
# css_priority優先權問題:

規則一：<h1 style="color: #ff0000;">主標題</h1>
直接在html標籤上的行內(inline)套用 順位優於 <link href="...">外部link引用

規則二：css選擇器優先順位： id>class>html_tag
即$("#id")>$(".classname")>$("tagname")

規則三：針對性越強其優先順位越高 因為表示排在越後面進行解析
div#test span { color: green; }
div span { color: blue; }
span { color: red; }
// 優先順位：green>blue>red 
// 解析時會先對<span>元素 後對<div>內部的<span>元素 再對<div id='test'>內部的<span>元素
// 前者的影響範圍會大於後者 即:div span{}只是span{}的一小部分

規則四：當其他條件相同時 後敘述比前敘述優先順位更高 
span { color: red; }
......
span { color: blue; }
而前敘述與後敘述指的是在CSS檔的前後位置

style="background:whitesmoke!important"
!important用於CSS中 為處理不同瀏覽器兼容性的問題(CSS hack)
若支持的browser會使該項屬性有更高的優先權(IE,GC) 但若不支持的browser則會自動忽略(FF,SF)
但因為會破壞CSS原先優先權的規則 導致程式維護不易
!important可覆蓋inline樣式 可用此規則來防止原先的CSS樣式被inline樣式覆蓋掉

- - - ------------------------------------------------
# js_jquery:
要使用jQuery 必須先在html中放入元素
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
1.用Google CDN載入
<script src="js/jquery-3.4.1.min.js"></script>
2.儲存在伺服器中載入

$('li.class_name') 即為jQuery對象
一般用於處理Ajax與element過場效果
同理也能使用:作為過濾篩選條件
$(“li:first”) 等同$(“li”).first() (jquery_fliter的舊版用法)
$(“li:even”)或$(“li:odd”) 即為偶數筆與奇數筆
$(“li:eq(n)”) 第n筆對象 初始為n=0
$("li:not(.intro)") 只扣除.intro該項

$(“li:contains(‘specific_text’)”) 找出內部文字節點中符合‘specific_text’之li元素
$(“ul:has(li)”) 找出子節點有li元素之ul元素

$("input[value^=aa]") 開頭符合aa之input元素
$("input[value$=aa]") 結尾符合aa之input元素
$("input[value*=aa]") 中間有aa之input元素
以上三者都是由$(“input[value!=aa]”)延伸而來

$("li").children()只為回傳下一層的子元素
$("li").find("ul")回傳所有符合的子元素 等同jquery的$("ul","li")

$("li").find("ul").filter(":nth-child(2n)") 可回傳符合條件的子元素
亦可用 filter()常配合inArray()一起使用
$.inArray 若index在index_list中則回傳所在位置 若不在index_list中則回傳-1
 $("li").find("ul").filter(function(index) { 
    return $.inArray(index, index_list) > -1; // 只要function回傳true即符合條件
}) 
 
$("li").find("ul").css("background-color","red")即為此元素添加css樣式
$("li").css({  // 若有多項則使用{}
  "font-style": "italic",
  "font-weight": "bolder"
})
$("li").find("ul").each(function(){...}) 遍及所有find()元素來做執行

$("ul").parent() 只為回傳上一層的父元素
$("ul").closest('div') 不一定是上一層 直到遇到符合條件的'一個'父元素為止
$("ul").parents('div') 回傳所有符合的父元素
由於有多元素 故如同find()一樣 可以使用each(function(){...})執行

$("ul:eq(0)").next() 或 $("ul:eq(1)").prev()
next()與prev()直接抓取同層的下一個與上一個元素

$.each(obj, function(key, val) {   若用$.each() 則第一參數可放入object, array等可遍及物件    
  alert(key);   
  alert(val);      
});   


css()除了放在eventHandler之外 
也可放於$(document).ready() 用以決定加載順序

JQuery中的$(document)與$(window):
$(document).ready(function(){...})和$(window).load(function(){...})之差異：
(其中$(window).load(function(){...})的原生寫法為：window.onload = function(){...})

$(window)為當前瀏覽器視窗 $(document)為此頁面整體DOM結構(包含視窗外的部分)
$(window).load()必須等待網頁內所有內容都下載完畢才執行
$(document).ready()則只要DOM結構下載完畢後即執行
因此$(document).ready()會快於$(window).load()

此外$(window).load()只能有一次 每次瀏覽器打開時便會執行
而$(document).ready()則可以有多次 並會依次序執行
此外$(window).load() 也可以將觸發事件掛在html : <div onload='showTime()'></div>

$("#textbox").hover(function{
  this.title = "Test";  //this為javascript用法 放於event中表示當前對象 
}
等同：
$("#textbox").hover(function(e){
  $(this).attr(’title’, ‘Test’);  //$(this)為jquery用法 好處是可調用jquery的方法
}
this是JS原生的DOM元素 不能調用jqery方法 
故用$(this)表示綁定的物件本身 e代表觸發事件的event物件


另外$(document).ready()可簡寫成$()： (因為此jquery物件太常被使用)
$(function(){
// Document is ready
});

有時為使用'$'字元: 可用jquery原始版本
(jQuery本身可作為方法使用：其方法的作用就是內部的參數都用jQuery取代 故最後結果會跟下面的匿名function相同)
jQuery(function($){
// Document is ready 且 can use '$' alias here
});

匿名方式的function表示此function只會在其中有效 不影響全局變數
且通常會用'a'取代'$' 以避免與外部的'$'搞混
(function(a) {
  a.fn.myFunction1 = function() {  //fn為function的意思 會將func.加到jquery的prototype上
    alert('hello world');
    return this;
  };
})(jQuery)  // 表示匿名函數的直接執行IIFE

$('#my_div').myFunction1();
皆在fn之後 表示對所有jQuery的物件都有效
如同其他jQuery的方法 可直接接在被jquery選擇的DOM節點上
this表示這個function($.fn.myFunction1) 在JS中function也是物件


**IIFEs(Immediately Invoked Functions Expressions)** 為建立函式即立即執行
var sayWelcomeIIFEs = (function(name) {
  console.log('Welcome ' + name);
})("Jason"); 在匿名函數後加上()即可
就如同sayWelcomeIIFEs() 也可以在()帶入參數

若用return:
var sayWelcomeIIFEs = (function(name) {
  return 'Welcome ' + name;
})("Jason");

此時: console.log(sayWelcomeIIFEs)不會顯示function_code
而是會直接回傳return的結果 因為此時為IIF 宣告即執行

另外匿名函數要直接執行 此時就可以藉由IIF的幫助 並在function外面加上()即可
(function(name) {
  return 'Welcome ' + name;
})("Jason");
亦等同:
(function(name) {
  return 'Welcome ' + name;
}("Jason"));   // 但較不常用

也可用單運算子(unary operator):
+function(name) {
  return 'Welcome ' + name;
}("Jason");  // 用unary operator可減少字元 可用'-', '!'替代

!function(){
  //常用於在js中添加GoogleAnalyticsObject元件
}(); 

- - - -----------------------------------
# unary_operator單運算子：
!:表示為not 常用於 !undefined 會轉成true
+:使變數轉成Number()型態 
-:也使變數轉成Number()型態 但會轉成負數
- - - -----------------------------------

(function(name,age,gender,job) {
  console.log('Welcome:' + name);
  console.log('his/her age is' + age); 
  console.log(gender+" "+job);
})("Jason",34); //或參數未在末尾設置 則變數為undefined 


JQuery的好用之處就在於他的便捷性
$("ul").text() 回傳中間的文本內容(textContent)
$("ul").empty()可以清除<ul>元素中所有的子元素

針對移出方式 jquery還分為:empty(), remove(), detach()三種：
remove()用於刪除自身元素 但可在DOM結構(JS檔)中用變數保留完整元素內容
empty()不刪除自身但會清空內部子元素 此時DOM結構就不會有內部子元素內容 
detach()幾乎等同remove() 但會保留綁定的事件 如果用remove()刪除則需要重新綁定事件




$("ul").append(content)表示直接插在子元素中的最後一個 可取代JS的appendChild()
$("ul").append(content).scrollTop($("ul").prop('scrollHeight')); // 滾軸移動到$("ul")的下方
$("ul").append() 會回傳子節點 故後面可以繼續執行

$('.dialog_box').appendTo($('.container')) 將該元素插在父元素內部的最後一個
差別在於append()是父元素調用 而appendTo()是子元素調用 

$("ul").prepend(first)會直接插在子元素中的第一個 
$('.first').prependTo($('.container')) 插在父元素內部的第一個

$(".dialog_box").before("<p>Test</p>") 在所有.dialog_box元素的前一行插入
$(".dialog_box").before($('.test')) 同理也可用於插入jquery的元件
after()用法完全與before()相同

- - - -----------------------------
# js_animation 動畫

css()對於動畫定格非常有幫助：觸發事件後可將動畫刪除 只取屬性值來使用
var boxElmtBg = boxElmt.css("background")
boxElmt.css("background","red")
可用boxElmt.css("background","") 將屬性值刪除

$(”body“).animate():
要做互動性網頁時必須加上動畫才不會顯得太突兀
$("#right").click(function () {
  $(".block").animate({ left: ' 50px' }, "slow"); // keyframe 一個關鍵幀 表示只作為過渡動畫
  $("body").animate({ scrollTop: 0 }, 600);
}); 
第一參數放css 用以表示動畫目的的樣式
第二參數為動畫速度"slow","normal","fast" 或 可用動畫時長(秒) 1000

animate()的其他options:
{
  delay:1000, //開始動畫前的延遲時間
  easing:"linear", // 數值變動的速率 easing transitions 指的是動畫快結束時用於做緩衝的方式
  step: function(){}, // 每一次迭代完成後要執行的函數
  complete: function(){}, // 全部完成後要執行的函數 只要涉及非同步幾乎都會有callback參數
  dirention:'normal' //每次迭代時動畫重複播放的方式
  fill-mode:'forwards' //動畫全部結束時會停在最後的狀態
}
easing屬性:
Cubic Bezier又稱貝茲曲線 用於設計前端動畫的變動數率 
函數：cubic-bezier(p1x, p1y, p2x, p2y)
(p1x, p1y)和(p2x, p2y)分別用於決定 起始點 和 終點 的斜率與斜率變化速度
'linear'為預設 放在t-x圖上就是斜率固定且由0到1的直線 又稱為零階貝茲曲線cubic-bezier(0, 0, 1, 1)
'ease'= cubic-bezier(0.25, 0.1, 0.25, 1) 快速開始 而圓滑結束
'ease-in' = cubic-bezier(0.42, 0, 1, 1) 讓起始點的動畫進場更圓滑 終點不變
'ease-out' = cubic-bezier(0, 0, 0.58, 1) 反之只處理終點 而起始點不變
'ease-in-out' = cubic-bezier(0.42, 0, 0.58, 1) 最常被使用 起始點跟終點都圓滑處理

除了用cubic-bezier()函數做圓滑效果 亦可用step()階梯函數做彈跳效果
step(3,start) 一開始就移動 最後一次移動後有停滯時間
step(3,end) 一開始有停滯時間 最後一次移動完就結束 
'step-start' = steps(1, start) 
'step-end' = steps(1, end)

dirention屬性:
normal 每次迭代都正常播放  reverse 每次迭代都反向播放
alternate 正向撥放後再反向播放  alternate-reverse 反向撥放後再正向播放


可用$('html,body').scrollTop() 和$('html,body').scrollLeft()做滾軸移動
此時必須在內部加上參數:scrollTop(0) scrollLeft(0) //最上層與最左端為0
此外:scrollTop本身也是css的屬性 可直接放入animate({})中
不加參數時為取值:$(window).scrollTop() 常用於找目前視窗$('window')的相對於$('body')的位置

相互牴觸inconsistency:
$('body').animate({})會有不同瀏覽器不支援的問題(相互性問題interchangeability)
使用$('html,body')取代$('body') 是為了讓firefox和chrome都能夠支援

常用於animate()的變數：
var winTop = $(window).scrollTop();  //獲取當前視窗距離頂端$(body)的距離
var objTop = $("#obj1").offset().top; //獲取當前物件的x座標


~css_animation ~css_transition: 不同於js 可直接由css實現動畫效果
jquery的animate()不能用transform屬性 只有transition才行 因此css動畫更實用

針對一次性的轉場應使用css 而需對動畫過程做追蹤或存在較高互動性的動畫則使用js
搭配css的animation和transition兩個屬性： animation是持續進行的動畫 transition則為過渡到另一配置

使用2個class_name的元素通常是指含有動畫：前者為此元素 後者為加上的動畫
事件觸發後元素加上class='horizTranslate' 此時若有transition屬性 則會有過渡動畫效果
.box.horizTranslate {  
  -webkit-transition: 3s;
  -moz-transition: 3s;
  -ms-transition: 3s;
  -o-transition: 3s;
  transition: 3s;  // transiton和animation都存在相容性問題
  margin-left: 50% !important;
}
.box.set_background{
  background: black;
  transition: background 0.3s linear;  // 也可指定css屬性
}

.heart{
  transform: scale(1);
  transition: all 1s;  //不指定屬性 表示所有css屬性都要符合才會停止動畫
}
.heart::before,
.heart::after { 
  transform: rotate(-45deg); // 依據 transform-origin做旋轉rotate()或做縮放scale()
  transform-origin: 0 100%; // 等同transform-origin:top right
}
用偽元素before,after其目的是讓原元素heart的內部子元素與屬性不會隨動畫而改變
偽元素就等同是內部為空的原元素heart


transform屬性：必須配合keyframes才能以迭代來完成動畫
可用於在瀏覽器視窗內設計3d元素 但前提是元素必須放在transform-style:3d的父元素內部
<div class="camera"> // camera用perspective-origin和perspective決定3d空間的架設位置
    <div class="space"> // space用transform-style決定2d空間或3d空間
        <div class="box"></div> // box在3d空間時z軸才有意義
    </div>
</div>

transform-origin屬性 用以表示旋轉的pivot點
transform-origin: center; 正中心
transform-origin: top left; 元素的左上方作為旋轉點 等同0% 0%

早期html沒有flexbox時 可用transform屬性達到視窗置中
.center-panel {  
     position:absolute;
     left: 50%;  // left只能將子元素的左上點移到正中央 但子元素並沒有置中  
     transform: translateX(-50%);  // 再依據子元素的寬度做調整 往左移動
}

.heart.animated { // 動畫相關屬性與jquery.animate()的options相同
  animation: 1600ms pulsate infinite alternate ease-in-out;
}
@keyframes pulsate {  // 加入關鍵幀keyframes 可用百分比或from-to來插入css屬性 
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
@keyframes backgroundChange{
	from {background: black;}
  to {background: white;}
}
#circle {  // animation其下子屬性 皆以'-'來表示
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-name:"rotate";
  animation-iteration-count: infinite; 
}

在js中當物件執行動畫時可用eventhandler來觸發事件：
animationend 動畫全部結束
animationstart 動畫開始時
animationiteration 動畫每次迭代開始時

transitionend 過渡動畫結束
transitionstart 過渡動畫開始時
transitionrun 過渡動畫被添加於物件時(有時動畫不會馬上執行)
transitioncancel 過渡動畫被取消時


jquery的物件距離用法:
position()：與「父元素」的相對位置
offset()：與「最外層文件＄(body)」的絕對位置

$('body')會有整個網頁的長寬尺寸 $(window)只有當前瀏覽器視窗的長寬尺寸
$('body')會大於$(window)很多 因此才有了滾軸scroll

$(window).scroll(function(){  //$(window).scroll()為處理瀏覽器的"scroll"事件監聽器
    last=$("body").height()-$(window).height() +50 // 50px作為預留空間
    ($(window).scrollTop()>=last) && $(".down").hide() 
}) 
即只要滾軸滾到下面時($(window).scrollTop()>=last)) 就會把$(".down")做隱藏


**jQuery有attr()和prop()之分：**
前者用於原生html的屬性值:只能是字串 後者用於DOM的屬性值(寫在JS中的元素):可為任何變數型態
$("ul li:eq(0)").attr("title") 返回屬性值value
$("ul li:eq(0)").attr("title",function(){ return this.name});
可直接放入function來返回屬性值
$("ul li:eq(0)").attr({title:"主題名",name:"對象名"});
或是用{}對象形式 一次修改多個屬性

prop()則較常用於只有屬性名而無屬性值的元素 會回傳true,false
但因為是bool值而非字串 故並不適合用attr()
<input class='form-control' id='send-img' type='file' name='send-img' multiple>
$("ul li:eq(0)").prop("multiple") 會回傳true

由於常見的class屬性有多個 因而延伸出addClass()和removeClass():
如此就不需用attr('class','d-none')導致取代掉原先的class屬性值

**JSON(JavaScript Object Notation):** 
即將JS的物件轉換成字串形式以利於傳輸 故使用時在做轉換
JSON.stringify() 將物件變JSON格式
JSON.parse() 將JSON變回物件

一般的JS物件：
var me = { name:"Jason" }  
JSON格式:  (JSON本來就是由dict變成的字串 key由前端傳到後端時會自動變為字串)
'"name":"Jason"'

- - - ------------------------------------
# js_jquery_ajax非同步:
ajax範例：(非同步方法)
$.ajax({  // 由ajax送出request 如此就不需頁面重整
  'url': '/chatroom/save_chat_log/',
  'type': 'post',  //常用'get'或'post'
  'data': {    //需要傳輸的資料
    'chat_content': input_info,
    'user_id': user_id,
    'user_name': user_name,
    'user_ip': '127.127.127.127',
    'csrfmiddlewaretoken': csrf_value
  },
  'async': false,  //是否先往下執行$.ajax()下面的程式
  'success': function(res){  //成功時執行
    console.log(res)
  },
  'error': function(err){  //失敗時執行
    console.log(err)
  }
});

瀏覽器需支援xhr(XMLHttpRequest):
$.ajax()會返回jqxhr物件 可用於加上done(), fail(), always()來進行非同步方法
var jqxhr = $.ajax("example.php")  // 單一參數為url
  .done(function(){
    alert( "success" );
  })

若要引用jqXHR參數則其先後位置為： 最後會回傳jqXHR是為了可以做'重傳'動作
jqXHR.done(function(data, textStatus, jqXHR){...})
jqXHR.fail(function(jqXHR, textStatus, errorThrown){...})
jqXHR.always(function(data|jqXHR, textStatus, jqXHR|errorThrown){...}) // always()依據成功與否而有不同的參數

textStatus的可能值為：null, "timeout", "error", "abort", "parsererror" 五種
當最後觸發done時 textStatus只會回傳null 

而client端本身觸發fail (與server或網路無關):
if (textStatus === 'abort') {
    alert(errorThrown + ': File Upload has been canceled'); 
}//errorThrown則為error的文字敘述 ex: "Not Found" 或 "Internal Server Error."

$('button.cancel').on('click', function (e) {  // 用於取消上傳
    jqXHR.abort();
});

jqXHR.done(function(){}).fail(function(){}).always(function(){}) 
可以將多個callback function bind寫在一起

用ajax傳送media檔案：
<input id='upload-photo-input' name="img_file" type="file" multiple>
<input>元素必須有type='file' 而multiple=true為充許一次傳送多份檔案

ajax上傳的表單資料可使用FormData物件
if ("FormData" in window) // 用於確認瀏覽器是否支援FormData
(如果不支援FormData ：則要改用JS自動生成<form>元素 以及內部的<input>和<iframe>元素 非常麻煩！)

var data = new FormData(); // 等同<form>元素內部各項<input>的鍵值對

formData.append(name, value); // 添加鍵值對
formData.delete(name); // 刪除鍵值對
formData.get(name); // 讀取單項的鍵值value
for(var pair of formData.entries()) {
   console.log(pair[0]+ ', '+ pair[1]); // 用於同時讀取key (pair[0]) 和 value (pair[1])
}
另有formData.values()和formData.keys() // 分別返回可迭代的array 同理可用for-of取值

$.each($('#form').serializeArray(), function(a, t) {  // 或用serializeArray()轉為可迭代array
  formData.append(t.name, t.value)
}

其中serializeArray()和serialize()都是jquery物件$('#form')的方法
但是append(),delete()...等則是JS原生物件FormData()的方法 兩者不能混用

FileReader物件唯一目的為讀取用戶上傳的檔案內容 使用事件來傳遞數據以減少從記憶體讀取的時間
可用File物件或Blob物件來指定需讀取的資料 Flie繼承自Blob
取得File物件的方式：
<input type='file'>回傳的FileList物件 和 拖移事件產生的DataTransfer物件

<input type="file" name="file_img" id="file_img">
<img id="imageView">

var file = $('input[type=file]').files[0] // 直接用css selector抓取的就是FileList物件

var fileReader = new FileReader();
fileReader.readAsDataURL(file)
var imageView = $('#imageView');  // 讓fileReader讀取的檔案可顯示在<img>上
fileReader.bind("load", function(event) { // 'load'讀取完成後觸發
  imageView.src = this.result;  //用戶上傳的圖片可直接在UI上顯示
});
reader.result表示成功讀取的結果  reader.error為失敗所引發的error

不使用fileReader的情況下：
$('#file_img').bind('change', function(e) {  //只要有change上傳檔案就會觸發
  var file = e.target.files[0]  //獲取全為blob物件的陣列(FileList物件)
  imageView.src = URL.createObjectURL(file) //此時的URL為本地端的記憶體位置
})

此時會用Blob物件型態儲存在記憶體位置中（Binary Large Object)
blob物件只會用於存放多媒體檔案 屬於二進位數據
byte_string:是已經把string變數轉成二進位編碼形式 其目的是為了方便傳輸多媒體檔案
英文字母只用1byte 中文字則用3bytes 
1byte等同8bits 亦可用2個16進位數字表示(C語言:0x5A)

除了用本地端的記憶體位置之外 也可用FileReader()處理：
const reader = new FileReader()
reader.readAsDataURL(blob) // 轉換成編碼為base64的DataURL 其用法等同URL.createObjectURL(file) 常用於讀取圖檔
reader.readAsText(blob [, encoding]) /// 轉換成預設為UTF-8的文本字串 常用於讀取文檔
reader.readAsArrayBuffer(blob) // 直接將二進位數據的裝在ArrayBuffer


DataTransfer只有setData(format, data)和getData(format)兩個方法：
DataTransfer由DragEvent物件自動生成 不能單獨創建
draggable和droppable:
draggable可拖曳元素 用於拖曳至一個 droppable可放置元素上

$('#draggable').bind("dragstart",function(e){  //在事件觸發後自動生成e.dataTransfer
	e.dataTransfer.setData('text/plain', 'This text may be dragged')
  dragTemp = e.target // draggable物件
})
$('#draggable').bind("drop",function(e){
  let dragText = e.dataTransfer.getData('text/plain') //setData與getData分別在不同的event中 以此傳遞資料
  dragTemp.append(dragText) // 將getData()的資料附在draggable物件上
  e.target.style.color="#fff"
})

drag事件由可拖曳元素綁定 drop事件則由可放置元素綁定
而dragstart, dragend同樣由可拖曳元素綁定
但dragover, dragenter, dragleave則改由可放置元素綁定(用於表示經過這此元素)

$.ajax({
    url: '/photo',
    type: 'POST',
    data: data,
    dataType:'json', // 預期從server端接收到的資料型態
    headers: {
        'X-CSRFToken': csrftoken
    },
    contentType:!1,  //required 預期送到server端的資料型態  
    processData:!1,  //required 不會將傳送的資料轉成字串
})
contentType 用 !1 取代 "multipart/form-data" 
其原因為 "multipart/form-data" 只適合直接寫在html的<form>POST請求 
其為符合多項<input>的表單 因此不同input資料之間會有boundary 


通常與$.ajax()一同出現的非同步方法：
~Deferred Object 為jquery專用於處理非同步問題的物件 
dfd = new $.Deferred 創建Deferred物件
dfd物件僅用於dfd.resolve()和dfd.reject()兩種方法的辨識:
當因為eventhandler觸發此兩種方法時 就會再執行dfd的done(), fail(), always()三種情況的事件

非同步事件永遠在處理需要耗時等待的方法：
因為不知道何時會執行完畢 故先寫各種執行完畢之狀況所要觸發的事件 以此來達到跳脫原先執行緒的非同步目的

dfd.state() 可看目前線程的狀況 分為三種state:
"Pending" 處理中, "Resolve"處理成功, "Reject"處理失敗

dfd.promise():
返回一個與Deffered物件對應的Promise物件 (也是jquery的物件 不是JS原生的Promise物件)
與Deffered基本無差異 但其resolve(),reject()等影響結果的方法不能再調用 等同是將其視為private method

$.when(dfd1,dfd2...) 可讓多個Deffered物件 能有共用的非同步事件 
var d1 = $.Deferred();
var d2 = $.Deferred();
$.when(d1,d2).done(function (v1, v2) {  // 必須等d1.done()和d2.done()都執行完後才會執行when(d1,d2)
  console.log(v1); // v1 is [1, 2, 3, 4, 5]
  console.log(v2); // v2 is "abc"
});


非同步方法的success和error:
dfd.done(function() {   
    alert('it is success');
});
dfd.fail(function(msg) {
    alert('it is'+msg);
});   
dfd.always()(function(){
    alert('it is over');
});
done(), fail()用來表示成功或失敗時所執行的方法 always()則無論如何都會出現
而如何定義成功或失敗 則需要靠resolve()和reject() 
 
$('button.success').on('click', function() {
  dfd.resolve();
});
$('button.fail').on('click', function() {
  dfd.reject('failed');  // resolve()和reject()最多可以引入一個參數 作為傳遞訊息
});
只要執行到dfd.resolve()或dfd.reject() 即代表線程結束
只後會依據成功或失敗來執行done()或fail()

done(), fail()可用then()合併:
dfd.then(  // 第一參數為doneCallback, 為第二參數failCallback
  function() {  
    alert('it is success');
  }, function(msg) {
    alert('it is'+msg);
  }
);

Deffered物件更具靈活性:
$.ajax({
    url: 'test',
    success: function(dataFromResponse) {
        console.log('request success!');
    }
    error: function(XMLHttpRequest, textStatus){
        console.log('request failed');
    }
    complete:function(XMLHttpRequest, textStatus){
        // 無論請求失敗或成功最後都會觸發
    }
});
ajax的success為執行成功後所執行的函式 可改用dfd.done()來觸發
同理ajax的error則可用dfd.fail()觸發

var dfd = $.ajax('test');  //$.ajax() 本身就可以用Deffered物件的方法
dfd.done( function() {
    console.log('request success! in function1');
});
dfd.done( function() {
    console.log('request success! in function2');
});
如此一來就將原先的success分成不同的函式來寫 可依據情況需求改變success回傳的函式


- - -----------------------------------
# js_其他第三方:

## bootbox.js 
用於對話視窗 (需先引用bootstrap)
基於bootstrap開發 可使用程式來設計對話視窗(可加上callback function) 
常見的模式分為三種： (bootbox都是基於JS的原生對話框做插件)
window.alert() 只有一個"確定"按鍵
window.prompt() 會有input輸入欄 因此最後會回傳string值
windiw.confirm() 有"確認","取消"兩按鍵 因此最後會回傳bool值

bootbox.setDefaults("locale", "zh_TW") // setDefaults()可作相關設定

var bootbox_msg = {
  title: "提示",
  message: "這是一個確認按鈕的樣式！",
  buttons: {  //confirm()必須含有buttons:
    confirm: {label: 'Yes', className: 'btn-success'},
    cancel: {label: 'No', className: 'btn-danger'}
  }
  callback:function (r) {  //confirm()會回傳一個bool值給callback
    console.log('這是回撥函式來確認最終結果: ' + r); 
  }
  onEscape: function() {  //若滑鼠點擊bootbox之外的部分 或鍵盤點擊esc鍵
    bootBoxLock.val = !1
  }
}
bootbox.confirm(bootbox_msg);  // 直接引用物件形式
bootbox.confirm("這是一個確認按鈕的樣式！", function (r) {
    console.log('這是回撥函式來確認最終結果: ' + r);
});  // 或改引用二個參數

bootbox.prompt({
  title: "這是一個帶有密碼輸入的提示！",
  inputType: 'password',  // prompt()必須含有inputType:
  callback: function (r) {  //prompt()會回傳一個string值給callback
    console.log(r);}});


## jquery-ui.js 
同樣建立在JQuery之上 (x-editable)
用於生成常見widget 通常用於改善原生的<input>這類的輸入項

<input type="text" name="date" id="date" />
$("#date").datepicker();  // 生成widget日期選擇器
$("#skin-colorpicker").colorpicker(); // 同理生成widget顏色選擇器

## jquery.mCustomScrollbar.js (必須引用jquery-ui)
<nav class='mCustomScrollbar'>  // 可針對滑對scroll添加觸屏事件 設定touch-action屬性
  <div class='mCustomScrollBox'>...<div>  // 關鍵在於使用jqueryUI來做滾軸 故overflow:hidden 
</nav>

## jquery.gritter.js
JQuery.Gritter為建立在JQuery之上 專用於處理彈出框的輕量函式庫

$.gritter.add({  //簡單的通知
    title: 'This is a notice!',  //the heading of the notification
    text: 'This will fade out after a certain amount of time.'  //the text inside the notification
});
時常與X-editable連用 
(on_error和on_seccess的callback function 為 ace-editable.js的自定義內容)

當上傳不合適內容時 觸發on_error: function(e){...}的各種狀況
可用t = $.gritter.add({...})彈出框做警告 並用$.gritter.remove(t)做取消

而最後成功傳送後 觸發on_success: function(e){...} 
並以a.gritter.removeAll()取消所有之前所建立的彈出框

## bootstrap-editable.js(X-editable) 
可直接在JS設定 原本html字串可點擊來生成超連結 出現彈出框讓使用者直接做編輯

(X-editable除了bootstrap之外 也有jqueryUI版本 所用的css/js不同)
data-*為html5的新命名標籤 可供X-editable使用
<a href="#" id="username" data-type="text" data-title="使用者名稱" 
data-url="https://jsonplaceholder.typicode.com/posts" data-value＝"你的名字">自訂內容</a>
X-editable的主要目的：讓使用者直接更改textContent("自訂內容")

$(function () {
  $('#username').editable({  //如果不放在<a data-*="">中 也可放於editable({...}) 同理也可以用在$.ajax({...})中
    type:'text',
    title:"使用者名稱",
    url:"https://jsonplaceholder.typicode.com/posts", //data-url用於傳送至server端的位置
    name='username',
    value＝"你的名字",  //可用於作為預設值

    success:function(a,t){}  // 修改完成後的callback function
  });
});

(function($){
  $.fn.editable.defaults.mode = 'inline'  //inline會直接在text位置修正 預設為'popup'會有彈出框
  $.fn.editable.defaults.emptytext = '點我加入資料';  // 預設為'Empty'
  $.fn.editableform.loading = "<div class='editableform-loading'>...........</div>"  //自行設置loading樣式
  $.fn.editableform.buttons = "<button type="submit" class="editable-submit">ok</button><button type="button" class="editable-cancel">cancel</button>"
  // editableform.buttons同理 可以由原先的模板做修改

})(jQuery);

data-type可選擇X-editable內建的表單元件
其中data-type="text"最常用 可自行修改內容 data-type="select"只能選擇已設定好的選項


## jquery.fileupload.js 用於傳輸多媒體檔案
支援多檔案上傳, 支援拖放功能, 中途可撤銷上傳 ,縮圖預覽等

fileupload.js使用jQuery.ajax()為基底 
且即使瀏覽器不支援XHR 也能用IframeTransport方法替代
processData, contentType 和 cache三項options皆為False 以方便檔案傳輸

<input type="file" class="hide" id="upload-photo-input" name="img_file" data-url="upload/photo_nocrop">
需要使用到jquery-ui.js和jquery.iframe-transport.js

$(function() {  // 用法即為eventHandler 直接綁定(binding)即可 
    $("#upload-photo-input").fileupload({  // 用fileupload({...})做綁定
      url:'/photo',
      type:'POST',
      dataType: "json",
      done: function(e, data) {  // done:為完成請求並要到server回傳的response後執行
        if(data.result.sta) {
          $(".preview").html("<img src="+data.result.previewSrc+">");  //用於上傳成功後的縮圖預覽
        }else{
          $(".upstatus").html("<span style='color:red;'>"+data.result.msg+"</span>"); //用於上傳失敗後的訊息顯示
        }
      },  
      fail: function(e,data){} //上傳請求失敗後觸發

      always:function(e, data) {} // 當全部上傳成功或失敗都會觸發 (只有一次)
      processalways:function(e, data) {}  // 當一個單獨檔案處理成功或失敗後觸發 (可能很多次)
      (process做前綴 都表示特別針對單一檔案)

      progressall:function(e, data) {}  // 全域性上傳處理事件觸發(用於進度條顯示)
    }) 
    
    fileupload之option項的done,fail,always 等同於ajax之option項的success, error, complete
    相關參數與$.ajax()類似： ($.ajax()會回傳jqXHR物件)
    jqXHR.done(function(data, textStatus, jqXHR){...})
    可用data.result, data.textStatus, data.jqXHR 來使用以上參數
    jqXHR.fail(function(jqXHR, textStatus, errorThrown){...})
    可用data.errorThrown, data.textStatus, data.jqXHR 來取用

    //也可以將綁定的callback function寫在外面
    $('#fileupload').bind('fileuploaddone', function (e, data) {...}); // 參數e為事件對象event
})

$("#upload-photo-input").fileupload(  // 第一參數'option' 可用於作為setter
    'option','url','/path/to/upload/handler.json'  // 用於修改其中一項option
);
var dropZone = $('#fileupload').fileupload(  // 同理 第一參數'option' 也可作為getter
    'option','dropZone'
);

$('#fileupload').fileupload('destroy') // 第一參數'destroy' 表示解除eventhandler
$('#fileupload').fileupload('disable')
$('#fileupload').fileupload('enable')  // 'disable', 'enable' 表示短暫關閉與事後再開啟


$("#upload-photo-input").fileupload(  // 只要綁定fileupload就能支援拖放功能, 多檔案上傳, 中途撤銷上傳等
  dataType: "json",
  done: function(e, data) {},

})

- - -----------------------------------
## bootstrap_plugin其餘插件：
bootstrap-table.js與bootstrap-table.css (常會與bootstrap-editable連用)
不同於bootstrap只有樣式 bootstrap-table可使用表單的標準功能 新增,修改,刪除,查詢......


- - ------------------------------------
## jquery plugin其餘插件：
Livestamp.js 用於自動更新帶有時間戳的html元素(timestamped) 常用於聊天室
moment.js 可使用格式化時間, 相對時間, 日曆時間等 (Livestamp.js必須使用此插件)
(moment-with-locales.js附屬於moment.js 讓日期不僅可用英文 可轉換成多國語言)

- - -----------------------------------
# js_eventlistener(eventhandler):
BOM(Browser Object Model,瀏覽器物件模型) 與瀏覽器相關 且 與網頁內容無關 已被W3C規範成HTML5 核心為window
DOM(Document Object Model,文件物件模型) 與網頁內容相關 核心為document
視窗viewport放大縮小只影響BOM而不影響DOM DOM內容在傳到client時就已經固定
兩者的差異:可用$(document).ready(function(){...})和$(window).load(function(){...})來說明

eventlistener通常在$(document).ready階段完成綁定
故可將多個方法做成模組寫成bind()方法 並在$(document).ready(function(){...bind(),...})中執行 

document.addEventListener("DOMContentLoaded", function(){  // 參數只能放入document的事件 ex:"readystatechange"
});

window.addEventListener("load", function() {  // 參數只能放入window的事件 ex:"resize"
});
如此可以確保在執行JS時 已經有所有DOM結構對象
"DOMContentLoaded"為只有完整結構但沒有外部資源 "Load"為有所有資源
另有"beforeunload"在網頁卸載之前觸發 "unload"在網頁卸載之後觸發

document.addEventListener("click",function(){
});
除了"click"與"dblclick"之外 其他常見滑鼠相關事件：
"mousedown" & "mouseup"：前為按下按鈕時觸發 後為放開按鈕時觸發
'touchstart' & 'touchend'：觸控螢幕上的按下按鈕與放開按鈕

"mouseenter" & "mousemove" & "mouseleave" ：
依序為移入某元素區域時觸發 在元素區域內移動時觸發 離開元素區域時觸發
'contextmenu':由右鍵點擊觸發 常使用event.preventDefault()來防止目錄在網頁上出現

"keydown" & "keyup" : 會捕捉所有按鍵的輸出 而因按鍵相同故不區分'A'與'a'大小寫(都是'65')
"keypress" : 不針對按鍵 而是捕捉按鍵所產生的字元 因此會區分'A'與'a'大小寫('A':65 'a':97)

"input" & "change" & "submit": 
依序為填寫表單時觸發 填寫表單完後觸發 填寫表單完並送出時觸發

"focus" & "blur": 元素被聚焦時觸發 元素失去聚焦時觸發
當focus觸發也表示另一元素會執行blur 兩者會同時在不同元素上執行
若互動元素疊加時要注意：子元素focus也就表示父元素blur 

tab時只會觸發：focus
點擊時的觸發順序為：mousedown > focus > mouseup > click
click的觸發為一組mousedown和mouseup組成 
如果mousedown後移開則不會觸發click 但若mousedown後移開再移回來做mouseup則仍觸發click

elmt.focus(function() {  //也因此可以藉由元素的觸發順序來判斷使用者習慣
    if ($(this).data('mousedown')) {
        console.log('You clicked it!');
    } else {
        console.log('You tabbed it!');
    }
});
elmt.mousedown(function() {
    $(this).data('mousedown', true); //用.data()來作為元素儲存記錄的方式 可用於不同function之間的訊息傳遞
});
elmt.blur(function() {
    $(this).data('mousedown', false);  
});


JS_eventListener簡易寫法:
function bgChange(e){
  e.target...
}

.val()則返回該元素的value屬性值 通常只用在輸入項
$("input:text").val()

btn.addEventListener('click', bgChange);

封裝打包之意：
即是讓外部使用者只能使用 而不知道內容實際的操作

可以用事件對象e(或稱event, evt) 其中e.target即為指向btn本身
form.onsubmit = function(e){
  e.preventDefault();
}
等同:
form.onsubmit = e =>{    // 同理 若不使用任何參數則改為()=>{}
  e.preventDefault();
}
其中e.preventDefault()即停止元素本身預設的動作
在<form>用於停止表單提交 在<a>用於停止跳轉網頁 在<input>可用於篩檢不符合規則的內容

if (e.which == 13) 為enter鍵 最常用
$(".mytext").trigger({type: 'keydown', which: 13, keyCode: 13})
會與trigger()合用 即不用等到user觸發事件 可用trigger()直接觸發
firefox不支援e.keyCode 但取而代之的有e.which
故可用 if (event.keyCode|| event.which == 13) 以避免相容問題
keycode 32 = space 空白鍵
keycode 65 = a A (英文字母A~Z:65~90)
keycode 8 = BackSpace
keycode 9 = Tab
keycode 16 =shift
keycode 37 = Left Arrow
keycode 38 = Up Arrow
keycode 39 = Right Arrow
keycode 40 = Down Arrow

trigger()的另一個用途可用於自定義事件名稱：
$('#foo').bind('update', function(){ // "update"事件
    console.log("I'm updated.");
});
$('#foo').trigger('update');

bind()對於後生成的元素無法綁定 此時可用deleate()代替：
deleate()為父元素的方法 用於綁定子元素的事件
$('#root').delegate('a', 'click', function(){  // 'a'是'#root'的子元素 
    console.log('clicked');
});
bind()與deleate()都由on()而來 可用on()來實現兩者
亦可直接用on()/off()代替bind()/unbind()

當點擊子節點時 父節點同時也會被點擊
此時當兩個節點綁的是不同的事件處理器時 就會發生問題
event bubbling 與 event capture用來表示父節點或子節點誰先誰後被啟用
useCapture=false為event bubbling(預設) 而useCapture=true為event capture
幾乎全部的瀏覽器都用event bubbling機制：表示最內層的子節點會先啟用 再到外層的父節點啟用

video.onclick = function(e) {
  // code ...... 
  e.stopPropagation();  //會放在主程式的下面來防止事件冒泡
};
加上e.stopPropagation() 可防止bubbling機制繼續傳播
e.stopImmediatePropagation()則是除了使bubbling停止傳播外 連同層的其他同類型元素都會停止
另外只有html將可觸發子元素疊在可觸發父元素時才需要而外設置stopPropagation()

另外return false 等價於 event.preventDefault() + event.stopPropagation()
因此常用於eventhandler

多型(polymorphism)可分為為兩種：多載(overloading)與複寫(overriding)
overloading為相同函式可傳入不同類型或不同數量的參數
overriding為相同函式因為繼承的子類別不同 而可以存在不同的函式操作

var request = new XMLHttpRequest();
request.open('GET', 'https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');
使用XMLHttpRequest()是為了做async非同步請求 目前該方法已成為標配
此為JS的請求方法可以取代傳統的html的<form>元素

request.responseType = 'json';
request.send();
設置responseType後 可以將response鎖定在json對象

也可以用：
request.responseType = 'text';
request.send();
jsonObj = JSON.parse(request.response);
即返回字串再轉成json形式：
因為不是所有的網站都能取得想要的json 此時先取text會方便許多

JSON.stringify(jsonObj) 與JSON.parse()反向
將jsonObj轉成字串形式

var data = {
  "ret":0,
  "name":'Jason'
}
HttpResponse(json.dumps(data)) 等同JsonResponse(data)
直接用JsonResponse()就是內建JSON格式轉換
JS中所有的物件都是dict的形式 設計上就是為了易於傳輸

request.onload = function() {
  var superHeroes = request.response;
  function(superHeroes);
}
回傳時用onload事件：讓該方法只有在請求成功時才會觸發
request.response 為其response對象
另外： 直接用function() {} 也稱為匿名函數
也就是函數本身沒有名字 只會在此使用一次


<select id="weather">
  <option value="">--Make a choice--</option>
  <option value="sunny">Sunny</option>
  <option value="rainy">Rainy</option>
</select>
select tag用法：html的選取滾軸

Canvas APIs:
ctx.beginPath(), ctx.arc(), ctx.fill() 常見API 用於作畫

ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
ctx.fillRect(0, 0, width, height);
fillStyle設置畫布顏色 與 fillRect()用於生成新的畫布
如此就能蓋住之前的視圖 因而產生動畫效果

btn.onclick = displayMessage;
btn.onclick = displayMessage();
前者才是對的：因為只是把function指派給onclick事件 與之前使用匿名函數相同
後者會有問題：會直接調用function 而非onclick事件觸發

但前者不能代參數 故需要用匿名函數幫忙
btn.onclick = function() {
  displayMessage('Woo, this is a different message!');
};

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
常用：意即 画布元素的宽和高 給定 浏览器的宽和高 且 設置全域變數

requestAnimationFrame(function);
每隔一小段时间都会运行一次这个函数

function 最後可用void替代return:
使用void表示最後回傳undefined的結果 也就等同是預期不回傳任何資料
void console.log('HI!');

另外：JS的 void function 不同於其他語言的定義 此時表示function為undefined 即不能被調用
void function saySomething (msg) {
  console.log(msg);
} ('Hello');
saySomething('Hi'); //saySomething is not defined 會發生錯誤

- - ----------------------------------
# js_concise(便捷性):

void 0 != t 
void 0為undefined (實際上void "anything"都為undefined 只是void 0最常用)
此段若t不是undefined 則回傳true 反之若t還沒有定義 則回傳false (t==undefined)

用來省略if{if{if...}}巢狀結構(JS便捷性)：
null != t && void 0 != t && (...)
常用來表示t不是null也不是undifined時 才繼續執行(...)

null != t && void 0 != t || (...)
若t不是null也不是undifined時 則前面為true 後面不需要執行(...) 
||取代&& 用來表示if not(){...}

'undifined'表示此變數未宣告就直接調用 稱為hoisting (可以未宣告就賦值但不可直接調用)
'undifined'的用途為在參數不齊時 其餘參數皆為'undifined'
function foo(a,t,e){
  void 0==t&&void 0==e&&console.log('send:'＋a)
}
foo(a) // t,e此時都為'undifined' 
var a = {
  name:'jason'
}
console.log(a.age) // 屬性為定義也為'undifined'

null的用途：null是一種物件 即(typeof null)為object
var a = null 常用來代表空物件 
因為已經賦值過的變數不可能再變為'undifined' 此時就用null表示刪除物件內的內容但繼續沿用此變數

知道此規則後便能用&&做簡寫(JS非常講究便捷性minified code 因此出現這種寫法)
return void 0 === i && (i = 1), 0 === i ? (..A..) : (..B..)
comparison與assignment寫在一起 此時表示若前者為true(i==undefined) 則i=1 並最後return (..B..)
若前者為false(i!=undefined) 則直接略過後方的assignment 並最後也是return (..B..)
JS中普遍會把comparison中的變數移到右邊 其目的是為與宣告或賦值(var i=0)做區分
return 後面出現的',' 也只是為了便捷性而已 最後會回傳最右邊的變數
而通常','前面的部分只是都會與最右邊的變數相關 故會縮寫成一行
故可改寫成：
if (i === undefined) {
  i = 1;
} //','前面的部分
if (i === 0) {
  // return ( A )
}else{
  // return ( B )
} //','後面的部分

如何省略if...else...:(JS便捷性):
variable1 = (1 == variable2) ? "true" : "false";  //':'左右兩邊都是變數 則可以直接做賦值
等同：
if(1 == variable2){
  variable1 = "true"
}else{
  variable1 = "false"
}

故可以把if-else和&&的巢狀結構一併使用(JS便捷性)：
1 == variable ? a = 10 : 2 == variable && (a = 100);
等同：
if(1 == variable){
  a = 10
}else{
  if(2 == variable){
    a = 100
  }
}
','和';'的差異: 在if結構中','較好用 因為可用括號方式產生不同結果
1 == variable && (a = 10,b = 20)  等同：
if(1 == variable){
  a = 10;
  b = 20;
}
1 == variable && a=10 , b=20  等同：
if(1 == variable){
  a = 10;
}
b = 20;

另外也可用!0,!1來表示t/f： 其目的也是便捷性
!0 = true
!1 = false

用e來表示10的次方(JS便捷性)：
var a = 1e3, b=2e5; // a=1000, b=200000 

|0,&0做二進位位元運算： (會將任何數先轉成二進位來做位元邏輯運算)
因為做運算只考慮到整數的部分 故： 5.2442|0 等同為 5|0 且任何數與0做OR都為自己 故結果為101


- - ----------------------------------
# html 基本方法:

html中引入CSS,JS的方法：
CSS寫法:
1.
<link rel="...">從外部引入樣式  
其中rel為relationship=表示 link的屬性值
2.
<style> 
body>p{
  color:#FFFFC9;
}
</style> 直接在內部寫樣式
3.
<p style="color:#FFFFC9;"> 或直接寫在html tag上

JS:只需要也只能用<script>...</script>插入JS code
而牽外部資源時<script src="..."></script> 不需要在textcontent中寫任何code

<script src="" alt=""></script>
scr可以放絕對位置或先對位置之腳本 而alt則為替代腳本
此外從外部資源引入JS需有順序之分：jquery.js->bootstrap.js->sockJS.js->myPackage.js
若需要用到其他js檔的物件就必須排在此js檔的下面
jquery.js幾乎全部的js檔都會用到 故幾乎會排在第一個

<link rel="stylesheet" media="all">
預設為media="screen" 可改為media="all"以適應所有設備

<link href="xxxxx.css" data-turbolinks-track = true>
表示連接的CSS只會載入一次

JS,CSS都會進行壓縮再放上網站 可以讓讀取速度增快
js和min.js的差別就在於後者是壓縮過的 如果要上架應採用後者
另外還提供map檔 供開發者直接用瀏覽器開啟網頁時查詢js檔的特定行數
另外為蓋過前面 自己編寫的css檔,js檔要寫在常用第三方bootstrap,jquery的後面


對話框
<div id="sendBox" style="display: block !important">...</div>
用google font的方式找字型
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

<p>與<span>的差異：
<p>元素為區塊級的 會自動隔行
<span>元素為內聯的(inline) 用於表示行內元素 不會自動隔行
即代表行內元素 故有時直接用<div>...</div> 就等同<div><span>...</span></div>


**html_tag <a>:**
<a>用於做超連結或執行觸發的動作：
<a href="{% url 'index' %}">Home</a> 
url是django模板標籤 必須要在urls.py中設置urlpatterns的path(name='index')函數做映射器
另外有re_path() 即使用正則表示法regular expression的path()

可用onclick取代href 以開啟其他瀏覽器視窗
<a onclick="showClickLinkConfirm('$1')">$1</a>

window.open(strurl,'_blank') 為非同步方法
獲取strUrl的資源 並在另一視窗打開('_blank',或可用<a>元素的id值)

另一種用法：
<a href="javascript:function1()">运行 function1</a> 可用於執行<script>內部的方法

~html_tag <form>和<input>:
{% if next %}
<input type="hidden" name="next" value="{{ next }}" />
{%if...%}和{{}}同樣使用next變數 可用於當input輸入完資料並submit
{% endif %}

<input id="team_name" type="text" name="name_field" value="Default name for team.">
id用於html辨識 name則用於POST(request)表單傳送 value則可用於初始值
value是為取代textContent 因為<input>屬於單一tag的元素

<form method="post" action="{% url 'login' %}" target="framename">
action的屬性值為URL 用於表示向此頁面發送表單
method常用的只有："post"或"get"兩種 兩者都可以發送表單
"post"屬於先建立連接 並由server端的來明確指示如何使用參數數據
只要涉及server數據庫修改的 都應該使用"post"

target屬性表示input後用以回應的顯示位置
target="_blank"表示另外開啟新視窗 target="_hidden"則表示不顯示
target="framename"則表示在特定的frame開啟

"get"屬於一次傳入 數據會附在URL之後 並用問號進行分隔
ex: "http://www.example.com/example/program?x=28&y=66"

可與<form>表單連用 並用$("form").serialize()返回符合GET request的格式
'url?'+$("form").serialize()  // url?a=1&b=2&c=3&d=4&e=5
序列化的意思就是將物件或元素攤開成可儲存或可直接取用的格式

另外 $("form").serializeArray() 則會返回多個物件所組成的array
[
  {name: a, value: 1},
  {name: b, value: 2},
  {name: c, value: 3},
  {name: d, value: 4},
  {name: e,value: 5}
]

target屬性用於在指定的iframe區塊打開 常用於做mousemove事件
加上<iframe style="display:none" name="framename"></iframe>
<iframe>為內嵌框架元素 除配合<form>的target之外
亦可直接用<iframe src="url" ></iframe> 導入其他網頁內容(但不被推薦)
為避免重複:'<iframe id =' (new Date()).getTime() + "-" + parseInt(1e3 * Math.random()) +'</iframe>'
若此物件只使用一次時 才會用(new Object())這種寫法

# js_時間做法 new Date():
new Date(86400000) // 輸出：1970-01-02 00:00:00 UTC (引入參數即為1970年開始算起的毫秒數)
new Date(1995, 11, 17) // 輸出1995-11-17 00:00:00 GMT+0800 (亦可輸入年,月,日,時,分,秒 預設為0)
Date物件的預設時區為本地時間local time 以方便client端使用

var today = new Date();
var someday = new Date(2022, 10, 1);
someday > today // false (Date()物件可用於比較)

(new Date()).getTime() // 輸出為timestamp整數 也就是從1970到現在的毫秒數
(new Date()).getHours() // output:0~23 可用於安排早中晚
並不能選擇AMPM格式 需要自行封裝轉換式：
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

<form>雖然是表單 但不一定要做method:
可以搭配<input type="radio"> 做網頁內容的轉換
<form>
  <input type="radio" name="size" id="size_1" value="small">
  <input type="radio" name="size" id="size_2" value="medium">
  <input type="radio" name="size" id="size_3" value="large">

<form id='send_form'>
有時<form>元素也可以完全不加屬性 所有eventHandler都用JS來執行

加上CSRF:
<form method="post" action="{% url 'login' %}">
{% csrf_token %} 
(會自動生成：<input type="hidden" name="csrfmiddlewaretoken" value="0c90dab91e22382cbaa5ef375f709167">)
只要有POST的請求都應該附上CSRF 
因為會自動生成<input>元素 故可用val()來找其值
'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()

只要有MIDDLEWARE有使用到：'django.middleware.csrf.CsrfViewMiddleware' 
則從client端來的request就一定要有csrf_token


若沒有在模板上附上則可在view使用@ensure_csrf_cookie：
@ensure_csrf_cookie
def my_view(request):

CSRF_USE_SESSIONS=False為預設 此時會存入cookie當中
但有時為安全性考量 會將其存放在server端中(session) 此時CSRF_USE_SESSIONS=True

CSRF_COOKIE_HTTPONLY=False為預設
若CSRF_USE_SESSIONS=True 則不能透過JS不能直接存取CSRF 故一般幾乎不會用

CSRF_HEADER_NAME = 'X-CSRFToken'預設 用AJAX時 需要以此做參數 放入request的headers中
const request = new Request(
    {headers: {'X-CSRFToken': csrftoken}}
);
CSRF_COOKIE_NAME = 'csrftoken'預設 用js抓取csrf值時會需要以此作參數 
function getCookie('csrftoken')


CSRF(Cross-Site Request Forgery) 中文翻為跨站請求攻擊或跨站偽造請求
攻擊者會偽造請求(不知名連結...等)給其他被攻擊者 讓被攻擊者在"不知情"的情況下送出請求
如此一來就會通過該網站後端的身分認證機制 因為也確實是被攻擊者所發送的請求

csrf_token：用於確認請求是來自上一頁正確的表單 以此避免在站外連結所送出的請求
當在登陸頁面時 會自動生成一組安全代碼 而當後端接受數據時 必須要有該組代碼才會通過

為防止CSRF 應避免任何只要輸入網址就可以執行的動作(GET)
所有的"GET" 應該都只能是唯獨的動作

{%url ...%}不需要事前使用{%load...%} 便可直接使用
會直接由urls.py中所設定的映射函數來找

{% url 'update' object_id %} 後面可加上要引入URL的參數
path('update/＜str:pk＞', views.update, name='Update') object_id會作為pk被引入

同理view多了一個pk參數：
def update(request, pk):
  expense = Expense.objects.get(id=pk)
  form = ExpenseModelForm(instance=expense)  # instance表示要被需要的該筆資料(record)
  return render(request, 'expenses/update.html', {
    'form':form
  })


{% url 'password_reset_confirm' uidb64=uid token=token %}
uidb64 = uid 用base64編碼的主鍵
token = token 需檢驗使否為正確的token

{% if validlink %}...{%endif%}
用於reset_confirm頁面 表示由有效的連結而進來

<li><a href="{% url 'login'%}?next={{request.path}}">Login</a></li>
用<a>的next屬性 可設置href屬性連接之後會跳轉到的頁面 可以蓋過原先的預設
{{request.path}}則表示前頁面 即login/logout之後會回到原先的頁面

**html_tag <nav>,<header>和<footer>:**
都是早期全靜態網頁時的使用方式 目前大多用div搭配bootstrap等cs框架取代
<footer>會在頁面最下方用於放置版權等資訊 <header>通常放置於頁面最上方 用於介紹標題
<nav class="menu">
  <a href="#home">Home</a> 
<nav>則負責放置其餘資訊的連結 通常內部會有<a>元素

實際上大部份html元素都能用<div>取代 
但用特定的元素能快速抓到整個網頁的架構 有助於SEO優化

**html_tag <main>和<section>,<article>和<figure>：**
<main>用來放置網頁最重要的部分 內部還會有更多分區排版<div>
<section> 同樣用於分區排版 但<main>只能有一個 而<section>能有多個
<article>用來包覆文章 <figure>用來包覆圖片 


- - ---------------------------------------
# django_template:
共有4種組成元件：variable, tags, filter, comment

django template variable {{...}}:
是django仿照vueJS而發明的in-HTML Templates方法
可插在html檔中的任何一處 <p id={{id_name}}>{{text}}</p> tag內部外部都行
也可插在引用的js檔中 等同是插在<script></script>之間

{{ form }} 是在<form action="" method="post">傳入後才會有的變數
可自動生成針對表單資料欄的<label> 和<input>元素 
另有： {{ form.as_table }}, {{ form.as_ul }}, {{ form.as_p }} 可改變form的形式
用於放在<table>...</table>中 作為textContent


{{ my_dict.key }}, {{ my_list.0 }} python的dict和list都能用此方法
{{ my_object.attribute }} 同理物件的屬性也行 同理物件的可調用方法可返回其結果


django template tags {%...%} 和 filter "|":

{%for...%},{%if...%}： 可用於顯示模型內多筆資料
<p> <strong> Genre: </strong>
{% for genre in book.genre.all %}  # 由views.py中引入可迭代物件(QuerySet)
  {{ genre }} 
  {% if not forloop.last %}, 
  {% endif %} 
{% endfor %}
</p>
if not forloop.last 插在forloop的區塊中 為使最後一次的loop不會加上','


{% for o in some_list %}
  <tr class="{% cycle 'row_odd' 'row_even' %}">....</tr>
{% endfor %} cycle與for常一起使用 
//output:
<tr class='row_odd'>...</tr>
<tr class='row_even'>...</tr>
<tr class='row_odd'>...</tr>
...... 直到for迴圈結束
即會依次序填入cycle中的多個變數 直到不會在碰到{%cycle%}為止

<td class="{% cycle 'row1' 'row2' as rowcolors %}">...</td>  //output row1
<td class="{{ rowcolors }}">...</td> //output row1
<td class="{% cycle rowcolors %}">...</td>  //output row2
不使用for迴圈也可以 但要將{%cycle as cycle_name%}命名
當碰到第二次{%cycle cycle_name%}時 即填入cycle中的下一個變數
若為{%cycle_name%} 則仍使用cycle中的當前變數


<li class="{% if bookinst.is_overdue %}text-danger{% endif %}">
django template{%...%} 也能插在標籤的變數之中

{% extends "base_generic.html" %}
子輩template必須使用extends來繼承父輩template
{% block title %}...... {%endblock%} 
block放在父輩template中 可讓子輩template改寫 (block大多只會透過繼承方式改寫 不會由其他py檔寫入)

{% firstof var1 var2 var3 "fallback value" %}
firstof 表示前一變數只要存在 就會優先輸出前一變數
而當var1,var2,var3都不存在時 就會輸出"fallback value" 


轉譯escape的目的：
即為避免python的字串變數中有html語法("<", ">"...) 而導致錯誤
模板語言的{%autoescape%} 只能用於模板變數 {{variable}} 如果直接用字串型態則不會執行

以下兩者處理轉譯的方法 其結果相同：
{% autoescape off %}
    {% firstof var1|escape var2|escape var3|escape "<strong>fallback value</strong>" %}
{% endautoescape %}
autoescape為此區塊內自動轉義
而當你想要呈現的效果就是html的語法 此時就應該用{% autoescape off %}將其關閉
並用|escape 將其他python字串變數一一轉譯

將python的換行符號轉義為html的<br>
value為"Joel\nis a slug"
{{ value|linebreaks }}  //output: <p>Joel<br>is a slug</p> 換轉成html元素
{{ value|linebreaksbr }}  //output: Joel<br>is a slug 只轉成text

{{ body|linebreaks|force_escape }}
|force_escape 用於將其他fliter的結果在做轉譯
|linebreaks後會有<p></p>  |force_escape可將其留下來輸出

{% autoescape on %}
{% firstof var1 var2 var3 "<strong>fallback value</strong>"|safe %}
{% autoescape %}
而用|safe 則直接略過該變數 不做自動轉譯 (escape和safe兩者用途相反)
因為django會預設防injection的保護機制 反而是要用|safe才能避開轉譯

{{ some_list|safeseq|join:", " }} 
|safeseq則用於list中 可一次對list內的多個變數做|safe
|join:", " 也相當常用於list 將list內的多個數數用", "串連起來

{{string_var|escape}} 使用於html中
而{{string_var|escapejs}} 則使用於JS中 為避免\n ,\r等換行變數發生錯誤

{{ string_var|title }} |title會將字串變數中的開頭字母變為大寫
{{ string_var|lower }} |lower會將字串變數全部變為小寫


{{ value|json_script:"data" }} 
通常會放在<script>之上(外部) 此方法只用於Django的template
會自動將views.py中引入的json變數做自動轉換
def room(request, name):
  render(request, 'chat/data.html', {
      'data': name  
  })

此時value為：
value={'key': name}

{{ value|json_script:"data" }} 會自動生成： 
<script id="data" type="application/json">{'key': "name"}</script>

可將原先在python的dict變數 在html中轉成json格式 最後在JS中使用
<script>
  const data = JSON.parse(document.getElementById('data').textContent);
  ...
</script>

<img src={{ profile_photo }}> 不要把html的標籤屬性值作為變數 供外部使用者input
若input為"/img/home-bg.jpg onload=alert(1)" 就會導致django的轉譯無法防範

django template comment {#...#} 
就是放於html的註解

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
  但不同的test_function並不會相互影響 因封裝了copy.deepcopy()讓每次test的變數彼此獨立

另外python django test 所使用的資料庫是額外建立的 會與真正的資料庫分開
故可用fixtures物件 創建初始數據以供測試使用 常用格式為JSON (data.json)

會將需要同一份setUp()和setUpTestData()的test放在同一個類別(TestCase子類別)
而通常會將被測試類別加上字尾Test 用以表示此類別的測試內容

setUpTestData()由setUpClass()封裝出來的 通常專門處理資料庫相關操作 
除了資料庫存取外 也會像setUp()一樣在每次測試時被調用 用以確保資料完整

setUpClass(cls)和tearDownClass(cls)等同是 jest的BeforeAll()和AfterAll()
同理setUp()和tearDown()就等同jest的BeforeEach()和AfterEach()
另有setUpModule()和tearDownModule()放在TestCase類別之外
處理所有類別都會執行的前置或善後 等同是jest的describe()之外BeforeAll()和AfterAll()

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
selenium屬於web_test工具 必須要用ChromeDriver用以協助瀏覽器執行動作
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


**測試驅動開發 (TDD)**
測試程式和產品程式一起被撰寫 且在未完成產品前就先完成測試 往後修改程式時可直接用測試查看問題
也就是藉由測試過程一步一步找出問題 如此可用於總結軟體的各種例外處理

**F.I.R.S.T. Principle**
fast:測試速度越快越好
independent:每個測試彼此獨立 因為若其中一個failure 也不會影響到其他測試的公正性
repeatable:任何環境下其結果都要相同 不會因作業系統或網路環境而改變
self-validating:最終都應該輸出boolean 讓測試者能夠輕易分辨
thorough:測試應該想到所有可能的情境 一切可能遇到的用戶非預期行為或各種環境下的可能行為
timely: TDD的概念 測試應在產品之前寫完
- - ---------------------------------------
# js_test (jest):
無論在複雜的系統都可以拆解成多個function 因此可以用unit test完成全部測試
但單元測試最大的問題出在有時引入的參數並不是所預期的 如此一來就測不出bug

module.exports 當外部程式碼使用require('jsFileUrl') 就能讀取到此物件
const jsFile = require('jsFileUrl') // 等同是js的import功能 
即不透過html的<script></script>也能成功引用的方式

test(test_name,function(){}) 表示為測試的最小單位
describe(test_set_name,function(){test...}) 則將對同一function的多個test()組成一個單位

beforeAll(() => console.log('1 - beforeAll')); // 只會在開始整個測試過程時執行一次 等同setUpTestData() 會放在describe()之外
afterAll(() => console.log('1 - afterAll'));

beforeEach(() => console.log('2 - beforeEach')); // 在每次測試中執行 等同setUp() 通常放在describe(function(){...})中 
afterEach(() => console.log('2 - afterEach'));
一般放在describe()之內 做為待測function的前置準備 若多個function的前置準備太相似 也可放於describe()之外 作為所有function的共同前置

beforeAll()和beforeEach()代表測試時的前置作業 可能為設定使用者資料或狀態等
意即表示test()只能是簡單的變數或方法回傳值判別 不能再做其他動作
若test()真的要進行其他複雜的動作 也應該以調用同區域function的方式進行

expect(peopleA.name).toBe('GQSM')  //測試字串或整數等
expect(peopleA).toEqual({ name: 'GQSM', age: 25 })  //測試object或array
toBeGreaterThan(), toBeGreaterThanOrEqual(), toBeLessThan(), toBeLessThanOrEqual() // 用於整數
toBeCloseTo()  // 用於浮點數 
toContain() // array中是否包含變數
toBeTruthy(), toBeFalsy()  // 用於boolean值
toBeNull()  // null
toBeUndefined(),  toBeDefined() // undefined 與 除undefined之外任意值
not.toBe()則與toBe()相反 

每個describe()代表一個狀態下的測試 而其中的test()則表示與此狀態下的各個方法
test()內可以有多個expect().toBe() 表示為驗證此方法是否正確 所需要的各個測試細項


## selenium
selenim也可以與jest連用 讓test可以使用瀏覽器進行交互

const {Builder} = require('selenium-webdriver');  // {}表示只引入其中的Builder()類別
var webdriver = new Builder();  // 可直接用Builder()做創建

var webdriver = require('selenium-webdriver'),  // 引入整個模組
    By = webdriver.By,
    until = webdriver.until;

var driver_ch = await new webdriver.Builder().forBrowser('chrome').build();  // 由於開啟瀏覽器需要等待時間 故用await

var driver_fx = await new webdriver.Builder().forBrowser('firefox').build();  // firefox跟chrome最常被使用

driver.quit(); // 最後要將瀏覽器實例關閉 

async function test_search() {  // 只要程式碼中有非同步(await)都要加上async

  await driver.get('https://selenium.dev');
  await driver.wait(() => driver.executeScript('return initialised'), 10000);
  var element = driver.findElement(By.css('p'))
  assert.strictEqual(await element..getText(), 'Hello from JavaScript!');
  // executeScript()放入JS字串等同在console操作
  // wait(function(){}) 等到function回傳true為止在進行下一條 並設置timeout條件 如果超過時間則不再等待(raise timeout error)
  // 通常下面會放時間等待的function(await element.getText())
}
如果執行時間太長會導致await與其他正在執行的非同步方法因競爭而堵塞 導致不穩定問題(intermittent issues)
因此通常加上driver.wait()會先凍結執行緒 直到參數的判別式為真為止
driver.wait()又稱為explicit wait 因其參數判別式必須抓取可見的元素

let ele = await driver.wait(until.elementLocated(By.css('p')),10000);
let foo = await ele.getText();
assert(foo == "Hello from JavaScript");
driver.wait() 只要參數最後為真即可(可以是非0數值或非''字串等) 並會作為調用方法的回傳值
until.elementLocated()用於判斷是否有該元素

其餘until常見相關用法：
until.elementTextIs(elmt, substr) // 是否包含字串
until.elementTextContains(elmt, text) // 是否與字串相同
until.elementTextMatches(elmt, regex) // 是否通過正則


var elmt = driver.findElement(By.css('p'));  // 直接放入css選擇器
assert.strictEqual(await element.getText(), 'Hello from JavaScript!');

driver.sleep(1000).then(function() {  // 用於等待後執行
  driver.findElement(By.name('q')).sendKeys(webdriver.Key.TAB);
});

var fontWeight = await element.getCssValue("font-weight"); // 讀取html元素的css屬性
var readonly = await element.getAttribute("readonly");  // 讀取html元素的屬性

await searchElmt.sendKeys('xxxxx', Key.ENTER); // 同理最後加上Key.ENTER
await searchElmt.clear();

let btnElmt = driver.findElement(By.linkText("Sign in")); // 表示<a>元素的text值

const actions = driver.actions({async: true});  // actionChains 並放入物件參數
await actions.move({origin:searchBtn}).press().perform();  // 同理 move()也可以放入物件參數 如此就不需要用位置參數

btn.click(), btn.doubleClick() 方法基本都跟python的selenium相同 只是換成js的編寫風格

await actions.move({origin:sourceEle}).press().perform(); // 按者
await actions.move({origin:targetEle}).release().perform(); // 釋放
// 表示拖移元素

await driver.wait(until.alertIsPresent());  // alert出現時為true 會等待到符合條件為止 也就是出現alert視窗為止
let alert = await driver.switchTo().alert(); // 可用switchTo()儲存alert內容變數


- - ---------------------------------------
# production:

AWS_EC2(Elastic Compute Cloud)與DigitalOcean都是虛擬伺服器服務VPS
(由於大部分的伺服器都是Linux作業系統 故須熟知一些Linux操作 Ubuntu為最多人使用的Linux版本 )

apt-get與pipㄧ樣都是套件管理工具 Linux系統較常使用apt-get
(除此之外 apt-get和homebrew都可用於安裝軟體 而pip則主要用於安裝python套件)
一般設定VPS都是透過.Config檔進行
會放置在伺服器中的URL:"/etc/nginx/nginx.conf"

託管伺服器會有一個完全獨立的虛擬化unix容器
並且會有自己的附加組件來支持應用程式服務
通常會需要指定的文件：runtime.txt, requirements.txt, Procfile, wsgi.py等
且通常伺服器接受git做版本控制與上傳方式

IaaS(Infrastructure as a Service)
主要包含：虛擬伺服器VPS,虛擬雲端VPC兩大功能
VPS只用於個人 而VPC用於公司或開發團隊 提供分配或調整各項運算資源
IaaS即提供伺服器,貯存與機房等硬體設備 使用者可以自行架設作業系統與主要應用程式

PaaS(Platform as a Service)
除了IaaSd的硬體設備之外 提供商還規範作業系統與開發環境 
用戶可使用已經構建完成的作業系統平台 故只需專注於資料處理與應用程式  

SaaS(Software as a Service)
提供商提供完整的應用服務 使用者直接購買服務 ex:Gmail, Evernote, Youtube...

FaaS(Function as a Service)
為serverless的服務 適用於Line Message 或FB robot這種架設在但三方app的服務

主要思考網站的所需流量的多寡以及如何满足该需求？
必須要能支持Django框架

channels的tutorial使用的是Docker作為container
container的目的是為解決 本地端開發環境與實際放到server端時的生產環境 有差異的問題
container取代傳統的virtual machine運用在hostOS上架設guestOS的方法
但因為virtual machine需要啟動guestOS因而導致啟動較慢且佔較大記憶體等問題
container以應用程式為中心 virtual machine以作業系統為中心
Anaconda過程中並沒有涉及其他的OS 因此Anaconda是container的概念
VMware可用來在mac中安裝windows 故屬於virtual machine的相關應用

Docker的競爭對手有CoreOS
Kubernetes則是一個container集群管理系統 用於做部署,維護,擴增等功能
K8s可運用container讓server隨流量自動擴張或縮減 或server掛點時可自動修復
能夠取代使用VM搭配nginx做反向代理的服務 這類型服務被稱為CaaS(Container as a Service)

Docker由image, container, Repository所組成：
Image(Docker的映像檔) 用來生成container, 而Repository(Docker的倉庫)則用來儲存多個不同的image
image可直接在網路上載入而直接在本機使用 交流分享上更方便 或可自行建立Dockerfile 可自動化執行指令與設定
最大的網路倉庫為Docker Hub 由Docker官方自行維護

Docker使用簡易版Linux環境：大致上就是分為user space和kernel space
兩者有獨立性:一般而言user無權訪問kernel 以確保使用者不會傷害到核心

Heroku是PaaS 而 Kubernetes(kube, k8s)是container tool 這三樣工具都是屬於不同層面的工具
Heroku的競爭對手是EB, Azure, GAE 其中的AWS的EB才是目前的PaaS龍頭

Microsoft的Azure本身就包含了Paas和Iaas兩種服務
大公司主流以AWS和Azure為主 而新創或小公司則用GCP

其中Elastic Beanstalk(EB) 是AWS雲端環境的快速部署與管理平台(PaaS) 
可使用任何AWS組件 像是Elastic Load Balancer負載均衡, Auto-Scaling Group和Security Group等
而Elastic Computer Cloud(EC2) 則讓用戶在上面自行建置伺服器 為AWS的雲端空間(IaaS)

其中Google App Engine(GAE)是GCP的快速部署與管理平台(Paas) 
而Google Compute Engine(GCE)是GCP的雲端空間(Iaas)
GCP的好處是台灣有機房 AWS則最近的建在香港
GCP較多新創公司使用 AWS是適合大型公司的專業後端使用
GCP價格最便宜 而AWS支援服務最齊全
GCP發展最晚 全球覆蓋率最低 而AWS則最早發展 有最多的可用區域

- - ---------------------------------------------
# gcp操作:
VM常用的作業系統Ubuntu 18.04 LTS 相關指令:
sudo apt-get update  // 進行更新
sudo curl -O http://vestacp.com/pub/vst-install.sh  // curl透過http協定存取網路資源
sudo bash vst-install.sh --force // bash用以執行sh腳本檔

VPC網路(Virtual Private Cloud)
最大單位為'網路名稱'即為獨立存在的LAN 而旗下的'子網路'可想像成一個 VLAN
'名稱'之間不能互通 但建立在同一名稱下'子網路'的app則可透過資料庫互通
VPC不同於固定的外部IP位置 需要透過GCP的公有端點來做通訊 GCP會提供DNS來做轉換

子網路遮罩(subnet mask) 用來標示單一網路IP位址內的主機所在位址
表示方法與IP位址相同 如:255.128.0.0 或 192.0.2.96/28 

server的防火牆為控制執行個體instance的流量和封鎖不被信任的連入流量

必須安裝Google Cloud SDK 才能做gcloud指令:
gcloud docker -- push  // 上傳container到GCS上 或可用Google Cloud Container Builder

gcloud auth list  // 列出有效帳戶名稱
gcloud config list project  // 列出專案ID名稱

gcloud compute instances create gcelab --zone us-central1-c // 建立個體 gcelab是個體名稱 --zone是配置參數
gcloud compute disks create mydisk --size=200GB --zone us-centrall-c  // 建立永久性磁碟 mydisk是磁碟名稱
gcloud compute instances attach-disk gcelab --disk mydisk --zone us-central1-c // 在運轉中的個體中新增永久性磁碟

persistent disks永久性磁碟 分為一般磁碟(HDD)和SSD磁諜
可決定使用哪個磁碟做為開機磁碟boot disk

Service Account服務帳號 
專門用來給應用程式做身份識別 目的是為避免用戶將真實的google帳號寫入主機設定中

Access Scope決定服務帳號所能涉及的權限 
default access基本都是唯讀  full access則權限最大 
set access for each API 則交給每一個API由人工設定

Management主機管理：
Reservations: 預定VM的擴張空間
Startup scipts: VM開機時所執行的腳本
On host maintenance: 機台定期維護時是否直接關機或將服務做遷移
Automatic restart: 機台硬體出現突發狀況是否直接重開機 
Preemptible VM 搶佔式主機: 用比原價便宜的價格來使用閒置主機 此為臨時性 不能保存資料

Security主機安全性設定：
Shielded VM: 主機開機時的安全檢查機制
SSH key: 除了用GCP登入外 用SSH需要有固定的key

Disks主機磁碟設定：
Deletion rule: 刪除VM個體後會順便把boot disk刪除
Encryption: 存取資料庫時所使用的加密方式 用google-managed就好
Additional disk: 通常會再加上data disk 為與boot disk分開

Network主機網路設定：
Network tag: 設定所要套用的防火牆 通常會將firewall分為web應用和dbf資料庫二種
Network: 設定所在GCP中的哪個網路名稱
External IP: 外部IP預設為epermeral揮發性 表示為動態IP 可改為靜態IP

Sole Tenency用戶群節點：
一般來說VM會隨機開在資料中心中不同的實體機上
此設定可用於將VM開在同一個機台上 但並不會影響VM表現 僅為符合部分企業的需求

設定GCP Console到chrome的常用頁面
Billing Alert 提醒用戶目前的收費費用 為避免有未關閉的測試機台或未關閉的固定IP
Stackdriver Alert 超過原先收費範圍的流量時會自動警告

帳單的產品與SKU指的是google所提供的API: 該API為產品 其中的功能則為SKU
無論是GCE或GAE都算是google的API 而GCE的固定IP申請則為SKU

GCP所有的設定都能透過REST-request或gcloud指令來呼叫
所以每次變更設定時都可儲存REST-request或gcloud指令 可供其後的主機使用
因為要進行負載平衡 相同功能的主機不可能只開一台

Load Balancer(Instance Group) 
當流量過大無法負荷時 Instance Group可自動加開相同設定的主機 將流量導引到新主機上
新主機的參數設定可透過以建立的模板來建立 這種instance group以功能來區分又稱auto-scaling group
auto-scaling group可設定最多開幾台或最少開幾台 或流量維持多久才進行擴張或縮減
Health Check設定流量檢查的閘道 HTTP Port 80 
Check interval每次檢查的間隔秒數 Timeout每次檢查所需持續秒數 避免突發性的爆量流量
Health threshold/ Unhealth threshold 連續判定幾次成功才執行auto-scaling
Initial delay 為使開機時間不做health check 

最後防火牆不能阻擋health check 必須設定firewall rule
將health check的IP請求設為allow即可

siege指令 用於做server的壓力測試： (用於測試autoscaling是否正常)
sudo apt-get -y install siege
siege -c 250 http://34.120.153.46


- - ---------------------------------------------
# CI/CD 持續整合與持續交付

circleCI用於自動化雲端環境的測試,整合和部署 需要有配合的雲端平台PaaS
Continuous Integration & Delivery (CI/CD) 持續整合與持續交付
可自動偵測GitHub上的程式碼 若有更新則自動整合支線,自動建置Docker環境,自動測試,再自動部署到EB上
且circleCI的自動化測試結果也會在GitHub上顯示 只要有新的push都會執行 無論最後有沒有pull到owner的帳號

在專案Repo中新增circle.yml
其中包含machine:設置環境 dependencies:相依套件與框架 test:需進行的測試

Git-Flow 為針對開發時git使用流程的規範(workflow)
通常以release分支為基礎 每個release分支會有一隻develop分支 
最後會將開發完成的develop併回release 此時release是已完成新功能且已修復完bug 確認後再併回master

Github-Flow 也是一種git流程規範(workflow)
但以master為基礎 只要是master上的版本都一定要通過測試 
且任何開發功能或修復bug等所有分支都必須從master延伸 不會在分為release和develop兩分支

Github-Flow與Git-Flow最大的差異：
在於Github-Flow是以CI/CD為目的 強調上線部署後仍能不中斷開發

常見資料庫系統：
MySQL和SQLite都是關聯式資料庫(RDBMS) 追求一致性與準確性且能處理大量資料
MySQL則適合高流量大規模的網站 接受多個客戶同時訪問同一資料庫
SQLite屬於輕量型資料庫 適合中低流量的網站 且會有資料庫需單個寫入的侷限性

MongoDB 則為文件型資料庫 屬於非關聯式資料庫(NoSQL,not only SQL) 追求即時性
redis 全名為remote diction server 同樣是資料庫的一種
但為Key-Value Database：即利用鍵值的格式儲存資料 屬於非關聯式資料庫(NoSQL)
常用於需要快取cache的場合 幾乎是聊天室架設必備的工具


- - ---------------------------------------------
# asgi.py and wsgi.py

(1) a production-grade WSGI server like Gunicorn+Django for ordinary HTTP requests.
(2) a production-grade ASGI server like Daphne+Channels for WebSocket requests.
Gunicorn和Daphne都是常見網路接口 屬於底層處理應用
但只有較大型的網站才會需要用兩個不同的server做導流 一般小網站都同時以Daphne處理HTTP和WS兩種request

皆由CGI而來（Common Gateway Interface,通用網路接口）
就如同使用者介面UI是針對人與機器之間的連接 CGI則是用戶電腦的指令與伺服器之間的連接
而更正確來講：CGI是web server和application server的連接 有CGI才能提供動態資料

Gunicorn為實現web server協議之服務器:
web server只能用來處理靜態資料 接受http_request和回傳http_response
Django為實現application server功能之框架:
application server負責business logic的執行和database的存取 
(application server無法直接與client端溝通 只能接受web server的request並回傳response)

nginx也是一種web server: 
但無法自行實現WSGI服務 主要功能皆與效能有關
可暫存靜態資源static 讓重複請求不用到appication server(django)
或針對高流量請求時緩存request
可以從nginx判斷 不同Domain或不同pathname已提供不同服務
在nginx層處理HTTPS連線
具多台伺服器時 可針對單一url的request做反向代理或將不同url的request做分流


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
用group_name取代channel_name 其餘也同樣以message_dict作為參數

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
若已經設置'DJANGO_SETTINGS_MODULE' 又用configure()覆蓋到其中的環境變數 則為RuntimeError例外
故兩者方法只能使用其一且也不能都不使用 可用settings.configured判斷是否已設定


application = ProtocolTypeRouter({"http":...,"websocket":....})
可用於決定在不同網路協定時的分流處理方式 當需要用到WS時都必須在asgi.py設定


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
      self.close() # 若要拒絕connection則用close() 表示webSocket只提供給認證身份者
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
可在text_data['command']中設置client聯繫server的所有方法

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

self.receive()或self.receive_json() 為分流所有從client端傳來的content_dict並執行相關方法
self.send()或self.send_json() 為負責所有傳送給client端的content_dict
content_dict用於與client端交流 所有的key-value都可自訂 
massage_dict則與其他channel交流 規定第一組一定要是"type"

會特別區分receive()和receive_json()的原因是 webSocket只要是單一字串都能傳
後者就等於是不用多做json.loads()和json.dumps()

另外's'為string的意思：
json.loads()可直接將json與string型態做轉換 json.load()則必須用text_file開啟

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


process進程與thread線程:
process指的是正在被執行且在載入記憶體的program
每個process都有獨立的資源空間 彼此不會相互干擾：因此若2個以上的process要做溝通會比較難進行
thread指的是process中能進行運算的排程：不同thread因為在同一個process中作業 可以共享資源
ex:前者為多個工廠但裡面只有一個工人 / 後者為一個工廠但裡面有多個工人
進程與線程都目的都是為了使資源利用率極大
最後Coroutine協程 ：為一種透過使用者自行控制thread的方法 取代原先全由OS控制的thread架構

- - ---------------------------------------------
# python非同步作法：
python和JS相同都是單線程語言 python有所謂GIL(全局解釋器鎖)
故即使進行非同步方法 將function放入event_loop中 pytohn仍是單線程執行(會讓多個線程並行並交替執行來達到多線程的效果)

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

coroutines = asyncio.wait(tasks)  # 表示不只有一個task 有多個task時就用asyncio.wait()
loop.run_until_complete(coroutines)  # 直到run_until_complete才開始執行


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

- - ----------------------------------------
# terminal:
## conda指令
conda env list
conda create --name myenv python=3.5
source activate myenv  # source為'點命令' 即重新執行剛修改過的檔案 使其立即生效
conda list
conda install thepackage (或 pip install thepackage) # 兩者都可以在myenv虛擬環境中安裝
conda search thepackage
conda update thepackage
conda remove thepackage
source deactivate



vi test.txt / vim test.txt  # 開啟文件檔
## django指令
python3 -m django --version (-m表示不執行,僅作為script : 通常後面會接module 而非執行python)
python3 -c 'import channels; print(channels.__version__)' (-c 執行python的命令句並用';'隔開 等同command)

django-admin startproject myproject 第一次在專案名稱資料夾建django專案
python3 manage.py startapp myapp 第一次在django的目錄下見app

python3 manage.py makemigrations 第一次建database 以及每一次model做更動都要使用
針對app中的models.py創建SQL指令 但不會執行任何指令 不會產生任何一張table, 任何一筆record
python3 manage.py migrate 讀取migrations中的SQL指令 會接續makemigrations後執行
基於SQL指令創建table和record 將兩指令分開是為了快速在不同資料庫創建一樣的格式
(另外即使不使用model做資料庫 仍需要做註冊：因為像sessions等功能都需要用到資料庫)

python3 manage.py migrate myapp 指定特定app創建table
python3 manage.py makemigrations myapp 指定特定app創建SQL指令
python3 manage.py sqlmigrate myapp 0001 查看myapp中makemigrations所生成的0001遷移文件

python3 manage.py flush 將還未migrate的數據刪除
manage.py migrate myapp zero 則用於刪除myapp的所有data

python manage.py runserver
可用本地端查看localhost：http://127.0.0.1:8000/ (為根目錄)
直接用CTRL+C 關閉terminal程式 即可終止runserver
port:8000用於查看本地端 每一個port碼都是不同的協定服務 (port,埠)
FTP:21Port DNS:53Port HTTP:80Port
一般上網只需要輸入域名就行 因為瀏覽器會自動補足所對應的port碼
而server端會針對所提供的服務來監聽所對應的port端口 如架網站就是提供80Port

print('len(dialogues):'+str(num), file=sys.stderr)
用於在runserver的情況下做除錯

python manage.py shell 進入django的互動模式 可用於手動操作database
關鍵是可以在網站運行時做變更 sqlite資料庫和redis資料庫都能使用
如同在網頁上操作資料或呈現view.py裡面的訊息 可按CTRL+D離開
SSH(secure shell)在terminal與遠端伺服器之間建立安全通道 github或gcp都需要使用SSH

python manage.py collectstatic
將STATICFILES_DIRS路徑中所收集到的static檔 收集放入STATIC_ROOT中
故不應該把static檔放入STATIC_ROOT中 不然會被蓋掉

python manage.py validate
用於驗證model

## redis-server指令
redis-server用於架設django緩沖系統
pip django-redis 必須安裝django-redis (不同於channel內建的redis庫)
redis-server 開啟Redis伺服器 才能使用redis-cli指令
redis-server redis.conf 可用conf檔做IP、port、logfile和datafile(dir)的設置
redis-cli 開啟Redis的CLI介面(command-line interface) 可檢查內存的key-value鍵(db0)
redis-cli -n 1 開啟db1資料庫(redis分為16個資料庫db0~db16) 若不指定-n 則會自動開啟db0
redis-cli ping 用於驗證redis-server是否可正常使用
redis-cli select 2 移動到其他db資料庫
redis-cli exit 用於離開redis-cli模式
redis-cli shutdown 用於停止redis資料庫

redis-cli dbsize 查看目前有多少鍵總數
redis-cli keys * 常看當前所有鍵
redis-cli keys cache:* 常看當前名稱對應的所有鍵
redis-cli del key_name 刪除鍵
redis-cli rename key_name key_name2 改名鍵
redis-cli type key_name 查看鍵的資料類別
redis-cli ttl key_name 查看鍵的過期時間
redis-cli expire key_name 60 延長鍵的過期時間(單位為秒) （另有:pexpire key_name 500 單位為毫秒)

loadtest -n 100 -k  http://localhost:8000/index/ 用於做網站載入速度測試 用來測試cache的實用性

## pip指令
pip套件管理工具的名稱為python package index(pypi) 本身就是以python寫成的工具
pip freeze | tee requirements.txt 輸出本地包環境至文件
pip install -r requirements.txt 根據文件來安裝環境

**pipenv可取代pip和virtualenv:**
pipenv並不是pip自帶的 必須使用pip install pipenv
自動生成Pipfile和Pipfile.lock取代原先使用virtualenv所需要的requirements.txt
pipfile的設計也可直接區分 development 與 production 環境(pipenv install --dev)
pipenv install -r requirements.txt 也可直接使用requirements.txt轉成pipfile
pipfile存放專案所需的套件 pipfile.lock則存放pipfile套件所需的支援套件

一般開發者會分兩個資料夾：src和dist
src放實際開發的檔案(入口也放在此,index.js) dist則放webpack編譯後的檔案
目的為使CSS可以有變數性質和其他程式語言的基本功能 讓css可重複使用、具有DOM的嵌套關係

## 其餘重要指令:
CTRL+Z 為暫停目前前台運行的程序
CTRL+\ 終止程序 通常是在CTRL+C無反應時使用
CTRL+D 離開當前的shell
CTRL+S CTRL+Q 兩個一組： CTRL+S用於看目前所花時間 CTRL+Q則跳回compile狀態
CTRL+R (reverse-i-search) 用於輸入關鍵字收尋過去的指令

**vim為terminal中的文字編輯器**
vim中常見模式為NORMAL, INSERT, REPLACE:
--NORMAL--: 加上:w存檔, :q離開, :wq存檔後離開
此模式下無法新增內容但能做複製剪下貼上 或進入其他模式
配合鼠標可做:y(yank)複製, d(delete)剪下, p(paste)刪除

進入其他模式時可按ESC可退出回NORMAL
--INSERT--：在NORMAL中選擇i,a,o 即可進入insert模式 
則進入INSERT 此時輸入字符會插入其中

--REPLACE--：在NORMAL中選擇r或R 
則進入REPLACE 此時輸入字符會做取代

--VISUAL--:在NORMAL中選擇v則可用鼠標進行操作

ps auxw  (不以'-'做指令 通常可以連用 並 只是改變輸出的顯示)
a(all) terminal下的所有程序
e(environment) 每個程序的環境變量
u(user) 以用戶為主來排列程序
x() 不以terminal來區分
w(wide)以寬闊的格式來顯示

grep 用來做收尋 通常會與ps連用 (ps auxw | grep aaa)
egrep 等同 grep -E (--extended-regexp) 幾乎沒有在用
fgrep 等同 grep -F (--fixed-strings) 表示固定長度字串
grep -i 不分大小寫

kill -9 /kill -15
前者為絕對關機 後者需要時間自動關機：後者比前者好

建立文件三種方式:
touch output,txt
cat > output.txt
echo "hello world" > output.txt

touch 為keep in touch 即更新文件的意思 故建立後可直接開啟文件
cat file1.txt file2.txt > file.txt cat原先用於合併多份文件
cat > filename 表示將空白文件合併進去filename 即為建立文件
cat filename 則表示顯示該文件後不做任何動作
echo "hello world" 為在terminal上顯示文本 
echo "hello world" > output.txt 表示在output.txt上顯示文本 即建立文件

export -p 列出當前所有的環境變量
export PATH=$PATH:$HOME/bin/ 設置環境變量 ($PATH:$HOME/bin/ 表示除原先$PATH之外新增$HOME/bin/)
切換到conda的虛擬環境中 也就是把$PATH加上/Users/jason_mac/opt/anaconda3/envs/datingApp/bin
echo $PATH 檢查目前的環境變量

vi ~/.bash_profile 由於PATH只是區域變數 只要電腦重新開機就會失效 故要寫入bash_profile
export PATH=$PATH:$HOME/bin/
source ~/.bash_profile 再讓該設定重新生效 如此就不用重開機

## docker指令
docker version 檢查版本
docker build . -t docker-demo-app 建立新的image -t是tag的意思 即打上名稱
docker images 列出目前所有的images

docker run -p 3000:3000 -it 733776b1db0a 有了id之後便能開始生成container
-p表示publish 將容器發布到端口port上 另外-P則表示隨機生成port 如此就不用指定3000:3000
3000:3000是因為要先連到host實體機的port 再連到實體機內container的port
因為一台host機可以有多個container 故需要用兩個一組的port
Container可被視為一台獨立的電腦 -it：-i是interactive可由鍵盤輸入 -t是terminal即可由螢幕輸出

docker run -p 3000:3000 -d 733776b1db0a
-d是daemonized 表示在背景中執行 運行時不做任何操作
或用-idt表示在背景中執行但仍保有基本輸入輸出的能力
docker pull [Image 名稱]:[Image 版本] 取得一個指定版本的image
(一般來說不用自己build一個映像檔 只要用pull就好)
docker run -p 6379:6379 -d redis:5  port6379為redis專用的端口 (另外有一個類似的6380)
使用channels框架需要在settings.py設置redis端口
(也可以直接略過pull步驟 docker會幫我們檢查本地端 若沒有會自動pull image)

docker ps -a 用來找目前正在執行的docker -a是all的意思 表示不只正在執行的
docker stop <ContainerID> 找到id後便可直接關閉
docker rm <ContainerID> 找到id後可做刪除

Docker Compose是docker的延伸工具 可組合多個功能的container來提供完整服務
必須要使用YAML批次腳本 (docker-compose.yml) 此外許多指令也與docke相同



## git指令
git config --global user.name "<Your Name>" 先將這台電腦連結到github上的使用者
git config --global user.email "<name@gmail.com>"
git config --local user.name "<Name>" 也可以在專案目錄上執行來連接到其他使用者 此時不用--global
git config --local user.email "<email@gmail.com>"
git config --list 可檢查設定值

以下兩者是唯二在本地端建立專案的方法: 會在專案中建立.git檔 故只要此檔刪除就可解除git控制
git init 第一次在本地端建立專案還未上傳時 
git clone 將github上的專案下載到本地端

git status用於看當前檔案的追蹤狀態
當新增檔案而尚未追蹤時：U(Untracked) 當已追蹤檔案有新更動時：M(Modified) 檔案被刪除時：D(Deleted)

git add new.txt 會將'檔案狀態'安置到暫存區staging area(又稱index) 此時還未存到本地端儲存庫repository中
add只記錄狀態 因此檔案無論新增,修改或刪除都需要先用add安置其'狀態'
git rm new.txt 表示在工作目錄將檔案刪除之後 在自動將其狀態add到暫存區
git rm --cached new.txt 只停止追蹤檔案 檔案不會被刪除 檔案將從追蹤狀態退回未追蹤
若想忽視部分檔案 可編輯.gitignore檔 只要將檔名寫於此檔內即可(已經追蹤的檔案要退回未追蹤才能入.gitignore)

git clean -f /module/ 刪除指定目錄內全部untracked的檔案 -f為強制執行 
git clean -f -d 表示刪除整個專案資料夾的untracked的檔案 
git clean -f -d -x 表示連寫入.gitignore的檔案都刪除

git commit -m "init commit" 只會將此時在暫存區的檔案commit到本地端儲存庫 等同完成一個備份的版本
因此當執行commit前都應再查看status以確保檔案正確

git commit -a -m "update content" 可用-a簡化add流程 
但只會安置更動過modified的檔案 對於新增或刪除則無效

也可以將未安置的檔案再add到'上一個'commit版本 此時要用--amend:
git commit --amend -m "update content fixed" 用於修改最近一次的commit 
git commit --amend --no-edit no-edit則表示不改變commit的message
只能修改最近一次 過去的commit因為會影響到其後的commit版本故不能直接修改
(如果要改變過去的commit 則必須要git rebase -i 來打開互動模式)

git revert HEAD --no-edit 則是完全取消最近一次的commit (也只能是最近一次)
但方法是再多加一個commit版本 並做出與此commit完全反動作的行為

git stash -u 當目前的檔案仍不需要commit新版本且想merge其他分支時  -u則表示untracked的檔案也可以存入
可以用stash將更動過但沒commit的檔案存入其中
可以在多個分支使用stash 不同的分支會有不同的標記stash@{0}, stash@{1}...
git stash list 查看當前stash的檔案
git stash pop stash@{0} 當前分支merge成功後 再把stash的檔案pop出來
git stash drop stash@{2} 刪除特定的stash檔案
git stash clear 清空當前stash的檔案

但真正好的使用方法是 無論如何只要做版本更動(merge,reset...)時 
當會先將手上的檔案做commit 如此就不需要使用stash

git tag v1.0.0 cd82f29 可在commit打上標籤 可方便整理並增加易讀性

git branch 查看目前分支 '*'為目前HEAD所在的分支 terminal的輸入指令上會顯示
git branch branch_name 從當下HEAD所在的分支來建立新分支
git checkout branch_name 則將HEAD移動到其他分支 此時commit就會紀錄是由此分支上傳的
針對開發的專案內容 同一電腦可以使用不同分支上傳 而不同電腦也可用同一分支上傳
git checkout -b branch_name 同樣能簡化branch流程
不一定每條分支最後都一定要合併 多分支可用於為專案提供多個版本

git branch feature cd82f29 表示多加上一個branch指著此commit 常用於回到過去版本後在做延伸
git branch -d feature 用於merge合併完後將分支刪除
git branch -D feature merge合併前就將分支刪除 用於淘汰此分支的版本內容
git branch -m old_name new_name 當本地端分支重新命名
若將分支刪除後 commit並不會被刪除仍可透過checkout切換 但會導致HEAD斷頭

git checkout cd82f29 也可移動到其他的commit版本 (只要輸入commit識別碼的前7碼就行)
(另一角度想:checkout只能移動到commit 而移動到branch則指的是當前分支所指的commit)
但若此commit並不是分支最新上傳的 也就是當前沒有分支指著它 則會導致HEAD斷頭

git checkout cd82f29 welcome.html 也可以只回復單一檔案
git checkout welcome.html 若沒有指定commit版本 則表示回復到當前分支(HEAD)
(如果未完成commit:也可用git reset HARD 回復到尚未add新狀態的當前分支)
git diff 則用於檢查目前的改動(未完成commit)與當前分支commit版本的差異

斷頭時進行commit 由於此commit沒有分支則會導致只有HEAD指著它
commit雖可以獨立於分支 但如此就難以事後被搜尋 以至於維護變得更困難
(git是一個以commit為單位的系統 branch僅為方便管理多個commit的標籤 可進行合併,退回等操作)
此時可用git branch new_branch 來指定新的分支給commit

git reflog 詳細顯示你每個commit和git指令辨識碼(reset指令也會被記錄)
git reset HEAD~2 用於回到過往的版本 往後退2個版本(HEAD~2)
git reset cd82f29^ 表示到此commit的前一次 等同(cd82f29~1) 
預設為--mixed 只會改變暫存區檔案 但不會動到工作目錄的檔案 即之後所變動的檔案被歸為untracked
git reset --soft cd82f29 都不會動到暫存區和工作目錄的檔案 版本之後所變動的檔案會被歸為modified
git reset --hard cd82f29 暫存區和工作目錄的檔案兩者都會動到 此時暫存區會回復到此版本的裝態

git reset --hard ORIG_HEAD reset動作因為會使當前分支改變 屬於危險操作 
故系統會在操作前留下一個ORIG_HEAD 以方便分支回復到操作之前

git checkout和git reset都可以回到過去的commit版本
但checkout只能將HEAD指向此commit 所有分支皆不會改變 而reset則可以將當前分支退到此commit

git branch -a 可查看所有分支 可分為本地端分支master和追蹤分支origin/master
當clone下來的專案由於本地端沒有分支 只會有追蹤分支origin/master
git checkout -t origin/master 此時可用-t 來切換到tracking branch 此時分支名為master
(等同 git checkout master 會在本地端建一隻分支做追蹤)
git pull origin master 每次要在分支工作時都應先下載當前分支的最新版本
git push origin master 且最後仍要將此分支上傳到遠端
git push -u origin master  -u為--set-upstream 表示設定本地端分支會自動對應同名的遠端分支
(也可以直接在當前分支設置git branch -u origin/master 此時沒有上傳)
git push origin master:feature 上傳master分支 但在遠端額外建立一條feature分支
git push origin :feature 若不從本地端上傳分支 即是刪除遠端的feature分支
git push 只要設定好--set-upstream 就可以直接push當前的所有分支
git push --all 會將當前本地端的所有分支都上傳

pull可猜解成fetch+merge:
git fetch origin master 可將origin/master抓下來但還沒合併
git merge origin/master 將追蹤分支(origin/master)與當前所在的本地端分支(master)合併
好處是可先檢查分歧狀況 如果有多人在同一個分支上工作很容易造成分歧
git pull --rebase origin master 找的是使用rebase代替原先fetch後進行的merge

git merge hitfix 當與當前分支有分歧時：
當前所在分支會自動提交merge的commit紀錄 即往前推進一個版本
而被merge的分支會會停留在原先的版本 通常merge完後就會把此分支刪除

git merge hitfix 當與當前分支無分歧時 (即當前分支只是停留在過去版本但沒有commit新內容)：
則為fast-forward快轉合併 此時不會提交merge的commit 只會將當前分支往前移至hitfix的最新版本
git merge --no-ff hotfix 則禁止fast-forward快轉 故仍提交merge的commit

git rebase hitfix rebase會將有分歧的兩條分支合併為一條 兩條分支最後都會指向同一個commit
被合併分支(hitfix)會併到當前分支(master)的後面 好處是會保留分支的commit且log紀錄更清楚
如果用merge合併完再把被合併分支刪除 則會導致被合併分支的commit遺失 

git rebase cd82f29 也可將單獨的commit併到當前分支的後面 (rebase字面意義就是推進版本(base)的意思)
git cherry-pick fd23e1c 6a498ec f4f4442 將其他commit複製到當前分支的後面 不是合併故不會改變其他分支
merge不會改變原先分支的紀錄 但是rebase會把分支併入其後
故通常多人協作用merge 而單人為保持commit紀錄的整齊會用rebase

git rebase -i HEAD~5 interactive表示互動模式 用於修改該分支最新的五個版本紀錄(HEAD~5)
git rebase -i cd82f29 修改從當前分支的最新版本到此版本之間的所有版本紀錄

rebase interactive互動模式下的指令:
pick 表示保留此commit (預設)
reward 則指更改此commit的message
squash 用於合併此commit到上一個commit
fixup 也是併入上一個commit 但不會重新編輯message

edit 可用於將此commit拆成多個commit 
會回到提交此commit時 此時可以決定所要add的檔案並分批commit 最後用git rebase --continue繼續
drop 直接丟棄此commit 如果修改過的檔案沒有被下一個commit保存則會導致修改部分遺失
另外丟棄也可以直接在互動模式下把該行刪掉 同理或要改變順序也可以在互動模式下做更換
(丟棄或換順序都不推薦 因為可能會影響後續commit版本的檔案)

當兩個分支有分歧且修改了同一檔案就會導致conflict衝突:
產生分歧的檔案 即表示兩個分支有做修改:both modified
此時要手動處理檔案內分歧的部分 且把git自動加上的conflict標記修掉即可
因為發生conflict 故還要再做一次 自行將此檔案add到暫存區並commit這次改動

rebase會比merge更容易發生conflict 當發生conflict時：
git rebase --continue 同上可手動處理檔案內分歧部分 修改完後繼續進行
若不是文字檔時 則無法手動排除分歧部分 此時只能選擇分支中的其中一個檔案
git checkout --ours cute_animal.jpg our表示為當前分支的檔案
git checkout --theirs cute_animal.jpg theirsf表示被合併分支的檔案
同上最後都需要重新將此檔案add到暫存區 再執行git rebase --continue

git rebase --skip 檔案內分歧的部分 選擇當前分支取代被合併分支
git rebase --abort 停止rebase合併

git log 只會有commit版本紀錄 不會有git指令紀錄
git log --oneline --graph 可看之前提交的commit紀錄 oneline為只有message格式 graph則將branch圖像化
git log --pretty --graph pretty則為完整的紀錄格式 commit的排列順序是依據提交的先後時間
log紀錄中會有author, date, message等資訊 都可用來做搜尋：
git log --author="JASON|SMITH"  '|'可用於搜尋多個author提交的commit
git log --grep="update"  表示搜尋message中有符合字元的commit
git log --after="2017-01" --before="2017-02" --since="9am" --until="12am" 收尋符合時間範圍內的commit
git log welcome.html 也可以只看單一檔案的log紀錄
git blame -L 5,10 welcome.html 則可以看出單一檔案內每行的編寫者author -L用於指定行數


常見分支名： 除了master和develop只會有一一個 其餘分支取名用'/'隔開 feature/feature_name
master正式上線分支：通常是已在release分支確認無誤才合併進來 commit最少但每次提交都是大改動
develop開發分支：主要用於開發的分支 可由此再分出feature分支與release分支
feature獨立功能分支：用於開發新功能 最後會合併到develop分支
release釋出版本分支：通常是開發完成時準備釋出時才建立 只會修改其中的bug 最後會被master合併且也會合併回delevop
hotfix緊急修補分支：由master分支出來 用於解決正式版已上線後才發現的bug 同上被master和delevop合併

**github:**
多人協作時: 會從專案owner的github帳號 將專案fork到個別開發者的github帳號之中 
此時才從個人帳號做下git clone 好處是push只會到自己的帳號
個別開發者再對owner帳號發送pull request(PR) 
此時owner會收到個別開發者的PR 確認無誤後在執行merge pull request

針對本地端的上傳內容 遠端儲存庫永遠只接受快轉合併 也就是兩個分支不能有分歧
(也非常符合邏輯：因為本地端只能push到自己的github帳號 也就是除了自己外 此github帳號基本不會有更動)
git push -f -f為force 就是讓本地端的分支直接上傳蓋掉遠端的分支(極不推薦)

git remote -v 查看當前專案所連結的遠端儲存庫
git remote add upstream git_url 用於連結其他遠端儲存庫 可自行設置專案名稱
origin為git clone下來的專案位置 即個別開發者的githug帳號 另一個取名upstream則為owner的github帳號

設置upstream是避免當前本地端的專案與owner的專案不同步的情形:
git fetch upstream master 取得owner專案的master分支內容 此時在本地端為追蹤分支upstream/master
git fetch upstream 不指定分支則取得owner專案所有分支的內容
git merge upstream/master 同理fetch完後來做merge合併 

README.md 為使用markdown語法撰寫

# npm套件管理工具: 
同理npm的指令都必須在專案資料夾中執行
使用webpack就一定要用到nodeJS 另外npm也是nodeJS的應用
npm init -y // 必須在專案資料夾內執行 會創建package.json檔 -y為yes表示使用預設檔
npm的套件管理方法是直接在專案資料夾裡面建立 而不是像pip在/usr/local/lib裡面建立
其目的是為了讓不同版本的套件可以針對不同專案在同一個電腦裡使用

npm install -g 即為全局安裝 像pip一樣在/usr/local/lib建立
npm install --save(預設 就是什麼都不加) 會在package.json中的"dependencies" 表示專案中實際使用的套件
npm install --save-dev(等同-D) 會在package.json中的"devDependencies" 表示只在開發或測試時使用的套件
ex:sass套件是為將sass檔轉換成css檔所用 如此就只需要在"devDependencies"

npm run test 會執行寫在package.json下script屬性下的'test'指令 (npx test)
好處是只會在專案環境下執行 此模組與全域環境無關
node test_basic.js 則會執行當前所有資料夾的js檔 

- - ---------------------------------------------------
## scss:
為最多人使用的CSS_preprocessor
webpack為自動化編譯工具 能夠處理多種不同的應用與框架
webpack建立在node.js之上
如果要在django上使用 必須用django-webpack-loader
但仍必須由node.js做生成 轉換成json檔(./webpack-stats.json)後在給django使用
此時node.js算是打包工具 仍用django建設後端 仍須新建webpack.config.js

如果沒有客製化需求 可直接導入bootstrap所提供的css檔,js檔
但需要客製化樣式就需要用webpack(需處理scss->css)
要先載入bootstrap原檔 內層會有一個scss資料夾
可在其中新增自己的元件(ex:_myBox.scss) 可以更改原先bootstrap預設的參數
最後再將all.scss編譯成all.css 便可供html引用
scss只是更方便管理css而已 可在scss中寫出巢狀的css樣式以減少重複性

- - ---------------------------------------------------
## jest: 
為javascript的測試框架
npm install jest --save-dev  //為nodeJS的套架 必須用npm下載

npm run test  // 會執行當前資料夾下所有的測試檔(.test.js) 
npm run test <file-name>.test.js  // 只執行單一測試檔

- - ------------------------------------------------
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
except:只能用於測試階段 正式上線就就必須捕抓完整的例外

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


# python_concise(便捷性)：
i = 5 if a > 7 else 0
同JSㄧ樣 if-else也可以用簡寫方式 以避免過多的換行

y = [1,2,3,4,5,6] 
[(i*2) for i in y ]  # output:[2, 4, 6, 8, 10, 12]
用for迴圈完成list

y_list = ['assss','dvv']
[print(i) for y in y_list for i in y]  # output: a s s s s d v v
亦可用for迴圈完成巢狀結構 (有點不合語法 其原因為for y in y_list：必須要有明確的變數 故y_list會先放在前面)

x = 3
(lambda k: k+3)(x)  # output: 6
用(lambda 參數: 表達式) 來取代傳統命名的函式
def func(x):
  return x+3

map(lambda x: x * 2, [1, 2, 3, 4, 5])  # output:[2, 4, 6, 8, 10]
map()可針對參數做映射 故最後回傳的大小長度都會跟放入的參數相同

lambda能與zip()一同使用 但易讀性較差
即： map(lambda t: t[0]*t[1], zip(input_a, input_b)) 
不如用：[x*y for x,y in zip(input_a, input_b)]

lambda也能處理多個變數 必須在其後擴充相同長度的參數
map(lambda x, y: x + y, [1, 3, 5, 7, 9], [2, 4, 6, 8, 10])

all()和any()都必須放可迭代物件
any([-1,0,[]]) # output:True  ( list中只要有一個True any()為True)
all([-1,0,[]]) # output:False  ( list中必須全為True all()為True )

zip()則用於同時處理多個可迭代物件 可將其組合成tuple並供使用
x,y = [1,2,3,4],['a','b','c']
 [x+y for x, y in zip(x, y)]

- - --------------------------------------------
# ajax與webSocket

即時聊天一定會使用ajax技術 即不用重新整理頁面來更新網站
webSocket是比較新的技術：為一種互動通訊的技術 在TCP連接上進行全雙工通訊的協定
原先html的單向性(Request-Response) 如此導致server短無法主動連接client端
傳統的ajax 必須要靠client端發送高頻率的request(輪詢) 來達成快速update資料
如此過於沒效率 因此改用webSocket取代AJAX (在chat room上)
目前AJAX的定位更傾向於 非同步地向server端要過大的資料：
讓頁面不用重整也能滿足效能的需求 或可分批傳送來減少頁面加載時間

若都是由client端來發送訊息 (即websocket和ajax都能實現的功能)
則websocket講究時效性 但client端發送訊息(用chatSocket.send) 
此時要等server端的應用層做出回應(ChatConsumer.receive)
ajax則用{success：function(res){...},onerror:function(){...}}直接調用返回函數
websocket若要有success:和onerror:功能 則可用websocket.onerror捕抓所有異常
websocket不需要傳送http_header 所以效率較高應優先使用

故若從server返回的訊息是固定的(即系統上的回應) 則應該使用ajax 
另外傳輸多媒體等大文件時因為會佔用websocket 更仍應採用ajax

但若從server返回的訊息是不固定的(其他使用者的即時回應) 則才用websocket

早期常見獲得real-time update的方法：(不使用websocket的狀況下)
polling輪詢：實現輪詢的底層需要用setTimeout()或setInterval()做定期發送ajax
setInterval()因為一開始就定好執行時間點 會導致不能因應實際回傳的時間做調整
setTimeout()可重複調用來取代setInterval() 因此大多時間是直接用setTimeout()

streaming(comet)：如同彗星後端一樣把request拉的很長不結束 
等同是server端一直做polling來傳輸待機訊號 直到真正需要用到時才傳資料

long-polling長輪詢:結合polling和comet衍生而來 改善頻繁發 
送ajax而是改發一個長時間待機的ajax直到server端有資料要傳時 才切斷發一個新的ajax

iframe永久幀 : 在頁面中嵌入一個專門接收server端資料的iframe 
<script>utils.exec(“response”)</script> 藉此不切斷request 
但是網頁的狀態週期會一直保持在loading 導致影響其他運作
會搭配js物件eventsource做監聽事件 evtSource.on('message',function(){...})

**async & defer:**
<script defer> 表示網站會繼續解析DOM 不會因js腳本而被打斷 且執行順序會在DOMContentLoaded之前</script>
<script async>表示下載完後會立即執行 不保證順序 通常用於完全獨立的模組</script>

- - -----------------------------------------
# js_async非同步作法：

async/await 的實現是建立在Promise之上的使用到promise的架構 屬於非同步
用 async/await 的方式 就是避免像promise一樣 因非同步與同步混在一起而導致易讀性下降
目前普遍的JS作法 都用async/await代替過去的promise 兩者等同：

const b = () => Promise.resolve()
const a = async () => {  // 此外因為仍在a的內部 故可使用a的變數
  await b()
  c()
}

const b = () => Promise.resolve()
const a = () => {
    b().then(() => c()) //用then做鏈接 即表示b()執行成功(resolve)後下一個接者執行c()
}

new Promise(function(resolve, reject) {
  //名稱實際上可變動 但習慣上仍使用resolve,reject 第一參數與第二參數分別表示成功與失敗
    resolve("成功");
    reject("失敗");  // 引入的參數表示promiseValue ex:成功時 promiseValue="成功" ; 失敗時 promiseValue="失敗"
});

用function傳入參數num 來定義promise的成功(resolve)或失敗(reject)條件
function runPromise(someone="people1",num=1) {  //只要function內包含Promise物件即為非同步
  console.log(`${someone} gets started!`);
  ......
  return new Promise((resolve, reject) => {
    num ? resolve(`${someone} 成功獲得 ${num} `) : reject(`${someone} 失敗!`);
  });
}

runPromise('小明', 1).then(someone => {  // 沒有 async/await 看起來像一般函式 導致易讀性較低
  console.log('小明', someone)
});
// 由於runPromise屬於非同步 會另外開線程 故以下這段console.log()會在promise結束前就執行
console.log('這裡執行了一段 console');

let mingRun = await runPromise('小明', 2000)
console.log('跑完了:', mingRun);
let auntieRun = await runPromise('漂亮阿姨', 2500);
console.log('跑完了:', auntieRun);
// mingRun和auntieRun在同一個線程 導致需要等mingRun執行完後才換auntieRun執行

let allRun = await Promise.all([runPromise('小明', 2000),runPromise('漂亮阿姨', 2500)])
console.log(allRun); // 或用Promise.all() 並發執行多個promise()

// 因此除非有需要延遲效果 不然大多會在同一個async function內使用
const asyncRun = async () => {  //匿名函數作法
  let mingRun = await runPromise('小明', 2000);
  let auntieRun = await runPromise('漂亮阿姨', 2500);
  return `${mingRun}, ${auntieRun}`
}
async function asyncRun() {  //一般建立函數方法
  let mingRun = await runPromise('小明', 2000);
  let auntieRun = await runPromise('漂亮阿姨', 2500);
  return `${mingRun}, ${auntieRun}`
}

const arrayData = [
  {num: 1, time: 500},
  {num: 2, time: 3000}
];

async function parallelFn() {
  const data = arrayData.map(async item => {  // 用array.map() 將array內的元素並發 用映射函數處理
    const res = await promiseFn(item.num, item.time); // item.num和item.time 即array內的每一個元素都是object
    return res;
  })
  console.log(data);

  for (const res of data) {
    console.log(await res);
  }
}

asyncRun().then(success => {   //async function寫法與promise很像 都會有用於成功時的.then()和用於失敗時的.catch()
  console.log(success)
}).catch(response => {
  console.log(response)
});

success = "成功" ; fail = "失敗"  可用then(), catch()引入参數
promise(1)
  .then(success => {
    console.log(success);
    return promise(2); // promise(2) 會接到最接近的then
  })
  .then(success => {
    console.log(success);
    return promise(0); // 這個階段會進入 catch
  })
  .then(success => {   // 由於上一個階段結果是 reject，所以此段不執行
    console.log(success);
    return promise(3);
  })
  .catch(fail => {  // promise(0) 會直接接到最接近的catch
    console.log(fail);
  })
  .finally(() => {  // 無論success或fail finally()一定會被執行 故適合用來確認工作結束
    console.log('done');
  });

promise(num) num>0都會是success num=0則為fail


promise物件只會存在三種狀態：
pending：事件已經運行中，尚未取得結果
resolved：事件已經執行完畢且成功操作，回傳 resolve 的結果（該承諾已經被實現 fulfilled）
rejected：事件已經執行完畢但操作失敗，回傳 rejected 的結果

常用promise的method
p.then();    // Promise 回傳正確
p.catch();   // Promise 回傳失敗
p.finally(); // 非同步執行完畢（無論是否正確完成）
用then(),catch()的目的是為了做鏈接 如此可以改善過去用if{if{if...}}的callback hell
因為另開一條線程的非同步事件：其執行方向不需要由上到下 因此可以用此方法決定執行的次序


setTimeout(function{},time) 為JS常用的延遲執行方式 可用於完成網頁動畫
setTimeout()屬於非同步事件 JS程序上會先跑完全部的同步事件 再依據time來處理非同步事件
不同於await async_function 會等待執行完畢後才換下一條同步
setTimeout()所使用的方法等同python的asyncio.create_task() 相當于另外開一條執行緒

因此setTimeout()中的參數time只能代表最少需要等待的時間 實際上有可能超過此時間
(因為同步事件還未完成 或其他在佇列的事件未完成)

由於JS是單線程語言(single thread)：此時若沒有用非同步處理 則會導致執行程序阻塞(blocking)
實現非同步的原理：JS是單線程 但瀏覽器是多線程 
故若JS要進行非同步方法就是請求瀏覽器 時間到時將要執行的方法放入event_loop等待單線程處理
而setTimeout()是webAPI 不會影響到JS主程式 故可以設置等待時間延後執行


setTimeout(( () => console.log("Hello!") ), 1000);
()=> 為function的簡易寫法 常用於只有單行的code
setTimeout(function(){
   console.log("Hello!");
 }, 1000);    // 等同於第一參數放入function()的寫法

const map1 = array1.map(x => x * 2);
常與array.map()一起使用 此時單行code亦可省略return

setTimeout()只會執行一次 另外有setInterval()可持續不間斷執行
用法相同 另外其執行對象都是window 完整語法是window.setTimeout()

除了放入function做參數外 也可直接放code的字串
如同eval()一樣 會執行字串的程式 但此方法效率較差且容易發生漏洞

setTimeout()和setInternal()都會有回傳值 回傳值的用途為做取消執行
var timeoutID = window.setTimeout(( () => console.log("Hello!") ), 1000);
window.clearTimeout(timeoutID);
同理 也有window.clearInterval(intervalID);

function show(str){
    console.log(str);
}
setInterval(show,2000,"每隔2秒我就會顯示一次");
可以將setInterval()後面的參數可用於傳遞給show(str)


- - ------------------------------------------------
# js_webSocket相關作法：
(html為完全靜態的語言 要實現webSocket一定要仰賴JS)
var Socket = new WebSocket("ws://www.example.com/socketserver")  // 為routing.py中映射到有建立consumer的url
// 通常第一次request返回的response就已經把socket連結建好
//if ("WebSocket" in window) 可用於檢查client端的瀏覽器是否支持ws

建立連接成功時觸發：
socket.onopen = (){
  alert("建立連接成功！");
}
//onopen, onmessage, onerror, onclose並非由client端所觸發 指的是從server端接收到的事件

發送訊息： 以websocket傳輸的資料方式稱作data frame(資料幀)
document.forms["myPublish"].onsubmit = ()=>{
  let outgoingMessage = this.message.value;

  socket.send(outgoingMessage);  // 直接用socket.send()即可
  // socket.send() 為由client端傳給server端 方向性為client->server

  return false;
}

接受訊息：
socket.onmessage = event => {
  let message = event.data;
  let messageElem = document.createElement('div');
  messageElem.textContent = message;
  document.getElementById('messages').append(messageElem);
}

message常用屬性：
message.type 可用於決定JS的處理方式 為字串形式
message.ms 從1970年開始算起的毫秒數 故每一時間的數值都不同可用於辨識

document.forms會選取所有html內部的<form>元素 回傳array
var selectForm = document.forms[i] //故必須用i指定


另外document的方法：
function(new_title){
  document.title = new_title; // 直接存取元素內容
}  //等同修改<head>內部的<title>內容


主動關閉:
socket.close(1000, "Work complete");  //1000最常見 表示正常關閉 此時不會觸發socket.onerror
預設的event.reason=="Normal closure, meaning that the purpose for which the connection was established has been fulfilled.";

接受關閉: event.code目前共分為15種 並可用event.reason查看理由
在觸發onclose之前 狀態都為：socket.readyState=="CLOSED"
socket.onclose = event => {
  // event.code === 1000
  // event.reason === "Work complete"
  // event.wasClean === true 
};

event.code == 1001 表示瀏覽器由開啟連接的頁面離去或server端故障
event.code == 1003 端點接收不能處理的資料形態而消滅連線 (為防止server端有意亂傳資料)
event.code == 1006 不正常關閉時觸發
event.code == 1007 端點接收到資料中有不一致的內容 (可能為編碼不同UTF-8)
event.code == 1009 端點接收到過大的資料而消滅連線(為防止阻塞 可讓端點重新連線)
event.code == 1010 當端點handshake後server無回應 表示未成功建立連線
event.code == 1011 server未能正常完成請求時 

另外 event.code可能與server端的close_code不同
每一種框架所使用的代碼都可能不相同

發生錯誤時觸發：
socket.onerror觸發後必會觸發socket.onclose 
但socket.onclose可單獨觸發 故將此分為不同的eventhandler

發生error就會關閉websocket 此時要自動重連並將localData(client端)資料再次傳回server端
也因此部分人會使用ajax做傳送 因為發生error時可自動重傳

socket.readyState可確認目前狀況
0 —— "CONNECTING"：socket物件已建立 但connection尚未建立
1 —— "OPEN"：connection建立完成並可以開始傳輸
2 —— "CLOSING"：connection關閉中
3 —— "CLOSED"：connection已關閉 (除了重新連線外 亦用websocket = null釋放)

if(Socket.bufferedAmount==0){
}
也很常用 用以判斷佇列中使否有資料待傳送

為要保持穩定長連接 會定期發送ping/pong來確認連接

- - -------------------------------------------
# js_window_object 和 ~js_document_object: 

window.location.reload() 重整頁面 (window可省略)
location.replace(url) 將當前頁面替換成url (不可按上一頁回去)
location.assign(url) 跳轉至url (可按上一頁回去)

history.go(0) 等同 window.location.reload() 
history.go(-1) 等同 history.back()
history.go(1) 等同 history.forward()

document.hidden // boolean值 為使用者是否正在當前頁面(可能正在其他分頁)
不同瀏覽器其屬性名不同 可能為webkitHidden, mozHidden, msHidden, oHidden (目前新版本已經都有支持)
一般的作法是遍及prefix = ['', 'webkit', 'moz', 'ms', 'o'] 
for (let i = 0; i < prefixes.length; i++) {
  if ((`${prefixes[i]}Hidden`) in document) {
    return `${prefixes[i]}Hidden`
  }
}

document.visibilityState // 可能值為'visible', 'hidden', 'prerender'
'visible'表示瀏覽器正在當前頁面且未縮到最小化(可用tab選取) 
'hidden'則瀏覽器不在當前頁面 即在此頁面不能使用tab選取
'prerender'表示網頁正在生成 當開啟網頁時會先是prerender狀態

以上可用於寫visibilitychange事件：
因為各家瀏覽器變數名稱不同 需加上前綴 prefix = ['', 'webkit', 'moz', 'ms', 'o'] 
document.addEventListener("visibilitychange", function(){  // 當打開其他分頁時 縮小化的標題會變更
    document.title = document[getVisibilityState()]+"狀態";
});

window.localStorage: (以key-value的方式將資料存放在瀏覽器)
window.localStorage可直接用localStorage替代
小寫駱駝體 通常表示為window的唯讀屬性(可省略window.)

localStorage.setItem('key', 'value');  //將資料存到localStorage
var data = localStorage.getItem('key');  // 從localStorage取得之前存的資料
localStorage.removeItem('key');  // 移除之前存的資料
localStorage.clear();  // 移除之前存的所有資料

同樣localStorage能使用object-like access:
localStorage.name = 'jason' 或 localStorage['name'] = 'jason'

window.sessionStorage： (與window.localStorage幾乎相同 方法都相同)
差別在於sessionStorage在頁面關閉時便會刪除且不同窗口不會共享 localStorage則不會過期也可共享
(sessionStorage因表示只在瀏覽器開啟有效 這點與session相同故命名之)
使用localStorage聊天室關閉後再開 仍保持在相同畫面
通常localStorage與sessionStorage會依據需求混搭使用 再搭配localData將資料存入


可用localDataFlush()做同步 將localData的資料轉往localStorage 
(flush即是將臨時狀態的資料同步到永久狀態)
getLocalData()則反之 將瀏覽器的localStorage轉往localData的

用key-value的方式儲存 因只接受字串形式：
故需先將物件轉成json型態JSON.stringify() 要取用時再轉回來JSON.parse()
var ArrResults =['a','b','c']
var objResults = {name:'jason' , age:18}；
localStorage.setItem('result', JSON.stringify(ArrResults))
var ArrResults = JSON.parse(localStorage.getItem('result'))

localStorage瀏覽器對每個網域只能儲存約5MB的資料量
localStorage只能儲存字串:一個中文字佔3個字節 英文字母與數字都只占1個字節 (一個字節就是一個byte)

document.cookie="name=jason;age=20;domain=example.com;path=/;max-age=3600;expires=Tue, 19 Jan 2038 03:14:07 GMT "
將key-value與cookie的prop放在一起 故要小心key的命名不能與prop重複
path指定哪些路徑可以存取cookie 若為path=/表示全站都可以存取
domain可指定除本身網域之外的其他網域共同使用此cookie


max-age和expires都表示過期時間 
max-age的考慮順位較高且時間較短 表示在特定秒數之內是有效的
expires則表示UTC格式的特定時間點之內有效

secure: 表示cookie只能用https傳遞 透過http存取網站無法看到此cookie
httpOnly: 表示cookie不能用js存取 為避免跨站腳本攻擊(XSS)
samesite: 表示cookie不能透過其他網域存取 為避免跨站請求偽造(CSRF)


document.cookie與字串形式
cookie存放sessionid(或用localStorage存放sessionid) 需作加密
所有任何識別身份的資料 無論是放在server或clinet都要做加密處理

document.cookie與django的request.COOKIE之差異：
兩者都是存放於相同的集合 一般而言document.cookie會優於request.COOKIE
除非server端需要存取數據 不然應直接在client端做存取較方便 

4種存放資料的方式:
cookie:存放資料大小約4kb左右 且最多只能有20個 (依瀏覽器而異)
故較適合存取session標籤 通常有時間週期 過期後便無法在使用此session
sid在cookie中便可直接用key/value來找 此外session需有資料庫才能用
sid =request.COOKIE['sessioid'] 
s = Session.objects.get(pk=sid)

此外若遇到用戶瀏覽器禁用cookie時也會失效
此時要用URL重寫技術 即：http://example.com/login?sid=xxxxx

URL和URI 為避免其他國家的用戶使用不同的編碼方式導致難以存入cookie中 故會用URI轉碼:
const uri = 'https://mozilla.org/?x=шеллы';
const encoded = encodeURI(uri);  //output:  "https://mozilla.org/?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
decodeURI(encoded)) === uri //output: true

由於cookie需要隨request發送 故會影響流量頻寬 因此有大小次數限制 
而webStorage就未改善此點而建立

## session:
需要搭配存於瀏覽器cookie中的sessionid(通常變數名為JSESSIONID)
由於資料存放在server端 故比cookie更容易影響server性能
django會負責處理sessionid的加密 在server端只要直接用request.session即可

## webStorage:
無大小與數量限制 分為localStorage和sessionStorage 
不同於cookie以string方式儲存 webStorage則以key/value的方式儲存
不同於cookie在httpRequest的header中攜帶 webStorage只會在client端存取
不同於cookie需要每次檢查request webStorage本身就支援事件通知機制

網頁動畫或互動較適合使用webStorage 
其中記憶單一使用者的功能用localStorage 而需要多個子頁面的功能用sessionStorage
而帳號登入,個人化設定,追蹤資料等需重入server端的行為則適合cookie/session

localData:直接存在js文檔之中 
只要網頁重整就會遺失 因此常用於作為臨時狀態的資料

- - - -------------------------------------
# html_meta 敘述元素

為了可以在不同裝置上使用
一般都會使用響應式設計(RWD) 可直接使用bootstrap-responsive.css
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">

用於適應不同手機大小與解析度
<meta name=”viewport” content=”width=device-width, initial-scale=1.0″>
一般圖檔尺寸大小144*144使用pixel 此為電腦像素的最小單位
但不是我們的長度單位:要換成長度 必須要有手機大小4.3寸(對角線,inch)和解析度1280*720

<meta name="csrf-param">和<meta name="csrf-token">
這是Rails框架的寫法(ruby語言

<noscript> 不支援JS時 用img替代
"<img src="https......" style="display:none;" height="1" width="1" alt="" />"
</noscript>

除非有其必要 不然別用<button onclick="function()"></button>
會把JS與html混在一起 增加維護難度
但弱勢動態生成的新元素則用此方法較好 可以減少再用jquery做搜尋的時間

<meta name="apple-mobile-web-app-capable" content="yes">
name=apple-mobile...都是與apple裝置相關的設定 其變數則用content=表示

https://stackpile.io/docs/1.0/app-library/alexa
Alexa Certify Javascript是AWS用於幫助網站曝光的認證


<meta property="og:title" content="What is Open Graph?">
<meta property="og:description" content="Computer dictionary definition for what Open Graph means including related links, information, and terms.">
<meta property="og:type" content="article">
<meta property="og:url" content="http://wootalk.today/">
<meta property="og:image" content="facebook.gif">
open graph: 用於決定當使用者分享網頁時 所顯示的標題,資訊,圖片

<meta property="fb:app_id" content="您的應用程式編號">
<meta property="fb:admins" content="您的Facebook ID">
facebook id 相關的應用

<template id="t1">... </template>
元素不會被渲染 用於保存內容 來讓js做選擇提取使用

<style data-fbcssmodules=""></style>

<script>ga()......</script>
Google Analytics(GA)可用於追蹤點擊紀錄 必須引入analytic.js並在js檔中加入ga()

<h1>h1. Bootstrap heading <small>Secondary text</small></h1>
<strong>rendered as bold text</strong>
<small>表示會使content的字體放小 <strong>則是會變粗體
後一些html標籤是在bootstrap中的CSS定義出來的
(能夠自行定義tag名稱是由XML開始 往後大多數框架都有相關的設計)

- - -------------------------------------------
# React.js
為改善DOM中結構過於複雜且元素太多導致難以維護的情形
class ShoppingList extends React.Component{
  ....
  render() {
    return(
      <h1>Shopping List for {this.props.name}</h1>
    );
  }
}

<ShoppingList name="Mark">
如此就能用React.js將想要的客製化元素封裝起來 並在html的DOM中實現

extends就像是實現：ShoppingList類別 繼承 React.Component類別
如此就能用React.Component提供的屬性與方法

render()用於回傳html傳統格式中的textcontent
也可用其下代替：
return React.createElement("h1", null, "Shopping List for ", props.name);
其中第二參數用於表示元素裡面的屬性(class,id,name...) 此時用null代替

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
也能用React.Component建立父子關係
Board是Square的父節點 可以決定square的屬性值

React.js也能作為css模組化工具 但比Vue.js相比較不直觀

- - -----------------------------------------------
# Vue.js
同樣有減少結構複雜化功能 (Danjango本身就有Vue.js功能)
<div id="demo">
  <h1>{{ message }}</h1>
  <input v-model="message">
</div>
用雙括號的方式來使用變數

const vm = Vue.createApp({
    data() {
        return {
          message: 'Hello Vue!'
        }
    }
}).mount('#demo'); 表示將Vue加在#demo元素上


使用Vue.js作為css模組化工具
<style module>
 .red {...
 }
</style>
只要在style module宣告過的樣式都能用:class="$style"使用
<h1 :class="$style.red">
另外有 if判別式應用與多個module應用
<h1 :class="{ [$style.blue]: isBlue }">Am I blue?</p>
isBlue=true時才會顯示
<h1 :class="[$style.red, $style.bold]">Red and bold</p>
[,]用於套用多個module


Mixins是一種在vueJS中體現的方法
將共用功能以物件形式(mixin object) 傳入mixins option中
var Component = Vue.extend({
  mixins: [mixObj, mixObjAnother],
});
如此Component物件就能使用mixObj, mixObjAnother兩個物件的方法與屬性
當mixin object的方法名稱相同時 會是後面引入的(mixObjAnother)蓋過前面引入的(mixObj)

生命週期鉤子 (instance lifecycle hooks)
即為vueJS創建物件時的執行順序 與其他框架下的生命週期相似 而vueJS用hook表示

mixin的邏輯在原生的JS就有使用
WindowOrWorkerGlobalScope 就是Window和WorkerGlobalScope 兩個物件的mixin


- - ----------------------------------------------------
# 軟體架構
MVVM模式取代傳統的MVC模式
即ViewModel取代Controller 其中Vue就是用於ViewModel的功能
若model被改變時 會同步在view上更新對應內容(data bindings)
同理在view上觸發事件時 會將狀態用物件表示的方式回存至model(DOM Listeners)
ViewModel框架即具有即時性 進而取代Controller

Django所使用的是MVT模式 也就是Template取代Controller 
當要從資料庫model中抓取資料並呈現在view上時 可藉由Template的模板語言實現
所有的view都必須將一個template做為參數(html檔)

- - ---------------------------------------------------
# bootstrap:
由於bootstrap命名較簡單 容易搞混
一般自己命名的類別都會加上"my" 以區分bs的類別
由components和utilities組成：
前者會有實體對象 後者用於表示特定格式 且 全部都使用class=" "建立

bootstrap.js和bootstrap.bundle.js:
差別在於多了popper.js 如果要tooltip或popover等彈出框則需要使用bundle版本

bootstrap.esm.js則可讓bootstrap作為module被引用
<script type="module"></script> 有些瀏覽器支持也需要這樣的寫法

bootstrap.css本身就包含bootstrap-grid.css和bootstrap-reboot.css (不會有人只選後兩者)
bootstrap-grid只能做grid sysyem的layout bootstrap-reboot則只能用來處理content

## bootstrap_container:
"container" 和 "container-fluid"
為bootstrap的最外層 可用來調節在不同螢幕尺寸時的顯示方式
container: 除了xs會自動調整大小(100%)之外 其餘都有固定的最適大小(ex: (Medium≥768px) : 720px )
(container等同container-xs, 即-xs為其預設)

container-{breakpoint}:
依據裝置螢幕大小的不同共分為5種：xs,sm,md,lg,xl

container-sm:則為xs,sm會自動調整大小, 其餘皆固定 
以此類推container-md, container-lg, container-xl
container-fluid:則自動調整所有螢幕尺寸大小 即所有尺寸都不固定
(container-fluid等同是container-xl的下一級)

<body>
  <nav class="navbar-fixed-top">...</nav>
  <div class="container">...</div>
  <div class="modal fade">...</div>
</body>
container通常放於body的下一層 會與彈出視窗modal或導覽選單nav同層

@import, @media, @font-face :at-rules
"@"表示特殊說明 與其他html標籤類別都沒有關係

xs:為手機直立的寬度  直接width:100%即可 不用設固定寬度
xm:為手機橫放的寬度  @media (min-width: 576px)
md:平板電腦的寬度  @media (min-width: 768px), 
lg:一般電腦的寬度  @media (min-width: 992px), 
xL:超大型電腦螢幕的寬度  @media (min-width: 1200px)

full-scream就是1440px * 1080px 為4:3長寬比 (為應付全螢幕 瀏覽器背景要能有此大小)
但一般瀏覽器會有上層UI介面 故為1440px * 900px 為8:7長寬比
上層的UI介面約為180px 而瀏覽器右側slide為32px 

瀏覽器的最小寬度為500px 故logo大致上不能超過這個大小 500px * 500px
youtube的video元素之高度為528px 當瀏覽器大於最小寬度時稍為放大一點 528px * 528px 
google的輸入欄最小寬度為436px 故當瀏覽器在最小寬度時應再縮小一點 436px * 436px

同理grid模式的row,col也會有{breakpoint}系統 但響應式設計不太一樣
以col-xs為例：只要小於xs的尺寸大小 就會變垂直排列以避免方格變形(類似於手機的排版方式)

大致邏輯是xxx-{breakpoint} 表示只適用於大於此{breakpoint}尺寸的裝置
故-xs為其預設 即可適用於所有大於xs尺寸的裝置

另外還有media_queries(@) 可用於偵測裝置大小並輸出符合大小的css內容
@media (min-width: 768px){  // 最小寬度為768px以上的裝置
  width:744px;
}
當大於768px(mg+pa+內部寬度)時會做width:744px;(pa+內部寬度)
(注意：media的width指的是瀏覽器視窗總寬度 而css中的width則指的是該元素不包含margin的寬度)
亦即margin最小為24 而隨螢幕寬度放大 margin也會隨之放大

故反之還有：
@media (max-width: 1200px){  // 同上 但表示最大寬度為1200px以下的裝置
}

margin 元素與外部元素之間的邊界間距 padding 元素與內部內容之間的邊界間距
何時使用 差別只在於width會把padding算進去 且 元素的border的位置會不同
margin用於全裝置統一留空的部分 而padding則用來微調不同裝置填空的部分
對於有背景色的元素而言border相當重要 此時mg,pa就不能混用

border 則是元素外框 用來設定邊框寬度與樣式 (border之內就算是content)
故外部元素的padding會和內部元素的margin相互影
padding-right:15px 和 padding-left:15px
此為padding的預設值 故通常container的寬度要比content還要寬30px
同理row,col也基本是透過margin,padding做調節

border與outline的差異：
border可設置圓角 屬於元素的邊框線 而outline用於點擊後顯目元素 屬於元素的外框線

<div class="container custom-container-width">  第一個class後面加上空格隔開 放入特定屬性
.container.custom-container-width {
    max-width: 1010px;       // 必須放在bootstrap.css後面引入 最後內容寬為1010-30=980px
}
<div class="row no-gutters">  同理 放入特定屬性no-gutters
可以使row中的col之間不會有padding隔開


row alignment system：row的重點在對齊方式
<div class="row align-items-start"> 表示對齊container的上緣
<div class="col align-self-start"> 此時會將不同對齊方式的col分開

<div class="row justify-content-start"> 表示對齊container的右側
通常只在裡面的col沒有塞滿12格時才有用： <div class="col-4"> <div class="col-4">
(用於內部元素有固定寬度的時候)

<div class="row justify-content-around"> 表示裡面元素分開排列 但不靠右側和左側
<div class="row justify-content-between"> 表示一樣是元素分開排列 但靠右側和左側

justify則為主軸相關main axis(左右) align開頭都是橫軸相關cross axis(上下)
亦即將同一寬度的元素歸為content 而讓多個元素等高對齊則用align items

12-col system : 相同row中的空間會被分隔成12等分
可用：
<div class="col-8">col-8</div> <div class="col-4">col-4</div> 做比例切割
若只有col:
<div class="col">col</div> <div class="col">col</div>  則做等分
用空格隔開:
<div class="col-12 col-md-8">.col-12 .col-md-8</div>
<div class="col-6 col-md-4">.col-6 .col-md-4</div> 可決定不同螢幕尺寸時的呈現方式
"col-12"表示已經填滿 會自動補到下一列

- - -------------------------------------
## bootstrap padding和margin:
<div class="w-100"> 和 <div class="w-100 p-3">
前者可充當換行 因為沒有指定padding： 後者為p-3
另有"w-25" "w-50" "w-75" "w-auto"可供選擇 (-auto則直接依據內部文字長度決定)
p-3為padding大小 使用rem單位
p-1: 0.25 * 1rem = 4px
p-2: 0.5 * 1rem = 8px
p-3: 1 * 1rem = 16px p-3,mb-3最常用
p-4: 1.5 * 1rem = 24px
p-5: 3 * 1rem = 48px
rem的大小會直接比對瀏覽器的textContent字體大小(font-size)
其目的是為配合多種不同裝置尺寸大小

em則是rem的過期用法 會直接比對父元素的textContent字體大小
但因為巢狀結構下過於複雜而被淘汰

m-3也是同樣單位
m：margin 沒特別指定 就是四邊都加寬
mt：margin-top
mr：margin-right
mb：margin-bottom
ml：margin-left
mx：margin-right 和 margin-left
my：margin-top 和 margin-bottom

margin css寫法:
margin:0 auto; 表示上下為0 左右自動對分
margin:0 0 0 0;四邊都為0 順序為top,right,bottom,left

最常用<div class="mx-auto" style="width: 200px;"> 自動加寬就等同於將元素置中
當width固定時 採用margin:auto才有意義

p：padding 同理沒特別指定 就是四邊都加寬
pt：padding-top
pr：padding-right
pb：padding-bottom
pl：padding-left
px：padding-right 和 padding-left
py：padding-top 和 padding-bottom

border css寫法:
border-top: 1px solid #E5E5E5; 必須指定三種參數 分別為width, style, color
border-top-width:1px; 可直接指定其中一種

- - -------------------------------------
## bootstrap_navbar:
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class='container-fluid'> 
    <a class="navbar-brand" href="#">Navbar</a>
    <span class="navbar-text">Title</span>
    <a class="nav-link" href="#">Website</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

.navbar.navbar-expand-lg響應式功能 在寬度超過lg格式時會展開內部的navbar-collapse元素
.container-fluid和<nav>元素配合 表示navbar的寬度可隨裝置螢幕調整
.navbar-dark讓文字顏色為白色 .navbar-light讓文字顏色為黑色 通常會跟bg-color配合

屬於<button>的navbar-toggler元素則
需用data-bs-target屬性綁定navbar-collapse元素的id值 data-bs-toggle屬性則表示所觸發的動作

<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    <li class="nav-item">
      <a class="nav-link active" aria-current="page" href="#">Home</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" href="#">Link</a>
    </li>
    <li class="nav-item">
      <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
    </li>
  </ul>
  <span class="navbar-text">Navbar text with an inline element</span>
  
navbar-brand, navbar-text, nav-link...等皆為navbar選項元件 可放在：
與navbar-collapse元素同層的地方 表示不會縮進toggler中 無論任何寬度都會顯示
而navbar-collapse元素的內部 則需用navbar-nav元素和navbar-item元素組成
並將navbar選項元件放入navbar-item元素中

collapse屬性表示此元素會回應collapse事件 navbar-collapse屬性則為在navbar的佈局
通常兩者同時出現 同樣的方式還出現在accordion元件中：<div class='accordion-collapse collapse'> 

## bootstrap_list:
<ul class="list-unstyled"> 將<ul>清單形式轉成多行的文字內容
<ul class="list-inline"> 將<ul>清單形式縮排成一行的文字內容
兩者都為方便用戶做複製或列印

## bootstrap_card:
panels, wells and thumbnails都被cards取代
cards:
<div class="card">
  <img class="card-img-top" src="..." alt="...">
  <class="card-body">
    <h5 class="card-title">
    <h6 class="card-subtitle">
    <p class="card-text">
    <a class="card-link" href="#">
    <a class="btn btn-primary" href="#">
此為最簡單的card應用 用於與image搭配
通常外部的row,col只會用<div> 因為這些都是用於排版用
內部的card才會開始用其他元素<img>,<h1>,<h2>,<h5>,<p>...
放於card-body內會對齊排好
另外可加入style="width: "來決定card的寬度
<div class="card" style="width: 18rem;">

<a class="btn btn-primary" href="#">
等價於<button class="btn btn-primary" type="button"> 兩者可替換
<a>大多用在超連結或其他UI的佈局變動 <button>則適合用於form的表單

panel是由三部分組成 這裡使用panel-default (old-version)
<div class="panel panel-default">
  <div class="panel-heading"> 標題
  <div class="panel-body"> 內容  常用於設置滾軸或視窗高度
  <div class="panel-footer"> 註腳  會在app的最下端 通常放input元素 如同聊天室的輸入欄



## bootstrap_input-group:
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">https://example.com/users/</span>
  <input type="text" class="form-control" id="basic-url" aria-describedby="basic-addon1">

<div class="input-group mb-3">
  <input type="text" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon2">
  <div class="input-group-append">
    <span class="input-group-text" id="basic-addon2">@example.com</span>
    <button type="button" class="btn btn-outline-secondary">send</button>

input-group用於在input欄的前後或後面加上預設輸入內容
"input-group-prepend"表示在前端加上 ex : https://
"input-group-append"表示在後端加上 ex : @example.com

並會加上"btn-secondary"或"btn-outline-secondary" 前者為背景樣式 後者為邊框樣式
btn-* '*'號可填入semantic語境色彩樣式(primary,secondary,success,danger,...)
secondary因為顏色較淺最常用 且通常會加上自己訂的css

semantic element語境化色彩 是html5的功能：
對於制式化的網站而言 直接使用語境顏色會方便許多 
例如warning-黃色 danger-紅色 在admin這種管理員網頁非常好用

加上form-control 才能使用bs對於input的格式規範 
EX: email格式, password格式...

## bootstarp_form-group:
<div class="form-group">
  <label for="exampleInputEmail1">Email address</label>
  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
class="form-group"僅為元素的佈局 用於內部元素之間會自動換行(即為元素的區塊化)
此為input的from-control 由label(標題), input(輸入欄), small(補語)組來而成
class="form-control"才能用bs內建的type篩選功能 並用type="emeil"決定輸入的格式規範  
aria-describedby="id_name"為<input>元素用於決定使用哪個補語<small>元素
for="id_name"為<label>元素用於決定標題所針對的<input>元素

<div class="form-group">
  <label for="FormControlFile1">Example file input</label>
  <input type="file" class="form-control-file" id="FormControlFile1" accept="image/png, image/jpeg" multiple>
accept屬性可決定上傳檔案的類型 可用audio/*(任何音頻檔案), video/*(任何影片檔案), image/*(任何圖片檔案)
multiple屬性為boolean值(有標即為"true") true為可選擇多個檔案

<input type="file" class="hide" id="upload-photo-input" name="img_file" data-url="upload/photo_nocrop">
可參考jquery.fileupload.js
hide已被d-none和d-block家族取代 (bootstrap5)

另外<div class="form-row">也是只做元素的佈局 用於內部元素需要排在同一行時
還有<div class="form-group row"> 一樣是塊狀元素的佈局但由於是grid模式 故內部可用col來分配寬度大小

form-group和input-group之差異：
form-group通常為input-group父元素 
內部具有唯一的<input>元素(或<div class='input-group'>) 和<label>和<small>分別做標題與補語
input-group則為使<input>元素有<span>與<button>可作為前綴或後綴的添加元件addon

<form>
  <fieldset> 即用於form佈局
    <legend>Personal details</legend> 即作為form標題用 (legend為圖示,說明之意)
    <label>Your name:</label> <input name="yourname">
    <label>Your age:</label> <input type="number" name="yourage">
早期form使用<fieldset>和<legend>來做佈局 後被bootstrap的格式取代

data-url為html5的標籤名(不是bootstrap) 是data-*的一種
data-後面的標籤名能夠自訂 其目的是為能在JS被引用 屬於dataset屬性
可用：$('#upload-photo-input').dataset.url 或 $('#upload-photo-input').data(url)
可用此方法在JS中存取資料 即jquery的data()
$('#upload-photo-input').data(url, 'upload/photo_nocrop')
$('#upload-photo-input').data(url:'upload/photo_nocrop')
此方法的好處是讓任何html元素都能自存資料

另外:<div data-last-value='45'> 
// 從html到js時會將'-'拿掉 $('div').data('lastValue') == 45


input::-webkit-file-upload-button {  //Chrome and Opera
  background-color: peru;
  border-radius: 4px;
  cursor: pointer;
}
用<input>的pseudo element 可改變預設的上傳按鈕外型

<div class="form-group">
  <label for="exampleFormControlSelect1">Example select</label>
  <select class="form-control" id="exampleFormControlSelect1">
    <option>1</option>
    <option>2</option>
另有select的from-control 由label, select, option組成
並可選用<select multiple class="form-control"> 表示選項用於多選
<select>同樣是輸入項 用以取代<input>

<div class="form-group">
  <label for="exampleFormControlTextarea1">Example textarea</label>
  <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
<textarea>同樣也是輸入項 用以取代<input>


form-check由input與label組成
一樣用<input>作為輸入項 最常用的為type="checkbox"和type="radio"
<div class="form-check">
  <input type="checkbox" class="form-check-input" id="exampleCheck1">
  <label class="form-check-label" for="exampleCheck1">Check me out</label>

<div class="form-check">
  <input type="radio" class="form-check-input" name="exampleRadios" id="exampleRadios1" value="option1" checked>
  <label class="form-check-label" for="exampleRadios1">Default radio</label>
checked表示預先選擇
value是全部的input元素都有 用於表示輸入的內容 
name則用於處理需傳送至伺服器的POST表單(request)

panel可用語境色彩semantic elements (old-version)
panel-primary(藍色), panel-success(綠色), panel-info(淡藍色), panel-warning(黃色), panel-danger(紅色)
這五種顏色分別代表不同狀況 會在bootstrap頻繁出現

另外最常用的是<p>元素 : <p class="text-primary">
常見：
<p class="text-muted"> 用於淡化顯示
<p class="text-light bg-dark">.text-light</p> text-light為白色 必須使用bg-dark(預設為bg-light)
<p class="text-black-50">.text-black-50</p> text-black可直接調顏色比例


大多時候放表格table或列表list
<table class="table"> (<th>...</th><th>...</th>,<tr><td>... </td><td>... </td></tr> 方法跟html相同)
<ul class="list-group">(<li class="list-group-item">...</li><li class="list-group-item">...</li>) 同理有ul,ol

## bootstrap_widget_component(使用widget):

accordion(像手風琴一樣可以拉開收合)
<div class="accordion" id="accordionExample"> 使用id讓不同的元素可以相互調用
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
      aria-expanded="true" aria-controls="collapseOne">...</button>
    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
      <div class="accordion-body">...</div>

  <div class="accordion-item">
  .....第二個item.....

dropdown 下拉選單
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button"
  id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"> Dropdown button </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
  dropdown元素由dropdown-toggle和dropdown-menu兩個子元素組合而成

offcanvas 用於製作側欄sidebar
<a class="btn btn-primary" role="button" data-bs-toggle="offcanvas" 
href="#offcanvasExample" aria-controls="offcanvasExample">sidebar-button</a>
<div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <div class='offcanvas-title'></div>
    <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
  </div>
  <div class="offcanvas-body">...</div>
<div>
offcanvas-start表示從右側出現 
另有：offcanvas-end左側 offcanvas-top 上側 offcanvas-bottom 下側
data-bs-dismiss用於取消data-bs-toggle觸發的物件 
因為通常會是其物件的子元素 故不需要額外再指定data-bs-target

tooltip 不會改變任何佈局 又能提供更多訊息
tooltip和popover都需要引入popper.js(包含於bootstrap.bundle.js)
要使用前必須在js中安裝data-bs-toggle="tooltip"

<button type="button" class="btn btn-secondary" data-bs-toggle="tooltip" data-bs-placement="right" title="Tooltip on right">
Tooltip on right</button>
data-bs-toggle="tooltip" 滑鼠移動到特定元素上發時觸發
data-bs-placement="left" 基本的四種方向trbl
title="this is the title" 會出現textcontent (不需要data-bs-target)
title='<em>Tooltip</em> <u>with</u> <b>HTML</b>' title的屬性值因在html呈現 故可用html語言

popover 類似於tooltip 但需要點擊才觸發
data-bs-toggle="popover"
data-bs-placement="right"
data-bs-content="the content..................."


modal 視窗window的彈出框
<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal">
Launch static backdrop modal</button>
data-bs-toggle="modal" 
data-bs-target="#myModal" 觸發標記為<div class="modal" id='myModal'>的modal

另可再JS中用主動顯示或主動退出 以取代html中的<button data-bs-toggle='modal'>
$('.form_modal').modal('show') 或 $('.form_modal').modal('hide')

除此之外也可讓modal當作事件來觸發：
$('.form_modal').on('show.bs.modal', function(e) { // 退出用'hide.bs.modal'取代
  // DO Something      
});

modal的組成：
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">  // 特別隔出modal-dailog元素是為了決定彈出框的位置與性質
    <div class="modal-content">
      <div class="modal-header">
      <div class="modal-body">
      <div class="modal-footer">

data-bs-backdrop="static" 用來表示不充許點選彈出框之外來離開modal (預設為充許)
data-bs-keyboard="false" 是否充許案esc鍵離開 (預設為充許)

- - -------------------------------------
# widget前端常見元件名稱:
(與bootstrap無關 僅為方便輸入關鍵字來收尋前端設計元件)
button:點下去圖示上不會有變化
radio:點下去可顯示以點擊(spot/empty)
checkbox:點下去可顯示以點擊且可以多選
toggle:通常只有兩個選項(on/off)
slider:滾軸前後是不同顏色 用以表示目前的程度 (bs5為<input type='range'>)
scrollbar:滾軸前後為相同顏色 只能以位置表示程度 (側欄就是scrollbar)

- - -------------------------------------

<button>放在<h2>裡面 將其中的文字轉成btn
再用data-bs-toggle data-bs-target決定點擊後所觸發的動作
(其中bs為bootstrap之意, 本意為讓JS做addEventListener()時抓取bs相關的event
舊版為data-toggle data-target 本意是為與html5的data-命名標籤隔開)


data-bs-toggle="collapse" btn觸發後所進行的動作
(collapse崩塌, 但也有展開收合之意expand and collapse)
data-bs-target="#" 選擇控制的id
data-bs-target="." 若要控制多個元素 則控制class
data-bs-parent="#accordionExample" 可使其做為同個模組來管理

data-bs-toggle="tooltip" 滑鼠懸浮在上面就會觸發
data-bs-placement="top" title="顶部的 Tooltip" 另有data-bs-placement,title來決定樣式

aria-label="collapseOne" 通常填入本身的id名稱或此元素用途的敘述作為label
aria-labelledby="headingOne" 通常填入控制項或補語元素的id作為label
兩者都提供視覺障礙者讀屏功能 
aria-label就是朗讀字串 而aria-labelledby則朗讀此id元素的textContent
如果兩者都存在 則電腦的讀屏功能會優先朗讀aria-labelledby

<div id="collapseOne" class="accordion-collapse collapse show" ...> 為開啟狀態
<div id="collapseTwo" class="accordion-collapse collapse" ...> 為關閉狀態
這些都只是設定默認狀態 讓JS可以調用更改其變數


<a>與<button>關係： (<a>大多用在超連結或其他UI的佈局變動 <button>則適合用於form的表單)
<a class="btn btn-primary" role="button" data-bs-toggle="collapse" href="#collapseExample"
 aria-expanded="false" aria-controls="collapseExample" tabindex="0">

<button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample"
aria-expanded="false" aria-controls="collapseExample">

<a>和<button>兩者可通用 使用相同的class 並用href=取代data-bs-target=
<a role="button"> 只要不是html原生的button 都應該加上role屬性 可提供讀屏器朗讀

<a href="#hidden" class="hidden">Skip to navigation</a>
原本html原生作法 用href="#hidden"可跳到id=hidden的地方

當控制的元素有多個：
data-bs-target=".collapseExample" data-bs-target改抓class
aria-controls="collapseExample1 collapseExample2" aria-controls仍是抓id 但充許一次抓取多個
其實只要用data-bs-target屬性便能完成配置 aria-controls僅為提供讀屏器朗讀功能

**aria(Accessible Rich Internet Applications,即無障礙網頁)**
wai-aria主要目的為提供視覺障礙者可以使用螢幕讀屏器 例如aria-label:'輸入訊息'

aria三要素：role角色, aria-attr.屬性, status狀態
role="button" 表示元素為按鍵<button>功能 role="navigation" 為<nav>功能
常見的role:search, tabgroup, tab, listbox
aria-expanded="false" 前者為屬性表示目前展開或收合 後者為狀態用"true"或"false"
主要為使底層的JS調用 因此aria-expanded="false"表示首次登入頁面的默認狀態

tabindex="0" 表示此元素可聚焦 也就是可用tab鍵選到該元素
其中屬性值即是被選到的順位 通常<a>元素都會使用
tabindex="-1" 只要數字小於0 則不能在網頁中用tab點選 但仍能接受focus事件
數字越大則tab輪轉的順位越前面 通常tab也是給讀屏器使用的


- - -----------------------------
# data-bs-toggle常見屬性
data-bs-toggle="collapse"  //摺疊
data-bs-toggle="dropdown"  //下拉選單
data-bs-toggle="modal"   //模態框  點擊後觸發並可點擊退出 更像原本html所定義的彈出框(常用於警告)
data-bs-toggle="tooltip"  //提示框  移動到特定元素之上觸發
data-bs-toggle="popover"  //彈出框  需要點擊才會觸發
data-bs-toggle="tab"  //標籤頁
data-bs-toggle="button"  //按鈕

- - -----------------------------


# glyphicon(字體圖示) 使用於 UI 小圖示
(bs4之後 已被Octicons和FontAwesome取代)
<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
大多時候用<span>且不會夾帶任何content 表示行內元素
aria-hidden="true" 讀屏器不會朗讀此元素
FontAwesome(fa)與GoogleFonts是目前的主流
fa: <i class="fa fa-paw" aria-hidden="true"></i>  // <i>原先用於將字體斜體 類似於<b>將字體粗體
gf: <span class="material-icons-outlined">android</span>

FontAwesome需要註冊會員 使用Font Awesome kit:
<script src="[YOUR_KIT_CODE]" crossorigin="anonymous"></script>

GoogleFonts的icon只需要加上：
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">

GoogleFonts的icon提供5種風格：(目前已被整合為一種.material-icons)
<i class="material-icons">donut_small</i> 
<i class="material-icons-outlined">donut_small</i>
<i class="material-icons-two-tone">donut_small</i>
<i class="material-icons-round">donut_small</i>
<i class="material-icons-sharp">donut_small</i>
且必須針對特定的風格引進css:
<link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet">

可以添加自製的class屬性來換顏色與大小: 
color:black 和 font-size:24px

# bootstrap_display:
(bs4後改成d-{attribute} ,d為display之意)
<div class="d-block">
d-none:不顯示也不佔空間
d-block:塊狀容器 大小以內容物判定 也可用style另外設置寬高屬性

visible和hidden:(舊版 bs5被改掉)
指定特定尺寸做顯示或隱藏
常用visible-lg(螢幕尺寸較大才可見) 和hidden-sm(螢幕尺寸太小則隱藏)
可用visible-lg-up 表示尺寸大於lg者都會顯示(lg,xl)
可用visible-sm-down 表示尺寸小於sm者都會顯示(sm,xs)

故可用：
d-none d-sm-block 取代 hidden-xs-down 和 visible-sm-up
表示在大於sm後才會以d-block做塊狀顯示
d-none 取代 hidden-xl-down 和 hidden-lx-up
表示全部隱藏
d-sm-none 取代 visible-md-down 和 hidden-sm-up (或為d-sm-none d-block, 但d-block為預設不用加)
表示大於sm後才會隱藏(d-none)
故d-{}-block,d-{}-none都是指大於該尺寸者全部顯示/隱藏
因此如果只要特定尺寸顯示 就會變得很複雜
ex : visible-lg 需要用 d-none d-lg-block d-xl-none三個屬性

d-print-block d-print-none 用於有列印需求的網頁:
<div class="d-none d-print-block">Print Only (Hide on screen only)</div>
表示只有在列印時才顯示 常用於一些時間的副標題
<div class="d-print-none">Screen Only (Hide on print only)</div>
表示網頁有顯示 但列印時隱藏

<div class="visible">看得到</div> visible為預設 所有元素都預期為可見的 
<div class="invisible">看不到</div> invisible則可以不變動佈局的情況下 讓元素無法被看見

display的五大屬性：
<div class="d-inline"> 本身元素<div>為inline(如同<span>) 會自動並排直到溢出才換行 長寬屬性由內容決定
<div class="d-block"> 本身元素<div>為block(如同<div>) 單一元素就會自動換行 並可設定bloc長寬屬性
<div class="d-inline-block"> 本身元素<div>有inline和block性質 會向右擺放溢出才換行 且可設block長寬屬性

d-flex和d-inline-flex的內部元素都是flex 不會有差異:
<div class="d-flex"> 本身元素等同<div class="d-block"> 會直接換行 
<div class="d-inline-flex"> 本身元素則為<div class="d-inline-block"> 溢出後才換行

## flex佈局模式：
block與flex差別在於: (差別只在影響內部元素(flew-item)的擺放 本身元素並不受影響)
block內部的元素則會直接換行
flex內部的元素會沿著flex-direction屬性(row 水平佈局)方向繼續擺放
因此可以因為不同裝置尺寸的寬度來調整擺放 若寬度較大則可放多個元素
(flex-direction分為四種：row, row-reverse, column, column-reverse)

flex-direction 決定row當主軸 則column自動變為交叉軸 (只有flexbox才有用到主軸與交叉軸)
且所有同row的內部元素都會拉到等高以方便溢出後換行 (即align-items:stretch為預設值)
flex-wrap:wrap 溢出後部會換行 為預設值
flex-wrap:nowrap 溢出後自動換行

可用flex-flow屬性：即flex-direction和flex-wrap之組合
flex-flow:row nowrap; 此為預設值 

另一個好處是：
flex元素才能做justify-content和align-items 可方便內部元素做定錨
但內部元素不能自行用position:absolute做定錨設置 必須透過flex父元素來設置位置 
此外flex元素不影響position:relative的whtrblz屬性值仍有效 兩者可連用


## grid佈局模式:
不同於Flex的一維佈局模式 Grid為一種二維的佈局方式 
使用row與col結構來做網頁佈局即為grid模式(網格模式)

<div class="d-grid gap-3">
內部元素網格化 且可用gap決定各個元素之間的間隔


~float佈局模式： (目前已被flex取代)
最早期的用法為使圖片在文章內部區域浮動 文字不會因為圖片而被遮住
<div class="container">
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus imper
  <img class="float-right" src="...">

<div class="bg-info clearfix">
  there are both buttons above.
  <button type="button" class="btn btn-secondary float-left">
  <button type="button" class="btn btn-secondary float-right">
float-left,float-right 用於內部元素 表示可浮動到指定位置
由於只能決定left或right 元素的高度不能控制 不同於flexbox可伸展到自動等高
clearfix表示其內部文字內容不會與其他浮動元素並排 會由浮動元素的下方開始排
(bootstrap在container加上clearfix 即為在container的最後加上偽元素::after)

<div class="container">
  <div class="item item1">1</div>
  <div class="item item2">2</div>
  <div class="clearfix"></div> 
  (可直接用偽元素取代 .container::after 其功能等同<div class="clearfix">)

.item{
  float:left; 此時所有item的元素會由左至右並排
}
.clearfix{
  clear: both; 表示清除掉左右兩邊的其他元素
}

沒有float屬性,只有clear屬性：
故本身只是內部的一般元素 原本會與浮動元素排在同一列 
但因為clear屬性導致其元素內容會往下排 從浮動元素的下面開始排
其方法也是為處理浮動元素height:0的問題 
若沒有clearfix則container的height:0 會因扁平導致無法顯示

bootstrap的作法：
自動生成container的DOM架構中最後一個元素 作為<div class="clearfix">:
.container::after { 
  content: "";
  display: block;
  clear: both;
}

img 圖片元素
<img class="img-fluid" src="..." alt="...">
表示寬度到與該元素區塊等寬 max-width: 100%; 但長度配合圖片大小 height: auto;
<img src="..." class="img-thumbnail" alt="...">
thumbnail縮圖會有1px的邊框

<img src="..." class="rounded" alt="..."> 表示圖片四角是圓的
<img src="..." class="rounded-circle" alt="..."> 表示用圓型框

通常使用<img src="/portfolio/pic1.png">的元素：
會用<div class="portfolio-div"> 在class的屬性值標記

用戶頭像avatar：
<img scr="... " class="avatar" alt="..."> 亦為常用名稱

<picture>
  <source srcset="/media/cc0-images/surfer-240-200.jpg" media="(min-width: 800px)">
  <img src="/media/cc0-images/painted-hand-298-332.jpg" alt="" />>
響應網頁更換<img>的方式 內有多個<source> 但只會有一個<img>顯示

<div class="left"> 和 <div class="right">
表示內部元素由左邊排起或右邊排起 如果內部有多種元素時DOM元素就不用前後調整
(bootstrap4 後被pull-left和pull-right取代)

<div class="float-start">Float start on all viewport sizes</div>
<div class="float-end">Float end on all viewport sizes</div>
則表示向前或向後對齊

<p class="text-start">Start aligned text on all viewport sizes.</p>
<p class="text-center">Center aligned text on all viewport sizes.</p>
<p class="text-end">End aligned text on all viewport sizes.</p>
同理用text也能達到依樣的效果 (不能給flex元素使用)

- - -----------------------------
# css_attribute_id

常用css: (皆以自訂的id與或物件型的class為例)
#dialog_box{
    background-color:#669FC7;  設置背景色
    border-radius: 15px;  設置對話框圓角
}
#panel_body{
    overflow-y: scroll; 自動產生滾軸 內部元素長度超過區塊時才顯示
    overflow-x: visible; 表示直接顯示超過區塊的部分
    (overflow-y: auto 為預設值 由瀏覽器依據元素選擇scroll or visible)
    height: 250px;  設定高度 常用於設置外掛式的諮詢視窗
}

.background{
  overflow:hidden; 隱藏內部元素長度超過區塊得部分
}

.avatar{
    z-index: 9999 !important; 將頭像放在最前面 表示不會被任何元素阻擋
    (z-index:auto; 推疊的順序與父層一樣 即為default 對於其他元素而言為z-index:0;)
}

.row_center{
  align-items:center; row元素交叉軸對齊 即垂直對齊
  justify-content: center; row元素主軸對齊 因為flexbox的預設將row視為主軸故即為水平對齊
  (justify-content和align-items都只能用在flex元素 留有空格做佈局 這也是flex內部元素不會將父元素填滿的原因)

  text-align:center; 不僅適用於文字置中 也適用於任何行內子元素(inline)
  (text-align:justify左右兩邊都對齊 常用於將inline元素平均分配在content上)
}

align-items用於父元素 可將內部所有的子元素做排序 
align-self則用於單一的子元素

text-align不能給flex元素使用 因為那是inline和block元素才能用的
而且text-align會影響內部子元素以及孫元素等多層元素的排列方式 有時會發生問題

align-items:stretch 將同列(content)的子元素拉到相同的高度
align-items:baseline 將同列(content)的子元素

justify-content:end和text-align:right的差異：兩者都是把內部元素往後排列
justify-content適用於內部有多個block的時候(<div>) 此外justify-content只能用於flexbox父元素
而text-align則用於內部都是inline元素的時候(<span>)

用start-end取代left-right 
是因為不是所有語言書寫都是由左到右 (ex:阿拉伯語是從右到左)
並可設置 direction:ltr從左到右(預設) 或 direction:rtl從右到左

- - -----------------------------
# css_attribute_class

只使用一項屬性的css:(以自訂的class屬性為例)
常見作法是讓css屬性轉成class類別以方便使用(如同自行設置一份bootstrap.css檔)

.pos_rlt{
  position:relative; 由調整元素的預設位置(static)而來 使whtrblz等屬性有效
  (position:static 即為元素的預設位置 此時whtrblz等任何屬性皆無效)
  top:20px; 表示與原先的預設位置的偏移距離 即元素會往下偏移20px
} 
此外其他同層元素仍受relative的元素的原始預設位置所影響 而非新的偏移位置
即relative的元素仍會佔據原本的預設空間

.pos_abs{
  position:absolute; 表示元素的絕對位置 其數值以被定位的父元素之相對位置來配置
  (position:fixed 也表示元素的絕對位置 但其數值以viewport視窗相對位置來配置)
  top: 10px; 表示與父元素邊界的偏移距離
  (top: 5%; 依據父元素大小來算比例) 
}
不同於static和relative 使用absolute和fixed的元素不會佔據原先的預設空間
(DOM都有預設的static document flow：即position:static所擺放的位置)
此外block元素的特性預設寬度會撐開整個父元素 但因為absolute和fixed元素跳脫原先的預設空間 
此時的寬度會以內部元素為基準 
因此通常絕對位置屬性較常使用whtrblz等屬性 且會搭配margin:auto來調整位置

若absolute的父元素沒有被定位 則等同定位於<body>：此時效果會跟fixed相同
因為手機裝置幾乎不支援fixed 故可以用absolute定位於<body>來替代
(只要position:static皆為未被定位 即position預設的屬性即為未定位)
用absolute做定位最好用單一元素 且此元素應大小固定 例如<nav>, <footer>, <header>...等

這點對於巢狀結構極為重要 
最好的辦法是父元素的position屬性用relative取代static 來解決父元素沒有定位的問題


margin-top與top之差別:
top只會考慮與父元素邊界之距離 不會推壓到同層的其他元素
反之margin-top則會擠壓同層的其他元素

.box {
  width:100%; 
  min-width:500px; 表示最小為500px 無法再縮小
  (當width為可變變數 此時可用min-width, max-width作為width的數值範圍)

  box-sizing: border-box;  設定的寬度包含padding,border
  (box-sizing:content-box 則表示設定的寬度只包含內部的content)
}
height:100%和width:100% 有些許不同：
由於在內容為空且未被定位的父元素中height:0 若內部子元素用height:100%則不會顯示
而父元素即使內容為空仍會填滿width(block元素的特性) 故內部子元素可用width:100%正常運行
因此在設置響應式高度時
應採用top與bottom來取代height 來解決父元素沒有定位的問題 故一般不會出現height:100%

而父元素的height(auto)會因為內部子元素的內容而撐開 且已知父元素的width(100%)會自動填滿
因此父元素的height(auto)會受內部子元素影響 而反之子元素的width(100%)會受父元素影響 
hight:auto表示直接依據內部子元素的height而定 此為預設值

100%與auto之差異：
width:100%表示與父元素寬度100%相同 但不算入margin寬度 因此可能導致其結果超出父元素
width:auto表示直接依據內部子元素的width而定 此為預設值 此時內部mg,pa,bd的寬度都會使元素寬度往外擴
CSS的預設值就是為讓內部元素盡量容易佈局 符合子元素都會在父元素之內的原則

height:100vh和width:100vw: 常用於響應式設計
不同於100%以父元素的大小為基準 100vh直接以裝置螢幕的大小為基準 
由於直接忽略父元素 故會用position:fixed 取代 position:absolute

.line_break{
  word-break: break-all; 無論方塊字(中,日,韓)或拼音字(英,法)都會自動換行
  (word-break: break-word 方塊字自動換行 拼音字則會保持單字完整 最常使用
  早期版本用：word-break: normal; && word-wrap: break-word; 之後簡寫為word-break: break-word)
}
.line_wrap{  (word-break:break-all 則不會有單詞太長問題 故不用理會word-wrap屬性)
  word-wrap: break-word; 當單詞太長(overflow)時的處理方法 即如何包覆起來(wrap)
} 

.line_space{
  white-space: normal; 連續空白字元會被合併為單一空白字元 且換行只在空間限制時發生
  (white-space: nowrap 內部字串即使在空間限制時仍不換行)
  (white-space: pre-wrap 連續空白字元會被保留 且在換行字元,<br>與空間限制時都會發生)
}  
以上三者常用於處裡元素內的換行功能 通常用於<p>元素上 且有時會相互抵觸 

.d_none{
  display:none; 用於事先隱藏元素：會改變DOM佈局 其餘元素會以沒有此元素的狀態做佈局
}
$(物件).hide(); jQuery的hide就是採用display:none的方法

.v_hidden{
  visibility:hidden; 也是隱藏元素：但只是看不到 元素的位置不變即不會改變DOM佈局
}

fit_cover{  
  object-fit:cover; 通常用於圖片元素 可維持原比例但會把多出的部分直接切掉 
}

fnt_250{
  font-size:20px; 20px字體
  (font-size:250%; 比父元素字體大250%)
}
font-size字體大小 font-weight字體粗細 font-style斜體
font-variant針對某些字元做變形 slashed-zero為處理'0''O'太相似問題 common-ligatures英文中的連字
font-family 用於決定預設字體：
但不會做下載動作 故要選擇各種瀏覽器都通用的字體


- - -----------------------------
# css_pseudo CSS 的偽元素(pseudo element)
偽的意思就是在html中看不到差異 只有觸發或符合條件時才顯示

<q>這是一句話</q>
// output: «這是一句話»

q::before {  
  content: "«";
  color: blue;
}
q::after {
  content: "»";
  color: red;
} //::before 和::after可放在css中 用於處理元素的頭/尾部分


after,before常用方式:
q::after{
  content:"";  使用空字元只為取border的樣式 (因為margin,padding都部會顯示)
}

::-webkit-scrollbar 用於修改滾軸的樣式
  ::-webkit-scrollbar-thumb — 滾軸的滑塊
  ::-webkit-scrollbar-track — 滾軸的軌道
不是標準用法 並不支援所有的瀏覽器

- - -----------------------------
# css_pseudo 另外還有CSS偽類(pseudo class) 
作為css的選擇器 找尋DOM的子類元素 
偽的意思就是在html中看不到差異 只有觸發或符合條件時才顯示

li:first-child{  // 並不需要在html中標明子類 會依據CSS來改變樣式
  background:#c00;
}
background-color最常被使用 除此仍有
background-image:url 用於設置圖片背景
background-size:cover 當圖片尺寸與容器不符時的解決辦法
background-clip:border-box 即backgroud的範圍是否延伸至border (border夠寬才有差別)

另有 last-child：最後一個子元素 nth-child(數字)：第幾個子元素

<div class="title">  // html中的元素屬性不用改變
  平常是橘色，滑到我這變紫色
</div>  
.title {
  color: #faa;
}
.title:hover {
  color: #aaf;
}
當滑鼠移到元素上方時觸發 用於提示

input{
  color:white
}
input:focus {
  color: red;
}
當點擊元素後會被觸發 常用於聊天室的輸入欄

偽元素與偽類可同時使用：
<div>Hello</div>

div::after {
  content: "碰我會變色";
  color: #aaf;
}

div:hover::after {
  content: "就說會變吧";
  color: #faa;
}

if ($("div").is(":focus")) {  // 當點擊時 $("div").is(":focus")==true
  ...
}  // 偽元素與偽類同樣能被css_selector所選取
.is()只會回傳boolean 常引入偽類或css做參數

if ($(this).is(":checked")){
  ...
}  // 用:checked來紀錄input是否被點選

$(this).find(":checked").css("background","red")
find()或children()才會回傳jquery object

- - -----------------------------

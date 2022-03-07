# html 基本方法:
html中引入CSS,JS的方法
CSS引入:
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

JS引入:只需要也只能用<script>...</script>插入JS code
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


## html_tag <a>:
<a>用於做超連結或執行觸發的動作：
<a href="{% url 'index' %}">Home</a> 
url是django模板標籤 必須要在urls.py中設置urlpatterns的path(name='index')函數做映射器
另外有re_path() 即使用正則表示法regular expression的path()

可用onclick取代href 以開啟其他瀏覽器視窗
<a onclick="showClickLinkConfirm('$1')">$1</a>

window.open(strurl,'_blank') 為非同步方法
獲取strUrl的資源 並在另一視窗打開('_blank',或可用<a>元素的id值)

另一種用法：
<a href="javascript:function1()">运行 function1</a> 可用於執行<script>內部的方法

## html_tag <form>和<input>:
{% if next %}
<input type="hidden" name="next" value="{{ next }}" />
{%if...%}和{{}}同樣使用next變數 可用於當input輸入完資料並submit
{% endif %}

<p>{{msg}}</p>  msg在python為字串形式 則可直接做為p元素的text 
<input value='{{msg}}'>  但若插在標籤屬性值 則msg的外圍應該加上'' 
簡而之dtl模板語言的變數可以插在html中的任何地方 只要符合格式即可

<input id="team_name" type="text" name="name_field" value="Default name for team.">
id用於html辨識 name則用於POST(request)表單傳送 value則可用於初始值
value是為取代textContent 因為<input>屬於單一tag的元素

<form method="post" action="{% url 'login' %}" target="framename" autocomplete='off'>


action的屬性值為URL 用於表示向此頁面發送表單
method常用的只有："post"或"get"兩種 兩者都可以發送表單
"post"屬於先建立連接 並由server端的來明確指示如何使用參數數據
只要涉及server數據庫修改的 都應該使用"post"

target屬性表示input後用以回應的顯示位置 target="_self"
target="_blank"表示另外開啟新視窗 
target="_hidden"則表示不顯示
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
亦可直接用<iframe src="url" ></iframe> 導入其他網頁內容(但不被推薦):
為避免重複:
<iframe id =' (new Date()).getTime() + "-" + parseInt(1e3 * Math.random()) + name'> </iframe>
若此物件只使用一次時 才會用(new Object())這種寫法

autocomplete='on' / 'off' 等同於內部的input元素都是相同的autocomplete屬性設定

## <iframe> js_時間做法 new Date():
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
form表單最後只會有一個name:value 故radio選項中只能選一個

<form id='send_form'>
有時<form>元素也可以完全不加屬性 所有eventHandler都用JS來執行



## <form> CSRF(Cross-Site Request Forgery) 
加上CSRF:
<form method="post" action="{% url 'login' %}">
{% csrf_token %} 
(會自動生成：<input type="hidden" name="csrfmiddlewaretoken" value="0c90dab91e22382cbaa5ef375f709167">)
只要有POST的請求都應該附上CSRF 
因為會自動生成<input>元素 故可用val()來找其值
'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()

只要有MIDDLEWARE有使用到：'django.middleware.csrf.CsrfViewMiddleware' 
則從client端來的request就一定要有csrf_token 且一定要放在form之中 不能用JS中抓取csrf_token


若沒有在模板上附上則可在view使用@ensure_csrf_cookie：
@ensure_csrf_cookie
def my_view(request):

CSRF_USE_SESSIONS=False為預設 此時會存入cookie當中
但有時為安全性考量 會將其存放在server端中(session) 此時CSRF_USE_SESSIONS=True

CSRF_COOKIE_HTTPONLY=False為預設
若CSRF_USE_SESSIONS=True 則不能透過JS不能直接存取CSRF 故一般幾乎不會用

CSRF_HEADER_NAME = 'X-CSRFToken'預設 用AJAX時 需要以此做參數 放入request的headers中
const request = new Request(
    {headers: {'X-CSRFToken': csrftoken}}
);
CSRF_COOKIE_NAME = 'csrftoken'預設 用js抓取csrf值時會需要以此作參數 
function getCookie('csrftoken')

CSRF的中文翻為跨站請求攻擊或跨站偽造請求
攻擊者會偽造請求(不知名連結...等)給其他被攻擊者 讓被攻擊者在"不知情"的情況下送出請求
如此一來就會通過該網站後端的身分認證機制 因為也確實是被攻擊者所發送的請求

csrf_token：用於確認請求是來自上一頁正確的表單 以此避免在站外連結所送出的請求
當在登陸頁面時 會自動生成一組安全代碼 而當後端接受數據時 必須要有該組代碼才會通過

為防止CSRF 應避免任何只要輸入網址就可以執行的動作(GET)
所有的"GET" 應該都只能是唯獨的動作


## <a> 用django template做{% url %}
<li><a href="{% url 'login'%}?next={{request.path}}">Login</a></li>
用<a>的next屬性 可設置href屬性連接之後會跳轉到的頁面 可以蓋過原先的預設
{{request.path}}則表示前頁面 即login/logout之後會回到原先的頁面

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


## html_tag <nav>,<header>和<footer>:
都是早期全靜態網頁時的使用方式 目前大多用div搭配bootstrap等cs框架取代
<footer>會在頁面最下方用於放置版權等資訊 <header>通常放置於頁面最上方 用於介紹標題
<nav class="menu">
  <a href="#home">Home</a> 
<nav>則負責放置其餘資訊的連結 通常內部會有<a>元素

實際上大部份html元素都能用<div>取代 
但用特定的元素能快速抓到整個網頁的架構 有助於SEO優化

## html_tag <main>和<section>,<article>和<figure>：
<main>用來放置網頁最重要的部分 內部還會有更多分區排版<div>
<section> 同樣用於分區排版 但<main>只能有一個 而<section>能有多個
<article>用來包覆文章 <figure>用來包覆圖片 

# django_template (html):
Client-side Render(CSR,前端渲染)和Server-side Render(SSR,後端渲染)之差異：
django的template語言就是屬於SSR 在後端生成後傳給前端
若先用JSON傳給前端在用JS做生成則為CSR 後端直接傳給前端資料
如果著重在SSR 也較記得放一些描述網站的資訊給搜尋引擎來做SEO
另外資料驗證應該前端與後端都做：前端驗證是最節省效能的方式 後端驗證可以避免有人硬改JS

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
{{ my_object.attribute }} 同理物件的屬性也行 物件的可調用方法可返回其結果

<ul> 
{% for key, value in choices.items %}  同理可用python的方法做for-loop
  <li>{{key}} - {{value}}</li>
{% endfor %} 
</ul>

{% for i in range(1,10) %}  有些python的常用方法不能在dtl中使用 像是range()
    <h2>{{i}}</h2>
{% endfor %}

故需要改為 {% for i in range %} 先將ragne(10)做成list 再傳入
並用render_response('template.html', {'range': range(10)}) 將range傳入template中

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
  <tr class="{% cycle 'row_odd' 'row_even' %}">{{ o }}</tr>
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
當碰到第二次{%cycle cycle_name%}時 即填入cycle中的下一個變數 若為{%cycle_name%} 則仍使用cycle中的當前變數


<li class="{% if bookinst.is_overdue %}text-danger{% endif %}">
django template{%...%} 也能插在標籤的變數之中

{% extends "base_generic.html" %}
子輩template必須使用extends來繼承父輩template
{% block title %}...... {%endblock%} 
block放在父輩template中 可讓子輩template改寫 (block大多只會透過繼承方式改寫 不會由其他py檔寫入)

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
|force_escape 用於將其他filter的結果在做轉譯
|linebreaks後會有<p></p>  |force_escape可將其留下來輸出

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

{{ data_value|date:"D d M Y" }} 可用於將DateTimeField換成字串

{{ value|default:"nothing" }} 如果變數為''則換成default值
{{ value|default_if_none:"nothing" }} 如果變數為None則換成default值

var dict = {{ py_dict | safe }}; var list = {{ py_list | safe }}; 
必須放在<script></script>中 以字串的形式建立變數

{{ value_list|dictsort:"name" }} 將list依據其中的dict.name做排序後輸出
其中輸出的內容會以字串在html中顯示

{{ value_list|first }}, {{ value_list|last }}, {{ value_list|random }}
 只會返回list中的第一位, 最後一位 或隨機一位
{{ value|length }}, {{ value|length_is:"4" }} 返回list長度 或 True/False

{% for book in books|dictsort:"author.age" %}  
    * {{ book.title }} ({{ book.author.name }})  因此通常會將不同屬性以特定形式顯示
{% endfor %}

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

<img src='{{ profile_photo }}'> 不要把html的標籤屬性值作為變數 供外部使用者input
若input為"/img/home-bg.jpg onload=alert(1)" 就會導致django的轉譯無法防範

django template comment {#...#} 
就是放於html的註解

## django template 軟體架構
MVVM模式取代傳統的MVC模式
即ViewModel取代Controller 其中Vue就是用於ViewModel的功能
若model被改變時 會同步在view上更新對應內容(data bindings)
同理在view上觸發事件時 會將狀態用物件表示的方式回存至model(DOM Listeners)
ViewModel框架即具有即時性 進而取代Controller

Django所使用的是MVT模式 也就是Template取代Controller 
當要從資料庫model中抓取資料並呈現在view上時 可藉由Template的模板語言實現
所有的view都必須將一個template做為參數(html檔)

# html_meta 敘述元素
為了可以在不同裝置上使用
一般都會使用響應式設計(RWD) 可直接使用bootstrap-responsive.css
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link href="assets/css/bootstrap-responsive.css" rel="stylesheet">

用於適應不同手機大小與解析度
<meta name=”viewport” content="width=device-width, initial-scale=1.0">
一般圖檔尺寸大小144*144使用pixel 此為電腦像素的最小單位
但不是我們的長度單位:要換成長度 必須要有手機大小4.3寸(對角線,inch)和解析度1280*720

<meta name="csrf-param">和<meta name="csrf-token">
這是Rails框架的寫法(ruby語言

<meta name="title" content="Meetunnel 最棒的匿名聊天平台">  // google已取消使用此tag 與<title>重複
<meta name="description" content="最棒的隨機陌生相遇平台！享受匿名聊天的浪漫！獨家功能：封鎖、檢舉、換照、尋人...，立即上MeeTunnel，讓你遇見對的人！">
<meta name="keywords" content="聊天,匿名,交友,約會,認識,相遇,感情,朋友,匿名聊天,chat,anoymous,date,meet">  // google已取消使用此tag 已被濫用

<noscript> 不支援JS時 用img替代
"<img src="https......" style="display:none;" height="1" width="1" alt="" />"
</noscript>

除非有其必要 不然別用<button onclick="function()"></button>
會把JS與html混在一起 增加維護難度
但弱勢動態生成的新元素則用此方法較好 可以減少再用jquery做搜尋的時間

<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
IE的版本兼容設定：IE=edge表示由用戶當前的最高IE版本決定 並會自動使用chrome的框架

<meta name="google-site-verification" content="zdvMUg9S3bTS8OmA2wBC29J-0UPCIsE6XSHqSOjyJSo">
向Google Search Console提交網站時 需要確認是網站擁有者 
只有網站擁有者才能存取相關的google搜尋數據

name=apple-mobile-(...) 都是與行動裝置上存取網頁相關的設定(分成iOS和android)
<meta name="apple-mobile-web-app-capable" content="yes"> // iOS-safari
<meta name="mobile-web-app-capable" content="yes"> // android-chrome
把網頁當app安裝到行動裝置的主畫面之後：
content="yes"若由app進入取代由瀏覽器進入 將會是全螢幕狀態 (如同一個原生app 但仍是由瀏覽器執行)
content="no"為預設 由app進入後不會是全螢幕 就等同是在主畫面上多了一個網頁書籤而已

<meta name="apple-mobile-web-app-status-bar-style" content="black"> 
作為原生app使用(直接全螢幕) 會使iphone螢幕上的狀態欄被遮蓋 此時用"status-bar-style"做設定(black)

<meta name="apple-mobile-web-app-title" content="WooTalk">
當成原生app安裝到主畫面時的title

<link rel="apple-touch-icon" href="/icon.png">  // iOS
<link rel="icon" sizes="192x192" href="/smallicon.png">  //android
<link rel="shortcut icon" type="image/png" href="/icon-rounded.png"> //android
當成原生app安裝到主畫面時的icon圖示

open graph: 用於決定當使用者在FB或支援FB格式的網站分享url時 所顯示的標題,資訊,圖片
<meta property="og:title" content="What is Open Graph?">
<meta property="og:description" content="Computer dictionary definition for what Open Graph means including related links, information, and terms.">
<meta property="og:type" content="article">
<meta property="og:url" content="http://wootalk.today/"> 
<meta property="og:image" content="facebook.gif">  // 最好1200*1200以上
<meta property="og:site_name" content="wootalk 吾聊">  // 指網站名稱 不同於title為網頁名稱 

facebook id 相關的應用
<meta property="fb:app_id" content="您的應用程式編號">
<meta property="fb:admins" content="您的Facebook ID">

<meta name="robots" content="noindex, nofollow">
告訴搜尋引擎不要再搜尋結果中顯示此網頁(noindex) 也不要追蹤此網頁的連結(nofollow) 常用於內部人員的後台
<meta name="robots" content="nosnippet">
告訴搜尋引擎不要再搜尋結果中顯示此網頁的摘要

<template id="t1">... </template>
元素不會被渲染 用於保存內容 來讓js做選擇提取使用

<style data-fbcssmodules=""></style>

<script>ga()......</script>
Google Analytics(GA)可用於追蹤點擊紀錄 必須引入analytic.js並在js檔中加入ga()

<h1>h1. Bootstrap heading <small>Secondary text</small></h1>
<strong>rendered as bold text</strong>
<small>元素 表示會使content的字體放小 / <strong>元素 則是會變粗體
後一些html標籤是在bootstrap中的CSS定義出來的
(能夠自行定義tag名稱是由XML開始 往後大多數框架都有相關的設計)


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

POST的content內容(放於header檔中)：
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
用<input>的name屬性來區分不同的封裝訊息 

- - --------------------------------
# http_code代號：
101 switch 轉換協定 (ex:http->ws)

200 OK 伺服器回應成功 
201 created (ex:PUT,POST 成功建立新的內容)
202 accepted （ex:DELETE 成功請求但還未執行)
204 no content (ex:POST 當使用者並未更改資料但仍發送請求時 此時伺服器只會確認此要求但不做更動)

301 redirect 即重新整理當前網頁 (仍與原本用戶輸入的url相同)
(由 /chat 轉為 /chat/ (多加'/') 也是301的的導向功能)

302 redirect 後端urls.py重新導向到新網頁 (其結果會與原本用戶輸入的url不同)
以上兩者都是redirect 但301會影響SEO排名 會導致被轉移的原網頁降名 (但都同一個url故其結果不變)

304 瀏覽器已讀取了所有Data 即目前無更新資料

401 需身分驗證 (SSL key...)
403 無讀取權限
404 伺服器未找到目標網址 resource不存在
408 瀏覽器請求時間過長

500 伺服器發生錯誤
503 伺服器當掉
505 瀏覽器不支持此html版本

- - --------------------------------
# http_request請求類別:
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
在網站的特定值做變動應使用POST 因為每次增加減少都會使該值變動 

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

xs:為手機直立的寬度  直接width:100%即可 不用設固定寬度 一般長度為372px => 120px * 3.1倍 
xm:為手機橫放的寬度  @media (min-width: 576px)  => 120px * 4.8倍
md:平板電腦的寬度  @media (min-width: 768px),  => 120px * 6.4倍
lg:一般電腦的寬度  @media (min-width: 992px),  => 120px * 8.3倍
xL:超大型電腦螢幕的寬度  @media (min-width: 1200px)  => 120px * 10倍

full-scream就是1440px * 1080px 為4:3長寬比 (為應付全螢幕 瀏覽器背景要能有此大小)
但一般瀏覽器會有上層UI介面 故為1440px * 900px 為8:7長寬比
上層的UI介面約為180px 而瀏覽器右側slide為32px 

瀏覽器的最小寬度為500px 故logo大致上不能超過這個大小 500px * 500px
youtube的video元素之高度為528px 當瀏覽器大於最小寬度時稍為放大一點 528px * 528px 
google的輸入欄最小寬度為436px 故當瀏覽器在最小寬度時應再縮小一點 436px * 436px

同理grid模式的row,col也會有{breakpoint}系統 但響應式設計不太一樣
以col-xs為例：只要大於xs的尺寸大小 就會變垂直排列以避免方格變形(類似於手機的排版方式)

大致邏輯是xxx-{breakpoint} 表示只適用於大於此{breakpoint}尺寸的裝置
故-xs為其預設(即col-xs-4 等同 col-4) 即可適用於所有大於xs尺寸的裝置 


另外還有media_queries(@) 可用於偵測裝置大小並輸出符合大小的css內容
@media (min-width: 768px){  // 最小寬度為768px以上的裝置
  width:744px;
}
當大於768px(mg+pa+內部寬度)時會做width:744px;(pa+內部寬度)
(注意：media的width指的是瀏覽器視窗總寬度 而css中的width則指的是該元素不包含margin的寬度)
亦即margin最小為24 而隨螢幕寬度放大 margin也會隨之放大

故反之還有：
@media (max-width: 1200px){  // 同上 但表示最大寬度為1200px以下的裝置
}

margin 元素與外部元素之間的邊界間距 padding 元素與內部內容之間的邊界間距
何時使用 差別只在於width會把padding算進去 且 元素的border的位置會不同
margin用於全裝置統一留空的部分 而padding則用來微調不同裝置填空的部分
對於有背景色的元素而言border相當重要 此時mg,pa就不能混用

border 則是元素外框 用來設定邊框寬度與樣式 (border之內就算是content)
故外部元素的padding會和內部元素的margin相互影
padding-right:15px 和 padding-left:15px
此為padding的預設值 故通常container的寬度要比content還要寬30px
同理row,col也基本是透過margin,padding做調節

border與outline的差異：
border可設置圓角 屬於元素的邊框線 而outline用於點擊後顯目元素 屬於元素的外框線

<div class="container custom-container-width">  第一個class後面加上空格隔開 放入特定屬性
.container.custom-container-width {
    max-width: 1010px;       // 必須放在bootstrap.css後面引入 最後內容寬為1010-30=980px
}
<div class="row no-gutters">  同理 放入特定屬性no-gutters
可以使row中的col之間不會有padding隔開
<div class="row g-3"> 最常見 表示每個col之間的寬度

row alignment system：row的重點在對齊方式
<div class="row align-items-start"> 表示對齊container的上緣
<div class="col align-self-start"> 此時會將不同對齊方式的col分開

<div class="row justify-content-start"> 表示對齊container的右側
通常只在裡面的col沒有塞滿12格時才有用： <div class="col-4"> <div class="col-4">
(用於內部元素有固定寬度的時候)

<div class="row justify-content-around"> 表示裡面元素分開排列 但不靠右側和左側
<div class="row justify-content-between"> 表示一樣是元素分開排列 但靠右側和左側

justify則為主軸相關main axis(左右) align開頭都是副軸相關cross axis(上下)
亦即將同一寬度的元素歸為content 而讓多個元素等高對齊則用items

(不常用)justify-items：此時主軸上的元素已有所在區塊 justify-items用於做靠右或靠左或置中
(不常用)align-content：此時副軸上已有多行元素 align-content用於整體靠上或靠下或置中



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

em則是rem的過期用法 會直接比對父元素的textContent字體大小
但因為巢狀結構下過於複雜而被淘汰
rem則是比對根元素的textContent字體大小 無論在哪個結構中都會是一樣的標準

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
## bootstrap_font:
字體大小選擇有分為'h1'~'h6'和'display-1'~'display-6'兩種：
<p class="h1">h1. Bootstrap heading</p> 
等同<h1>h1. Bootstrap heading</h1> 為早期用html元素標籤的方式

<h1 class="display-1">Display 1</h1> 和 <h1 class="display-2">Display 2</h1> 
同樣是<h1>標籤 但前者"display-1"比後者"display-2"大
當已經決定所用字體大小<h1>時 在用display區分同等標籤<h1>的大小

font-size大小：
medium：預設值，等於 16px ( h4 預設值 )
xx-small：medium 的 0.6 倍 ( h6 預設值 )
x-small：medium 的 0.75 倍
small：medium 的 0.8 倍 ( h5 預設值，W3C 定義為 0.89，實測約為 0.8 )
large：medium 的 1.1 倍 ( h3 預設值，W3C 定義為 1.2，實測約為 1.1 )
x-large：medium 的 1.5 倍 ( h2 預設值 )
xx-large：medium 的 2 倍 ( h1 預設值 )
(以上寫法如同使用rem單位)

smaller：約為父層的 80% 比對基準不同
larger：約為父層的 120%
(smaller, larger如同使用em單位 等同%單位)

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

collapse屬性表示此元素會回應collapse事件 navbar-collapse屬性則為在navbar的佈局
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

<button>元素除了type="button"之外 還有type="submit" 和 type="reset" 都為配合<form>元素而使用 (submit為寄出完整form資料 reset為完全清除form當下資料)
因此有些瀏覽器會將<button>元素預設為type="submit" 此時若沒有再設置type="button"就會出錯

<input type="button">是html早期的寫法 但由於單標籤內部不能包其他元素 故之後改用<button></button>取代


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

html5所提供的type屬性值: 
type="url" 可以檢驗字串是否符合url格式 一樣使用內建的正則表示法
type="email" 可以檢驗字串是否符合email格式 檢驗方法為<input>標籤的正則表示法
type="password" 可以自動將字串轉為"*"

type="tel" 在手機上會自動切換到數字鍵盤
type="date" 會有瀏覽器提供的日期選擇器

此外<input>元素也有其他相關屬性：
pattern=".+@beststartupever.com" 能夠自建正則表示法
title="請輸入beststartupever公司的信箱" title屬性必須跟在pattern屬性之後 表示當檢測錯誤發生時所顯示的內容

size="32" 為input輸入框的長度 能顯示32個字元
minlength="3" maxlength="64" 真正能輸入的最少與最多字元
list='email-list' 可以用<datalist id="email-list">在input欄建立選擇清單
required 則規定該值不能為空

autocomplete="on" 讓瀏覽器的密碼系統可以自動輸入密碼  "off"則關閉功能
autocomplete="current-password" 則只在二次造訪時自動輸入密碼


## bootstarp_form-group:
<div class="form-group">
  <label for="exampleInputEmail1">Email address</label>
  <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
  <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
class="form-group"僅為元素的佈局 用於內部元素之間會自動換行(即為元素的區塊化)
此為input的from-control 由label(標題), input(輸入欄), small(補語)組來而成
class="form-control"才能用bs內建的type篩選功能 並用type="emeil"決定輸入的格式規範  
aria-describedby="id_name"為<input>元素用於決定使用哪個補語<small>元素
for="id_name"為<label>元素的屬性 可點擊聚焦在屬性值的元素


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
// 從html到js時會將'-'拿掉 $('div').data('lastValue') == 45


input::-webkit-file-upload-button {  //Chrome and Opera
  background-color: peru;
  border-radius: 4px;
  cursor: pointer;
}
用<input>的pseudo element 可改變預設的上傳按鈕外型

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
<div class="dropdown btn-group">
  <button class="btn btn-secondary dropdown-toggle" type="button"
  id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"> Dropdown button </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
    <li><a class="dropdown-item" href="#">Action</a></li>
    <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>
dropdown元素由dropdown-toggle和dropdown-menu兩個子元素組合而成
父元素一定要用 dropdown 或 btn-group 因為會修改元素屬性為 position:relative
 
用於調整下拉表單的位置：
data-bs-offset="10,20" offset用以表示相對於原先位置的偏移
data-bs-reference="parent" reference則改變原先的參考元素 改用button的父元素為參考


offcanvas 用於製作側欄sidebar
<a class="btn btn-primary" role="button" data-bs-toggle="offcanvas" href="#offcanvasExample" aria-controls="offcanvasExample">sidebar-button</a>
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
bootstrap的許多插件都會使用到jquery 因此bootstrap會針對特定元件擴充jquery功能

若不使用jquery的話 則需要創建bootstrap的Modal實例 (反而更麻煩)
var myModal = new bootstrap.Modal(document.getElementById('myModal'), options)

除此之外也可讓modal當作事件來觸發：
$('.form_modal').on('show.bs.modal', function(e) { //  $為jq元件 退出用'hide.bs.modal'取代
  // DO Something
});
'hide.bs.modal'和'hidden.bs.modal' 當同一個元素有綁定多個事件時 此時前後順序的判斷會非常重要 綁定'hide.bs.modal'的順序會先於綁定'hidden.bs.modal'


modal的組成：
<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">  // 特別隔出modal-dailog元素是為了決定彈出框的位置與性質
    <div class="modal-content">
      <div class="modal-header">
      <div class="modal-body">
      <div class="modal-footer">

data-bs-backdrop="static" 用來表示不充許點選彈出框之外來離開modal (預設為充許)
data-bs-keyboard="false" 是否充許案esc鍵離開 (預設為充許)

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

aria-label="collapseOne" 通常填入本身的id名稱或此元素用途的敘述作為label
aria-labelledby="headingOne" 通常填入控制項或補語元素的id作為label
兩者都提供視覺障礙者讀屏功能 
aria-label就是朗讀字串 而aria-labelledby則朗讀此id元素的textContent
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

**widget前端常見元件名稱:**
(與bootstrap無關 僅為方便輸入關鍵字來收尋前端設計元件)
button:點下去圖示上不會有變化
radio:點下去可顯示以點擊(spot/empty)
checkbox:點下去可顯示以點擊且可以多選
toggle:通常只有兩個選項(on/off)
slider:滾軸前後是不同顏色 用以表示目前的程度 (bs5為<input type='range'>)
scrollbar:滾軸前後為相同顏色 只能以位置表示程度 (側欄就是scrollbar)


**data-bs-toggle常見屬性:** 
data-bs-toggle="collapse"  //摺疊
data-bs-toggle="dropdown"  //下拉選單
data-bs-toggle="modal"   //模態框  點擊後觸發並可點擊退出 更像原本html所定義的彈出框(常用於警告)
data-bs-toggle="tooltip"  //提示框  移動到特定元素之上觸發
data-bs-toggle="popover"  //彈出框  需要點擊才會觸發
data-bs-toggle="tab"  //標籤頁
data-bs-toggle="button"  //按鈕


- - --------------------------------
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

<div class="visible">看得到</div> visible為預設 所有元素都預期為可見的 
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
且所有同row的內部元素都會拉到等高以方便溢出後換行 (即align-items:stretch為預設值)
flex-wrap:wrap 溢出後不會換行 為預設值
flex-wrap:nowrap 溢出後自動換行

可用flex-flow屬性：即flex-direction和flex-wrap之組合
flex-flow:row nowrap; 此為預設值 

另一個好處是：
flex元素才能做justify-content和align-items 可方便內部元素做定錨
但內部元素不能自行用position:absolute做定錨設置 必須透過flex父元素來設置位置 
此外flex元素不影響position:relative的whtrblz屬性值仍有效 兩者可連用

flex-grow與flex-shrink：
flex-grow用於決定子元素如何平分flexbox中剩餘空間
.box1{flex-grow:1;}
.box2{flex-grow:2;}
此時平分方式為分為3等分 而box1填滿1等分 box2填滿2等分 
預設值為flex-grow:0 表示不填滿flexbox的剩餘空間

flex-shrink則是當多個子元素的總寬度超過flexbox的所有空間時 如何壓縮子元素的寬度
.box1{flex-shrink:0;}
.box2{flex-shrink:1;}
此時box1不做任何壓縮 box2則會壓縮大剛好等於flexbox的所有空間
預設值為flex-shrink:1 表示所有子元素的壓縮比例都相同



## grid佈局模式:
不同於Flex的一維佈局模式 Grid為一種二維的佈局方式 
使用row與col結構來做網頁佈局即為grid模式(網格模式)

<div class="d-grid gap-3">
內部元素網格化 且可用gap決定各個元素之間的間隔


~float佈局模式： (目前已被flex取代)
最早期的用法為使圖片在文章內部區域浮動 文字不會因為圖片而被遮住
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

- - --------------------------------

# glyphicon(字體圖示) 使用於 UI 小圖示
(bs4之後 已被Octicons和FontAwesome取代)
<span class="glyphicon glyphicon-search" aria-hidden="true"></span>
大多時候用<span>且不會夾帶任何content 表示行內元素
aria-hidden="true" 讀屏器不會朗讀此元素
FontAwesome(fa), GoogleFonts, feathericons是目前的主流
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

feathericons: (還未使用過)
- - --------------------------------
# 五大瀏覽器：GC,FF,SF,IE,OP
一般會忽略opera 因為使用人數太少
pfx = ["webkit", "moz", "MS", "o", ""] 因此有些css也需要有對應的前綴詞
-moz-{屬性}：Firefox 瀏覽器
-webkit-{屬性}：Safari, Chrome, Opera 等瀏覽器
-o-{屬性}： Opera 瀏覽器
-ms-{屬性}： IE 瀏覽器


# css_selector選擇器
CSS選擇規則：
最常用： 'tag_name' '.class_name' '#id_name'
亦可連用 "tag_name.class_name"即為找符合class_name的tag_name元素
同理 "tag_name#id_name" 找id=id_name的tag_name元素
而'.class1_name.class2_name'表示需要符合二想class_name的元素
也可用 'a[title]' , 'a[href="https://example.com"]' 找特定屬性的元素
前者找有title屬性的a 元素 而後者找href屬性為"https://example.com"的 a元素

id_name通常用在固定配件 永遠只會有一個元素 ex: container, send_text, send_btn等
大部分<input>元素都會用id_name以方便抓取
class_name則用於會動態生成的配件 ex: container內部的chat_dialog內容

'.resultParas p' 其中的" "為選擇其後代所有子節點
'.resultParas>p' 其中的">"為選擇其直接子節點

former_element + target_element { style properties } 相鄰兄弟選擇器
former_element ~ target_element { style properties } 通用兄弟選擇器
第一個元素用於表示其關係(former_element) selector只會選擇第二個元素(target_element)
"+"符合第一元素與第二元素相鄰時 "~"只要符合兩個元素在同一層即可

class與id最主要的差別：
id只會有一個且通常部會改變 class可以有多個較常經由JS的互動而改變(class="hide")

prompt(),alert()這種在window外層的method都盡量不用 風格已經被淘汰

- - --------------------------------

# css_priority優先權問題:

規則一：<h1 style="color: #ff0000;">主標題</h1>
直接在html標籤上的行內(inline)套用 順位優於 <link href="...">外部link引用

規則二：css選擇器優先順位： id>class>html_tag
即$("#id")>$(".classname")>$("tagname")

規則三：針對性越強其優先順位越高 因為表示排在越後面進行解析
div#test span { color: green; }
div span { color: blue; }
span { color: red; }
// 優先順位：green>blue>red 
// 解析時會先對<span>元素 後對<div>內部的<span>元素 再對<div id='test'>內部的<span>元素
// 前者的影響範圍會大於後者 即:div span{}只是span{}的一小部分

規則四：當其他條件相同時 後敘述比前敘述優先順位更高 
span { color: red; }
......
span { color: blue; }
而前敘述與後敘述指的是在CSS檔的前後位置

style="background:whitesmoke!important"
!important用於CSS中 為處理不同瀏覽器兼容性的問題(CSS hack)
若支持的browser會使該項屬性有更高的優先權(IE,GC) 但若不支持的browser則會自動忽略(FF,SF)
但因為會破壞CSS原先優先權的規則 導致程式維護不易
!important可覆蓋inline樣式 可用此規則來防止原先的CSS樣式被inline樣式覆蓋掉

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
  overflow:hidden; 隱藏內部元素長度超過區塊得部分
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
  (text-align:justify左右兩邊都對齊 常用於將inline元素平均分配在content上)
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
  (position:static 即為元素的預設位置 此時whtrblz等任何屬性皆無效)
  top:20px; 表示與原先的預設位置的偏移距離 即元素會往下偏移20px
} 
此外其他同層元素仍受relative的元素的原始預設位置所影響 而非新的偏移位置
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
(只要position:static皆為未被定位 即position預設的屬性即為未定位)
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
  white-space: normal; 連續空白字元會被合併為單一空白字元 而換行只在空間限制時發生
  (white-space: nowrap 內部字串即使在空間限制時仍不換行)
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
  object-fit:cover; 通常用於圖片元素 可維持原比例但會把多於部分直接切掉 
  object-fit:contain; 也為維持原比例 而少於部分則直接留黑底
  object-fit:fill; 圖片會變形來塞滿所有畫面 不會切掉也不會留黑底
  /* object-position: left top; */ 若為預設會以正中心為軸心來做縮放 可訂object-position改以左上角為軸心
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
# css_pseudo CSS偽元素(pseudo element)
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
# css_pseudo CSS偽類(pseudo class) 
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
find()或children()才會回傳$jquery object

- - -----------------------------
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
object使用for-in 而array則使用for-of (array中的key就是list的index)
因為in主要用於key 而of是針對value
for-in變數位置在裡面 故表示key或index(鑰匙需要插在裡面) for-of為屬於物件的變數 故為value(數值為物件的所有物)

in 表示在物件的'體內' 為屬性概念 用於object
of 表示物件的所屬物 為內部變數概念 用於array

in和of兩者都能用for-loop 但只有in可用於做if判別
因此set要用has()代替 而array則用includes()代替

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

前者只是一個物件變數(variable) 後者可視為物件類別(class) 
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
方法與物件的差異在於開頭是否大寫：Person()與getPerson()
另外：Person()最後不會return 而getPerson()最後會return物件(Person())

Person()只用於宣告物件的屬性 getPerson()才做屬性的賦值 如此易讀性更高
此外可充許有多個創建方法來創建同一種物件:getPersonFemale(), getPersonMale()...

-- -- --------------------------------
## js_truthy 真值表 if判斷:

if({}), if([])  // 空物件, 空陣列也是true
if("foo"), if(42), if(-42), if(Infinity), if(-Infinity) //負數或infinity都為true
等同if(true)

if("") // 但空字串為false
if(0), if(null), if(undefined) 和 if(NaN) 
等同if(false)

因為'hi' === 'hi '  //false  而'hi'.trim() === 'hi '.trim()  //true
trim用於將前後的空白去除 以避免字串判別受空白格有影響

另外判斷字串是否為空 可直接用if(str) //str = ''則為false
但為追求易讀性 更常用if(str.length == 0)

同理空陣列也都使用到length屬性 if(arr.length == 0)  //判斷空陣列
空物件則須先將keys轉為array在做length屬性判別
if(Object.keys(obj).length == 0)  //判斷空物件

-- -- --------------------------------
## js 嚴格比較 和 寬鬆比較 "===" vs "==" 
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

-- -- --------------------------------
## jQuery有attr()和prop()之分：
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
另外prop()可以處理需要即時更新狀態的屬性 而attr()則為取html檔的初始狀態 但對於部分屬性兩者可以互通

由於常見的class屬性有多個 因而延伸出addClass()和removeClass():
如此就不需用attr('class','d-none')導致取代掉原先的class屬性值

-- -- --------------------------------
## JSON(JavaScript Object Notation):** 
即將JS的物件轉換成字串形式以利於傳輸 故使用時在做轉換
JSON.stringify() 將物件變JSON格式
JSON.parse() 將JSON變回物件

一般的JS物件：
var me = { name:"Jason" }  
JSON格式:  (JSON本來就是由dict變成的字串 key由前端傳到後端時會自動變為字串)
'"name":"Jason"'


-- -- --------------------------------
# js的object和array:

Object.keys(obj)能將object的keys轉成array 
同理也有Object.values()和Object.entries() 都是將object的相對資料轉成陣列array 

Object.assign({}, obj) 和 Object.assign([], arr) 用於做複合資料的複製(composite): object和array

由於object或array的賦值為傳址(pass by reference) 會導致變動其中一個變數而影響到另一個 
等同：{...obj} 和 [...arr]

但有一點列外 這種方法不能複製多層次的object (deepcopy)
必須借用JSON才能實現 JSON.parse(JSON.stringify(obj))

刪除整個object變數,或刪除object中的屬性
使用 delete object 和 delete object['key']

slice(start [, end]) 和 substr(start [, length])
兩者都用於切割字串 差別在於第二參數為擷取到該位置之前 與 擷取總長度
array.slice()也可用於拷貝array 因為會回傳一個新array

theString.split(char) 則用chat字元將字串分開
theArray.join(char) 則用chat字元將已被分開的字串合併 
常用於將array的內部元素已字串形式表示 如此就不需要用for-loop

array3 = array1.concat(array2) 用於向後合併不同的array 時常會跟join混淆
好處是自身不會發生改變 故也必須賦值到一個新array

array.splice(start [, deleteCount[, item1]])
則用於在原字串或陣列中間位置刪除元素或插入元素 

array.pop() 和 array.shift() 刪除最後一項與刪除第一項

array2 = array1.map(x => x * 2); 將原先內部元素執行函式後的回傳結果轉成新陣列
const even = (element) => element % 2 === 0; array.some(even); 將判別式函式當參數 只要內部元素有一個符合即回傳true
array.every(even); some()為至少一個符合 every()為全部皆要符合

-- -- --------------------------------
## javascript 常用object與array方法:
javascript - 刪除array.pop()/array.shift()/array.slice(), 新增array.push(value), 合併array1.concat(array2)
javascript - 刪除delete object[key], 新增object[key] = value, 合併object3 = Object.assign({}, o1, o2)

與之對比 python常用dict與list方法:
python - 刪除list.pop(index), 新增list.append(), 合併list.extend()
python - 刪除dict.pop(key)/ del dict[key], 新增dict[key] = value, 合併dict.update()



## js 表達式與聲明式:
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

expression需要事先宣告且會佔用變數空間 適合作為專案中的常用函數集合 
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
var在全域範圍中(global scope)宣告等同const const無論在哪個程式中(local scope)宣告都是const

而直接在最外層使用var 則為全域變數 也就是window物件
遵守這種宣告方式 可避免變數跑到外部

javascript屬於動態定型語言 也就是js的變數可以不是先宣告且僅作為物件的參照 
js不同於其他語言 變數不需要事先指定型態 可直接用var取代int,float,str,bool...
其好處就是list(array), dict(object) 裡面的物件都不需要同一類型
若js變數不事先宣告var 則此變數為全域變數(window物件, 可直接在console使用this.some取得)

for( let i = 0; i < 5; i++ ) {
  window.setTimeout(function() {  // async時會產生問題 但若是同步方法則兩者無異 
    console.log(i);
  }, 1000 * i);
}
此時可以正確的輸出1,2,3,4,5  如果將let改為var 則為5,5,5,5,5
因為每一個let宣告的變數只會在該block存在
但是var會在整個code的區域存在 因此var的變數會覆蓋掉前一個
導致setTimeout()執行時會被變為只有i=5 也因此var在空間運用上會優於let

可用var person1={},person2={},......personlast={}; 寫在同一排
應該將需要同時創建的物件寫在一起 可以節省字元


## js 單運算子unary_operator：
!:表示為not 常用於 !undefined 會轉成true
+:使變數轉成Number()型態 
-:也使變數轉成Number()型態 但會轉成負數

-- -- --------------------------------
## IIFEs (Immediately Invoked Functions Expressions)
為建立函式即立即執行
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


-- -- --------------------------------
# js 例外處理(exception):
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
## js_error 例外名稱:
SyntaxError: 語法錯誤 少了';','}',')'...等等
RangeError: 數字超出範圍所產生的的錯誤
ReferenceError: 找不到變數時所發生的錯誤 常發生在拼錯字的狀況 (參照錯誤)
TypeError: 找不到函式所發生的錯誤 嘗試調用一個不存在的方法 (資料型態錯誤)
URIError: 配合encodeURI()或decodeURI()方法使用的錯誤
EvalError: 配合eval()方法使用所產生的錯誤： 但因eval是一個不建議使用的全域方法 故幾乎不會用到

-- -- --------------------------------
# js_prototype物件原型：
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

同理用text(str)會直接將str內部的元素標籤顯示出來 html(str)則會轉成html架構
此外前端用text(str)方式顯示 就可以將html(str)方式所造成的script攻擊化解掉

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
(新版的$jQuery 已被on()/off()取代)


class屬性地目的： 為讓同性質的element可以劃分在一起
故也常被JS的querySelector() 用於辨識element
若沒有要做變數操作 也可用.classname來設置樣式
此外一個element可以有多個class 方便分群管理element

<label for="guessField">Enter a guess: </label>
<input type="text" id="guessField" class="guessField">
label for="id"屬性 用於表示跟哪個input綁在一起
input type有多種樣式 "radio", "text", "submit"

guessField.focus() 表示在載入頁面時 自動將游標放入input
此時點擊鍵盤會觸發guessField的鍵盤事件(eventListener)

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


# js_jquery:
要使用jQuery 必須先在html中放入元素
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
1.用Google CDN載入
<script src="js/jquery-3.4.1.min.js"></script>
2.儲存在伺服器中載入

$('li.class_name') 即為jQuery對象
一般用於處理Ajax與element過場效果
同理也能使用:作為過濾篩選條件
$(“li:first”) 等同$(“li”).first() (jquery_filter的舊版用法)
$(“li:even”)或$(“li:odd”) 即為偶數筆與奇數筆
$(“li:eq(n)”) 第n筆對象 初始為n=0
$(“li:gt(n)”) 高過於第n筆資料之集合 (不包含第n筆 greater than)
$(“li:lt(n)”) 低過於第n筆資料之集合 (不包含第n筆 lower than)
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

$("li").find("ul").eq(2) 可以直接指定第幾個子元素
等同$("li").find("ul:eq(2)") 

$(this).closest('.comment').find('form').eq(0)

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

$.each(obj, function(key, val) {   若用$.each() 則第一參數可放入object, array等可遍及物件    
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
若互動元素疊加時要注意：子元素focus也就表示父元素blur 

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

trigger('submit')等同submit() 但並不是所有的事件都可以直接當成function使用 
(主要是submit事件實在是太常見)

bind()對於後生成的元素無法綁定 此時可用deleate()代替：
deleate()為父元素的方法 用於綁定子元素的事件
$('#root').delegate('a', 'click', function(){  // 'a'是'#root'的子元素 
    console.log('clicked');
});
bind()與deleate()都由on()而來 可用on()來實現兩者
亦可直接用on()/off()代替bind()/unbind()

$body.on("click", "#btn1", btnClick1) 使用函數名btnClick1作為綁定的對象
$body.off("click", "#btn1", btnClick1) 此時亦可通過函數名來解除綁定 
最大的差別是此時調用主體要改用$父元素 而非子元素 取代delegate()

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
return 後面出現的',' 也只是為了便捷性而已 最後會回傳最右邊的變數
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
variable1 = (1 == variable2) ? "true" : "false";  //':'左右兩邊都是變數 則可以直接做賦值
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

用e來表示10的次方(JS便捷性)：
var a = 1e3, b=2e5; // a=1000, b=200000 

|0,&0做二進位位元運算： (會將任何數先轉成二進位來做位元邏輯運算)
因為做運算只考慮到整數的部分 故： 5.2442|0 等同為 5|0 且任何數與0做OR都為自己 故結果為101


- - ----------------------------------
# js_regex js正則表示法
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

str.replace(re,"$2,$1"):  // 類似於python的string.format()
若re中有多個group時 則可用$1, $2, $3,...$n選擇特定的group
group的好處是可將被收尋到的字串變數化 RegExp.$1, RegExp.$2...
var re = /(\w+)\s(\w+)/; 
var str = 'John Smith';
var newstr = str.replace(re, "$2,$1");  // "Smith, John" 常用於顛倒順序

var re =/(foo) (bar) \1 \2/;  等同: /(foo) (bar) (foo) (bar)/
\1, \2分別代表(foo)和(bar)這前後兩個group

var newStr = str.replace(re, (match) => { // 'JOHN SMITH' 用於替換大小寫
      return match.toUpperCase();
    });  // 加上function(match) match是符合條件的字串

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


## css_animation 和 css_transition: 
不同於js 可直接由css實現動畫效果
jquery的animate()不能用transform屬性 只有transition才行 因此css動畫更實用

針對一次性的轉場應使用css 而需對動畫過程做追蹤或存在較高互動性的動畫則使用js
搭配css的animation和transition兩個屬性： animation是持續進行的動畫 transition則為過渡到另一配置

使用2個class_name的元素通常是指含有動畫：前者為此元素 後者為加上的動畫
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
可用於在瀏覽器視窗內設計3d元素 但前提是元素必須放在transform-style:3d的父元素內部
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
     transform: translateX(-50%);  // 再依據子元素的寬度做調整 往左移動
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
transitioncancel 過渡動畫被取消時


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


- - ---------------------------------------
# js_其他第三方:

## bootbox.js 
用於對話視窗 (需先引用bootstrap)
基於bootstrap開發 可使用程式來設計對話視窗(可加上callback function) 
常見的模式分為三種： (bootbox都是基於JS的原生對話框做插件)
window.alert() 只有一個"確定"按鍵
window.prompt() 會有input輸入欄 因此最後會回傳string值
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
    url:"https://jsonplaceholder.typicode.com/posts", //data-url用於傳送至server端的位置
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
  // editableform.buttons同理 可以由原先的模板做修改

})(jQuery);

data-type可選擇X-editable內建的表單元件
其中data-type="text"最常用 可自行修改內容 data-type="select"只能選擇已設定好的選項


## jquery.fileupload.js 用於傳輸多媒體檔案
支援多檔案上傳, 支援拖放功能, 中途可撤銷上傳 ,縮圖預覽等

fileupload.js使用jQuery.ajax()為基底 
且即使瀏覽器不支援XHR 也能用IframeTransport方法替代
processData, contentType 和 cache三項options皆為False 以方便檔案傳輸

<input type="file" class="hide" id="upload-photo-input" name="img_file" data-url="upload/photo_nocrop">
需要使用到jquery-ui.js和jquery.iframe-transport.js

$(function() {  // 用法即為eventHandler 直接綁定(binding)即可 
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

      progressall:function(e, data) {}  // 全域性上傳處理事件觸發(用於進度條顯示)
    }) 
    
    fileupload之option項的done,fail,always 等同於ajax之option項的success, error, complete
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
var dropZone = $('#fileupload').fileupload(  // 同理 第一參數'option' 也可作為getter
    'option','dropZone'
);

$('#fileupload').fileupload('destroy') // 第一參數'destroy' 表示解除eventhandler
$('#fileupload').fileupload('disable')
$('#fileupload').fileupload('enable')  // 'disable', 'enable' 表示短暫關閉與事後再開啟


$("#upload-photo-input").fileupload(  // 只要綁定fileupload就能支援拖放功能, 多檔案上傳, 中途撤銷上傳等
  dataType: "json",
  done: function(e, data) {},

})

## bootstrap_plugin其餘插件：
bootstrap-table.js與bootstrap-table.css (常會與bootstrap-editable連用)
不同於bootstrap只有樣式 bootstrap-table可使用表單的標準功能 新增,修改,刪除,查詢......


## jquery plugin其餘插件：
Livestamp.js 用於自動更新帶有時間戳的html元素(timestamped) 常用於聊天室
moment.js 可使用格式化時間, 相對時間, 日曆時間等 (Livestamp.js必須使用此插件)
(moment-with-locales.js附屬於moment.js 讓日期不僅可用英文 可轉換成多國語言)



- - --------------------------------------------
# js ajax與webSocket二大功能：

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
ajax則用{success：function(res){...},onerror:function(){...}}直接調用返回函數
websocket若要有success:和onerror:功能 則可用websocket.onerror捕抓所有異常
websocket不需要傳送http_header 所以效率較高應優先使用

故若從server返回的訊息是固定的(即系統上的回應) 則應該使用ajax 
另外傳輸多媒體等大文件時因為會佔用websocket 更仍應採用ajax

但若從server返回的訊息是不固定的(其他使用者的即時回應) 則才用websocket

早期常見獲得real-time update的方法：(不使用websocket的狀況下)
polling輪詢：實現輪詢的底層需要用setTimeout()或setInterval()做定期發送ajax
setInterval()因為一開始就定好執行時間點 會導致不能因應實際回傳的時間做調整
setTimeout()可重複調用來取代setInterval() 因此大多時間是直接用setTimeout()

streaming(comet)：如同彗星後端一樣把request拉的很長不結束 
等同是server端一直做polling來傳輸待機訊號 直到真正需要用到時才傳資料

long-polling長輪詢:結合polling和comet衍生而來 改善頻繁發送ajax
而是改發一個長時間待機的ajax直到server端有資料要傳時 才切斷發一個新的ajax

iframe永久幀 : 在頁面中嵌入一個專門接收server端資料的iframe 
<script>utils.exec(“response”)</script> 藉此不切斷request 
但是網頁的狀態週期會一直保持在loading 導致影響其他運作
會搭配js物件eventsource做監聽事件 evtSource.on('message',function(){...})

## async & defer:
<script defer> 表示網站會繼續解析DOM 不會因js腳本而被打斷 且執行順序會在DOMContentLoaded之前</script>
<script async>表示下載完後會立即執行 不保證順序 通常用於完全獨立的模組</script>


- - - ------------------------------------
# js_jquery_ajax:
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
另有formData.values()和formData.keys() // 分別返回可迭代的array 同理可用for-of取值

$.each($('#form').serializeArray(), function(a, t) {  // 或用serializeArray()轉為可迭代array
  formData.append(t.name, t.value)
}

其中serializeArray()和serialize()都是jquery物件$('#form')的方法
但是append(),delete()...等則是JS原生物件FormData()的方法 兩者不能混用

FileReader物件唯一目的為讀取用戶上傳的檔案內容 使用事件來傳遞數據以減少從記憶體讀取的時間
可用File物件或Blob物件來指定需讀取的資料 Flie繼承自Blob
取得File物件的方式：
<input type="file">回傳的FileList物件 和 拖移事件產生的DataTransfer物件
<input type="file" name="file_img" id="file_img">
<img id="imageView">

var file = $('input[type=file]').files[0] // 直接用css selector抓取的就是FileList物件

var fileReader = new FileReader();
fileReader.readAsDataURL(file)
var imageView = $('#imageView');  // 讓fileReader讀取的檔案可顯示在<img>上
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
其為符合多項<input>的表單 因此不同input資料之間會有boundary 

常見的dataType為text, json, jsonp, script, html, xml 最常用的text, json
jsonp為完成在網頁上顯示跨站資源 此時ajax的options改為dataType:'jsonp'和jsonp:!0
script則可在傳回時自動執行js檔 html則可在傳回時讀取html檔

用ajax回傳html檔: (dtl模板只會在後端生成 故對前端而言就是一般的html檔 同樣可由ajax載入)
dataType:html,
success: function(res){
  var html = $(res).find('.wrap');
  $('#router').html(html);
  $('#router').load(./test.html .wrap);  // 最後要做load()才會執行html檔的JS
} 

通常與$.ajax()一同出現的非同步方法：
~Deferred Object 為jquery專用於處理非同步問題的物件 
dfd = new $.Deferred 創建Deferred物件
dfd物件僅用於dfd.resolve()和dfd.reject()兩種方法的辨識:
當因為eventhandler觸發此兩種方法時 就會再執行dfd的done(), fail(), always()三種情況的事件

非同步事件永遠在處理需要耗時等待的方法：
因為不知道何時會執行完畢 故先寫各種執行完畢之狀況所要觸發的事件 以此來達到跳脫原先執行緒的非同步目的

dfd.state() 可看目前線程的狀況 分為三種state:
"Pending" 處理中, "Resolve"處理成功, "Reject"處理失敗

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
而如何定義成功或失敗 則需要靠resolve()和reject() 
 
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


- - -----------------------------------------
# js_async非同步作法：
當這件事情是需要等待時間無法及時完成時 就需要用非同步方法以避免阻塞
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

由於JS是單線程語言(single thread)：此時若沒有用非同步處理 則會導致執行程序阻塞(blocking)
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
message.ms 從1970年開始算起的毫秒數 故每一時間的數值都不同可用於辨識

document.forms會選取所有html內部的<form>元素 回傳array
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
# js_window_object 和 js_document_object: 

window.location.host 域名
window.location.href 絕對位置URL
window.location.pathname 相對位置URL

window.location.reload() 重整頁面 (window可省略) 可直接在console使用 可讓safari更新內存的js檔
location.replace(url) 將當前頁面替換成url (不可按上一頁回去)
location.assign(url) 跳轉至url (可按上一頁回去)

history.go(0) 等同 window.location.reload() 會連js或css檔都重新載入
history.go(-1) 等同 history.back()
history.go(1) 等同 history.forward()

document.hidden // boolean值 為使用者是否正在當前頁面(可能正在其他分頁)
不同瀏覽器其屬性名不同 可能為webkitHidden, mozHidden, msHidden, oHidden (目前新版本已經都有支持)
一般的作法是遍及prefix = ['', 'webkit', 'moz', 'ms', 'o'] 
for (let i = 0; i < prefixes.length; i++) {
  if ((`${prefixes[i]}Hidden`) in document) {
    return `${prefixes[i]}Hidden`
  }
}

document.visibilityState // 可能值為'visible', 'hidden', 'prerender'
'visible'表示瀏覽器正在當前頁面且未縮到最小化(可用tab選取) 
'hidden'則瀏覽器不在當前頁面 即在此頁面不能使用tab選取
'prerender'表示網頁正在生成 當開啟網頁時會先是prerender狀態

以上可用於寫visibilitychange事件：
因為各家瀏覽器變數名稱不同 需加上前綴 prefix = ['', 'webkit', 'moz', 'ms', 'o'] 
document.addEventListener("visibilitychange", function(){  // 當打開其他分頁時 縮小化的標題會變更
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
(sessionStorage因表示只在瀏覽器開啟有效 這點與session相同故命名之)
使用localStorage聊天室關閉後再開 仍保持在相同畫面
通常localStorage與sessionStorage會依據需求混搭使用 再搭配localData將資料存入


可用localDataFlush()做同步 將localData的資料轉往localStorage 
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
domain可指定除本身網域之外的其他網域共同使用此cookie


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
故較適合存取session標籤 通常有時間週期 過期後便無法在使用此session
sid在cookie中便可直接用key/value來找 此外session需有資料庫才能用
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
不同於cookie以string方式儲存 webStorage則以key/value的方式儲存
不同於cookie在httpRequest的header中攜帶 webStorage只會在client端存取
不同於cookie需要每次檢查request webStorage本身就支援事件通知機制

網頁動畫或互動較適合使用webStorage 
其中記憶單一使用者的功能用localStorage 而需要多個子頁面的功能用sessionStorage
而帳號登入,個人化設定,追蹤資料等需重入server端的行為則適合cookie/session

localData:直接存在js文檔之中 
只要網頁重整就會遺失 因此常用於作為臨時狀態的資料


- - -----------------------------------------------
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
一般放在describe()之內 做為待測function的前置準備 若多個function的前置準備太相似 也可放於describe()之外 作為所有function的共同前置

beforeAll()和beforeEach()代表測試時的前置作業 可能為設定使用者資料或狀態等
意即表示test()只能是簡單的變數或方法回傳值判別 不能再做其他動作
若test()真的要進行其他複雜的動作 也應該以調用同區域function的方式進行

expect(peopleA.name).toBe('GQSM')  //測試字串或整數等
expect(peopleA).toEqual({ name: 'GQSM', age: 25 })  //測試object或array
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
如果執行時間太長會導致await與其他正在執行的非同步方法因競爭而堵塞 導致不穩定問題(intermittent issues)
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
await actions.move({origin:searchBtn}).press().perform();  // 同理 move()也可以放入物件參數 如此就不需要用位置參數

btn.click(), btn.doubleClick() 方法基本都跟python的selenium相同 只是換成js的編寫風格

await actions.move({origin:sourceEle}).press().perform(); // 按者
await actions.move({origin:targetEle}).release().perform(); // 釋放
// 表示拖移元素

await driver.wait(until.alertIsPresent());  // alert出現時為true 會等待到符合條件為止 也就是出現alert視窗為止
let alert = await driver.switchTo().alert(); // 可用switchTo()儲存alert內容變數

# phaserJS 遊戲框架 
由於不像unity是專門的遊戲引擎 可能社群資源較不足
* Phaser.Scene:
function SceneB(){
    Phaser.Scene.call(this, { key:'sceneB'});  // 為此func.設置更多參數(key為其名稱) 為提供其他scene使用
}
var sceneB = this.scene.get('sceneB');

BootScene並沒有update() 只有preload()和create(): 
因為BootScene僅做為畫面緩衝 負責載入圖檔 (preload:) 和開始GameScene (create:)
create: function(){
    this.scene.start('GameScene');
}

physics, cemeras, anims 都會直接內建於Phaser.Scene中

this.anims: 會放anims存放於此scene中 可用this.anims.create創建

sprite.anims.play(key, ignoreIfPlaying) 必須先創建動畫this.anims.create({key: 'up',...})
key為以創建的動畫 ignoreIfPlaying為true以避免重複點擊

角色通常會用一張png涵蓋所有幀圖像(anims) 故要設置每幀的長寬大小以方便切割(frameWidth: 16, frameHeight: 16)
一般角色的png檔(anims) 其編號為從左到右後再從上到下(from left to right, from top to bottom)

scene.add.tileSprite(x, y, width, height)  用於加入單一png圖檔
scene.make.tileSprite({  scene.add和scene.make唯一的差別使用參數或json
    x: 0,
    y: 0,
    width: 512,
    height: 512,
    key: '',
    add: true
})


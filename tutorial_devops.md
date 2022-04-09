
# conda指令
conda env list
conda create --name myenv python=3.5
source activate myenv  # source為'點命令' 即重新執行剛修改過的檔案 使其立即生效
conda list
conda install thepackage (或 pip install thepackage) # 兩者都可以在myenv虛擬環境中安裝
conda search thepackage
conda update thepackage
conda remove thepackage (或 pip uninstall thepackage) 用pip下載就要用pip卸載
conda deactivate 

vi test.txt / vim test.txt  # 開啟文件檔

- - ---------------------------------------------------
# django指令
採用pip install django==version 即可
python3 -m django --version (-m表示不執行,僅作為script : 通常後面會接module 而非執行python)
python3 -c 'import channels; print(channels.__version__)' (-c 執行python的命令句並用';'隔開 等同command)

django-admin startproject myproject 第一次在專案名稱資料夾建django專案
python3 manage.py startapp myapp 第一次在django的目錄下見app

python3 manage.py makemigrations 第一次建database以及每一次model做更動都要使用
針對app中的models.py創建SQL指令 但不會執行任何指令 不會產生任何一張table, 任何一筆record (此時就算不接上任何資料庫也能執行)

python3 manage.py migrate 讀取migrations中的SQL指令 會接續makemigrations後執行
基於SQL指令創建table和record 將兩指令分開是為了快速在不同資料庫創建一樣的格式
(另外即使不使用model做資料庫 仍需要做註冊：因為像sessions等功能都需要用到資料庫)

python3 manage.py migrate myapp 指定特定app創建table
python3 manage.py makemigrations myapp 指定特定app創建SQL指令
python3 manage.py sqlmigrate myapp 0001 查看myapp中makemigrations所生成的0001遷移文件

可以用此方法刪除創建過程中多餘的SQL指令：
find . -path '*/migrations/*.py' -not -name '__init__.py' -delete
find . -path '*/migrations/*.pyc' -delete
python manage.py makemigrations 如此一來就會重新由0001_initial.py開始創建
但此時會導致migrate的資料不同步問題 需用--fake：
python manage.py migrate --fake app_name zero
python manage.py migrate app_name

或用：
python manage.py migrate --fake
python manage.py migrate

如果要做資料庫遷移到不同系統(sqlite->pqsql) 則可用fixture幫忙
fixture指的是被內容被序列化的資料庫檔案 可能為json或xml
python3 manage.py dumpdata > whole.json 將sqlite的內容寫入whole.json
python3 manage.py loaddata whole.json -i 在由whole.json匯入pqsql -i可忽略原資料
如果db太大會導致無法順利轉換成fixture 故sqlite只適用於開發階段db較小的時候

python3 manage.py flush 刪除資料庫的record數據
python3 manage.py sqlflush 刪除資料庫的tabel架構和record數據
manage.py migrate myapp zero 則用於刪除myapp的所有data

python manage.py runserver 
等價於：python manage.py runserver 127.0.0.1:8000
即直接以本地機做server在本地端回送 一般用於測試用
python manage.py runserver 0.0.0.0:8000
即直接以本地機做server但開公網 讓其他同一區域的機台裝置可以連線

python manage.py runserver 0.0.0.0:0 --noreload
--noreload表示不會啟動檢測程式

此外0.0.0.0:8000等同開啟本地機的所有ip位置 可能有：
 192.168.1.1 (區域網路常用192開頭和172開頭兩種)
 61.1.2.3 (可能表示路由器的對外ip位址)
 202.202.202.202 (表示本地機向互聯網機構申請的對外ip位址)

python manage.py runserver 192.168.1.1:8000
只會開啟此ip位置的連線 不同於0.0.0.0:8000

可用本地端查看localhost：http://127.0.0.1:8000/ (為根目錄)
直接用CTRL+C 關閉terminal程式 即可終止runserver

port:8000用於查看本地端 每一個port碼都是不同的協定服務 (port,埠)
FTP:21Port DNS:53Port 
HTTP:80Port HTTPS:443Port (8000和8080為http的替代端口 8443為https的替代端口)
故8000, 8080, 8443常用於本地端測試
一般上網只需要輸入域名就行 因為瀏覽器會自動補足所對應的port碼
而server端會針對所提供的服務來監聽所對應的port端口 如架網站就是提供80Port
除了run server之後 也要一並run docker 開啟對應的container接口

print('len(dialogues):'+str(num), file=sys.stderr)
用於在runserver的情況下做除錯

python manage.py collectstatic
將STATICFILES_DIRS路徑中所收集到的static檔 收集放入STATIC_ROOT中
故不應該把static檔放入STATIC_ROOT中 不然會被蓋掉
collectstatic 除了用於收集不同app資料夾中的static檔 也可以收集專案之外的media文件 像是music或video可能不會放在專案資料夾中 
此時就必須用collectstatic 因為這樣才不會有路徑權限問題 (djangon只能使用專案內的檔案 無法存取電腦的其他檔案)

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'templates'),
    os.path.join(BASE_DIR, "yourapp1", "templates"),
    os.path.join(BASE_DIR, "yourapp2", "static"),
    os.path.join(BASE_DIR, "watever"),
    "/home/me/Music/TaylorSwift/",
    "/home/me/Videos/notNsfw/",  # STATICFILES_DIRS可以找專案之外的資源 許多影音資源可能不會放在專案中
]
python manage.py validate
用於驗證model

python3 manage.py createsuperuser
必須先設置superuser 資料會放在auth.models的User類別

## 進入django的互動模式
python manage.py shell 可用於手動操作database (CTRL+D離開)
關鍵是可以在網站運行時做變更 sqlite資料庫和redis資料庫都能使用
如同在網頁上操作資料或呈現view.py裡面的訊息 可按CTRL+D離開
SSH(secure shell)在terminal與遠端伺服器之間建立安全通道 github或gcp都需要使用SSH

ssh-keygen -f .ssh/id_rsa 此指令用於產出符合規範的SSH Key並存放在特定檔案中
cat ~/.ssh/id_rsa.pub SSH Key


- - ---------------------------------------------------
# redis-server指令
redis-server用於架設django緩沖系統  (CTRL+D離開)

pip install django-redis 必須安裝django-redis (不同於channel內建的redis庫)

redis-server 開啟Redis伺服器 才能使用redis-cli指令(不是在django的host開啟 需要在redis的host上開啟)
redis-server redis.conf 可用conf檔做IP、port、logfile和datafile(dir)的設置

redis-cli 開啟Redis的CLI介面(command-line interface) 可檢查內存的key-value鍵(預設為db0)
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

redis-cli get key_name 返回key的value
redis-cli set key_name value 設置key的value (但一般都使用django的shell來存取cache)

loadtest -n 100 -k  http://localhost:8000/index/ 用於做網站載入速度測試 用來測試cache的實用性

- - ---------------------------------------------------
# postgresql 指令
psql -U postgres -d postgres -h 127.0.0.1 -p 5432 登入pgsql資料庫
-U 指定用戶, -d 指定資料庫, -h 資料庫服務器IP, -p 端口
或用pg sql shell輸入相關資料登入 登入資料庫後可以直接使用sql指令進行操作

sudo -u postgres bash 可在terminal中切換postgres使用者 方便進入對應的database
mac的postgres相關指令位置：/Library/PostgreSQL/13/bin/psql
mac的postgres資料庫位置：/Library/PostgreSQL/13/data(需要以postgres使用者身份進入)
內部有pg_hba.conf 和 postgresql.conf 要開放遠端連接就需要使用此
pg的host based authorization的意思為對host的授權管理

sudo -u postgres /Library/PostgreSQL/13/bin/pg_ctl -D /Library/PostgreSQL/13/data restart 當設定檔變更後必需要進行重啟 此時用此方式


- - ---------------------------------------------------
# CTRL快捷鍵:
CTRL+Z 為暫停目前前台運行的程序
CTRL+\ 終止程序 通常是在CTRL+C無反應時使用
CTRL+D 離開當前的shell
CTRL+S CTRL+Q 兩個一組： CTRL+S用於看目前所花時間 CTRL+Q則跳回compile狀態
CTRL+R (reverse-i-search) 用於輸入關鍵字收尋過去的指令


- - ---------------------------------------------------
# vim (terminal的文字編輯器)
open ~/.bash_profile 另外可用open取代 就變成用文字編輯器打開

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


- - ---------------------------------------------------
# linux指令
'&'  表示指令在背景中執行my-script.sh &  
'&&' 將不同指令並列 前指令成功才會做後指令 make && make install  
'|'  為將前指令的結果輸出接著做後指令的輸入 ls | grep filename  
'||' 前指令失敗才會做後指令 cat filename || echo “fail”

ps auxw  (不以'-'做指令 通常只是改變輸出的顯示)
ps ef 顯示所有進程及環境變數並以全格式顯示
a(all) terminal下的所有程序
e(environment) 每個程序的環境變量
u(user) 以用戶為主來排列程序
x() 不以terminal來區分
w(wide)以寬闊的格式來顯示

grep 用來做收尋 通常會與ps連用 (ps auxw | grep aaa.sh)
egrep 等同 grep -E (--extended-regexp) 幾乎沒有在用
fgrep 等同 grep -F (--fixed-strings) 表示固定長度字串
grep -i 不分大小寫

ps ax -o pid,ppid,%cpu,vsz,wchan,command|egrep '(nginx|PID)' 找尋與nginx相關的執行程序
ps aux | grep supervisord 檢查supervisor的進程

awk指令也時常會與ps連用 用於顯示重要訊息
awk '{print $1,$4}' log.txt 顯示文本中每排的第1項和第4項 

[log.txt]
2 this is a test    # output:2 a
3 Are you like awk    # output:3 like
This's a test    # output:This's 

kill -9 /kill -15
前者為絕對關機 後者需要時間自動關機：後者比前者好 (沒有指定程序表示對全部的程序執行 故為關機)
一般來說kill -15無法成功後才會使用kill -9 (kill -15可已被忽略或被阻塞 但kill -9則一定要立即執行)

SIGKILL和SIGTERN：
kill的操作方式都是向程序發送訊號 -9為SIGKILL -15為SIGTERN(kill -15也是預設 故可用kill即可)
kill -l 可查看所有訊號 常見的unix系統層訊號為：SIGTERN, SIGKILL, SIGINT, SIGQUIT

SIGINT則由 ctrl+c 傳送 預設情況下用於終止程序(signal interrupt) 
但只能處理前台程序(也就是terminal正在運行的程序) 不能處理後台

SIGQUIT由 ctrl+\ 傳送 使程序終止並把其中記憶體數據轉有到硬碟中
SIGTSTP由 ctrl+z 傳送 能使程序暫停不中止 並把程序從前台轉向後台 

訊號可能進行的操作分為5種： (可用kill -l查看)
Term表示終止當前進程, Core表示終止當前進程並且Core Dump, Ign表示忽略該信號, Stop表示停止當前進程, Cont表示繼續執行先前停止的進程


建立資料夾:
mkdir Test 在當前目錄建立資料夾
mkdir -p /home/demo/sub2/Test 會創建目錄直到抵達所需創建的資料夾為止 忽略過程中路徑目錄不存在的問題
mkdir -m 755 /home/demo/sub1/Test 與上相同 但針對創建的資料夾可以自設權限

建立文件三種方式:
touch output.txt
cat > output.txt  (> output.log 常可用於刷新log檔案)
echo "hello world" > output.txt

touch 為keep in touch 即更新文件的意思 故建立後可直接開啟文件
cat file1.txt file2.txt > file.txt cat原先用於合併多份文件
cat > filename 表示將空白文件合併進去filename 即為建立文件
cat filename 則表示顯示該文件後不做任何動作 即不做合併 (若要查看檔案可直接用cat取代vi 更為方便)
echo "hello world" 為在terminal上顯示文本  
echo "hello world" > output.txt 表示在output.txt上顯示文本 即建立文件

echo {ASCII字串} | base64 -D > image.png 亦可用於建立圖檔
echo $SHELL 查看當前的shell 目前使用:/bin/zsh
bash或zsh都是可執行的 可輸入/bin/bash 或/bin/zsh 打開terminal
/bin/bash -c ls 可直接執行皆在-c(command)的指令

pwd 顯示目前的絕對路徑
pwd -P 顯示實際的工作目錄(而非連接檔的位置) -L則為輸出連接路徑

cat test.txt | xargs echo -n3 將text.txt資料用三行顯示(xargs的默認輸出即為echo)
用xargs將cat建立檔案的path傳給echo執行 
find ~/Library/Caches/ -name "google-cloud-sdk" | xargs rm -r 用xargs將find找到的路徑傳給rm執行

export -p 列出當前所有的環境變量
export PATH=$PATH:$HOME/bin/ 設置環境變量 ($PATH:$HOME/bin/ 表示除原先$PATH之外新增$HOME/bin/)
切換到conda的虛擬環境中 也就是把$PATH加上/Users/jason_mac/opt/anaconda3/envs/datingApp/bin
echo $PATH 檢查目前的環境變量

ls -a 才能看到所有隱藏的檔案(.bash_profile)
 查看檔案的詳盡資料 包含使用權限等
ls -l /dev/disk/by-id/google-* 可用星號表示自動匹配任何字串
vi ~/.bash_profile 由於PATH只是區域變數 只要電腦重新開機就會失效 故要寫入bash_profile
export PATH=$PATH:$HOME/bin/
source ~/.bash_profile 再讓該設定重新生效 如此就不用重開機
(或用source ~/.zshrc 一定要做！)

修改的文件必須是目前所使用的殼層 可用echo $SHELL查看
bash:bash_profile , zsh: zshrc

mv -n A A-new 或 mv A ./folder-new/A-new 更名檔案或移動檔案 且會防止覆蓋(-n)
cp -rp /source/user /backup/ 將整個檔案(-r)與屬性(-p)做備份到/backup/ 
rm 刪除單一檔案 和 rm -rf 強制(-f)刪除整個資料夾(-r)

ln A A-ln-hard 為link 即用於將執行檔接到特定資料夾 使其可用terminal指令執行 但不能對資料夾做連接 (連接已檔案副本的方式存在)
ln -s B B-ln-soft 為soft link 當原檔名稱備更改 會導致連接失效 可以對資料夾做連接 (連接以路徑的方式存在)

/usr/bin/ 則放系統內建的terminal指令 如ls, cd, echo, touch...等
/usr/local/bin/ 此資料夾是用來放所有第三方程式的terminal指令
各個應用程式都會有軟連接將執行檔接過去  如npm, brew, pip, python...等

whereis ls 系統內建的指令則用whereis搜尋
which npm 第三方程式的指令可用which搜尋(gcloud, gsutil...)
whoami 查看當前的使用者
id $whoami 查看當前使用者的相關資訊 使用 -g -n 可取得group群組名稱

curl原名為cURL 與wget相同都是做檔案下載 兩者都有很多參數指令可用
wget -m -p -k -P ./  https://example.com/ 備份網站 -m表示鏡像下載(等同-r -N:遞迴下載且只下載更新檔案) -p下載所有檔案 -k表示更換成本地連接 -P表示存到本地端位置

wget僅用來下載遠端資料 不會做後續的安裝或部署
tar -c 用於壓縮檔案 和 tar -x 用於解壓縮檔案

chown用於修改用戶與群組 也可由ls -l查看檔案權限
chown root:root /tmp/tmp1.txt 把tmp1.txt的用戶改為root用戶名:root用戶組
chown -R root:root /tmp 把tmp資料夾內所有檔案改為root用戶名:root用戶組

chmod用於修改權限 可由ls -l查看檔案權限
chmod +x為 /tmp/tmp1.txt 增加執行權限 等同 chmod a+x /tmp/tmp1.txt (因為a為all 可以直接省略)
或用chmod -x /tmp/tmp1.txt則為去除執行權限

對象除了a(all)之外 還有u(user), g(group), o(other) 總共四種 
user表示該文件的所屬用戶 group表示該文件的所屬用戶之群組的其他用戶 other則是此群組之外的用戶 all 就是以上三者的總合
權限則為r讀/w寫/x執行 以及:
s執行時將執行進程設為該文件的所屬用戶(至少要有x)
u a+u 讓所有人都有所屬用戶相同的權限
g a+g 讓所有人都有群組其他用戶相同的權限
o a+o 讓所有人都有有和其他人相同的權限

chmod 777 /tmp/tmp1.txt 7=4+2+1表示所有人都有完整的權限
r/w/x 分別表示 數字4/2/1(第一位, 第二位, 第三位) 用於使用2進位寫入檔案管理系統
同理 6=4+2 為讀寫權限 5=4+1為讀取和執行
-rwxrw-r-- 前三個為user的權限(rwx) 中間三個為group權限(rw-) 後三個為其他人權限(r--) 

如果仍不能執行可以在~ 改用./command_name

sed指令(Stream Editor):
sed 's/beijing/wuhan/g' 文件內的beijing替換成wuhan
sed -e 's/Giga/GigaRama/' -e 's/^/Hi../' > file sed -e用於指定多重條件
sed -E 's/(DROP|CREATE|COMMENT ON) EXTENSION/-- \1 EXTENSION/g' 其中\1會配對前a面正則配對上的字串 即(DROP|CREATE|COMMENT ON)其中一種

wc /etc/motd/test.txt 計算檔案的行數(newline)、字數(word)與位元組數(byte)
wc -l /etc/motd/test.txt 參數-l 只計算其中的行數

加裝硬碟的步驟 任何新硬碟在使用前都必須先做格式化, 更改使用權限, 掛載到電腦的檔案系統： 
lsblk 查看目前的在VM上的硬碟
blkid 可列出VM上硬碟的UUID
mkfs.ext4 -m 0 -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/DEVICE_NAME 將選定的硬碟做格式化 ext4為文件系統而非分區使用 -m 0為使用所有可用硬碟空間 -E 表示為格式化選項 此為用於優化持磁碟性能表現(停用延迟初始化並使用discard功能)
sudo mount -o discard,defaults /dev/DEVICE_NAME /mnt/disks/postgres-disk 將硬碟格式化後 要用mount進行掛載 之後就能在特定位址使用硬碟
 讓linux每次重啟時 能夠自動裝載硬碟

env 可查看環境變數
echo $[env-name] 也可用 $var-name 列出單一環境變數
$[env-name] = value 除此之外還可設值($)

## linux目錄
/etc, /bin, /dev, /lib, /sbin 為linux五個次目錄 
/etc 專處理系統開機過程所需讀起的設定檔
/bin terminal的常用執行檔 cd,ls...
/dev 主電腦系統之外的裝置相關檔案 可能為軟碟機或光碟機
/lib 編輯程式的函式庫
/sbin 系統管理常用程式 fdisk,mount...

/opt 存放可選程式 當相關管理程式為測試版時通常會存放於此 方便做刪除
/tmp 使用者的暫時存放區 安裝軟體時的預設工作目錄
/usr 多個子目錄：為儲放使用者自行安裝的第三方套件 包含常用執行檔/usr/bin 與 常用程式/usr/sbin
/usr/man 存放套件說明檔
/usr/local 套件升級的安裝目錄 即除了原廠電腦系統之外其餘後續升級都會存放在於此

/var 儲放系統登入記錄, 發生問題紀錄, 常態性服務紀錄

- - ---------------------------------------------------
# pip指令
pip套件管理工具的名稱為python package index(pypi) 本身就是以python寫成的工具
pip freeze 查看當前環境的程式包
pip freeze > requirements.txt 將當前環境的程式包寫入檔案
pip freeze | tee requirements.txt 查看當前環境且輸出程式包環境至文件
('>'寫入檔案和'|'同時執行多條指令 皆是linux用法)
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


- - ---------------------------------------------------
# git指令
git config --global user.name "<Your Name>" 先將這台電腦連結到github上的使用者
git config --global user.email "<name@gmail.com>"
git config --local user.name "<Name>" 也可以在專案目錄上執行來連接到其他使用者 此時不用--global
git config --local user.email "<email@gmail.com>"
git config --list 可檢查設定值

github的password：如果用command line來執行要使用token

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

也可以將未安置的檔案再add到'上一個'commit版本 此時要用--amend:
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

git branch feature cd82f29 表示多加上一個branch指著此commit 常用於回到過去版本後在做延伸
git branch -d feature 用於merge合併完後將分支刪除
git branch -D feature merge合併前就將分支刪除 用於淘汰此分支的版本內容
git branch -m old_name new_name 當本地端分支重新命名
若將分支刪除後 commit並不會被刪除仍可透過checkout切換 但會導致HEAD斷頭

git checkout cd82f29 也可移動到其他的commit版本 (只要輸入commit識別碼的前7碼就行)
(另一角度想:checkout只能移動到commit 而移動到branch則指的是當前分支所指的commit)
但若此commit並不是分支最新上傳的 也就是當前沒有分支指著它 則會導致HEAD斷頭

git checkout cd82f29 welcome.html 也可以只回復單一檔案
git checkout welcome.html 若沒有指定commit版本 則表示回復到當前分支(HEAD)
(如果未完成commit:也可用git reset HARD 回復到尚未add新狀態的當前分支)
git diff 則用於檢查目前的改動(未完成commit)與當前分支commit版本的差異

斷頭時進行commit 由於此commit沒有分支則會導致只有HEAD指著它
commit雖可以獨立於分支 但如此就難以事後被搜尋 以至於維護變得更困難
(git是一個以commit為單位的系統 branch僅為方便管理多個commit的標籤 可進行合併,退回等操作)
此時可用git branch new_branch 來指定新的分支給commit

git reflog 詳細顯示你每個commit和git指令辨識碼(reset指令也會被記錄)
git reset HEAD~2 用於回到過往的版本 往後退2個版本(HEAD~2)
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
(等同 git checkout master 會在本地端建一隻分支做追蹤)
git pull origin master 每次要在分支工作時都應先下載當前分支的最新版本
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
如果用merge合併完再把被合併分支刪除 則會導致被合併分支的commit遺失 

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
若不是文字檔時 則無法手動排除分歧部分 此時只能選擇分支中的其中一個檔案
git checkout --ours cute_animal.jpg our表示為當前分支的檔案
git checkout --theirs cute_animal.jpg theirsf表示被合併分支的檔案
同上最後都需要重新將此檔案add到暫存區 再執行git rebase --continue

git rebase --skip 檔案內分歧的部分 選擇當前分支取代被合併分支
git rebase --abort 停止rebase合併

git log 只會有commit版本紀錄 不會有git指令紀錄
git log --oneline --graph 可看之前提交的commit紀錄 oneline為只有message格式 graph則將branch圖像化
git log --pretty --graph pretty則為完整的紀錄格式 commit的排列順序是依據提交的先後時間
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
個別開發者再對owner帳號發送pull request(PR) 
此時owner會收到個別開發者的PR 確認無誤後在執行merge pull request

針對本地端的上傳內容 遠端儲存庫永遠只接受快轉合併 也就是兩個分支不能有分歧
(也非常符合邏輯：因為本地端只能push到自己的github帳號 也就是除了自己外 此github帳號基本不會有更動)
git push -f -f為force 就是讓本地端的分支直接上傳蓋掉遠端的分支(極不推薦)

git remote -v 查看當前專案所連結的遠端儲存庫
git remote set-url origin git@github.com:username/renamerepo.git 修改原先origin的路徑
git remote add upstream git_url 用於連結其他遠端儲存庫 可自行設置專案名稱
origin為git clone下來的專案位置 即個別開發者的githug帳號 另一個取名upstream則為owner的github帳號

設置upstream是避免當前本地端的專案與owner的專案不同步的情形:
git fetch upstream master 取得owner專案的master分支內容 此時在本地端為追蹤分支upstream/master
git fetch upstream 不指定分支則取得owner專案所有分支的內容
git merge upstream/master 同理fetch完後來做merge合併 

README.md 為使用markdown語法撰寫

- - ---------------------------------------------------
* containerized app使用 (docker和kubernetes)
# docker指令
Dockerfile中的內容：(Dockerfile不用加副檔名)
Dockerfile用於在本地端建立專用的container 
通常包含軟體需求(FROM),所在目錄(WORKDIR),對外埠號(EXPOSE), 前置執行指令(RUN)與最後執行指令(CMD)

將django做成container:
FROM: python:3.8.3-alpine 所用程式版本(從Docker Hub抓base image)
LABEL maintainer="example@gmail.com" 存放相關資訊
WORKDIR: /usr/src/app 在開啟container的機台中設置work directory 不存在時會自動建立 表示在此層執行RUN (/usr/src/app慣用位置 或直接用/app)
如果沒特別指定WORKDIR 那就會放在根目錄/

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1  建立機台的環境變數 若有多項可以分開書寫
ARG NODE_VER 也類似於環境變數 但可在build container時重新設置 (docker build --build-arg NODE_VER=node-v5.9.0-linux-armv7l)

COPY ./requirements.txt /usr/src/app 將requirements.txt複製到container中 或直接將整個專案複製過去
COPY . /usr/src/app 複製當前專案到container的特定位置 (專案的根目錄 會與Dockerfile同一層)
COPY static /etc/static/ 用於複製整個資料夾 當指定目標為資料夾時 會將內部的內容複製過去

ADD http://example.com/big.tar.xz /usr/src/thin
gs/ 與COPY相同都是複製 但ADD用於複製遠端檔案

RUN pip install --upgrade pip 
RUN pip install -r requirements.txt  用pip對requirments.txt進行安裝

VOLUME /app 當docker run --mount時會將檔案掛載在container中的此位址

EXPOSE 8000  container所接受的port

ENTRYPOINT [ "/bin/sh", "-c", "echo $HOME"] -c為cmd-string 表示可向echo放入參數 如果之後沒有參數則不用使用bash -c

COPY docker-entrypoint.sh /
ENTRYPOINT [ "/docker-entrypoint.sh"] (docker-entrypoint.sh的第一行必須為 #!/bin/sh)

CMD python manage.py runserver 0.0.0.0:8000 最後用cmd執行runserver即可 

指的是container的最後一行指令 也可以直接在shell用docker run取代：
docker run --rm -it container_name python manage.py runserver 0.0.0.0:8000

RUN和ENTRYPOINT之差異：
CMD指令可被覆蓋：故通常會將必定要進行的指令寫在ENTRYPOINT (像是下載uwsgi等...)
而CMD會寫入隨情況改變的指令 因為docker run可覆蓋掉cmd但不會影響ENTRYPOINT

當需要環境變數時：此外docker-entrypoint.sh內部可寫入$ENV_NAME等環境變數 而CMD則不行

當有些指令只在特定host才能執行時：此時就不能使用RUN 而要用ENTRYPOINT寫入shell腳本
因為這樣才能成功建立 之後在讓特定的host使用即可

一般來說一個container就代表一個process 也就是CMD所執行的process (因此CMD只能有一個 其餘則放在ENTRYPOINT)

dockerFile的寫法分為 shell form 和 exec form 兩種：前者以command的形式來寫 後者用[]array來寫 
ENTRYPOINT不能用shell form來寫 會導致CMD指令被覆蓋掉 (shell form則是每行獨立)
有時CMD可以只寫參數 而沒有執行指令： CMD ['-i','-t']  (exec form以array表示 即ENTRYPOINT將後面的CMD指令連用)
好處是docker run --command 可以只寫附加的參數 而沒有執行指令(放在ENTRYPOINT中)



#docker-entrypoint.sh 通常會將docker的前置作業寫入entrypoint 不同於直接寫在dockerFile的RUN是為了架設環境
#!/bin/sh # 用於指令shell script 可取代/bin/bash -c指令

#Collect static files
echo "Collect static files"
python manage.py collectstatic --noinput

#Make migrations
echo "Make migrations"
python manage.py makemigrations

#Apply database migrations
echo "Apply database migrations"
python manage.py migrate

exec "$@"  # 執行CMD指令：如果CMD為exec form形式 (像是：['nginx', '-g', 'daemon off;'] 就需要用此方法引入)
(但CMD為shell form形式則不需要 像是：CMD nginx -g "daemon off;")

習慣上如果有用ENTRYPOINT的話 那就會用exec "$@"引入CMD指令(exec form)
反之沒有使用ENTRYPOINT 則直接用CMD(shell form)

requirment.txt可用pip list --format=freeze > requirements.txt導出(比pip freeze更好 因為會審略掉多餘的安裝資訊 只留下版本號)
(pip list --format=json > requirements.txt 則轉成json格式)
conda clean -a 先做淨化 再轉成requirments.txt前可先做清除

此外settings.py中部分設定必須放到env中
並使用secret物件和configMap物件來存取資料

將nginx做成container:
FROM nginx:latest
LABEL maintainer="example@gmail.com"
COPY nginx.conf /etc/nginx (linux作業系統 的 nginx預設資料夾位置)
COPY docker-nginx-dj3.conf /etc/nginx/sites-available

RUN mkdir -p /etc/nginx/sites-enabled/ && \  創建sites-enabled
    ln -s /etc/nginx/sites-available/docker-nginx-dj3.conf /etc/nginx/sites-enabled/  並做soft-link
CMD ["nginx", "-g", "daemon off;"] nginx會在container中執行 故須設置deamon off 此時container才能管理進程 (讓container不會自動關閉 讓nginx可以留在前台處理(foreground))

nginx加上ssl的方法：(使用certbot自動更新簽證)
RUN apt-get update && apt-get install -y software-properties-common
RUN add-apt-repository ppa:certbot/certbot
RUN apt-get update && apt-get install -y python-certbot-nginx 下載certbot

RUN sudo certbot --nginx -n --agree-tos -d mywebsite.tw -d www.mywebsite.tw -m myemail@gmail.com --redirect 直接執行certbot即可


如果使用nginx的container：
nginx.conf所設置的error.log和access.log都已經被導到外部 docker logs container_id

docker version 檢查版本
docker build . -t docker-demo-app 建立新的image -t是tag的意思 即打上名稱
(在設置好的包含Dockerfile的資料夾中進行 不同於pod物件使用yaml建立)
要做成container的檔案 需要把.gitignore的部分都先移除 尤其是.env
為避免與本地端原檔混在一起通常會在做一份git clone
docker tag 59f3e3615488 docker-demo-app 用於建立完後再改名

gcloud auth configure-docker 要上傳前必須用此方法向docker取得憑證 一台電腦只需建立一次
docker pull busybox 如果沒有標版本號 那就是用busybox:latest (如果registry已經有同名image 則舊的版本號會改為None)
docker tag busybox asia.gcr.io/my-project/busybox 如果需要放到特定雲端上 就需要先用tag做改名動作
docker push asia.gcr.io/my-project/busybox

docker images 列出目前所有的images (等同 docker image ls)
docker commit -m "Added Git package" -a "Starter" 59f3e3615488 當修改container之後 可用commit更新 讓docker hub與本地端同步 
但可以會使得原先在service掛載的secret或config無法使用

docker run -p 3000:3000 -it --rm 733776b1db0a 有了id之後便能開始生成container
-p表示publish 將容器發布到端口port上 另外-P則表示隨機生成port 如此就不用指定3000:3000
3000:3000是因為要先連到host實體機的port 再連到host內container的port
(因為一台host機可以有多個container 故需要用兩個一組的port)

Container可被視為一台獨立的電腦 -it --rm：
-i是interactive可獲取container的STDIN 可輸入但需要用docker container exec
-t是--tty 為分配一個虛擬終端機（pseudo-tty）並綁定到container上 
此時可用bash進入container的shell模式 (-it基本都會連用)
--rm當container執行完畢時可直接刪除 我們只要留image即可 

docker run -p 3000:3000 -d 733776b1db0a
-d是--detach(分離模式) 表示在背景中執行 且運行時終端機不能對container做任何輸入或輸出操作 此時關閉終端機也不會有問題
預設為--foreground(前台模式) 此時運行docker run的終端機 會附加到container的STDOUT和STDERR

docker run --name container名稱 -p 8080:80 -v /html:/usr/share/nginx/html -d nginx 
-v表示當host中的檔案映射到container的路徑上

docker pull [Image 名稱]:[Image 版本] 取得一個指定版本的image
等同:docker pull registry.hub.docker.com/ubuntu:latest 會在Docker Hub中找此image
(一般來說不用自己build一個映像檔 只要用pull就好)
docker run -p 6379:6379 -d redis:5  port6379為redis專用的端口 (另外有一個類似的6380) -d 為daemon 也就是轉到後台操作 (預設為--foreground會綁定此terminal 不會進後台)

可在django的settings.py中設定 不需要密碼的redis使用方式：redis://127.0.0.1:6379/0
需要密碼的redis為：redis://password@127.0.0.1:6379/0

使用channels框架需要在settings.py設置redis端口
(也可以直接略過pull步驟 docker會幫我們檢查本地端 若沒有會自動pull image)

docker run --user jason 預設的使用者為root 但可用參數修改user(docker containers run as root)
docker run --env KEY1=VALUE1 可加上環境變數
docker run --env-file ./envfile 也可用檔案來環境變數 (格式有明確規範 envfile中不能有空格) 

進入container中後可用linux的env指令查看環境變數
echo $[env-name] 也可用 $var-name 列出單一環境變數
$[env-name] = value 除此之歪還可設值 ($)

docker cp <container-name>:/path/to/file/in/container . 
docker cp <file> <container-name>:/path/to/file/in/container 當container中沒有文字編輯器時 可以用docker cp將棋複製到該容器的主機中 等完成編輯後再放回去

docker ps -a 用來找目前正在執行的container -a是all的意思 表示不只正在執行的 (等同docker container ls -a 可省略container)
docker ps --filter name=redis_server 用篩選找尋特定container (ps為查看目前的的process status)

docker service ps redis 查看包含redis名詞的特定service物件
docker service create --name redis --secret my_secret_data redis:alpine 對container掛載secret物件 (linux系統的預設路徑：/run/secrets/my_secret_data)
docker service update --secret-add db_pass running_service_name 更新container 額外掛載secret物件
docker service update --secret-rm my_secret_data redis 對特定的container 刪除之前掛載的secret物件

docker service create --name redis --config my-config redis:alpine 對container掛載config物件 (linux系統的預設路徑：/my-config)

docker本身有service物件：
docker run只是單獨執行一個container 而使用docker service則可以依據設定自動處理多個container
當發生問題時可以重啟 自行尋找node來上架容器 並可以進行不中斷更新

docker secret ls 查看secret物件
docker secret rm my_secret_data 刪除secret物件
printf "This is a secret" | docker secret create my_secret_data - 使用'-'參數 將standard input輸入到my_secret_data中 
docker secret create .env ./.env 直接用特定檔案建立secret物件 物件也要同名才能直接給後端抓取

docker config ls 查看config物件
echo "This is a config" | docker config create my-config - 用'-'參數 將standard input輸入到my-config中 
docker config create .env ./.env config的使用方法基本跟secret相同 無一差別在於傳遞過程不會加密且最後預設的存放物質不相同

docker container exec container_id ls -l 在container中執行linus指令
docker container exec container_id cat >text.txt 建立空白文件
docker container exec container_id cat text.txt 顯示此文件內容

docker attach continaer_id 連接到container的配置的處理進程(STDOUT...) 不是ssh
docker exec -it 9ad62459bfdc bash 進入container的ssh
docker exec -it 9ad62459bfdc sh 在container當前的workdir在開啟ssh

docker exec -it 9ad62459bfdc bash -c "apt-get update && apt-get install -y vim" 要在container中使用編輯器則必須先做下載安裝(使用apt-get)
(除了使用vim之外 也可以使用nano 安裝方式相同)

docker stop <ContainerID> 找到id後便可直接關閉
docker rm <ContainerID> 找到id後可做刪除
docker image rm <ImageID>  同理也可以把存放在本地端的image刪除

docker images --digests 當tag為<none>而無法指定時使用 可用@{digest}取代原先的:{tag}
docker image rmi test1:latest 用於刪除image tag 但不會刪除image檔

docker images -f “dangling=true” -q 顯示所有tag為<none>的image的id (dangling表示懸空) -f為filter用於過濾 -q為quiet用於只顯示id 
docker images --no-trunc 不截斷輸出 則image的ID會是最原始的sha256碼


docker login  登入後才可以上傳到docker hub中：
docker tag django_todo:latest <Docker Hub username>/django_todo:latest
docker push <Docker Hub username>/django_todo:latest 放在docker hub
docker push asia.gcr.io/<project-id>/server 也可放在google docker registry


上傳到GCP的三件事：
docker build . -t anonlarp_django_for_www:latest && docker tag anonlarp_django_for_www:latest asia.gcr.io/anonlarp-project/anonlarp_django_for_www:latest && docker push asia.gcr.io/anonlarp-project/anonlarp_django_for_www:latest

docker build . -t anonlarp_nginx_certbot_for_www:latest && docker tag anonlarp_nginx_certbot_for_www:latest asia.gcr.io/anonlarp-project/anonlarp_nginx_certbot_for_www:latest && docker push asia.gcr.io/anonlarp-project/anonlarp_nginx_certbot_for_www:latest


docker只涉及連到本地機的port 與IP位址無關
決定外界使否可連線或連到哪個ip位址則由django manage.py決定

containerized app是具有RESTful風格的管理系統 可使用標準HTTP方法進行操作
所有container都會有一個用於連接的端口 用以接收外部的request請求
只要能使用request的方式訪問的資源或應用 都適合包裝成container

每個container只進行一種服務 one process in one container
因container即process，因此合理的設計方法會是一個 container 只執行一個 process 
但有時可透過管理程序軟體(supervisord)協助操作 將類似的功能綁成一個container

container中的data不會保存下來 All data in the container is not preserved
不能使用container來儲存資料 也正因為如此更能確保容器化的運作機制 
(如果要保留資料則要使用Volumes Component)

如果要將pgsql移植到不同的VM上：可以直接將persistent disk掛上去便可直接使用 (但為避免發生問題 不能同時讓2個以上VM做掛載)
此外不能在VM運行時掛上persistent disk 會導致硬碟被同步化：只能在VM停止的時後掛上才能確保disk的資料不受影響

Docker Compose是docker的延伸工具 可組合多個功能的container來提供完整服務
Kubernetes也是container的集中管理工具 並由google進行維護
兩者都必須要使用YAML(批次腳本) 此外許多指令也與docker相同
YAML:如果此項目會並列重複時 應該在前面加上- (ex:-name:...-name:...)
因此可知yaml同一層並列資料存在順序性 並可用-var_name:做分隔

- - ---------------------------------------------------
# kubernetes指令
使用minikube作為本機端的操作工具 用於建設Kubernetes Cluster 
每一個VM都是一個node 而minikube運行的VM本身就是master node
另外必須使用kubectl和kubectx用於操作指令
kubectl get all 可以取得所有k8s物件的資料
kubectl get svc,deploy 可以指定多種物件

minikube ssh 進入minikube的shell

minikube dashboard 開啟kubenetes的圖形介面
minikube dashboard --url 查看url並由browser做開啟

kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml  用於透過yaml檔安裝插件(dashboard)
kubectl proxy 一樣是連線到dashboard

由於只會有唯一個實體資源管理中心Kubernetes Cluster 
但此時難以對不同物件歸類劃分 因此增加virtual cluster(即為Namespaces)負責做抽象管理 

當namespaces被刪除時 該namespace中的所有物件都會被刪除
可透過resource.requests和resource.limits來做限制

kubectl create namespace namespace 建立namespace
kubectl config view 可查看目前所在的namespace

一般物件在創建時可在metadata中指定所在namespace
metadata:
  name: compute-quotas
  namespace: hellospace

## 創建 Namespace：
並加上compute-quotas和object-quotas兩個ResourceQuota物件來資源分配：
apiVersion: v1
kind: Namespace
metadata:
  name: hellospace
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quotas
  namespace: hellospace
spec:
  hard:  # 限制運算資源
    requests.cpu: "1"
    requests.memory: 1Gi
    limits.cpu: "1"
    requests.memory: 10Gi

apiVersion: v1
kind: ResourceQuota
metadata:
  name: object-quotas
  namespace: hellospace
spec:
  hard:  # 限制物件數量
    services: "2"
    services.loadbalancers: "1"
    secrets: "1"
    configmaps: "1"
    replicationcontrollers: "10"

## kubenete進行雲端化(Kops)：
Kops用於部署到aws或gcp上 可以使用本地端的aws指令或gcloud指令
AWS的S3等同GCP的GKE 都是架設containerized app
kops create cluster\  用於創建cluster
> --name=k8sdemo.zxcvbnius.com \
> --state=s3://k8s-demo-qwer \
> --zones=us-west-2a \
> --master-size=t2.micro \
> --node-size=t2.micro \
> --node-count=2 \
> --dns-zone=k8sdemo.zxcvbnius.com

kops edit cluster k8sdemo.zxcvbnius.com --state=s3://k8s-demo-qwer  用於修改cluster的相關設定
kops update cluster k8sdemo.zxcvbnius.com --yes --state=s3://k8s-demo-qwer

kops delete cluster \  用於刪除cluster
> --name=k8sdemo.zxcvbnius.com \ 
> --state=s3://k8s-demo-qwer \ 

## 建立k8s的service物件：
kubectl run hello-minikube --image=gcr.io/google_containers/echoserver:1.8 --port=8080  
跑docker-image並設置port 其中hello-minikube為我們自己決定的物件名稱 用於之後的操作

kubectl run -i --tty alpine --image=alpine --restart=Never -- sh
執行alpine並開啟shell --tty(Teletype) 指的是unix系統的終端機

一樣可以使用yaml建立service物件(kind: Service) 但一般都直接使用kubectl expose
kubectl expose deployment hello-minikube --type=NodePort 建立service物件 使deploy物件讓本機端可以連線到cluster
kubectl expose pod mypod --type=NodePort --name=my-pod-service --port=3000 一樣建立service物件 使pod物件可以讓本機端連線到cluster
(不同於port-forward直接映射到本機端 而expose為映射到cluster上的port供外部使用)

selector:
  app: my-pod  # service只會找尋第一個pod
type: NodePort

type:ClusterIP用於供cluster內部使用者訪問 (此ip不會固定 當service物件被刪除即釋放)
type:NodePort用於供同個node但不在cluster中的使用者訪問 (比如實體機的瀏覽器 kubectl expose在做的事)
kubectl delete svc/hello-service 使用完後記得做刪除

service物件的三種埠號
spec.ports.port 用於設置cluster內部溝通使用之ClusterIP的port
spec.ports.nodePort 用於設置外部連接到此node(實體機或虛擬機)之IP的port
spec.ports.targetPort 用於pod內部的port(pod物件通常是3000) 以上兩者以不同連線方法最終都要對應到targetPort

二種顯示方式：
使用alpine開啟shell 輸入curl 10.104.188.91:3000 (ClusterIP:port)
用minikube查看url位址 minikube service hello-service --url  用browser輸入http://192.168.99.100:30390 (nodeIP:nodePort)

另外可用service來做LoadBalancer：
對於同樣是label為(app:webserver)的pod物件 會依據pod的不同load多寡 將工作丟給正在空閒的pod
selector: 
  app: webserver  # 決定會丟到哪些pod
type: LoadBalancer


## 建立k8s的node物件：
node可能只一個實體機或虛擬機 當node被加入時會在k8s上建立node物件
再將node物件加入cluster 此時k8s會依據pod的設定檔來決定部署到哪個node上 如此可以避免vm中流量資源無法互通的問題 (有些vm超載有些vm閒置) 此時k8s就能完成負載平衡的工作(load balancing)
可想像成node就是一個獨立的VM 此時可以開多個功能相同的node來達成備用與平衡負載的工作

每個node都會有一個iptables 即是linux上的防火墻用於限制連線與分配負載 用於與master node進行溝通
每個node也都有唯一的kube-proxy 用於將內部所有pods的資訊傳給iptables 用以確保node上所有pod都是即時狀態

kubectl get nodes 查看正在運行的node物件
kubectl describe nodes minikube 查看nodes中minikube的物件訊息

kubectl get svc 查看當前所有service物件 (必須由kubectl expose deployment)
minikube status 可查看當前VM使用的內網網址
minikube service hello-minikube --url 使用minikube查看此物件所使用的url
minikube service mypod-service --url 如果pod沒有指定port 則會由k8s做分配
minikube stop 當前是開啟狀態的話必須先暫停
minikube start --extra-config=apiserver.ServiceNodePortRange=1-50000 修改minikube的設定檔

kubectl drain {node_name} 用於將node的狀態變更為維護模式 原先在node上的pod會轉向其他node (但必須由deployment創建的pod 而不能應用在直接創立的pod)
kubectl uncordon {node_name} 則將node的狀態回到開放排程

kubectl get deploy,pods -o wide 可查看當前物件在哪個node上排程


## 建立k8s的pod物件：
pod指的是k8s中所有協助完成application的container之總和 關鍵在於pod內部的不同container 可由local port互相溝通

kubectl create -f mypod.yaml 用於建立pod物件 -f為--file (kind:Pod)
kubectl get pods --show-all 查看當前所有pod物件 預設為只查看正在運行的pod物件 
kubectl describe pods mypod 查看pods中mypod的物件訊息
kubectl port-forward mypod 8000:3000 表示將pod內部的3000port 映射到本機端的8000port

每個pod都會有一個專屬的ClusterIP 只有再同一個cluster中才能透過此ip做訪問
每個pod內部可能有多個container 設置不同的containerPort 用於區分在pod中的container
同一個pod通常會存放功能相近的container 或 多個需要頻繁進行溝通的container 應使用pod內部溝通
當需要分成不同的pod並進行負載平衡 則使用不同pod彼此訪問
pod內部溝通：等同 localhost/port_number 即在同一個本地端作業
不同pod彼此訪問：等同 clusterIP/port_number 即在內網中互相溝通

而且pod物件會透過deployment部署多pod備用：
此時如果相同功能分成不同pod時 就必須整組pod一起部署

pod是k8s的基本單位 每個pod都應該能透過request溝通來滿足使用需求
pod內部會有多個container用於安裝虛擬環境所需的程式包
這些container如果是從docker hub下載的 會需要設定環境變數Environment Variables
這些環境變數會放在secret中供其他pod取用 (spec.containers.env)

env:  # 不同pod必須使用環境變數來找尋host 來取代localhost/port
- name: WORDPRESS_DB_HOST
  value: mysql-server-service
env檔在k8s的yaml中設定 而不是存放在docker的Dockerfile

通常會選擇放在不同pod是因為此應用服務的功能並不常使用等同有點類似於cluster中的api的概念
資料庫必須與container分開 因為container規定是不保留資料的

metadata.name和metadata.labels方便k8s針對pod取名與分類管理
metadata.annotations等同使用者的註解 不會被k8s系統解讀

spec中可以定義多個container：
由container.name(container的名稱), 
container.image(Docker Registry中的下載途徑 即K8s用於存放docker image的地方), 
container.port(用於溝通的埠號)所組成 
container.port.name 可以在埠號上設置名稱 如此一來可供service物件使用
container.port.containerPort: 3000 表示此container使用3000溝通(只用於container之間溝通) 
ports:
- name: wordpress-port
  containerPort: 80

spec.nodeSelector用於設置pod要部署的node
nodeSelector: 
  hardware:high-memory

kubectl label node minikube hardware=high-memory node也可以設置label且用於nodeSelector label名稱通常會跟VM性質相關

kubectl attach mypod -i 查看pod內部的log
kubectl exec mypod -- ls /app 下一個pod的內部ahell指令 表示查看container中的/app資料夾
kubectl exec -it mypod -- /bin/bash  查看pod內部的bash檔

kubectl label pods mypod app=webserver 對pod新增label
kubectl label pods mypod version=latest 常用的兩種label app和version
kubectl get pods  --show-labels 查看labels訊息
常用的label名稱：
"release" : "stable"，"release" : "qa"
"enviroment": "dev"，"enviroment": "production"
"tier": "backend", "tier": "frontend"
"app": "database", "app": "cache", "app": "webserver"

annotations: (僅用於創建者註解)
  version: latest
  release_date: 2017/12/28
  contact: zxcvbnius@gmail.com


## Stateless 與 Stateful:
stateless表示該服務不會因為時間或新資料寫入貨任何狀態而改變回傳資料
stateful表示會因為寫入資料的不同而改變回傳資料 SQL都屬於stateful的應用 因為db會紀錄每筆資料 即使重開db仍會保留數據

function int sum(int a, int b) {  // stateless function
    return a + b;
}

int count = 0;  // 等同紀錄當前狀態
function int counter() {  // stateful function
	count++;
	return count;
}

Horizontal scaling 為新增更多節點node來分擔負載
Vertical scaling 為新增更多的CPU,RAM來獲得更多運作資源

## 建立k8s的deployment物件：
每個cluster中會有一個Replication Controller用於管理內部的pod物件
(rc不是node的子物件：因為node是被cluster分配資源的對象 rc則是負責進行此操作的物件)
Replication Controller由yaml設定檔創建(kind: ReplicationController)
當發生pod的crush時會自行創建新的pod來達到設定檔所洩的數量

spec.replicas決定pod數量 和 spec.selector決定pod的label 
這也是為何label重要的原因 因為pod的label必須提供給後續物件做使用
spec.template則決定pod內部要運行的container(spec.template.spec)

kubectl get rc 可查看Replication Controller目前狀態
kubectl scale --replicas=4 -f ./my-replication-controller.yaml 可用指令來讓rc進行水平擴張
kubectl delete rc my-replication-controller --cascade=false 刪除rc但由rc使用的pod則照常運作
kubectl delete pods mypod --grace-period=0 --force 強制停止pod並做刪除

ReplicationController(rc)的改進版本為ReplicaSet(rs) (kind: ReplicaSet)
差別在於能用matchLabels和matchExpressions
但一般不直接創建rs 而是用kubectl create -f ./my-deployment.yaml 創建deployment物件
kubectl get rs 創建完deployment後可查看ReplicaSet狀態

strategy.type = rollingUpdate
strategy.rollingUpdate.maxSurge 用於決定更新版本為多產出的pod 100%則會產出原本數量的pod
strategy.rollingUpdate.maxUnavailable 表示最多可容忍不能使用的pod數量

kubectl set image deploy/hello-deployment mypod=zxcvbnius/docker-demo:v2.0.0 --record
在deployment物件中可以完成直接變更container 更新版本(rollout)
寫好的後端應用先包成新版container 之後在用kubectl set image對pod物件做版本更新
deploy進行更新後會生成新的pod但不會取代舊的pod 其目的是為了之後做rollback

kubectl edit deploy hello-deployment
除了用kubectl set image進行更新外 也可透過kubectl edit deploy修改yaml檔來進行更新

kubectl rollout status deploy <deployment-name>
kubectl rollout history deploy <deployment-name>
kubectl rollout undo deploy <deployment-name>
kubectl rollout undo deploy <deployment-name> --to-revision=n
也因為deploy提供update container的方法 即升級版本的方法 故也可以用rollout進行整個deploy的版本回溯
使用kubectl rollout undo一樣會在history中產生紀錄

livenessProbe用於設置health check
httpGet.path和httpGet.port 用於決定要訪問的url和port
initialDelaySeconds 重開機到第一次訪問間隔時間
periodSeconds 每次訪問間隔時間
successThreshold和failureThreshold 表示連續幾次來代表失敗或成功
如果達成failure k8s會重開一個container

此外deployment還具備 Horizontal Pod Autoscaling功能：
也就是依據當前pod的工作量來判斷是否增減pod數量 (必須先安裝heapster用以抓取pod使用量)
在yaml中新增containers.resources欄位
其中requests.cpu: 200m  表示要求最少總CPU20%的資源給此container (200m同等於200milicpu(milicore))
另外limits.cpu: 400m 則限制最多能給予運算資源到此container
同理也可用在內存上 requests.memory: 1Gi和 limits.memory: 10Gi

建立HPA物件(kind=HorizontalPodAutoscaler)
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: helloworld-hpa
spec:
  scaleTargetRef:  # HPA的對象
    apiVersion: apps/v1beta2
    kind: Deployment
    name: helloworld-deployment
  minReplicas: 2
  maxReplicas: 5
  targetCPUUtilizationPercentage: 50


## k8s的secrets物件：
用於存放敏感資料 container需要用到卻又不能顯示的資料 (訪問不同server的access token, SSH Key, database帳密, env環境變數等)
sensitive data必須放在獨立的pod中 提供其他pod使用
kubectl create secret generic mysecret \--from-file=./username.txt \--from-file=./password.txt  generic可用於合併多個file來建立特定物件

\--from-literal=username=root \--from-literal=password=rootpass --from-file也可改成--from-literal 則可直接輸入字串

secret物件也能透過yaml建立(kind=Secret)
apiVersion: v1
kind: Secret
metadata:
  name: wordpress-secret
type: Opaque
data:
  db-password: cm9vdHBhc3M=    # echo -n "rootpass" | base64

在pod的yaml中設定：  (spec.containers.env)
env:
- name: SECRET_USERNAME  # 同理可設置多組環境變數
  valueFrom:
    secretKeyRef:
      name: mysecret  # 從secret物件中抓取
      key: username
- name: SECRET_PASSWORD
  valueFrom:
    secretKeyRef:
      name: mysecret
      key: password

## 使用volumes:
取代env 改在pod的volumes設定：
volumes:
- name: secret-volume
  secret:
    secretName: mysecret  # 將env當成db的資料來處理

volumes除了存放secret之外 也可以存放configMap 
configMap可以用於管理Configuration
config存放部署用的資料： (不同於secret存放敏感資料) 
通常不會做加密編碼 但會存放在外部以方便做動態更新
volumes:
- name: nginx-conf-volume
  configMap:
    name: nginx-conf
    items:
    - key: my-nginx.conf
      path: my-nginx.conf


configMap和secret直接用yaml建立即可 之後都直接放進volume做volumemount較為方便
並記得要在container中進行volumeMounts掛載 (containers.name.volumeMounts)
volumeMounts:
- name: secret-volume
  mountPath: /etc/creds
  readOnly: true

volumeMounts:
- name: nginx-conf-volume
  mountPath: /etc/nginx/conf.d

emptyDir用於做pod中所有container的共享資料夾
volumes:
  - name: cache-volume
    emptyDir: {}

hostPath則將該實體機(node)的資料夾掛載上去
volumes:
  - name: tmp-volume
    hostPath:
      path: /tmp
      type: Directory

PersistentVolumeClaim:
用於動態管理volume 能夠依據pod需求動態生成相對應的volume
reclaimPolicy有兩個參數能選Delete 與 Retain：當綁定的pod物件消失時應如何處理對應的volume (預設為Retain)

必須先創建模板StorageClass:
由kubectl get sc 查看相關資訊
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: standard
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  zone: us-west-2
reclaimPolicy: Delete  

再創建以此StorageClass為模板的VolumeClaim (類似於class之於instance的概念):
因為claim物件可以針對狀況充許多個並存 而StorageClass則只需要一個
accessModes有三種參數 ReadWriteOnce, ReadOnlyMany, ReadWriteMany：
ReadWriteOnce: Volume 同時只可以掛載在同一個 Node 上提供讀寫功能
ReadOnlyMany: Volume 同時可以在多個 Node 上提供讀取功能
ReadWriteMany: Volume 同時可以在多個 Node 上提供讀寫功能

apiVersion: v1
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi  # volume儲存空間大小
  storageClassName: standard
最後一樣要在pod上綁定並做掛載
volumes:
- name: my-pvc
  persistentVolumeClaim:
    claimName: myclaim


## k8s的ingress物件：
kubectl get ing 查看ingress資訊
用於處理LoadBalancer：雲端空間上VM只需要對一個ingress即可 ingress會將流入的request分配到不同的service上 (GCP本身也有LoadBalancer服務)

ingress的LoadBalancer則可以設置rule來決定不同功能的pod物件如何使用
直接架在service的LoadBalancer只會處理同功能的pod物件 兩者的應用層級不同
一般request會先經由ingress做分類再交由service處理

spec:
  rules:
  - host: helloworld-v1.example.com
    http:
      paths:
      - path: /
        backend:
          serviceName: hellworld-v1
          servicePort: 80
      - path: /chat
        backend:
          serviceName: hellworld-v1
          servicePort: 80
  - host: helloworld-v2.example.com  # 分到不同的pod上
    http:
      paths:
      - path: /
        backend:
          serviceName: helloworld-v2
          servicePort: 80

另外可以使用Nginx Ingress Controller插件：
可以將不符合ingress的rule條件的request都導向特定的結果
創建default-backend：則當ingress找不到rule時 導向default backend - 404

## Cronjob 
用於進行server的例行性工作 像是更新網站流量報表, 更新玩家最新數據等
早期直接使用linux的crontab進行 但像在可以改用k8s操作
但如果log分散在多個VM中 則難以集中管理log 因此改採cronjob直接綁在cluster上

linux的操作方式：
crontab -e 進入crontab模式
*/1 * * * * echo "Hi, current time is $(date)" >> ~/cronjob.log
表示每隔1分鐘進行指令

建立CronJob物件：(kind=CronJob)
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: hello
spec:
  schedule: "*/1 * * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: hello
            image: apline
            args:
            - /bin/sh
            - -c
            - echo "Hi, current time is $(date)"
          restartPolicy: OnFailure

kubectl get jobs --watch 查看cronjob的操作狀況


- - ---------------------------------------------------
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

package-lock.json只能鎖定大版本 不同於package.json可以鎖定特定版本號(包含小版本v1.x.x)
如此一來能夠讓npm install時更為穩定

npm run test 會執行寫在package.json下script屬性下的'test'指令 (npx test)
好處是只會在專案環境下執行 此模組與全域環境無關
node test_basic.js 則會執行當前所有資料夾的js檔 

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
主要包含：虛擬伺服器VPS, 虛擬雲端VPC兩大功能
VPS只用於單一host (不實用 因一般架網仍需要多台host協助完成)
而VPC用於多台host (可用於公司或開發團隊 提供分配或調整各項運算資源)
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

channels的tutorial使用的是Docker的container
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
而Elastic Computer Cloud(EC2) 則讓用戶在上面自行建置伺服器 為AWS的雲端空間(IaaS)

其中Google App Engine(GAE)是GCP的快速部署與管理平台(Paas) 
Google Compute Engine(GCE)是GCP的雲端空間(Iaas)
而Google Kubernetes Engine(GKE)則介於兩者之間 屬於比較新的服務(Iaas)
GCP的好處是台灣有機房 AWS則最近的建在香港
GCP較多新創公司使用 AWS是適合大型公司的專業後端使用
GCP價格最便宜 而AWS支援服務最齊全
GCP發展最晚 全球覆蓋率最低 而AWS則最早發展 有最多的可用區域

- - ---------------------------------------------
# GCP操作:
VM常用的作業系統Ubuntu 18.04 LTS 相關指令:
sudo apt-get update 進行更新
sudo curl http://vestacp.com/pub/readme.md 只會在terminal上顯示
sudo curl -O http://vestacp.com/pub/vst-install.sh curl透過http協定存取網路資源 -o表示使用同檔名存在本地端
sudo curl -X POST -d "username=admin&password=admin123456" http://127.0.0.1:8000/api-token-auth/
sudo curl -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123456"}' http://127.0.0.1:8000/api-token-auth/
使用curl來做不同的request -X預設為GET -H可以加到header中 
而-d則增加傳送資料 必須要在-H中充許application/json 才能使用json形式來附加資料


sudo curl -H "Authorization: JWT <your_token>" http://127.0.0.1:8000/virtual/
或是 sudo curl -H "Authorization: Bearer <your_token>" http://127.0.0.1:8000/virtual/
直接在Header中加上JWT
sudo curl -X POST -H "Content-Type: application/json" -d '{"token":"<EXISTING_TOKEN>"}' http://localhost:8000/api-token-refresh/
刷新方式必須把token放到-d參數來刷

sudo bash vst-install.sh --force bash用以執行sh腳本檔
任何一個指令的-h都是help 可以跟-H的Header區隔開來

curl原名為cURL 與wget相同都是做檔案下載 兩者都有很多參數指令可用
wget -m -p -k -P ./  https://example.com/ 備份網站 -m表示鏡像下載(等同-r -N:遞迴下載且只下載更新檔案) -p下載所有檔案 -k表示更換成本地連接 -P表示存到本地端位置

wget僅用來下載遠端資料 不會做後續的安裝或部署
tar -c 用於壓縮檔案 和 tar -x 用於解壓縮檔案

三大常用linux作業系統：
centos 後端常用java或perl 已經不再維護 若要架設web_server 則常採用Apache
debian 後端常用python或php 若要架設web_server 則常採用Nginx
ubuntu 後端常用ruby或js 最早為debian的桌面系統 用戶介面漂亮且具有完整的包管理系統(apt) 比起伺服器應用更適合用於桌面系統

以上為各個作業系統'常用的'後端語言 並不是不能使用其他的
因此一般認為ubuntu更適合初學者使用 相對操作更為簡單 且開源軟體最多

GCP所有的設定都能透過REST-request或gcloud指令來呼叫
所以每次變更設定時都可儲存REST-request或gcloud指令 可供之後的設定使用

帳單的產品與SKU指的是google所提供的API: 該API為產品 其中的功能則為SKU
無論是GCE或GAE都算是google的API 而GCE的固定IP申請則為SKU

IAM(Identity and Access Management)
針對不同的資源項目(GCE, GKE, GAE, SQL, GCS...)將權限分成多個Permission
Roles就是對個Permission的集合 目的是方便分類管理 (直接看Permission項目有數千條... 故一定要用Role處理)
預設的Roles有三種：Owner, Editor 跟 Viewer 
Owner有全部的權限, Editor只能修改已存在的資源不能創建, Viewer只能檢視讀取資源不能修改
除了以上三者之外 還有針對不同資源項目的Role:
Storage Object Creator：只能創建 但不同修改也不能刪除 (適合給非專案所有人的其他團隊成員)

Policy是集合性單位 整個專案就只會有一個Policy作為規範
Policy是一至多個Binding的集合 所謂Binding就是將不同identity身份的帳號與role做綁定 
可針對專案Project設置Policy 此時旗下所有的資源項目Resource都會遵守此Policy 方便團隊管理
同理可針對公司Organization(最上層根目錄)設置Policy 則旗下所有專案Project都會遵守
 

必須安裝Google Cloud SDK 才能做gcloud指令:
gcloud init 在本地端與google cloud連線 設定登入帳號, 專案, 網域等 

gcloud docker --push 上傳container到GCS上 或可用Container Builder
gcloud auth login 登入GCP帳號
gcloud auth list 列出有效帳戶名稱
gcloud config list 列出專案ID名稱與預設地區等資訊

siege指令 用於做server的壓力測試： (用於測試autoscaling是否正常)
sudo apt-get -y install siege (-y 表示對所有詢問(y/n)都回答y)
siege -c 250 http://34.120.153.46

## GAE:
gcloud app deploy 用gae直接架設網站
gcloud app browse 並用瀏覽器瀏覽

Liveness checks 檢查VM和VM中的container是否正在運行 當未達標準時會重開一次
Readiness checks 是否已準備接受流入的request 當未達標準時不會進入用於執行的個體池pool of instances

## GCS:
gsutil ls 查看所有googlestorage值區
gsutil ls -l gs://my-awesome-bucket 查看專案目前的googlestorage值區 -l為詳細資料
gsutil cp data gs://gs-bucket-name/ 上傳
gsutil cp gs://my-awesome-bucket/kitten.png ./kitten2.png 下載
gsutil rm gs://my-awesome-bucket/kitten.png 刪除
gsutil defacl set public-read gs://gs-bucket-name 將特定bucket設為公開讀取
gsutil rsync -R static/ gs://gs-bucket-name/static 上傳整個資料夾到bucket上
gsutil -m cp -r gs://gs-bucket-name/static . 下載整個資料夾到本地端

* 在containerOS的VM中 並不會主動安裝GCS 需要進入container中自行安裝 分為3步驟:
1.docker exec -it container_id bash 進入container的shell

2.apt-get update 套件管理軟體apt-get需要先進行安裝
apt-get install -y gcc python-dev python-setuptools libffi-dev 
apt-get install -y python3-pip 如果遇到沒有python的環境則需要用apt-get先安裝python 才能用pip
pip install gsutil 由於已經有pip故可以直接做安裝

合併之後：
apt-get update && apt-get install -y gcc python-dev python-setuptools libffi-dev && apt-get install -y python3-pip && pip install gsutil

3.gsutil config 使用config完成gcloud帳號授權後即可使用

postgresql常用的備份檔案與還原方式：(不好用)
pg_dump -U username -d database >db.sql
psql -U username -d database < db.sql

如果以上方法不成功 可改用django的方式： (好用)
python manage.py dumpdata > whole.json
python manage.py loaddata whole.json
(過程中把*/migrations/*.py 和 */migrations/*.pyc清除並重做makemigrations和migrate
find . -path '*/migrations/*.py' -not -name '__init__.py' -delete && find . -path '*/migrations/*.pyc' -delete
python manage.py makemigrations && python manage.py migrate
最後再進到django的shell把ContentType清掉:
python manage.py shell
from django.contrib.contenttypes.models import ContentType 
ContentType.objects.all().delete()
)

## GSQL:
gcloud sql instances describe pgsql 查看當前的SQL執行個體
gcloud sql instances create django-sql 直接創建一份 一般也可以直接由GCP上執行
gcloud sql databases describe postgres --instance=pgsql 也可直接查看SQL個體內部的資料庫

## GKE:
gcloud container clusters create-auto autopilot-cluster-1-clone-1 \ 創建autopilot模式的pod單位
--region "asia-east1" \
--release-channel "regular" \
--network "projects/anonlarp-project/global/networks/default" \ 
--subnetwork "projects/anonlarp-project/regions/asia-east1/subnetworks/default" \

gcloud container clusters get-credentials autopilot-cluster-1-clone-1 \ 連結專案
--project projectname 

## GVPC and network:
虛擬私有雲服務(Virtual Private Cloud)
最大單位為網域 即為獨立存在的LAN 而旗下的子網路可想像成一個VLAN
網域之間不能直接互通 而建立在同一網域下子網路的app則可互通
VPC不同於固定的外部IP位置 需要透過GCP的公有端點來做通訊 GCP會提供DNS來做轉換

VPC能讓不同的專案使用共同的內網資源:
gcloud compute shared-vpc enable sharedvpc-1  將sharedvpc-1專案設為host-project
gcloud compute shared-vpc associated-projects add sharedvpc-2 \
--host-project sharedvpc-1  將sharedvpc-2轉案設為連結至host-project的service project
gcloud compute shared-vpc list-associated-resources sharedvpc-1  列出所有連結至host-project的專案

創建VPC時同需再同一個專案具有唯一性的名稱
gcloud compute networks create NETWORK \
--subnet-mode=custom \ 可設置auto或custom (auto會自動在所有地區添加子網 custom則手動添加 後者較合理)
--bgp-routing-mode=regional \  可設置global或regional (單一地區用regional 當需要在多個地區架設VM時才會用到global)

當使用GCP的default網路 就是在所有地區都添加子網(auto mode)
asia-east1:110.140.0.0/20, us-central1:10.128.0.0/20, europe-west1:10.132.0.0/20... 實際上根本用不到

gcloud compute networks list  查看當前網路
gcloud compute networks subnets list  表示當前所有的子網路
gcloud compute networks subnets list-usable  表示當前專案可用的子網路

* 建立負載平衡器：需要接上backend-services和backend-buckets 並設定fronted-config 
(可以與nginx混用 目前大多用nginx完成backend-services和backend-buckets)

1.在子網路中取得一組靜態IP
gcloud compute addresses create shared-vpcip \
--subnet projects/sharedvpc-1/regions/asia-east1/subnetworks/default 

2.創建後端服務 為使loadBalancer可以將流量引入後端 (不引入後端而直接讀取靜態資料為backend-buckets)
gcloud compute backend-services create web-backend-service \  
--protocol=HTTP \
--port-name=http \
--health-checks=http-basic-check \
--global

3.將後端服務加在instance-group上
gcloud compute backend-services add-backend web-backend-service \ 
--instance-group=lb-backend-example \
--instance-group-zone=us-east1-b \
--global

4.最後再將後端與前端接在loadbalancer-1即可
(!)gcloud compute load-balancer create loadbalancer-1 \ 
--backend-services=web-backend-service \
--fronted-addresses=shared-vpcip \ 表示loadbalancer個體的IP位置
--fronted-port=80 \

子網路遮罩(subnet mask) 用來標示單一網路IP位址內的主機所在位址
表示方法與IP位址相同 如:255.128.0.0 或 192.0.2.96/28 
相同的IP位址和子網路的CIDR表示法為192.168.2.1/24 
最後的/24：用來表示前24位數固定 只有後面8位數表示不同的連入主機 
同理/16：192.168.0.0/16 前16位固定 其後表示不同主機
不一定要是8的倍數 可能為20/： 10.128.0.0/20
而 0.0.0.0 表示為所有ip的集合 用於表示默認所有ip連入

Classless Inter-Domain Routing 簡稱：CIDR 
無類別域間路由 網路上用於將ip封包進行歸類的方法

domain name申請:
FQDN（fully qualified domain name)指的是到特定主機host的完整網域名稱 
mymail.somecollege.edu host為mymail，位於somecollege.edu網域中
同理www.indiana.edu也是FQDN www為host_name 而indiana.edu則為域名 只是大部分時使用www主機做為網域的入口host 久而久之後就自動省略
每台host都有至少一個IP位址 但大多數只供內網使用 
而連接外網的入口host會架設web server用於分流到內網的host(反向代理) 瀏覽器中輸入的domain name就是找這台連接外網的入口host 

## GCE：
gcloud beta compute ssh \ 在本地端連上虛擬機的SSH
--zone "your_zone" "your_instant_name" \
--project "your_project_name" \

gcloud compute instances create gcelab \ instance執行個體名稱 及 VM機台名稱  (instances指的是執行個體 相當於建立管理物件 並不單指目前建立的VM機台)
--zone asia-east1-b \ VM所在區域
--machine-type=n1-standard-1 \ 決定所需VM機台規格 

gcloud compute instances create-with-container busybox-vm \ 用容器化的開啟方式
--container-image docker.io/busybox:1.27 \
--container-env-file ./env.txt \ 放入.env檔
--container-mount-host-path mount-path=/logs,host-path=/tmp,mode=rw  \ 裝載到host的特定目錄上
--container-command \ 等同docker run -c 
--container-stdin \ 等同docker run -i 可以開啟交互模式
--container-tty \  等同docker run -t 在交互模式下可使用指令
--container-restart-policy=always \ 等同 docker run --restart=always 無論如何都會重啟(一般server使用此設定來守護進程 是GCE的預設) 
其他的選項有: --restart=on-failure:10 (以非0狀態(0 exit code)退出時才會重啟 但10次以上就不重啟) 和 --restart=no (任何狀態退出都不自動重啟 適用於本機端使用的container程序 也是原本docker的預設)

vCPU:被實現為計劃按需運行的線程 指的是虛擬CPU 直到有工作負載時才會分配到可運行的真正物理CPU 對使用VM的用戶來說vCPU就等同真的CPU
運算最佳化：用於遊戲類型應用 需要大量突現即時性顯示的功能
記憶體最佳化：用於專業雲計算應用服務 所需內存較大的功能

三種VM機台的開機設定方式： (無論用哪一種方式都會至少需要一個開機硬碟)
--image debian-10-buster-v20200309 或 --image-family debian-10 \ 作業系統的映像檔 前者可決定版本 後者為直接用最新版
--image-project debian-cloud \ 通常會與image一起安裝 即雲端操作指令套件 (image相當於server的開機設定 用以減少每次新開一台機台的工作量)
--source-snapshot=https://compute.googleapis.com/compute/v1/projects/myproject/global/snapshots/instance-snapshot \ 複製已創建過的instance之機台內部系統與資料 (snapshot則是server的備份資料 可用於還原之前機台的資料)
--boot-disk-name=disk0 \ 若不使用image或snapshot(這兩種方法是用新的disk) 則可用已創建過的disk name為disk0
--disk-name=disk1 \ 仍可放入其他disk 通常會把data-disk和boot-disk分開 當需要使用備用機台時則直接將data-disk掛上去

gcloud compute instances create gcelab-1 gcelab-2 充許一次創建多個相同設定的VM機台
gcloud compute instances create gcepreempt \  建立搶佔式VM機台 (用比原價便宜的價格來使用閒置主機 此為臨時性且可能被突然中斷 不能保存資料：通常是為讓臨時性的大量運算可以移轉到搶佔式機台上)
--preemptible \
--no-restart-on-failure \ 
--maintenance-policy=terminate

當前的GCE版本：--provisioning-model=SPOT 取代 --preemptible 將搶佔式機台稱作SPOT虛擬機
如果不使用則為STANDARD虛擬機 --provisioning-model=STANDARD(GCE預設的虛擬機)

gcloud compute instances update-container VM_NAME \ 事後需要更新容器時可以使用
--container-image gcr.io/cloud-marketplace/google/nginx1:latest
GCE設計就是一隻VM只部署一種container 反之GKE則適合同時部署多個container

gcloud compute instances list 顯示目前所有VM機台
gcloud compute instances update gcelab \ 
--update-labels environment=production 設置label標籤的目的是為了幫多個VM做分類 以方便過濾搜尋
gcloud compute instances remove-labels gcelab \  移除label標籤 
--remove-labels environment

gcloud compute instances list \  label最大的用處在於幫助過濾搜尋
--filter labels.environment=test

gcloud compute instances describe gcelab 查看此VM機台的詳細訊息
gcloud compute instances add-tags gcelab \ 設置tag標記的主要目的是為了管理防火牆規則 (標記tag和標籤label的功能不同)
--tags http-server 
gcloud compute instances remove-tags gcelab \
--tags http-server

network：設定所在GCP中的哪個VPC網路名稱 (如果未設置 則直接用預設的default網路)
network tag：設定所要套用的防火牆 防火牆會放在VPC網路之下 通常會將防火牆分為web應用和db資料庫二種

VM創建完畢都會自動生成一組在該區域region中的內部IP與外部IP
內部IP創建時會連同內部VPC一起創建 而外部IP的相關設定可由GVPC調整 
內部VPC中會有多個預設的防火牆firewall 當要使用時在目標上加標記即可 (或可用VPC內部所有個體全部套用)
VM最常加上的標記:http-server和 https-server(分別為預設防火墻標記：default-allow-http和 default-allow-https) 
防火牆也可決定充許IP範圍：但通常針對外網輸入則會設為0.0.0.0 只有內網輸入才會另外訂出IP範圍

防火牆規則的預設為對外輸出(outgoing)完全開放 並可增加規則封鎖；對內輸入(incoming)則完全禁止 必須增加規則開放
因此GCP的VPC才會有預設的內網完全開放流入規則 和 http/https的流入規則

default-allow-internal(預設防火牆)
限定內網IP範圍10.128.0.0/9 (前9位固定 則第二組只要大於128即可 即第九位為1)
但放寬通訊協定tcp:0-65535, udp:0-65535, icmp

default-allow-ssh(預設防火牆) 
為port22 通常為全部套用的防火墻 因為這樣才能由本地端透過gcloud連接到VM的SSH

default-allow-rdp(預設防火牆)
為port3389 為遠端桌面協定(Remote Desktop Protocol) 類似於SSH 但專用於微軟系統

當application server有使用uWSGI做unix socket時 就需要用自製的防火墻開放port8003,port8004...
此時不能只用http-server和 https-server (如果沒有nginx_host 並直接對外開放的情形) 

gcloud compute instances start gcelab  啟動VM機台
gcloud compute instances stop gcelab  停止VM機台 (並不是所有GCP服務都能停止 有些必須直接刪除)
gcloud compute ssh gcelab  直接開啟VM機台的SSH

gcloud compute disks create mydisk --size=200GB --zone us-centrall-c 建立永久性磁碟 mydisk是磁碟名稱
當需要更多儲存空間來架設環境, 存放資料庫或運行主程式時 則需要再多一個硬碟
永久性磁碟(PD)分為四種：
pd-standard傳統硬碟, pd-ssd固態硬碟, pd-balanced平衡性能與費用的SSD(此為disk預設選項), pd-extreme高性能的SSD
針對所在位置分為：
區域磁碟(zone) 費用較低 就是在一個區域(zone)物理性架設安裝的磁碟
地區磁碟(region) 費用較高 可在同地區的兩個區域(zone)實現存儲與複製 等同是多了一個即時備份的磁碟

其餘設定參數：
deletion protection: 可防止VM被不小心刪除(預設)
deletion rule: 刪除VM個體後會順便把boot disk刪除(預設)
encryption: 存取資料庫時所使用的加密方式 用google-managed即可(預設)
additional disk: 通常會再加上data disk 為與boot disk分開

gcloud compute instances attach-disk gcelab --disk mydisk --zone us-central1-c 在運轉中的個體中新增永久性磁碟

gcloud compute addresses list 當前所有VM機台的內部ip與外部ip 

gcloud compute firewall-rules create "new-http-server" \
--allow=tcp:80 \ 充許經過防火牆的協定 (預設port80就是http 故可理解為充許以tcp為基底的http流量通過)
--source-ranges="10.0.0.0/22,10.0.0.0/14" \ ()
--description="Narrowing TCP traffic"
gcloud compute firewall-rules list 查看當前所有已設定的防火牆規則

Service Account服務帳號：(除了所有者帳號之外 其餘都是系統隨所用應用程式創建的服務帳號)
專門用來給不同應用程式在GCP上的身份權限 目的是為避免用戶將真實的google帳號寫入主機設定中
GCE的服務帳號為Compute Engine default service account
access scope決定服務帳號所能涉及的權限:
default access基本都是唯讀  full access則權限最大 set access for each API 則交給每一個API由人工設定 (一般都由人工設定API)
如果事後需要修改設定 可在IAM處理

Management主機管理：
reservations: 預定VM的擴張空間 以防機台需要額外空間時使用 (原則上不設置 因為可直接由instance group來處理)
startup scipts: VM開機時所執行的腳本

VM可用性政策：(直接用預設即可)
on host maintenance:機台定期維護時直接關機 或 將服務做遷移(預設)
automatic restart:機台硬體出現突發狀況則直接重開機(預設) 與否

Security主機安全性設定：
shielded VM: 主機開機時的安全檢查機制 分為三項:
--no-shielded-secure-boot 確保VM啟動時不會受到惡意軟體攻擊 -> 預設不開
--shielded-vtpm 用於驗證VM啟動前和啟動的完整性(虛擬信任平台模組) -> 預設開
--shielded-integrity-monitoring 透過監控來確保VM開即執行階段的完整性 -> 預設開

SSH key: 除了用GCP登入外 當用本地端連上SSH時需要有固定的key

Sole Tenency用戶群節點： (node一般就是指host)
一般來說VM會隨機開在資料中心中不同的實體機上
此設定可用於將VM開在同一個機台上 但並不會影響VM表現 僅為符合部分企業的需求


Instance Group (用於進行負載平衡)
當流量過大無法負荷時 Instance Group可自動加開相同設定的主機 將流量導引到新主機上
新主機的參數設定可透過以建立的模板來建立 
這種instance group以功能來區分又稱auto-scaling group(為instance group的一種) 可設定最多開幾台或最少開幾台 或流量維持多久才進行擴張或縮減 
設定參數：
health check設定流量檢查的閘道 HTTP Port 80 (其他參數:check interval每次檢查的間隔秒數 timeout每次檢查所需持續秒數 避免突發性的爆量流量 initial delay 為使開機時間不做流量檢查)
health threshold/ unhealth threshold 連續判定幾次成功才執行auto-scaling
(防火牆不能阻擋health check 故必須設定firewall rule 將health check的IP請求設為allow即可)

gcloud compute instance-templates create example-template-custom \ 設置instance group的模板 建立模板後就能讓instance group使用此模板
--machine-type=e2-standard-4 \  大部分參數都跟創建VM時相同
--image-family=debian-10 \
--image-project=debian-cloud \
--boot-disk-size=250GB 

內部有DB時 需建立stateful group 此時因為內部有固定資料 不能直接用autoscaling 
如果DB使用於不同的host 則可用stateless group 方便做autoscaling 
gcloud compute instance-group create example-group \ 
--instance-template=example-template-custom \ 
--zone us-central-1


- - ---------------------------------------------
# CI/CD 持續整合與持續交付

circleCI用於自動化雲端環境的測試,整合和部署 需要有配合的雲端平台PaaS
Continuous Integration & Delivery (CI/CD) 持續整合與持續交付
可自動偵測GitHub上的程式碼 若有更新則自動整合支線,自動建置Docker環境,自動測試,再自動部署到EB上
且circleCI的自動化測試結果也會在GitHub上顯示 只要有新的push都會執行 無論最後有沒有pull到owner的帳號

在專案Repo中新增circle.yml
其中包含machine:設置環境 dependencies:相依套件與框架 test:需進行的測試

Git-Flow 為針對開發時git使用流程的規範(workflow)
通常以release分支為基礎 每個release分支會有一隻develop分支 
最後會將開發完成的develop併回release 此時release是已完成新功能且已修復完bug 確認後再併回master

Github-Flow 也是一種git流程規範(workflow)
但以master為基礎 只要是master上的版本都一定要通過測試 
且任何開發功能或修復bug等所有分支都必須從master延伸 不會在分為release和develop兩分支

Github-Flow與Git-Flow最大的差異：
在於Github-Flow是以CI/CD為目的 強調上線部署後仍能不中斷開發

常見資料庫系統：
MySQL, SQLite,postgreSQL 都是關聯式資料庫(RDBMS) 追求一致性與準確性且能處理大量資料
MySQL則適合高流量大規模的網站 接受多個客戶同時訪問同一資料庫
SQLite屬於輕量型資料庫 適合中低流量的網站 且會有資料庫需單個寫入的侷限性

MongoDB 則為文件型資料庫 屬於非關聯式資料庫(NoSQL,not only SQL) 追求即時性
redis 全名為remote diction server 同樣是資料庫的一種
但為Key-Value Database：即利用鍵值的格式儲存資料 屬於非關聯式資料庫(NoSQL)
常用於需要快取cache的場合 幾乎是聊天室架設必備的工具


- - ---------------------------------------------
# 設置daphne
此為django-channel推薦的網路接口 用於處理asgi.py
一般不需要多寫ini檔
daphne -b 0.0.0.0 -p 8089 datingApp.asgi:application 即可開啟daphne

# 設置uWSGI
gunicorn和uwsgi為實現web server協議之接口:
為考慮效率 web server大多用來處理靜態資料 並接受http_request和回傳http_response

Django為實現application server功能之框架:
application server負責business logic的執行和database的存取 
(application server無法直接與client端溝通 只能接受web server的request並回傳response)

ubuntu安裝方式uwsgi方式:
sudo apt-get install -y build-essential python-dev python-pip
sudo pip install uwsgi 表示為python的套件 故也可以直接放在requirements.txt中

django一定需要搭配uWSGI 因為django自帶的server效能太差
後端部署要使用uWSGI&nginx 可做反向代理與負載平衡
client <-> web server(nginx) <-> the socket <-> uwsgi <-> application server(Django)
uWSGI會創建一個unix socket用來連接web server和application server
uwsgi --http :8000 --module mysite.wsgi 用uWSGI運行django專案的wsgi模組
uwsgi --socket mysite.sock --module mysite.wsgi socket綁定端口此時可以可直接用http協定通訊 在uwsgi設置不同端口 可讓nginx作分流
browser <-> 80 port <-> nginx <-> 8003 port <-> uwsgi <-> django
browser <-> 80 port <-> nginx <-> static files(不用經過uwsgi)
(這也是為何django只有在開發時 才要額外用STATICFILES_FINDERS的原因)

不是所有request都會經過uwsgi 只有需傳到application_server的request 因為nginx會處理掉部分request
nginx則處理所有的request作分流 而uwsgi只負責將django接上單一個port 兩者不相互依賴
nginx會獨立一個host(web server) 而uwsgi會放在django的host上

uwsgi --ini mysite_uwsgi.ini 亦可直接執行ini文件來運行uwsgi ini文件即包含socket和module等設定資訊(ini檔通常放在專案根目錄)
當使用uwsgi做為接口時 則不需要用python manage.py runserver 0.0.0.0:8000
(uwsgi.ini的module會直接接到wsgi.py中application)

uwsgi --stop /tmp/datingApp-master.pid 使用<pidfile>來關閉uwsgi 相關位置可在.ini檔中設定

uwsgi --http :9090 --wsgi-file wsgi.py 如果不使用ini檔 可以用參數表示
wsgi.py中會有application(env, start_response)此時uwsgi會將request 送到wsgi.py

此外daphne要先於uwsgi設置 因為uwsgi會測試asgi的路徑
daphne datingApp.asgi:application -b 0.0.0.0 -p 8009 使用daphne設置端口


touch uwsgi.ini ini檔的相關設定：
[uwsgi]
http = 0.0.0.0:8003  # 改變port後並要讓nginx導入新的路口(而request對nginx還是以8000port進入 此時還是用http協定)
(socket = :8003  # 此時在瀏覽器輸入127.0.0.1:8003會找不到 因為不是由http協定進入 而是unix socket處理)
(socket = /path/to/your/project/mysite.sock  # unix socket可以改用sock檔)
(chmod-socket = 664  # 使用sock檔需要修改權限)

module = project_name.wsgi:application # 等同wsgi-file 表示要將request送到哪
chdir = /home/foobar/myproject/ 架設的server由根目錄/到project (可用執行uwsgi指令所在位址取代)
home=/path/to/virtual/env 設置環境 (同樣可用執行uwsgi指令所在環境取代)
master = True # 必須有master才能做processes(workers)
processes = 4  # 4個進程 每多增加一個進程都會消耗內存而線程則不會 (可設置為CPU數*2)
threads = 2  # 2個線程 但線程會導致同一個進程的行速度上升
(拉高processes和threads有助於提升執行效率 最基本就是4,2)
vacuum = True # 離開時清除uwsgi設置 刪除生產在VM中的unix socket文件和pid文件
pidfile = /tmp/project_name-master.pid 如此才能用terminal操作關閉server (django設置)

harakiri=20  # 20秒無法回應則重新生成process
max-requests=5000  # 超過5000筆request也重新生成process

# 設置nginx
Nginx是一種web server: 
但無法自行實現WSGI服務 主要功能皆與效能有關 所以內層還要接上處理wsgi的gunicorn或uwsgi 與 處理asgi的daphne

nginx的反向代理reverse poxy：將static和media文件請求傳到一台server 而django應用則交給另一個server 並可暫存靜態資源static和media 讓重複請求不用到appication server(django)
nginx的負載平衡load balancer：具多台同功能server時 可針對相同url的request做反向代理導向不同的server 或者將不同url的request做分流
可以從nginx判斷 不同Domain或不同pathname以提供不同服務(跨server性質)

針對高流量請求時nginx也可緩存送來的request
亦可在nginx層處理HTTPS連線
nginx可在同一個IP位址但不同port開多個server_name 依據request的url來決定分流到哪個port 因此可由uWSGI設置專用接口 再由nginx導向

Network Address Translation(NAT架構) 區網內的電腦IP對外都會統一為一個公用IP
nginx讓區網內的電腦能將某個port公開出去 可暫時獲得公有URL以供其他電腦連線
nginx就是透過nginx自家伺服器做反向代理 將外部request傳送到區域內網的localhost

Ubuntu系統中的所在位置:/usr/local/nginx
sudo apt-get install nginx  在linux環境架設nginx
sudo /etc/init.d/nginx start
當修改設定檔後 需再次重啟：
sudo /etc/init.d/nginx restart

可準備2個資料夾 sites-enabled和sites-available 並修改nginx.conf:
註解： # include /usr/local/etc/nginx/conf.d/*.conf;
加上： include /usr/local/etc/nginx/sites-enabled/*; 表示引入在sites-enabled中的conf檔

user  root root; root為host電腦管理者名稱 其後為群組名稱 因為nginx需要獲取底層的權限 故需要設置管理者

TCP_NOPUSH on; 數據包累積到一定大小才會發送 必須啟用sendfile才會生效
TCP_NODELAY on; 對於數據包採取採取盡快發送 keepalive狀態下才會開啟
兩者可以一起使用 表因為兩者的判定條件不相同 故不牴觸

gzip  on; 當網址資源需要下載的檔案或文件太大時才會開啟 表示獲取資源會先進行壓縮到用戶端在進行解壓

所有的conf檔都會放在sites-available 而確定要使用的conf檔則用soft link連結到sites-enabled 可避免直接在sites-enable改動
sudo ln -s mysite_nginx.conf /etc/nginx/sites-enabled/  在sites-enabled目錄下提供conf檔
sudo /etc/init.d/nginx restart 載入mysite_nginx.conf後再重啟

sites-available/deploy-at-root-proxy-pass.conf的相關設定：

upstream test {
    server 192.168.1.123:58080;  # 指向實際後端application server主機 可在proxy_pass中指定
    server 192.168.1.123:9099 max_fails=3 fail_timeout=15s;  # 可設置upstream fail的相關設定 可用於觸發錯誤重試機制

    # server unix:///path/to/your/mysite/mysite.sock; # 也可以改用sock檔取代 此時不是用http協定 而是unix socket
    (另外unix socket可能會有權限問題 可用：uwsgi --socket mysite.sock --wsgi-file test.py --chmod-socket=666 開權限)
    }

upstream myweb {
    server web1.dtask.idv.tw weight=3;  loadbalancer可設置分配權重 weight=3
    server web2.dtask.idv.tw weight=2;
}

nginx underscores_in_headers on;  # 用於調整相關設定 此時proxy_set_header才能用有'_'的變數做替代

server {
    listen 8000; # the port your site will be served on
    (listen 8000 default_server; 當沒有匹配到時會轉往default_server 如果沒定義default_server時則用第一個server代替)

    server_name your_domain; 
    # the domain name it will serve for or your machine's IP or FQDN (除domain name之外 也可輸入該台host的IP位址或FQDN)

    server_name  www.vipdailiang.com vipdailiang.com;  表示對nginx 輸入兩者都會通到相同地方

    server_name  vipdailiang.com; 第二種方法是加上rewrite 如此就會做重導向
    rewrite ^/(.*) http://www.vipdailiang.com/$1 permanent; rewrite可用於重定向 

    charset utf-8;

    access_log  /data/nginx/logs/bpm.wangshibo.com-access.log main;
    error_log  /data/nginx/logs/bpm.wangshibo.com-error.log;  # 存放紀錄

    client_max_body_size 50M; # 限制上傳內容大小 超過則返回403錯誤 如果只是一般request則直接使用預設即可(默認為1M)
    client_header_timeout 1m; # header請求時間太長 會返回403錯誤 (一般都是header快於body 當header確認回傳內容時才做body請求)
    client_body_timeout 1m;
    proxy_connect_timeout 60s; 當request無法即時被nginx處理時 會放於等待池中直到timeout時間
    proxy_read_timeout 1m; 當response無法被即時被nginx處理時 也會先放於等待池中
    proxy_send_timeout 1m; 當nginx正在處理response時 容許最長處理時間


    location  = / {  # '='表示精準配對 只會配對'/'一種情況
    } 
    location ^~ /images/ {  # '^~'表示只會配對此選項 其後便不再配對其它location
    }
    location ~ ^/weblogs/ {  # 除了完整url之外 也可用正則表示法 ~表示區分大小寫的正則 ~*不區分大小寫的正則
    }
    location ~* \.(gif|jpg|jpeg)$ {  # '~*'表示配對一組不區分大小寫的正則 '.'為特殊符號 加上'\.'
    }

    # try_files可用於取代rewrite用於做重定向：
    常用於static檢驗上 如果沒有static資料時才做重定向到backend server (因為static資源會放在web server)
    
    location / {
      try_files $uri $uri/ @proxy_to_app;  # try_files用於檢查$url, $url/...等資料是否存在 若存在則返回最先檢查到的那一筆 若不存在則執行最後一個路徑(@proxy_to_app)
    }
    location @proxy_to_app {  # @proxy_to_app為在此設定檔宣告的location變數 此變數會被帶到try_files的$uri之後
    }
    

    location / { # 將port8000轉成uWSGI的port8003
        proxy_pass http://127.0.0.1:8003/;  # port為uWSGI修改改過的端口
        (或用proxy_pass upstream_name 表示會分流到被upstream指定的host)

        (uwsgi_pass 127.0.0.1:8003;  # 如果uWSGI已將django路徑改成unix端口 則應用uwsgi_pass取代)
        (include /path/to/your/mysite/uwsgi_params;  # 使用uwsgi_pass需加上uwsgi_params 用於取代下面的proxy_set_header設定)

        proxy_set_header Host $host; # 將原先指向web_server的host 換成 指向application_server的host(可用$host取代$http_host)
        ($host不包含port 而$http_host包含port)
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Real-PORT $remote_port; # 同理用於替代原先web_server的資訊 換成實際client端的IP:PORT

        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # X-Forwarded-For由多個IP組成 表示request經過的代理主機IP (X-Real-IP會是其中的第一個IP)

        proxy_set_header X-Forwarded-Proto $scheme;  # 有時不需要 因為web_server可能會做轉換 例如： http 換成 ws

        proxy_redirect 可直接對客戶端送來的url進行修改 (用於隱藏：當客戶端看到url時 所透露出來的server端訊息)
        (proxy_redirect為default時 都會進行)

        client_max_body_size 5M;  # 也可放於location之中 表示針對特定路徑有其限制
        
        proxy_next_upstream error timeout http_500 http_404; # 表示那些狀況時會進行重試 默認只會有error timeout 因為後兩者表示真的有問題 重試也不會有用

    }
    location /static/ {  # url為/static/直接取靜態文件 不進入uWSGI
        alias /your/path/project_name/static/;  # url為/static/js/chat.js  則返回/your/path/project_name/static/js/chat.js 不重複location的配對路徑
    }
    location /media/ {  # 所有的靜態文件都要用nginx作分流
        alias /your/path/project_name/mdia/;
    }

    error_page 502 503 =200 /50x.html;  # 表示發生特定錯誤時所返回路徑
    location = /50x.html {  # 故需要再加上location 此時內容直接放在nginx就好 因為不會到後端 '='f指的是重定向 而不是用戶原先輸入的網址
        root /usr/share/nginx/html;  # 會返回/usr/share/nginx/html/50x.html 會將location的url接在 root的url 之後
    }
    error_page 404 /404.html 可顯示自定義404頁面內容，正常返回404狀態碼。
    error_page 404 = /404.html 可顯示自定義404頁面內容，但返回200狀態碼。 '='為重定向之意error_page 404 =200 /404.html 可省略重定向成功的200狀態碼

}

sudo nginx -t 測試設定檔是否可正常使用 每次執行時都要進行一次
sudo nginx -s reload 重新讀取conf檔以使更新生效
sudo nginx -g 'daemon off;' sudo一定要加上 且使用'daemon off;狀態開啟 才比較有關閉
nginx -s stop 暫停nginx
nginx -s quit 離開nginx
brew search nginx 查詢是否有此軟件
brew info nginx 查看此軟件的相關訊息
brew install nginx 下載此軟件

nginx-log的位置：usr/local/var/log/nginx/

# 設置supervisord
用於自動管理進程 當發生問題時會自動執行相關指令已開啟端口(uwsgic和daphne都需要透過supervisord管理)
supervisord -c /etc/project_name/supervisord.conf 執行supervisord -c可指定特定設定檔執行 若不指定則用預設/etc/supervisord.conf 
(supervisorctl只能在base環境下使用 不然看不到status狀態)
supervisorctl start all 等同supervisord 但必須先由 supervisord指令來建立upervisord.sock
supervisorctl status 檢查當前的狀況
supervisorctl stop all
supervisorctl start programxxx 除了用all之外 也可以指定進程
supervisorctl stop programxxx
supervisorctl restart programxxx 重新啟動該進程 不會重新讀取設定檔
supervisorctl reload 亦重新啟動該進程 但會先停止進程並重讀設定檔 
supervisorctl update 如果沒有改變則不會停止 

使用supervisord的container時需要修改supervisord.conf：
nodaemon=true 因為總進程需要讓docker來管理
/etc 取代 /usr/local/etc , 
/var 取代 /usr/local/var 確認路徑 因為本機端的路徑會跟container的路徑不同

supervisord-log的位置：usr/local/var/log/supervisord.log(supervisord的主程式 而不是運行的進程)
supervisord_nginx和supervisord_uwsgi的log位置：datingApp/log/supervisor/

测试用JSP 用於測試最後application server後端收到的資訊:
request.getScheme() 為所使用的協定(http, https, ws, wss, ftp...)
request.getRemoteAddr()和request.getRemotePort() 為server端的內網IP(192.168.1.123)和內網port(58828) 指的是內網中架設web server的主機host(做反向代理)

request.getServerName和request.getServerPort() 則是被web server分流導向的實際後端application server的主機host (因此ServerName可以不是IP 而是內網中已設置的name)

為要取得實際client端host的資訊 (必須在nginx中使用proxy_set_header來替換掉web_server的host資訊)
request.getHeader("X-Forwarded-For") 第一組IP為client端的host 最後一組IP為web_server的host
request.getHeader("X-Real-IP")和request.getHeader("X-Real-Port") 若有在nginx替代web_server資訊 則會是client端的host資訊
request.getHeader("Host") 指向實際後端application_server的host

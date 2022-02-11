const story_dialogs = [
["以下劇本是由<span class='a-point'>偵探</span>的視角進行：", !1,"s"],
["", !1,"w"],
["===大學畢業晚會===", !1,"s"],
["<span class='a-point'>我</span>：(今天是我們最後一天待在學校了 突然有點感傷...)", !1,"a"],
["<span class='a-point'>我</span>：(突然有人叫住我...)", !1,"a"],
["", !1,"w"],
["<span class='a-point'>好姐妹</span>：誒！過了今天我們就不再是大學生了耶！ 要不要來做一些特別的事～", !1,"a"],
["<span class='a-point'>我</span>：說什麼呀 妳是喝醉了哦？", !1,"a"],
["<span class='a-point'>好姐妹</span>：哈哈 等等要不要跟他們去續攤呀？", !1,"a"],
["<span class='a-point'>我</span>：他們...？", !1,"a"],
["<span class='a-point'>好姐妹</span>：你傻呀！就是剛剛那群人呀！ 我看妳剛剛也玩得很開心呀", !1,"a"],
["<span class='a-point'>我</span>：哪有！ 那他們要去哪續攤？", !1,"a"],
["<span class='a-point'>好姐妹</span>：妳看妳明明就很有興趣！ 我去問一下好了，我猜應該是學校旁邊的酒吧！ 妳真的要去齁？", !1,"a"],
["<span class='a-point'>我</span>：應該可吧！ 但我不能玩太晚哦", !1,"a"],
["<span class='a-point'>好姐妹</span>：知道啦，我們走吧！", !1,"a"],
["", !1,"w"],
["", !1,"w"],
["。", !1,"s"],
["。", !1,"s"],
["。", !1,"s"],
["====隔天早上====", !1,"s"],
["<span class='a-point'>我</span>：(我在宿舍醒來...)", !1,"a"],
["", !1,"w"],
["<span class='a-point'>我</span>：我怎麼......", !1,"a"],
["<span class='a-point'>好姐妹</span>：誒 妳昨天很誇張耶！ 真看不出來妳比我還會玩～ 哈哈", !1,"a"],
["<span class='a-point'>我</span>：我...？", !1,"a"],
["<span class='a-point'>好姐妹</span>：對呀 還被帥哥帶出場～", !1,"a"],
["<span class='a-point'>我</span>：怎麼可能！？", !1,"a"],
["<span class='a-point'>好姐妹</span>：真的呀！ 連我也嚇了一跳 認識妳四年 都沒看過妳這麼主動哈哈哈", !1,"a"],
["<span class='a-point'>我</span>：為什麼我完全沒印象......", !1,"a"],
["<span class='a-point'>好姐妹</span>：哈哈哈我也沒仔細看！ 喝到最後很多人都茫了～", !1,"a"],
["<span class='a-point'>我</span>：(這個男生是誰呀？ 完全記不起來...... 總之先回去那間酒吧看看吧)", !1,"a"],
["", !1,"w"]];

const role_desc_dialogs = {
    1:[
        ["<span class='a-point'>審問</span>：" + 
        "左側名單是昨晚與妳待在酒吧的<span class='a-point'>嫌疑人</span>，只有其中一位是真正發生關係的<span class='a-point'>渣男</span>，請選擇任何一位嫌疑人單獨進行<span class='a-point'>審問</span>吧。",0,"s"],
        ["<span class='a-point'>推理</span>：" +
        "每一輪最後偵探將進行<span class='a-point'>推理</span>，若成功識別個別<span class='a-point'>嫌疑人</span>昨晚所做的事，則該名嫌疑人失敗出局，直到找出嫌疑人中的<span class='a-point'>渣男</span>則偵探勝利，成功破案遊戲結束。",0,"s"]],
    0:[
        ["<span class='a-point'>調查</span>：" +
        "你可以<span class='a-point'>調查</span>左側名單上的嫌疑人，可查看對方昨晚可能做的事。",0,"s"],
        [ "<span class='a-point'>線索</span>：" +
        "<span class='a-point'>調查</span>完之後，可向<span class='a-point'>偵探</span>傳送一句話做為<span class='a-point'>線索</span>。除此之外偵探會對每一位嫌疑人進行審問，你必須想辦法不讓<span class='a-point'>偵探</span>識別自己昨晚所做的事，若被成功識別則失敗出局。",0,"s"]]
};

const role_desc = {
    1:[""],
    0:["若偵探成功找出嫌疑人中的渣男，則其餘嫌疑人勝利，成功洗刷罪名。 <br> 反之嫌疑人中的渣男未被找出，則渣男勝利，成功躲過。"]
};

const end_dialogs = [


];
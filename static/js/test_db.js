
var status_0 = {
        anonName: "",
        chatLogs0: "",
        chatLogs1: "",
        chatLogs2: "",
        chatLogs3: "",
        chatLogs4: "",
        chatLogsMaxNum: "250",
        chatLogsNum: "0",
        imgUrl_adult: "",
        isBanned: "false",
        isSaved: "false",
        lastSaid: "sys",
        matchType: "",
        name: "",
        room: "",
        school: "",
        status: "0",
        testQuestions: "[]",
        testResult: "[]",
        text_in_discon: "[]",
        uuid: "d8098204-f531-433b-bef6-59d9fc914141",
        waiting_time: "",
    },
    status_1 = {
        anonName: "不加糖拿鐵(管理員)",
        chatLogs0: "",
        chatLogs1: "",
        chatLogs2: "",
        chatLogs3: "",
        chatLogs4: "",
        chatLogsMaxNum: "250",
        chatLogsNum: "0",
        imgUrl_adult: "",
        isBanned: "false",
        isSaved: "true",
        lastSaid: "anon",
        matchType: "mf",
        name: "jason",
        room: "",
        school: "NTU",
        status: "2",
        testQuestions: "[{\"content\":\"在一場朋友的聚會中你認識了A男與B男：\\n\\nA男-崇尚現實主義，將家庭擺在第一位，極具領袖魅力，在大型電影公司擔任副製片人\\nB男-浪漫主義的嬉皮士，空軍背景，創業成立小規模的航運公司並擔任CEO與飛行員\\n\\n依據以上描述，請問你認為何人在聚會中對女性更有吸引力？\",\"choice\":[\"A男\",\"B男\"]},{\"content\":\"請問何者才是瑞典著名家具品牌IKEA的正確念法？\",\"choice\":[\"一ki呀\",\"愛ki呀\"]},{\"content\":\"如果只有這二種選擇，哪一個網路論壇對你更有吸引力？\",\"choice\":[\"DCARD\",\"PTT\"]},{\"content\":\"你的朋友剛從國外回來，決定邀請所有IG上的好友來辦一場迎風派對。\\n\\n但你到現場時卻發現只有你一人，此時你會怎麼做？\",\"choice\":[\"想辦法開溜並告知朋友臨時有事\",\"努力炒熱氣氛並試圖安慰這位朋友\"]},{\"content\":\"如果要買遊戲機，不考慮價格差異下你會選擇哪一台？\",\"choice\":[\"switch\",\"PS5\"]}]",
        testResult: "[\"0\",\"1\",\"0\",\"1\",\"0\"]",
        text_in_discon: "[]",
        uuid: "1afdcfae-1417-4f2a-8288-437e3e1ef760",
        waiting_time: "2021-11-03 22:59:26",
    }



function loadStatus(status){
    for (prop in status){
        localStorage[prop] = status[prop]
    }
}

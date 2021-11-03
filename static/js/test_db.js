
var status_0 = {
    anonName: "",
    chatLogs0: "",
    chatLogs1: "",
    chatLogs2: "",
    chatLogs3: "",
    chatLogs4: "",
    chatLogsMaxNum: "250",
    chatLogsNum: "0",
    hasTested: "false",
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
}

function loadStatus(status){
    for (prop in status){
        localStorage[prop] = status[prop]
    }
}

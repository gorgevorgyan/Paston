
function whoStarts(users){  //Checks who is starting

    for(let i in users){
        for(let j in i){
            if(users[i][j] == 'a5'){
                return i
            }
        }
    }

    return;  // Need new shuffle
}

function canSay(whatWant, currTalk, currTurn=null) {

    let card = ['a', 'b', 'c', 'd'].reverse()

    if(!currTurn) return true
    if(card.indexOf(currTalk) < card.indexOf(whatWant)) return true
    else return false
    
}

function checkWin(cards, currTalk) {

    let card = ['a', 'b', 'c', 'd'].reverse()
    let tableCards = []
    let sec;
    let userIds = [];
    

    for(let ids in cards){
        userIds.push(ids)
        tableCards.push(cards[ids])

    }
    
    let currMust = tableCards[0][0]

    if(currMust == tableCards[1][0]){
        if( parseInt(tableCards[0][1]) > parseInt(tableCards[1][1])) sec = 0;
        else sec = 1;    
    }
    else{
        if(tableCards[1][0] == currTalk) sec = 1;
        else sec = 0;
    }


    if(currMust == tableCards[2][0]){
        if( parseInt(tableCards[sec][1]) > parseInt(tableCards[2][1])) return userIds[sec];
        else return userIds[2];
    }
    else{
        if(tableCards[2][0] == currTalk) return userIds[2];
        else return userIds[sec];
    }

}

function score(talk, talker, pass, userList) {  //talk-must, pass-[tarac, tarac1, tarac2], userList-[id, id1, id2]
    let card = ['a', 'b', 'c', 'd']
    let a = userList.indexOf(talker)
    let delIt = pass.splice(a, a)
    pass.push(delIt[0])
    userList.splice(a, a)
    userList.push(talker)
    return {
        [userList[2]] : (pass[2] >= 6) ? pass[2] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1),
        [userList[0]] : (pass[0] >= 2) ? pass[0] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1),
        [userList[1]] : (pass[1] >= 2) ? pass[1] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1)
     }
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

function getCards(){

    var cardList = []
    var sendList = []
    var count = 0;
    for(let i in ['a', 'b', 'c', 'd']){
        for(let j = 1; j <= 8; j++){
            cardList.push(String(['a', 'b', 'c', 'd'][i]) + String(j))
        }
    }
    cardList = shuffle(cardList);
    while ([cardList[30], cardList[31]].includes('a5')) cardList = shuffle(cardList)
    for(let k = 1; k < 4; k++){
        a = []
        for (let n = 0; n < 10; n++){
            a.push(cardList[count])
            count += 1;
        }
        sendList.push(a)
    }
    sendList.push([cardList[30], cardList[31]])
    return sendList;
}

console.log(whoStarts([['a1' , 'a2'], ['a3'], ['a5']]))

module.exports = {
    ...{score}, ...{checkWin}, ...{canSay}, ...{whoStarts}
}
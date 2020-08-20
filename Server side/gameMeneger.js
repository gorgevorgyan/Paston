
function whoStarts(users){  //Checks who is starting

    for (let ids in users){
        for (let cards in usres[ids]){
            if(cards.includes("a5")) return ids  //Retures user id
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

module.exports = {
    ...{score}, ...{checkWin}, ...{canSay}, ...{whoStarts}
}
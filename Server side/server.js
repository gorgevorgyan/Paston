if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
  }
const config = require("./config/global.json");
const express = require('express')
//const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');
const fs = require("fs");
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const path = require('path');
var Busboy = require('busboy')
const fileUpload = require('express-fileupload');
const { emit } = require('process');
const { start } = require('repl');
const User = require('./models/User');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://sahak12:newdvbt2@cluster0.8lxiu.gcp.mongodb.net/pastonx?retryWrites=true&w=majority";
var ObjectId = require('mongodb').ObjectId; 
let Users = require(__dirname+"/models/User.js");
let Room = require(__dirname+"/models/Room.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(fileUpload());

app.use(methodOverride('_method'))


//////////FUNCTIONS//////////


function whoStarts(users){  //Checks who is starting
    for(let i in users){
        if(users[i].includes("a5")) return i
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
    let b = pass[a]
    pass = delAr(pass, a)
    pass.push(b)
    userList = delAr(userList, a)
    userList.push(talker)
    console.log(userList, pass)
    return {
        [userList[2]] : (pass[2] >= 6) ? pass[2] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1),
        [userList[0]] : (pass[0] >= 2) ? pass[0] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1),
        [userList[1]] : (pass[1] >= 2) ? pass[1] * (card.indexOf(talk) + 1) : -10 * (card.indexOf(talk) + 1)
     }
}

function delAr(arr, index){
    var newArr = []
    for(let i in arr){
        if(i != index){
            newArr.push(arr[i])
        }
    }
    return newArr

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


/////END FUNCTIONS//////////


app.get("/login", function(req, res){
	res.sendFile(__dirname+"/login.html")
});

app.get('/main',(req, res) => {
	res.sendFile(__dirname+"/main.html")
});


app.get('/lobby', (req, res) => {
	res.sendFile(__dirname+"/lobby.html")
});



mongoose.connect(config.mongo.connectionURL, config.mongo.options, error => {
    if(error)console.log(error);
    console.log('Mongoos connect');
});

app.post('/registerUser', async(req, res) => {
    console.log("reg");
    let user = await Users.findOne({NickName: req.body.name})
    if(user) return res.send('this nickname defined');

    let newUser = new Users({
        NickName:req.body.name,
        Password:req.body.pass
    });

    try{
        let user = await newUser.save();
        //res.header('auth-token', await jwt.sign({user}, privatKey));
        console.log(user._id)
        res.send(user._id).status(200);
    }
    catch(error){
        res.send('').status(504);
    }
});

app.post('/signin', async(req, res) => {
    let user = await Users.findOne({NickName: req.body.nick})
    if(!user){
        console.log("this name is none");
        return;
        //return res.send('this nickname undefined');
    }
    if(user.Password !== req.body.password){
        console.log("this password is invalide")
        return;
        //return res.send("this password is invalide");
    }
    try{
        //res.header('auth-token',await jwt.sign({user}, privatKey));
        res.send(user._id).status(200);;
    }
    catch(error){
        console.log(error);
        res.send('server error').status(500)
    }
});

app.post('/addRoom', async(req, res) => {

    let user = await User.findOne({_id : req.body.id});

    let newRoom = new Room({
        UserList:[user._id],
        Admin   : req.body.id,
        private : false
       });

    try{
        let Nroom = await newRoom.save();
        //res.header('auth-token', await jwt.sign({user}, privatKey));
        res.send(Nroom._id).status(200);
    }
    catch(error){
        res.send('').status(504);
    }
});

//app.listen(3000, () => {
//    console.log("I am running");
//});

io.on('connection', function(socket){
    socket.on('roomNewUser', async function(msg){
      console.log(msg)

      let room = await Room.findOne({_id : msg.roomId, isStart: false, private: false});
      let user = await Users.findOne({_id : msg.userId});

      if(user.isPlay == true) console.log("user is in game"); //return socket.emit('room', 'User already is in game');

      if(room == undefined) console.log("no room found") //return socket.emit('room', 'your room undefine or Game started');

      try{
          
          let newRoom = await Room.findOneAndUpdate({ _id : msg.roomId}, {
              UserList:[...room.UserList, user._id],
              isStart :(room.UserList.length == 3)  
          });
          //update user is play true
          await Users.findByIdAndUpdate(msg.userId, {isPlay: true});
          user = await Users.findById(msg.userId);

          //update user token
          //let authToken = await jwt.sign({user}, privatKey);
          //socket.emit('updateToken', {"auth-token":authToken});
          
          //key for conection game
          //let key = await jwt.sign({'key': _id}, privatKey);
          //socket.emit('room', {'key':key});/// 
          
          //send new room list 
          var roomInfo = await Room.find({_id : msg.roomId})
          var starter = whoStarts(currCards)
          io.emit('roomUpdate', {"roomID" : msg.roomId,"info": await Room.find({_id : msg.roomId})});
          if(roomInfo[0].UserList.length == 3){
            var currCards = getCards()
            var starter = whoStarts(currCards)
            console.log(starter)
            let newRoomC = await Room.findOneAndUpdate({ _id : msg.roomId}, {
                cardList:currCards,
                score: [0, 0, 0],
                currRealTalker: starter,
                tableCards: [],
            });
            io.emit('gameStart', {"roomID" : msg.roomId, "userCards" : currCards, "starter" : starter, "roomInfo" : roomInfo, "score" : "[0,0,0]"})
            console.log("Game need to be started")
          }
      }
      catch(error){
          console.log(error)
          socket.emit('room', 'your room undefined or Game started');
      }

    });

    socket.on('wantPass', function(msg){ 
        function a(){
           io.emit('ano ther', {"roomID" : msg.roomID, "who" : msg.who, "talker" : msg.talker});
        }
        setTimeout(a, 500)
    });

    socket.on('passInfo', async function(msg){ 

        user = await Room.findById(msg.roomID);
        //console.log(user, user.letPass)
        if(user.letPass.length == 2){
            //console.log("DETECED TWO ELEMENTS")
            if(user.letPass[1]){
                //console.log("AGREE1 PASSED")
                if(msg.answer){
                    //console.log("AGREE2 passed")
                    io.emit("letedPass", {"roomID" : msg.roomID, "backAnswer" : "1", "whoWill" : 'null', "talker" : msg.talker})
                }
            }
        }
        else{
            //var updatePass = []
            //updatePass[msg.by] == msg.answer
            //updatePass.push(msg.by)
            //updatePass.push(msg.answer)
            console.log( msg.roomID, "THSI IS ROOM")
            let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                letPass:[msg.by, msg.answer]
            });
            //console.log(newRoomP)
        }

    });

    socket.on('sayMust', async function(msg){ 

        io.emit("sayBack", {"roomID" : msg.roomID, "block" : msg.who, "must" : msg.must})
     });

     socket.on('sayMustWB', async function(msg){ 
        console.log(msg.must, msg.who)
        let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
            currTalk:String(msg.must),
            currTalker:msg.who,
            curLetMustInfo:[]
        });
        io.emit("canPlay", {"roomID": msg.roomID, "who" : msg.who})
      });

    socket.on('passSay', async function(msg){
        var roomInfo = await Room.find({_id : msg.roomID})
        if(roomInfo[0].curLetMustInfo.length == 2){
            console.log(msg.what, msg.player)
            let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                currTalk:String(msg.what),
                currTalker:msg.player,
                curLetMustInfo:[]
            });
            io.emit("canPlay", {"roomID": msg.roomID, "who" : msg.player})
        }
        else{               
            console.log( msg.roomID, "THSI IS ROOM")
            let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                curLetMustInfo:[msg.who, false]
            });
        }
    });

    socket.on('cardAddTable', async function(msg){
        var roomInfo1 = await Room.find({_id : msg.roomID})
        var roomInfo = roomInfo1[0]
        var currCards = roomInfo.tableCards
        var players = roomInfo.UserList
        var checkList = {}
        console.log(roomInfo)
        console.log(players)
        console.log(currCards)
        var p1 = players[0]
        var p2 = players[1]
        var p3 = players[2]
        var currCard = msg.card
        var currPLayer = msg.player
        var FullnewUser = '';
        var FullnewUserFull = '';
        for(let kill in [1, 2, 3]){
            console.log(String(roomInfo.UserList[kill]), String(msg.player))
            if(String(roomInfo.UserList[kill]) == String(msg.player)){
                console.log("here")
                if(kill == 2) {
                    FullnewUser = roomInfo.UserList[0]
                }
                else {
                    FullnewUser = roomInfo.UserList[parseInt(kill) + 1]
                }
                console.log(FullnewUser, roomInfo.UserList[kill + 1], kill)
            }
        }
        for(let kill1 in [1, 2, 3]){
            console.log(String(roomInfo.UserList[kill1]), String(roomInfo.currTalker))
            if(String(roomInfo.UserList[kill1]) == String(roomInfo.currTalker)){
                console.log("here11")
                if(kill1 == 2) {
                    FullnewUserFull = roomInfo.UserList[0]
                }
                else {
                    FullnewUserFull = roomInfo.UserList[parseInt(kill1) + 1]
                }
                console.log(FullnewUserFull, roomInfo.UserList[kill1 + 1], kill1)
            }
        }
        if(currCards.length == 2){
            if(parseInt(roomInfo.gameState) == 9){
                var gameStatee = roomInfo.gameState
                var passInfo = roomInfo.currPass
                console.log(players.indexOf(msg.player), players.indexOf(msg.player) == 0)
                if(players.indexOf(msg.player) == 0) checkList = {[p1] : currCard, [p2] : currCards[0], [p3] : currCards[1]}
                else if(players.indexOf(msg.player) == 1) checkList = {[p1] : currCards[1], [p2] : currCard , [p3] : currCards[0]}
                else if(players.indexOf(msg.player) == 2) checkList = {[p1] : currCards[0], [p2] : currCards[1], [p3] : currCard}
                console.log(checkList, ["a", "b", "c", "d"][parseInt(roomInfo.currTalk) - 1])
                var winner = checkWin(checkList, ["a", "b", "c", "d"][parseInt(roomInfo.currTalk) - 1])
                console.log(winner, " THIS IS WINNER")
                passInfo[roomInfo.UserList.indexOf(winner)] = passInfo[roomInfo.UserList.indexOf(winner)] + 1
                console.log(passInfo, roomInfo.UserList.indexOf(winner))
                var newScroe = score(['a', 'b', 'c', 'd'][parseInt(roomInfo.currTalk)], roomInfo.currRealTalker, passInfo, players)
                console.log(newScroe, " This is new score")
                var newCards = getCards()
                var newSendScore = [newScroe[p1], newScroe[p2], newScroe[p3]]
                let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                    tableCards:[],
                    currRealTalker: '',
                    gameState: '0',
                    currPass: [0, 0, 0],
                    score: newSendScore,
                    currTalk: '',
                    cardList:  newCards,
                    currTalker: FullnewUserFull,
                    letPass: [],
                });
                var sendListRoom = [roomInfo]
                console.log(newSendScore)
                io.emit('gameStart', {"roomID" : msg.roomID, "userCards" : newCards, "starter" : players.indexOf(FullnewUserFull), "roomInfo" : sendListRoom, "score" : newSendScore})
            }
            else{
                var gameStatee = roomInfo.gameState
                var passInfo = roomInfo.currPass
                console.log(players.indexOf(msg.player), players.indexOf(msg.player) == 0)
                if(players.indexOf(msg.player) == 0) checkList = {[p1] : currCard, [p2] : currCards[0], [p3] : currCards[1]}
                else if(players.indexOf(msg.player) == 1) checkList = {[p1] : currCards[1], [p2] : currCard , [p3] : currCards[0]}
                else if(players.indexOf(msg.player) == 2) checkList = {[p1] : currCards[0], [p2] : currCards[1], [p3] : currCard}
                console.log(checkList, ["a", "b", "c", "d"][parseInt(roomInfo.currTalk) - 1])
                var winner = checkWin(checkList, ["a", "b", "c", "d"][parseInt(roomInfo.currTalk) - 1])
                console.log(winner, " THIS IS WINNER")
                passInfo[roomInfo.UserList.indexOf(winner)] = passInfo[roomInfo.UserList.indexOf(winner)] + 1
                console.log(passInfo, roomInfo.UserList.indexOf(winner))
                let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                    tableCards:[],
                    currRealTalker: winner,
                    gameState: String(parseInt(gameStatee) + 1),
                    currPass: passInfo
                });
                io.emit('canPlay', {"roomID" : msg.roomID, "who" : winner, "clear" : true})
            }
        }
        
        else{
            currCards.push(msg.card)
            let newRoomP = await Room.findOneAndUpdate({ _id : msg.roomID}, {
                tableCards:currCards,
                currRealTalker:FullnewUser
            });
            console.log(FullnewUser)
            io.emit('canPlay', {"roomID" : msg.roomID, "who" : FullnewUser, "tableCards":currCards, "table" : true})
            //io.emit("nextUser", {"roomID": who.roomID, "newUser" : newUser})
        }
    });

  });

http.listen(port, function(){
    console.log('listening on *:' + port);
});
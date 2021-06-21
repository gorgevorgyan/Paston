var mongoose = require('mongoose');
var Schema = mongoose.Schema

let Room = new Schema({
    UserList:Array,
    Admin :mongoose.mongo.ObjectId,
    GameId: {
        type: String,
        default: ""
    },
    gameState:{
        type: String,
        default: "0"
    },
    currTalker:{
        type: String,
        default: ""
    },
    score: Array,
    currPass: {
        type: Array,
        default: [0, 0, 0]
    },
    currTalk:{
        type: String,
        default: "" 
    },
    cardList:Array,
    private: Boolean,
    letPass:Array,
    curLetMustInfo: Array,
    currRealTalker: {
        type: String,
        default: "" 
    },
    tableCards:{
        type:Array,
        default:[]
    },
    isStart:{
        type:Boolean,
        default:false
    },
    
});

module.exports = mongoose.model('Room', Room);

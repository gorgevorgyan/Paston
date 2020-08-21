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
        default: ""
    },
    currTalker:{
        type: String,
        default: ""
    },
    score: Array,
    currPass: Array,
    currTalk:{
        type: String,
        default: "" 
    },
    cardList:Array,
    private: Boolean,
    isStart:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('Room', Room);

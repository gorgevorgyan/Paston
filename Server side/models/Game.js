var mongoose = require('mongoose');
var Schema = mongoose.Schema

let Game = new Schema({
    gameState: {
        type:Number,
        default: 0
    },
    currGameState: {
        type:Number,
        default: 0
    },
    currTalker: String,
    currTlak  : String,

    currPass  :  Array,
    cardList:Array,
    PlayerList:Array,
    score:{
        type:Array,
        default:[]
    }
});

module.exports = mongoose.model('Room', Game);
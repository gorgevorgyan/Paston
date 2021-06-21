var mongoose = require('mongoose');
var Schema = mongoose.Schema

let User = new Schema({
    NickName:{
        type:String,
        max:12,
        min:4
    },
    Password:String,
    Rang:{
        type:Number,
        default:0
    },
    PlayCount:{
        type:Number,
        default:0
    },
    WL:{
        type:Number,
        default:0
    },
    gold:{
        type:Number,
        default:5
    },
    chip:{
        type:Number,
        default:600
    },
    isPlay:{
        type:Boolean,
        default:false
    },
    Data:{
        type:Date,
        default:new Date()
    }
});

module.exports = mongoose.model('User', User);

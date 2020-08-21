let router = require('express').Router();
const privatKey = require("../config/global.json").jwt.privatKey;

let jwt = require('jsonwebtoken');
let checkToken = require('../modules/checkToken')

let Room = require('../models/Room.js');
let User = require('../models/User.js');   

router.use(checkToken['express']);

io.of('/lobby').use(checkToken['socket']);

io.of('/lobby').on('connection', async (socket) => {
    socket.emit('roomList', await Room.find({}));
    let join = socket => async _id => {
        let room = await Room.findOne({...{ _id }, isStart: false, private: false});
        

        let {user} = socket;
        if(user.isPlay == true) return socket.emit('room', 'USER ERROR');

        if(room == undefined) return socket.emit('room', 'your room undefine or Game started');

        try{
            
            let newRoom = await Room.findOneAndUpdate({ _id }, {
                UserList:[...room.UserList, user._id],
                isStart :(room.UserList.length == 2) 
            });
            //update user is play true
            await User.findByIdAndUpdate(user._id, {isPlay: true});
            user = await User.findById(user._id);

            //update user token
            let authToken = await jwt.sign({user}, privatKey);
            socket.emit('updateToken', {"auth-token":authToken});
            
            //key for conection game
            let key = await jwt.sign({'key': _id}, privatKey);
            socket.emit('room', {'key':key});/// 
            
            //send new room list 
            io.of('/lobby').emit('roomList', await Room.find({}));
        }
        catch(error){
            socket.emit('room', 'your room undefine or Game started');
        }
    };

    
    socket.on('craete', async  private => {
        let {user} = socket 

        let room = new Room({
            UserList:[],
            Admin   : user._id,
            ...{private}
        });
        try{
            let newRoom = await room.save();
            join(socket)(newRoom._id)
        }
        catch(err){
            res    
        }
    })

    socket.on('join', join(socket));

    socket.on('find', async () => {
        let rooms = await Room.find({ isStart: false, private: false});

        if(rooms.length == 0)return;

        let room = await rooms[ Math.floor(Math.random() * rooms.length)];
        join(socket)(room._id);
    });
});

module.exports = {
    url:"/rooms",
    callback:router
}
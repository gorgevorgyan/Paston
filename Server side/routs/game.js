let router = require('express').Router();

let checkRoom = require('../modules/checkRoom');
let checkToken = require('../modules/checkToken').socket;

io.of('/game').use(checkToken, checkRoom);
io.of('/game').on('connection', socket => {
    console.log(socket.game, socket.user);
});

module.exports = {
    url:'/game',
    callback: router
}
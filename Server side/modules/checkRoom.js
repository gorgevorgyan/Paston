let jwt = require('jsonwebtoken');
const privatKey = require("../config/global.json").jwt.privatKey;


module.exports =  async(socket, next) => {
    let token = socket.request.headers['room-key'] ;
    
    if(!token) return socket.disconnect();

    try {
        socket.game = jwt.verify(token, privatKey)
        if(socket.game == null) return socket.disconnect();

        next();
    }
    catch(error) {
        return socket.disconnect();
    }
}
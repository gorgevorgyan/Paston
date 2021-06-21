let jwt = require('jsonwebtoken');
const privatKey = require("../config/global.json").jwt.privatKey;


module.exports.express = async(req, res, next) => {
    let token = req.headers['auth-token'];

    if(!token) return res.send('invalide web token');
    try{
        req.user = await jwt.verify(token, privatKey).user;
        if(req.user == null)return res.send('invalide web token');

        next();  
    }
    catch(error){
        return res.send('invalide web token');
    }
}
module.exports.socket = async(socket, next) => {
    let token = socket.request.headers['auth-token'] ;

    if (!token) return socket.emit('token', 'token is not define');
    
    try{
        socket.user = await jwt.verify(token, privatKey).user;
        if(socket.user == null)return socket.disconnect();
        next();
    }
    catch(error){
        return socket.disconnect();
    }
}
let router = require('express').Router();
let Users = require("../models/User.js");

const privatKey = require("../config/global.json").jwt.privatKey;

let jwt = require("jsonwebtoken");
let checkToken = require('../modules/checkToken').express;

router.post('/signin', async(req, res) => {
    let user = await Users.findOne({NickName: req.body.NickName})
    if(!user)
        return res.send('this nickname undefined');
    
    if(user.Password !== req.body.Password)
        return res.send("this password is invalide");
    
    try{
        res.header('auth-token',await jwt.sign({user}, privatKey));
        res.send('user signin!').status(200);;
    }
    catch(error){
        console.log(error);
        res.send('server error').status(500)
    }
});
router.post('/signup',async(req, res) => {
    let user = await Users.findOne({NickName: req.body.NickName})
    if(user) return res.send('this nickname defined');

    let newUser = new Users({
        NickName:req.body.NickName,
        Password:req.body.Password
    });

    try{
        let user = await newUser.save();
        res.header('auth-token', await jwt.sign({user}, privatKey));
        res.send('user signin!').status(200);
    }
    catch(error){
        res.send('server error').status(504);
    }
});

router.post('/', checkToken, (req, res) => {
    res.send(req.user);
});

//admin//___________________________________
router.post('/userList', async(req, res) => res.send(await Users.find({})));


module.exports = {
    url: '/auth',
    callback: router
}
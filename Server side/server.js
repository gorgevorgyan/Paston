
const express = require("express");
const app = express();

const http = require('http').createServer(app)
io = require('socket.io')(http);

const config = require("./config/global.json");

const mongoose = require('mongoose');
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/static', express.static('public'));

config.server.routerList.forEach(fileName => {
    let rout = require(`./routs/${fileName}`);
    app.use(rout.url, rout.callback);
});
mongoose.connect(config.mongo.connectionURL, config.mongo.options, error => {
    if(error)console.log(error);
    console.log('Mongoos connect');


    const PORT = process.env.PORT || config.server.port;
    http.listen(PORT, err => {
        if (err) return console.error.bind(console, `Server error: ${err}`);
        console.log(`Server runing : port = ${PORT}`);
    });
});
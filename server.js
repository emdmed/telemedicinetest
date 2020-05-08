
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiKey = "46727622";
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, "6a01eb366bfe5759ebd5b18033894f50dd01338c");

const server = require("http").createServer(app);

app.use(express.static(__dirname + "/videoclient"));

server.listen(process.env.PORT || 3000);
console.log("Server running...")

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//ROUTES

app.get("/", function(req, res){
    res.sendFile(__dirname + "/videoclient/index.html");
})

//get credentials
app.get("/credentials", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);

        token = session.generateToken();

        console.log("new session created ", session.sessionId);

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });


})





const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiKey = "46727622";
const mongoose = require("mongoose")
const api_handler = require("./handlers/api_handler");
const db_handler = require("./handlers/db_handler");
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, "6a01eb366bfe5759ebd5b18033894f50dd01338c");

const server = require("http").createServer(app);

//DB
const remotemongo = "mongodb://admin:sanatorio123@ds054118.mlab.com:54118/labos";
//connect to mongoose
mongoose.connect(remotemongo, {useNewUrlParser: false});

let testurl = "http://localhost:3000";

let sessionInfo;

app.use(express.static(__dirname + "/videoclient"));

server.listen(process.env.PORT || 3000);
console.log("Server running...")

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//ROUTES

app.get("/", function(req, res){
    res.sendFile(__dirname + "/videoclient/welcome.html");
})

//get credentials
app.get("/createsession", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()
        console.log("new session created ", session.sessionId);

        sessionInfo = session.sessionId;
        console.log("doctor session ", sessionInfo);

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });
})

app.get("/createtoken", function(req, res){
    let token = opentok.generateToken(sessionInfo);
    console.log("patient video ", "token ",token, "session ", sessionInfo);
    res.json({sessionId: sessionInfo, token, apiKey}).end();
})

app.post("/contact", async function(req, res){
    console.log("contact");
    let data = req.body;

    let storeUser = await db_handler.findPatient(data)

    if(storeUser === false){
        res.status(400).end();
    } else {
        res.send({url: `${testurl}/waitingroom.html`, storeUser}).status(200).end();
    }

})





const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiKey = "46727622";
const mongoose = require("mongoose")
const api_handler = require("./handlers/api_handler");
const db_handler = require("./handlers/db_handler");
const ENV_URL = require("./config");
var OpenTok = require('opentok'),
    opentok = new OpenTok(apiKey, "apikey");

const server = require("http").createServer(app);

//DB
const remotemongo = "dburlhere";
//connect to mongoose
mongoose.connect(remotemongo, {useNewUrlParser: true, useUnifiedTopology: true });

let testurl = "http://localhost:3000";
let url = "produrlhere";

let sessionDermato;
let sessionEndocrino;
let sessionClinica;

app.use(express.static(__dirname + "/videoclient"));

server.listen(process.env.PORT || 3000);
console.log("Server running...")

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//ROUTES

app.get("/", function(req, res){
    res.sendFile(__dirname + "/videoclient/welcome.html");
})

//create Sessions
app.get("/createsessionDermato", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()

        sessionDermato = session.sessionId;

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });
})

app.get("/createsessionEndocrino", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()

        sessionEndocrino = session.sessionId;

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });
})

app.get("/createsessionClinica", function(req, res){
    opentok.createSession(function(err, session) {
        if (err) return console.log(err);
        let token = session.generateToken()

        sessionClinica = session.sessionId;

        res.json({
            apiKey,
            sessionId: session.sessionId,
            token
        }).end();
    });
})

app.get("/createtokendermato", function(req, res){
    let token;
    try{
        token = opentok.generateToken(sessionDermato);
        res.json({sessionId: sessionDermato, token, apiKey}).end();
    }catch{
        res.send(400).end();
    }
})

app.get("/createtokenendocrino", function(req, res){
    let token;
    try{
        console.log("endocrino session", sessionEndocrino);
        token = opentok.generateToken(sessionEndocrino);
        console.log("patient video ", "token ",token, "session ", sessionEndocrino);
        res.json({sessionId: sessionEndocrino, token, apiKey}).end();
    }catch{
        console.log("patient video ", "token ",token, "session ", sessionEndocrino);
        res.status(400).end();
    }
})

app.get("/createtokenclinica", function(req, res){
    let token;
    try{
        console.log("clinica session", sessionClinica);
        token = opentok.generateToken(sessionClinica);
        console.log("patient video ", "token ",token, "session ", sessionClinica);
        res.json({sessionId: sessionClinica, token, apiKey}).end();
    }catch{
        console.log("patient video ", "token ",token, "session ", sessionClinica);
        res.send(400).end();
    }
})

//login
app.post("/contact", async function(req, res){
    console.log("contact");
    let data = req.body;

    let storeUser = await db_handler.findPatient(data)

    if(storeUser === false){
        res.status(400).end();
    } else {
        console.log(storeUser[0]);
        console.log("stored user ", storeUser[0].type, storeUser[0].service );
        if(storeUser[0].type === "doctor" && storeUser[0].service === "dermato"){
            res.send({url: `${ENV_URL}/dermato.html`, storeUser}).status(200).end();
        } else if(storeUser[0].type === "doctor" && storeUser[0].service === "endocrino"){
            res.send({url: `${ENV_URL}/endocrino.html`, storeUser}).status(200).end();

        } else if (storeUser[0].type === "doctor" && storeUser[0].service === "clinica"){
            res.send({url: `${ENV_URL}/clinica.html`, storeUser}).status(200).end();
        } else {
            res.send({url: `${ENV_URL}/waitingroom.html`, storeUser}).status(200).end();
        }
    }
})


//checkear consultorios

//DERMATO
app.post("/checkConsultorioDermato", async function(req, res){

    let data = req.body;
    console.log(data);
    let found = await db_handler.checkConsultorioDermato(data);
    console.log("found patient", found);
    res.send(found).end();

})

app.post("/dermatoWaitingLine", async function(req, res){
    let data = req.body;
    try{
        let enterWaitingLine = await db_handler.enterDermatoWaitingLine(data);
        console.log("enterWaitingLine value ", enterWaitingLine);
        if(enterWaitingLine.denied === true){
            res.send(enterWaitingLine);
        } else {
            res.status(200).end();
        }
      
    }catch(error){
        //res.status(400).end();
    }

})

app.post("/deleteMyDermatoTurn", async function(req, res){
    let data = req.body;
    try{
        await db_handler.deleteMyDermatoTurn(data);
        console.log("turn deleted");
        res.status(200).end();
    }catch(error){
        res.status(400).end();
    }
})

//ENDOCRINO
app.post("/checkConsultorioEndocrino", async function(req, res){

    let data = req.body;
    console.log(data);
    let found = await db_handler.checkConsultorioEndocrino(data);
    console.log("found patient", found);
    res.send(found).end();

})

app.post("/endocrinoWaitingLine", async function(req, res){
    let data = req.body;
    try{
        let enterWaitingLine = await db_handler.enterEndocrinoWaitingLine(data);
        console.log("enterWaitingLine value ", enterWaitingLine);
        if(enterWaitingLine.denied === true){
            res.send(enterWaitingLine);
        } else {
            res.status(200).end();
        }
      
    }catch(error){
        //res.status(400).end();
    }

})

app.post("/deleteMyEndocrinoTurn", async function(req, res){
    let data = req.body;
    try{
        await db_handler.deleteMyEndocrinoTurn(data);
        console.log("turn deleted");
        res.status(200).end();
    }catch(error){
        res.status(400).end();
    }
})

//CLINICA
app.post("/checkConsultorioClinica", async function(req, res){

    let data = req.body;
    console.log(data);
    let found = await db_handler.checkConsultorioClinica(data);
    console.log("found patient", found);
    res.send(found).end();

})

app.post("/clinicaWaitingLine", async function(req, res){
    let data = req.body;
    try{
        let enterWaitingLine = await db_handler.enterClinicaWaitingLine(data);
        console.log("enterWaitingLine value ", enterWaitingLine);
        if(enterWaitingLine.denied === true){
            res.send(enterWaitingLine);
        } else {
            res.status(200).end();
        }
      
    }catch(error){
        //res.status(400).end();
    }

})

app.post("/deleteMyClinicaTurn", async function(req, res){
    let data = req.body;
    try{
        await db_handler.deleteMyClinicaTurn(data);
        console.log("turn deleted");
        res.status(200).end();
    }catch(error){
        res.status(400).end();
    }
})

app.get("/clinicaPatientList", async function(req, res){
    let list = await db_handler.getClinicaPatientList();
    res.send(list);
})

app.post("/deleteClinicaTurnByDni", async function(req, res){
    let dni = req.body;
    await db_handler.deleteClinicaTurnByDni(dni);
    res.status(200).end();
})

//check if sessions are online
app.get("/checkAllSessionOnline", function(req, res){

    res.send({dermato: sessionDermato, endocrino: sessionEndocrino, clinica: sessionClinica});

})

//client tells server to delete sessions

app.get("/deleteEndocrinoSession", function(req, res){

    sessionEndocrino = undefined;
    res.status(200).end();

})

app.get("/deleteDermatoSession", function(req, res){

    sessionDermato = undefined;
    res.status(200).end();

})

app.get("/deleteClinicaSession", function(req, res){

    sessionClinica = undefined;
    res.status(200).end();

})




const mongoose = require("mongoose");

//SCHEMA
var Clinica= mongoose.Schema({
    creation_date: {type: Date, required: true},
    dni: {type: Number, required: true},
    email: {type: String, required: true}
});

var Clinica = module.exports = mongoose.model("consultorio_clinica", Clinica);
        
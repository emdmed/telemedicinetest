const mongoose = require("mongoose");

//SCHEMA
var Dermato= mongoose.Schema({
    creation_date: {type: Date, required: true},
    dni: {type: Number, required: true},
    email: {type: String, required: true}
});

var Dermato = module.exports = mongoose.model("consultorio_dermato", Dermato);
        
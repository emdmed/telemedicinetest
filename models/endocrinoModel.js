const mongoose = require("mongoose");

//SCHEMA
var Endocrino= mongoose.Schema({
    creation_date: {type: Date, required: true},
    dni: {type: Number, required: true},
    email: {type: String, required: true}
});

var Endocrino = module.exports = mongoose.model("consultorio_endcorino", Endocrino);
        
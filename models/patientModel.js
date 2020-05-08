const mongoose = require("mongoose");

//SCHEMA
var User= mongoose.Schema({
    creation_date: Date,
    dni: {type: Number, required: true},
    email: {type: String, required: true}
});

var User = module.exports = mongoose.model("HCJSM_USER", User);
        
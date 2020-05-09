const PatientModel = require("../models/patientModel");
const loginModule = require("./modules/login-module-db");
const consultorioDermato = require("../models/dermatoModel");


const db_handler = {
    createPatient,
    checkPatientPhone,
    updatePatient,
    getPatientList,
    deletePatient,
    findPatient,
    checkConsultorioDermato,
    enterDermatoWaitingLine,
    login: loginModule
}


async function createPatient(patient, callback){
    let created_patient = await PatientModel.create(patient);
    return created_patient;
}

async function enterDermatoWaitingLine(patient){
    let created_patient = await consultorioDermato.create(patient);
    return created_patient;
}

async function checkConsultorioDermato(patient){
    let found = await consultorioDermato.find(patient);
    let list = await consultorioDermato.find();

    if (found.length === 0){
        return false
    } else {

        if(list.length === 0){
            return false;
        } else {
            //get index
            let index = false;
    
            for(let i = 0; i < list.length; i++){
                console.log(found.dni, list[i].dni)
                if(found[0].dni === list[i].dni){
                    index = i
                } else {}
            }

            return {foundPatient: found, index: index}
        }
    }
 
}

async function findPatient(patient){
    let found = await PatientModel.find({email: patient.email, dni: parseInt(patient.dni)});
    if(found.length === 0){
        return false
    } else {
        return found;
    }
  
}

async function checkPatientPhone(phone){
    console.log("phone: ", phone)
    let foundPatient = await PatientModel.find({"info.phone": phone})
    if(foundPatient.length > 0){
        return foundPatient;
    } else {
        return false
    }
}

async function updatePatient(patient){
    console.log("dbhandler - updated patient ", patient)
    try{
        let updated = await PatientModel.findOneAndUpdate({"info.phone": patient.info.phone}, patient, {useFindAndModify: false});
        console.log("Success");
        return updated.info.number
    }catch(err){
        return false
    }
}

async function getPatientList(){
    let patientList = await PatientModel.find();
    return patientList;
}

async function deletePatient(phone){
    let deleted = await PatientModel.findOneAndDelete({"info.phone": phone});
    console.log(deleted);
    
}

module.exports = db_handler;
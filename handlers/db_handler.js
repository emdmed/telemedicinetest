const PatientModel = require("../models/patientModel");
const loginModule = require("./modules/login-module-db");
const consultorioDermato = require("../models/dermatoModel");
const consultorioEndocrino = require("../models/endocrinoModel");
const consultorioClinica = require("../models/clinicaModel");


const db_handler = {
    createPatient,
    checkPatientPhone,
    updatePatient,
    getPatientList,
    deletePatient,
    findPatient,
    checkConsultorioDermato,
    enterDermatoWaitingLine,
    deleteMyDermatoTurn,
    getDermatoPatientList,
    deleteDermatoTurnByDni,
    checkConsultorioEndocrino,
    enterEndocrinoWaitingLine,
    deleteMyEndocrinoTurn,
    getEndocrinoPatientList,
    deleteEndocrinoTurnByDni,
    checkConsultorioClinica,
    enterClinicaWaitingLine,
    deleteMyClinicaTurn,
    getClinicaPatientList,
    deleteClinicaTurnByDni,
    login: loginModule
}


async function createPatient(patient, callback){
    let created_patient = await PatientModel.create(patient);
    return created_patient;
}

//DERMATO
async function enterDermatoWaitingLine(patient){
    let created_patient;

    try{
        created_patient = await consultorioDermato.create(patient);
        console.log("created")
        return {denied: false};
    }catch(error){
        console.log("not created")
        return {denied: true, error}
    }
 
}

async function deleteMyDermatoTurn(patient){
    let deleted;
    try{
        deleted = await consultorioDermato.findOneAndDelete(patient);
        return deleted;
    }catch(error){
        return error
    }
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


async function getDermatoPatientList(){
    let list =  await consultorioDermato.find();
    return list;
}

async function deleteDermatoTurnByDni(dni){
    await consultorioDermato.findOneAndDelete(dni);
    console.log("Doctor requested turno deleted...");
}

//ENDOCRINO
async function enterEndocrinoWaitingLine(patient){
    let created_patient;

    try{
        created_patient = await consultorioEndocrino.create(patient);
        console.log("created")
        return {denied: false};
    }catch(error){
        console.log("not created")
        return {denied: true, error}
    }
 
}

async function deleteMyEndocrinoTurn(patient){
    let deleted;
    try{
        deleted = await consultorioEndocrino.findOneAndDelete(patient);
        return deleted;
    }catch(error){
        return error
    }
}

async function checkConsultorioEndocrino(patient){
    let found = await consultorioEndocrino.find(patient);
    let list = await consultorioEndocrino.find();

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

async function getEndocrinoPatientList(){
    let list =  await consultorioEndocrino.find();
    return list;
}

async function deleteEndocrinoTurnByDni(dni){
    await consultorioEndocrino.findOneAndDelete(dni);
    console.log("Doctor requested turno deleted...");
}

//CLINICA
async function enterClinicaWaitingLine(patient){
    let created_patient;

    try{
        created_patient = await consultorioClinica.create(patient);
        console.log("created")
        return {denied: false};
    }catch(error){
        console.log("not created")
        return {denied: true, error}
    }
 
}

async function deleteMyClinicaTurn(patient){
    let deleted;
    try{
        deleted = await consultorioClinica.findOneAndDelete(patient);
        return deleted;
    }catch(error){
        return error
    }
}

async function checkConsultorioClinica(patient){
    console.log("Looking in db for: ", patient);
    let found = await consultorioClinica.find(patient);
    let list = await consultorioClinica.find();

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
            console.log("found! ",  {foundPatient: found, index: index})
            return {foundPatient: found, index: index}
        }
    }
 
}

async function getClinicaPatientList(){
    let list =  await consultorioClinica.find();
    return list;
}

async function deleteClinicaTurnByDni(dni){
    await consultorioClinica.findOneAndDelete(dni);
    console.log("Doctor requested turno deleted...");
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
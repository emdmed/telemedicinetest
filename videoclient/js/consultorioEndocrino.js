let STORED_PATIENT = JSON.parse(localStorage.getItem("HCJSM_user"));

if (!STORED_PATIENT){
    alert("Error al validar paciente, por favor vuelva a ingresar");
    window.location = ENV_URL;
} else {}

var apiKey;
var sessionId;
var token;

let globalSession;

function createSession(){
    $.ajax({
        url: "/createsessionEndocrino",
        method: "GET",
        success: function(res){
            let data = res;
            console.log("APIKEY ", data.apiKey);
            apiKey = data.apiKey;
            sessionId = data.sessionId;
            token = data.token;
            console.log("Session created! ", sessionId);
            // (optional) add server code here
            initializeSession();
        }
    })
}

$("body").on("click", "#init_endocrino_room", function(){
    createSession();
})

$("body").on("click", "#paciente_endocrino", function(){
    $.ajax({
        url: "/createtokenendocrino",
        method: "GET",
        success: function(res){
            let data = res;
            console.log("TOKEN ", data);
            apiKey = data.apiKey;
            sessionId = data.sessionId;
            token = data.token;

            initializeSession();
        },
        error: function(){
          alert("Error al generar Token");
        }
    })
})

async function initPatientConsultorio(){

  let status = await checkLoggedInPatient();

  if(status === false){
    console.log("Init patient consultorio status is ", status)

  } else {
    console.log("Init patient consultorio status is ", status)
    console.log("Creating token...");
    $.ajax({
      url: "/createtokenendocrino",
      method: "GET",
      success: function(res){
          let data = res;
          console.log("apikey ", data.apiKey, "token ", data.token);
          apiKey = data.apiKey;
          sessionId = data.sessionId;
          token = data.token;
  
          initializeSession();
      },
      error: function(){
          //alert("El consultorio no se encuentra disponible");
          //window.location= "https://telemedclinicas.herokuapp.com";
      }
    })
  }
}

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
}
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
    console.log("initsession ", "apikey", apiKey,  "sessionid", sessionId, "token ", token)
    globalSession = session;
  
    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
        session.subscribe(event.stream, 'subscriber', {
          insertMode: 'append',
          width: '100%',
          height: '100%'
        }, handleError);
    });
    // Create a publisher
    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });

    session.on("streamDestroyed", function(event) {
      $.ajax({
        url: "/deleteMyEndocrinoTurn",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
          console.log("turno borrado");
          alert("Finalizó la consulta");
          localStorage.removeItem("turno");
        }
      })
  });
}

$("body").on("click", "#end_call", function(session){

  globalSession.disconnect()

  //tell server to delete sessionEndocrino on memory

  $.ajax({
    url: "/deleteEndocrinoSession",
    method: "GET",
    success: function(res){
      console.log(res);
    }
  })
})

async function checkLoggedInPatient(){
  let status;
  let user = JSON.parse(localStorage.getItem("HCJSM_user"));
  console.log("checked user", user)

  if (user === undefined){
    console.log("Necesita Ingresar para ser atendido");
    status = false;
  } else {
    //check if user is on waiting line and check index 
    await $.ajax({
      url: "/checkConsultorioEndocrino",
      method: "POST",
      data: user[0],
      success: function(res){
        let data = res;
        if(data === false){
          console.log("Debe sacar turno para ser atendido");
          status = false;
        } else {
          status = true;
        }
      },
      error: function(){
        console.log("error");
        status = false
      }
    })
  }
  return status;
}

$("body").on("click", "#get_endocrino_patient_list", function(){
  $(".patients_here").empty();
  
  $.ajax({
    url:"/endocrinoPatientList",
    method: "GET",
    success: function(res){
      console.log(res)
      let data = res;
   
      data.forEach(element => {
        $(".patients_here").append(`
        
          <div class="form-row my-auto" id="${element.dni}">
            <p class="mr-1 my-auto">${element.email}</p>
            <p class="mx-1 my-auto">${element.dni}</p>
            <button class="btn btn-sm btn-danger mx-1 my-auto delete_patient" id="${element.dni}">x</button>
          </div>

        `)
      });
    }
  })
})

$("body").on("click", ".delete_patient", function(){

  let dni = $(this).attr("id");

  $.ajax({
    url: "/deleteEndocrinoTurnByDni",
    method: "POST",
    data: {dni: dni},
    success: function(){
      console.log("deleted! ");
    }
  })
})
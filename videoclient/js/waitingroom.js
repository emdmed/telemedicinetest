let STORED_PATIENT = JSON.parse(localStorage.getItem("HCJSM_user"));

if (!STORED_PATIENT){
    alert("Error al validar paciente, por favor vuelva a ingresar");
} else {

    //turno already taken?
    let turno = JSON.parse(localStorage.getItem("turno"));

    if(!turno){

    } else {

        console.log("Turno ya solicitado, esperando...")
        $("#go_to_waiting_line").hide();
        $("#wait_in_line_icon").show();

        let checkturn = setInterval(() => {
            //check first if there is a registered patient on db
            $.ajax({
                url: "/checkConsultorioDermato",
                method: "POST",
                data: STORED_PATIENT[0],
                success: function(res){
                    let data = res;

                    if(data.index === 0){
                        $("#turn_dermato").show();
                        clearInterval(checkturn);
                        $("#wait_in_line_icon").hide();
                    }

                    console.log("mi turno es el ", data.index);
                    $("#dermato_turn_number").text(data.index + " pacientes antes que usted");
                },
                error: function(){
                   
                }
            })
    
        }, 5000);
    }

}

$("body").on("click", "#go_to_dermato_waiting_line", function(){

    //remove all other consultorios cards
    $(".endocrino-card").remove();

    $.ajax({
        url: "/dermatoWaitingLine",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
            console.log(res);
            let getinline = res;

            if(getinline.denied === true){
                alert("Error, el paciente ya se encuentra en la lista de espera (Borrar paciente de db)");
            } else {
                $("#go_to_waiting_line").hide();
                localStorage.setItem("turno", true);
    
                $("#wait_in_line_icon").show();
                $("#go_to_waiting_line").hide();
    
                let checkturn = setInterval(() => {
                    //check order in line
                    $.ajax({
                        url: "/checkConsultorioDermato",
                        method: "POST",
                        data: STORED_PATIENT[0],
                        success: function(res){
                            let data = res;
    
                            console.log(data);
    
                            if(data.index === 0){
                                $("#turn_dermato").show();
                                clearInterval(checkturn);
                                $("#wait_in_line_icon").hide();
                            }
    
                       
    
                            console.log("mi turno es el ", data.index);
                            $("#dermato_turn_number").text(data.index + " pacientes antes que usted");
                        },
                        error: function(){
                           alert("Error al ingresar al consultorio")
                        }
                    })
            
                }, 5000);
            }
          
        },
        error: function(error){
            alert("Error al solicitar turno", error);
        }
    })

})

$("body").on("click", "#go_to_endocrino_waiting_line", function(){

    //remove all other consultorios cards
    $(".dermato-card").remove();

    $.ajax({
        url: "/endocrinoWaitingLine",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
            console.log(res);
            let getinline = res;

            if(getinline.denied === true){
                alert("Error, el paciente ya se encuentra en la lista de espera (Borrar paciente de db)");
            } else {
                $("#go_to_endocrino_waiting_line").hide();
                localStorage.setItem("turno", true);
    
                $("#wait_in_line_icon").show();
                $("#go_to_endocrino_waiting_line").hide();
    
                let checkturn = setInterval(() => {
                    //check order in line
                    $.ajax({
                        url: "/checkConsultorioEndocrino",
                        method: "POST",
                        data: STORED_PATIENT[0],
                        success: function(res){
                            let data = res;
    
                            console.log(data);
    
                            if(data.index === 0){
                                $("#turn_endocrino").show();
                                clearInterval(checkturn);
                                $("#wait_in_line_icon").hide();
                            }
    
                            $("#endocrino_turn_number").text(data.index + " pacientes antes que usted");
                        },
                        error: function(){
                           alert("Error al ingresar al consultorio")
                        }
                    })
            
                }, 5000);
            }
          
        },
        error: function(error){
            alert("Error al solicitar turno", error);
        }
    })

})

$("body").on("click", "#delete_localstorage", function(){

  

    $.ajax({
        url: "/deleteMyDermatoTurn",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
            console.log(res);
            localStorage.removeItem("turno");
            window.location.reload();
        }
    })

    $.ajax({
        url: "/deleteMyEndocrinoTurn",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
            console.log(res);
            localStorage.removeItem("turno");
            window.location.reload();
        }
    })
 

})


function checkIfEndocrinoSessionIsOnline(){
    let checker = $.ajax({
      url: "/checkEndocrinoSession",
      method: "GET",
      success: function(res){
        console.log(res);
        return true
      },
      error: function(){
        alert("Error at checking if session is online")
        return false
      }
    })

    return checker;
  }


setInterval(() => {
let check = checkIfEndocrinoSessionIsOnline();

    if(check === true){
        console.log("Endocrino session is online");
    } else if(check === false){
        console.log("Endocrino session is offline, do not try to connect")
    } else {
        console.log("ERROR, dunno");
    }
    
}, 7000);
  


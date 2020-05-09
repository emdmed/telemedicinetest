let STORED_PATIENT = JSON.parse(localStorage.getItem("HCJSM_user"));

if (!STORED_PATIENT){
    alert("Error al validar paciente, por favor vuelva a ingresar");
} else {

    //turno already taken?
    let turno = JSON.parse(localStorage.getItem("turno"));

    if(!turno){

    } else {
        setInterval(() => {
            //check first if there is a registered patient on db
            $.ajax({
                url: "/checkConsultorioDermato",
                method: "POST",
                data: STORED_PATIENT[0],
                success: function(res){
                    console.log(res);
                },
                error: function(){
                   
                }
            })
    
        }, 5000);
    }

}

$("body").on("click", "#go_to_waiting_line", function(){

    $.ajax({
        url: "/dermatoWaitingLine",
        method: "POST",
        data: STORED_PATIENT[0],
        success: function(res){
            console.log(res);
            $("#go_to_waiting_line").hide();
            localStorage.setItem("turno", true);

            setInterval(() => {
                //check order in line
                $.ajax({
                    url: "/checkConsultorioDermato",
                    method: "POST",
                    data: STORED_PATIENT[0],
                    success: function(res){
                        let data = res;

                        if(data.index === 0){
                            $("#turn_dermato").show();
                        }

                        $("go_to_waiting_line").hide();

                        console.log("mi turno es el ", data.index);
                        $("#dermato_turn_number").text(data.index + " pacientes antes que usted");
                    },
                    error: function(){
                       
                    }
                })
        
            }, 5000);
        },
        error: function(){
            alert("Error al solicitar turno");
        }
    })

})

$("body").on("click", "#delete_localstorage", function(){

    localStorage.clear();

})



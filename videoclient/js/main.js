let consulta = {
    email: false,
    empresa: false
}

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    alert("Has ingresado un email no valido")
    return (false)
}

function ValidateName(name)
{
    if (/^[a-zA-Z ]+$/.test(name)){
        return(true)
    }
    alert("Error, por favor verifica los datos ingresados")
}

//check which plan got clicked
$("body").on("click", "#plan_remoto_btn", function(){
    consulta.plan = "remoto";
})
$("body").on("click", "#plan_gold_btn", function(){
    consulta.plan = "gold";
})
$("body").on("click", "#plan_premium_btn", function(){
    consulta.plan = "premium";
})
$("body").on("click", "#plan_personalizado_btn", function(){
    consulta.plan = "personalizado";
})


$("body").on("keyup", function(){

    let email_value = $("#email").val();
    let empresa_value = $("#empresa").val();

    if(email_value.length >0 && empresa_value.length >0){
        $("#enviar").prop("disabled", false);
    } else {
        $("#enviar").prop("disabled", true);
      
    }
})

$("body").on("click", "#enviar", function(){
    console.log("enviar")
    let email_value = $("#email").val();
    let empresa_value = $("#empresa").val();


    $(this).prop("disabled", true);

    consulta.dni = empresa_value;
    consulta.email = email_value;
    console.log("send form ",consulta)

    $.ajax({
        url: "/contact",
        method: "POST",
        data: consulta,
        success: function(res){
            let data = res;
            console.log("cool");
            $(this).prop("disabled", false);
            $("#exampleModalCenter").modal("hide");

            localStorage.setItem("HCJSM_user", JSON.stringify(data.storeUser));

            window.location= data.url;
        },
        error: function(){
            alert("Error");
        }
    })

})

$("body").on("click", "#request_demo", function(){
    consulta.plan = "demo";
    $(".demo_container").append(`
        <div class="card bg-primary text-white">
            <div class="card-header">
                <h4 class="text-center text-white text-bold">La Demo incluye</h4>
            </div>
            <div class="card-body">
                <ul>
                    <li>App Android</li>
                    <li>Chat paciente/médico</li>
                    <li>Geolocalización de consultas</li>
                    <li>Validación de direcciones</li>
                    <li>Panel de control para carga de profesionales</li>
                    <li>Trazabilidad de consultas atendidas</li>
                </ul>
            </div>   
        </div>
        <hr>
    `)

})

//hide demo card when modal closes
$('#exampleModalCenter').on('hidden.bs.modal', function () {
    $(".demo_container").empty();
});




function makeNewPosition(){
    
    // Get viewport dimensions (remove the dimension of the div)
    //var h = $(window).height() - 50;
    var w = $(window).width() - 50;
    
    var nh = Math.floor(Math.random() * 250);
    var nw = Math.floor(Math.random() * w);
    
    return [nh,nw];    
    
}

function animateDiv(myclass){
    var newq = makeNewPosition();
    $(myclass).animate({ top: newq[0], left: newq[1] }, 9000,   function(){
      animateDiv(myclass);        
    });
    
};


//scroll detect
$(window).scroll(function() {
    let scrolledDown = $(window).scrollTop();

    if(scrolledDown > 120){
        $(".scrollDown").hide();
    } else if (scrolledDown < 120){
        $(".scrollDown").show();
    }
});


$("body").on("click", "#see_plans", function(){
    //scroll
   
    $('html,body').animate({
      scrollTop: $("#" + "pricing").offset().top
      }, 'slow');
  

})
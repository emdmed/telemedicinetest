var apiKey;
var sessionId;
var token;

function createSession(){
    $.ajax({
        url: "/createsession",
        method: "GET",
        success: function(res){
            let data = res;
            apiKey = data.apiKey;
            sessionId = data.sessionId;
            token = data.token;
            console.log("Session created! ", sessionId);
            // (optional) add server code here
            initializeSession();
        }
    })
}

$("body").on("click", "#medico", function(){
    createSession();
})

$("body").on("click", "#paciente", function(){
    $.ajax({
        url: "/createtoken",
        method: "GET",
        success: function(res){
            let data = res;
            apiKey = data.apiKey;
            sessionId = data.sessionId;
            token = data.token;

            initializeSession();
        }
    })
})




// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);
  
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
  }
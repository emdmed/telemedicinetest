// replace these values with those generated in your TokBox Account
//var apiKey = "46727622";
//var sessionId = "1_MX40NjcyNzYyMn5-MTU4ODk2Njg5NDY2MH5YaHRHSEF3bmVCZ2lObWJQWUZRVFcrdHZ-fg";
//var token = "T1==cGFydG5lcl9pZD00NjcyNzYyMiZzaWc9MDkzNWJmMWU0ODdlYTZhMzBmZDM3YTI4NzhlYzFkNDI2MjkwZGRiMDpzZXNzaW9uX2lkPTFfTVg0ME5qY3lOell5TW41LU1UVTRPRGsyTmpnNU5EWTJNSDVZYUhSSFNFRjNibVZDWjJsT2JXSlFXVVpSVkZjcmRIWi1mZyZjcmVhdGVfdGltZT0xNTg4OTY2OTIyJm5vbmNlPTAuNjcwODg3MDE1ODE3NDMyNyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTg4OTcwNTE2JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9";

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

$("body").on("click", "#init_dermato_room", function(){
    createSession();
})

$("body").on("click", "#paciente_dermato", function(){
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

function initPatientConsultorio(){
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
}




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
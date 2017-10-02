//var isOpen = false;
//function popupToggle(){
//    var popup = document.getElementById("chat-popup");
//    if(isOpen){
//        popup.style.animationName = "popup_close";
//        isOpen = false;
//    }else{
//        popup.style.animationName = "popup_open";
//        isOpen = true;
//    }
//}

$.getScript("audio.js", function(){
   //alert("Script loaded but not necessarily executed.");
});

$(document).ready(function () {
    var isOpen = false;
    $('.chat-header').click(function () {
        if (isOpen) {
            isOpen = false;
            $('.chat-popup').css({
                "animation-name": "popup_close"
            });
            $('.chat-body').css({
                "animation-name": "hide_chat"
            });
            $('.chat-footer').css({
                "animation-name": "hide_chat"
            });
        }
        else {
            isOpen = true;
            $('.chat-popup').css({
                "animation-name": "popup_open"
            });
            $('.chat-body').css({
                "animation-name": "show_chat"
            });
            $('.chat-footer').css({
                "animation-name": "show_chat"
            });
        }
    });
    $("#chatInput").focus();
});


var params = {},
    watson = 'Watson',
    context;

function userMessage(message) {

    params.text = message;
    if (context) {
        params.context = context;
    }
    var xhr = new XMLHttpRequest();
    var uri = '/api/watson';
    xhr.open('POST', uri, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        // Verify if there is a success code response and some text was sent
        if (xhr.status === 200 && xhr.responseText) {
            var response = JSON.parse(xhr.responseText);
            text = response.output.text; // Only display the first response
            context = response.context; // Store the context for next round of questions
            console.log("Got response from Watson: ", JSON.stringify(response));

          if(text.toString().length==0){
             callCloudantById( function ( value ) {
                 console.log( 'response'+response );
                 text = value;
                 displayMessage(text, watson);
                 var chat = document.getElementById('chat_box');
                 chat.scrollTop = chat.scrollHeight;

               },response.intents[0].intent );

          }else {
               for (var txt in text) {
                    displayMessage(text[txt], watson);
                 }

          }
          var chat = document.getElementById('chat_box');
          chat.scrollTop = chat.scrollHeight;

        }
        else {
            console.error('Server error for Conversation. Return status of: ', xhr.statusText);
            displayMessage("Putz, deu um tilt aqui. Você pode tentar novamente.", watson);
        }
    };
    xhr.onerror = function () {
        console.error('Network error trying to send message!');
        displayMessage("Ops, acho que meu cérebro está offline. Espera um minutinho para continuarmos por favor.", watson);
    };
    console.log(JSON.stringify(params));
    xhr.send(JSON.stringify(params));
}


function callCloudantById( callback ,id){
    $.getJSON( "/api/cloudant/"+id, function( data ) {
      callback(data.resposta);
    });
}

function newEvent(event) {
    // Only check for a return/enter press - Event 13
    if (event.which === 13 || event.keyCode === 13) {
        var userInput = document.getElementById('chatInput');
        text = userInput.value; // Using text as a recurring variable through functions
        text = text.replace(/(\r\n|\n|\r)/gm, ""); // Remove erroneous characters
        // If there is any input then check if this is a claim step
        // Some claim steps are handled in newEvent and others are handled in userMessage
        if (text) {
            // Display the user's text in the chat box and null out input box
            //            userMessage(text);
            $("#chatInput").css("border-color", "#d2d6de");
            displayMessage(text, 'user');
            userInput.value = '';
            userMessage(text);
        }
        else {
            // Blank user message. Do nothing.
            console.error("No message.");
            userInput.value = '';
            $("#chatInput").css("border-color", "red");
            return false;
        }
    }
}

function displayMessage(text, user) {
    var chat = document.getElementById('chat_box');
    if (user == "user") {
         var div = document.createElement('div');
         var div0 = document.createElement('div');

         var divHora = document.createElement('div');
         var textHora= document.createTextNode(new Date().getDate()+"/"+(new Date().getMonth()+1)+"  "+new Date().getHours()+":"+addZero(new Date().getMinutes()));
         divHora.style='text-align:right;color:#a4a4a4;font-size:12px;padding-right:50px';
         divHora.appendChild(textHora);

         var user = document.createTextNode(' ');
         var userBox = document.createElement('span');
         userBox.className = 'direct-chat-name pull-left';
         div0.className = 'direct-chat-msg right';
         div.className = 'direct-chat-text';
         var img = document.createElement('img');
         img.className = 'direct-chat-img';
         img.src = 'http://intranet.vbofficeware.com.br/fileserver/imagem/img_usuario.png';
         div0.appendChild(img);
         div0.appendChild(div);

         userBox.appendChild(user);

         var message = document.createTextNode(text);
         var messageBox = document.createElement('p');
         messageBox.appendChild(userBox);
         div.appendChild(message);
         messageBox.appendChild(div0);
         messageBox.appendChild(divHora);
         chat.appendChild(messageBox);
    }
    else {
        var div = document.createElement('div');
        var divHora = document.createElement('div');
        var textHora= document.createTextNode(new Date().getDate()+"/"+(new Date().getMonth()+1)+"  "+new Date().getHours()+":"+addZero(new Date().getMinutes()));
        divHora.style='text-align:right;color:#a4a4a4;font-size:12px';
        divHora.appendChild(textHora);

        var user = document.createTextNode(' ');
        var userBox = document.createElement('span');
        user = document.createElement('img');
        user.className = 'direct-chat-img';
        user.src = 'http://intranet.vbofficeware.com.br/fileserver/imagem/logo-ViaCognitiva_transp.png';
        div.className = 'direct-chat-text';

        userBox.appendChild(user);

        var message = document.createTextNode(text);
        var messageBox = document.createElement('p');
        messageBox.appendChild(userBox);
        div.appendChild(message);
        messageBox.appendChild(div);
        messageBox.appendChild(divHora)

        chat.appendChild(messageBox);

        var textoHTML = $( ".direct-chat-text" ).last().html();
        $( ".direct-chat-text" ).last().empty();
        var textoFormat = textoHTML.replace(/&lt;/g,'<').replace(/&gt;/g, '>');
        $( ".direct-chat-text" ).last().append( textoFormat );

         var textoFormatado=text;
         textoFormatado = textoFormatado.replace(/<[^>]*>/g, "");
                // console.log('Texto Formatado '+textoFormatado);

        loadSound(textoFormatado) ;

    }
}
function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
userMessage('');



function enviarImagem() {

  var chat = document.getElementById('chat_box');

  var messageBox = document.createElement('p');
  var div0 = document.createElement('div');
  var img = document.createElement('img');
  img.src = '';

  var canvas = document.createElement('canvas');
  canvas.style='display:none;';

  var video = document.createElement('video');
  video.style='height: 200px';
  video.autoPlay = true;

  div0.appendChild(video);
  div0.appendChild(img);
  div0.appendChild(canvas);
  messageBox.appendChild(div0);
  chat.appendChild(messageBox);

  capturar();
}


function capturar(){

      var video = document.querySelector('video');
      var canvas = document.querySelector('canvas');
      var ctx = canvas.getContext('2d');
      var localMediaStream = null;

      var onFailSoHard = function(e) {
                 alert('getUserMedia() not supported in your browser.');
                console.log('Reeeejected!', e);
       };

       if (localMediaStream) {
          ctx.drawImage(video, 0, 0);
          // "image/webp" works in Chrome 18. In other browsers, this will fall back to image/png.
          document.querySelector('img').src = canvas.toDataURL('image/webp');
        }


        // Not showing vendor prefixes or code that works cross-browser.
        if (navigator.getUserMedia) {
            navigator.getUserMedia({video: true}, function(stream) {
              video.src = window.URL.createObjectURL(stream);
              localMediaStream = stream;
            }, onFailSoHard);
        }else if (navigator.webkitGetUserMedia) {
           navigator.webkitGetUserMedia({video: true}, function(stream) {
                          video.src = window.webkitURL.createObjectURL(stream);
                          video.controls = true;
                          localMediaStream = stream;
            }, onFailSoHard);

        }else {
            onFailSoHard({target: video});
         }


         //video.pause();
         //localMediaStream.stop(); // Doesn't do anything in Chrome.


}


function sendMessage() {
    if($("#chatInput").val()==''){
        $("#chatInput").css("border-color", "red");
       return;
    }
    $("#chatInput").css("border-color", "#d2d6de");
    var message = document.getElementById('chatInput');
    var texto = message.value;
    texto = texto.replace(/(\r\n|\n|\r)/gm, "");
    displayMessage(texto, 'user');
    message.value = '';
    userMessage(texto);
}


var socket = io();
var color = getRandomColor();

var blurred =  false;
var title = "SocketChat";
var alerts = 0;

$(window).blur(function() {
    blurred = true;
});

$(window).focus(function() {
    blurred = false;
    alerts = 0;
    document.title = title;
});

$("#m").css("color", color);

$('form').submit(function(){
  var text = $('#m').val();
  if (text.charAt(0) != "/") {
    var message = {};
    message.content = text;
    message.color = color;
    socket.emit('chat message', message);
    $('#m').val('');
    return false;
  }
  else {
    var command = text.substring(1);
    if (command == "color") {
      color = getRandomColor();
      $("#m").css("color", color);
    }
    $('#m').val('');
    return false;
  }
});
socket.on('chat message', function(msg){
  $(msg).prependTo("#messages").css('visibility','visible').effect("shake", {times: 1}, 250);
  if (blurred == true) {
    alerts++;
    document.title = title + " | " + alerts + " New!";
  }
  twemoji.parse(document.body);
});
socket.on('user count', function(count){
  $('#usercount').text("Users Online: " + count);
  if (blurred == true) {
    alerts++;
    document.title = title + " " + alerts + " New!";
  }
});

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


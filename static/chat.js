var socket = io();
var color = getRandomColor();

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
    alert(command);
    if (command == "color") {
      color = getRandomColor();
    }
    $('#m').val('');
    return false;
  }
});
socket.on('chat message', function(msg){
  $('#messages').prepend(msg);
});
socket.on('user count', function(count){
  $('#usercount').text("Users Online: " + count);
});

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
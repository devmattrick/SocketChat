var socket = io();
var color = getRandomColor();

$("#m").css("color", color);

$('form').submit(function(){
  var message = {};
  message.content =  $('#m').val();
  message.color = color;
  socket.emit('chat message', message);
  $('#m').val('');
  return false;
});
socket.on('chat message', function(msg){
  $('#messages').prepend(msg);
});

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
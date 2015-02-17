var socket = io();
var color = getRandomColor();

var blurred =  false;
var title = "SocketChat";
var alerts = 0;
var wasaskedinvite = false;

var linkRegex= /^(https?:\/\/.*)/i
var imageRegex = /^(https?:\/\/.*\.(?:png|jpe?g|gif).*)/i;
var youtubeRegex = /^http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(.*)(&(amp;)?[\w\?=]*)?/;

$(window).blur(function() {
  blurred = true;
});

$(window).focus(function() {
  blurred = false;
  alerts = 0;
  document.title = title;
});

$("#m").css("color", color);

$(".autoselect").click(function() {
  this.select();
});

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
  var content = msg.content;
    var color = msg.color;
    var mediacontent = content;
  if ($(".auto-embed").is(':checked')) {
    mediacontent = content.replace(imageRegex, "<a href='$1' target='_blank'><img style='border-bottom: " + color + " solid 3px;' class='embed-image' src='$1' /></a>").replace(youtubeRegex, "<iframe width='560' height='315' src='https://www.youtube.com/embed/$1' frameborder='0' allowfullscreen style='border-bottom: " + color + " solid 3px;'>YouTube Video</iframe>");
  }
  if (mediacontent != content) {
    content = mediacontent;
  }
  else {
    var linkcontent = content.replace(linkRegex, "<a href='$1' target='_blank'>$1</a>");
    if (linkcontent != content) {
      content = linkcontent;
    }
    else {
      content = content.replace(/\*([^\*]+)\*/g, "<b>$1</b>").replace(/\_([^\*]+)\_/g, "<i>$1</i>").replace(/\~([^\*]+)\~/g, "<strike>$1</strike>");
    }
  }
  $('<li style="color: ' + color + '; visibility: hidden;">' + content + '</li>').prependTo("#messages").css('visibility','visible').effect("shake", {times: 1}, 250);
  if (blurred) {
    alerts++;
    document.title = title + " | " + alerts + " New!";
  }
  twemoji.parse(document.body);
});
socket.on('user count', function(count){
  $('#usercount').text("Users Online: " + count);
  if (count == 1) {
    if (!wasaskedinvite) {
      $("#invite-friends").show();
    }
    wasaskedinvite = true;
  }
  else {
    $('#invite-friends').fadeOut();
  }
  if (blurred) {
    alerts++;
    document.title = title + " | " + alerts + " New!";
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


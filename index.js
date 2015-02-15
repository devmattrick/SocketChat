var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + JSON.stringify(msg));
    var content = entities.encode(msg.content).replace(/\*([^\*]+)\*/g, "<b>$1</b>").replace(/\_([^\*]+)\_/g, "<i>$1</i>").replace(/\~([^\*]+)\~/g, "<strike>$1</strike>");
    var color = msg.color;
    io.emit('chat message', '<li style="color: ' + color + '">' + content + '</li>');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var autolinks = require('autolinks');

var online = 0;

app.use(express.static(__dirname + '/static'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
	online++;
	io.emit('user count', online);
	socket.on('chat message', function(msg){
    	console.log('message: ' + JSON.stringify(msg));
    	if (msg.content != "") {
            msg.content = entities.encode(msg.content);
            msg.color = entities.encode(msg.color);
    		io.emit('chat message', msg);
    	}
  	});
  	socket.on('me message', function(msg){
    	console.log('me: ' + JSON.stringify(msg));
    	var content = entities.encode(msg.content);
    	var color = msg.color;
    	content = autolinks(content).replace(/\*([^\*]+)\*/g, "<b>$1</b>").replace(/\_([^\*]+)\_/g, "<i>$1</i>").replace(/\~([^\*]+)\~/g, "<strike>$1</strike>");
    	io.emit('chat message', '<li style="color: ' + color + '; visibility: hidden;"> *' + content + '* </li>');
  	});
  	socket.on('disconnect', function() {
		online--;
		io.emit('user count', online);
	});
});

http.listen(3000, function(){
  console.log('Listening on *:3000');
});
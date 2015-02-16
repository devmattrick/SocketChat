var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();
var autolinks = require('autolinks');

var imageRegex = /(https?:\/\/.*\.(?:png|jpe?g|gif))/i;
var youtubeRegex = /^http(?:s)?:\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)(.*)(&(amp;)?[\w\?=]*)?/;

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
    	var content = entities.encode(msg.content);
    	var color = msg.color;
    	//Temporarily removing formatting and autolinking for skae of simplicity
    	//.replace(/\*([^\*]+)\*/g, "<b>$1</b>").replace(/\_([^\*]+)\_/g, "<i>$1</i>").replace(/\~([^\*]+)\~/g, "<strike>$1</strike>")
    	mediacontent = content.replace(imageRegex, "<a href='$1' target='_blank'><img style='border-bottom: " + color + " solid 3px;' class='embed-image' src='$1' /></a>").replace(youtubeRegex, "<iframe width='560' height='315' src='https://www.youtube.com/embed/$1' frameborder='0' allowfullscreen style='border-bottom: " + color + " solid 3px;'>YouTube Video</iframe>");
    	if (mediacontent != content) {
    		content = mediacontent;
    	}
    	else {
    		var linkcontent = autolinks(content);
    		if (linkcontent != content) {
    			content = linkcontent;
    		}
    		else {
    			content = content.replace(/\*([^\*]+)\*/g, "<b>$1</b>").replace(/\_([^\*]+)\_/g, "<i>$1</i>").replace(/\~([^\*]+)\~/g, "<strike>$1</strike>");
    		}
    	}
    	if (content != "") {
    		io.emit('chat message', '<li style="color: ' + color + '; visibility: hidden;">' + content + '</li>');
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
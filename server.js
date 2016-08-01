var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var nickname = "";
var nickname_list = [];

io.on('connection', function(client) {
    console.log('A client connected');

    client.on('join', function(name){
      console.log(name + " has connected");

      nickname_list.push(name);

    	client.nickname = name;
    	client.broadcast.emit('chat', name + " joined the chat");
      client.emit('chat', name + " joined the chat");
      client.broadcast.emit('list', nickname_list);
      client.emit('list', nickname_list);
    });

    client.on('messages', function(message){
       nickname = client.nickname;

       console.log(nickname + ": " + message);

       var data = {name: nickname, content: message};

       // client.broadcast.emit('messages', nickname + ": " +  message);
       // client.emit('messages', nickname + ": " +  message);

       client.broadcast.emit('messages', data);
       client.emit('messages', data);
    });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/static'));

server.listen(8080);
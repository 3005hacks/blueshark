var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

app.get('/:eventID', function(req, res) {
	res.sendFile(__dirname + '/views/forms.html');
	io.emit('fbEventURL', req.params.eventID);
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});

// socket.io
io.on('connection', function(socket) {
	console.log('socket.io connected');
});

// mongoDB
var url = 'mongodb://localhost:3000/test';

MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});
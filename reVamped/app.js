var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongo = require('./server/db');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/views/index.html');
});

// should probably change '/landing' => '/', but use this for test
app.get('/landing', function(req, res) {
  res.sendFile(__dirname + '/views/landing.html');
});

// should also change this route
app.get('/dash', function(req, res) {
  res.sendFile(__dirname + '/views/dashboard.html');
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

    socket.on('createEvent', function(mongoData) {

        MongoClient.connect(url, function(err, db) {

            assert.equal(null, err);

            mongo.insertDocument(db, 'events', mongoData, function() {
                db.close();
            });
        });
    });

	console.log('socket.io connected');
});

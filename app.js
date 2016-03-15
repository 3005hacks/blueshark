/*

name: app.js
description: server code to run Node application

*/

// global vars and objects
var global = require('./server/global');

// framework for node
var express = require('express');
var app = express();
var path = require('path');

// used to run http server
var http = require('http').Server(app);

// socket.io, used for client-server communications
var io = require('socket.io')(http);

// MongoDB stuff
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongo = require('./server/db');

// Handlebars view engine for Express
var exphbs  = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// lets you access css, js, and img files
app.use(express.static(path.join(__dirname, 'public')));

// instantiates http server
http.listen(3000, function() {
  console.log('listening on *:3000');
});

/************** ROUTING **************/

// routing for landing page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/landing.html');
});

// holder variable for template data for dashboard.handlebars
var dashboardTemplateData = {};

// routing for dashboard page
app.get('/dash', function(req, res) {

  // dummy data
  data = {eventTitle: 'Yeezy Just Jumped Over Jumpman', eventDate: '5/30/3005', eventHost: 'Yeezy Reincarnated'};
  
  // renders dashboard template and fills it with data
  res.render('dashboard', data);
});

// routing for event page
app.get('/event/:eventID', function(req, res) {
  // console.log(eventData);
  // renders event template and fills it with data
  res.render('event', eventData);
});

/************** socket.io **************/

// starts socket connection
io.on('connection', function(socket) {

  console.log('socket.io connected');

  socket.emit('global', {userData, eventData});
  
  // listener for makeEvent
  socket.on('makeEvent', function(mongoData) {
    MongoClient.connect(url, function(err, db) {
      assert.equal(null, err);
      mongo.insertDocument(db, 'events', mongoData, function() {
        db.close();
      });
    });
  });

  // listener for findEvent
  socket.on('findEvent', function(objectKey, callback) {

    MongoClient.connect(url, function(err, db) {

      assert.equal(null, err);

      mongo.findEventByID(db, 'events', objectKey, function(err, data) {

        if (err != null) {
          console.log(err);
          callback(err);
        }
        else {
          callback(null, data);
        }
        db.close();
      });
    });
  });

  // listener for sendEventData
  socket.on('sendEventData', function(data) {
    eventData = data;
  });
});

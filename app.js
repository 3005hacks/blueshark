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
var layouts = require('handlebars-layouts')

app.engine('.hbs', exphbs({
  defaultLayout: 'page',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// lets you access css, js, and img files
app.use(express.static(path.join(__dirname + '/dist')));

// instantiates http server
http.listen(3000, function() {
  console.log('listening on *:3000');
});

/************** ROUTING **************/

// routing for landing page
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/landing.html');
});

// routing for dashboard page
app.get('/dash', function(req, res) {

  // renders dashboard template and fills it with data
  console.log(dashboardEvents);
  res.render('dashboard', dashboardEvents);
});

// routing for event page
app.get('/event/:eventID', function(req, res) {
  // renders event template and fills it with data
  res.render('event', eventData);
});

/************** socket.io **************/

var dashboardEvents = {};

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
  socket.on('populateDashboard', function(dashData) {
    MongoClient.connect(url, function(err, db) {

      assert.equal(null, err);


      for (var event in dashData.attending) {

        mongo.findEventByID(db, 'events', dashData.attending[event].id, function(result) {

          // if (err != null) {
          //   console.log(err);
          //   callback(err);
          // }
          // else {
          //   callback(null, data);
          // }
          // callback();
        
          // event ID
          var eventID = result.eventID;

          // event name
          var eventName = result.name;

          // event start date
          var eventDate = result.startTime;

          var eventType;
          if (result.hostID == userData.userID)
            eventType = 'Host';
          else
            eventType = 'Attending';

          dashData.found.events.push({
            'eventID': eventID,
            'eventName': eventName,
            'eventDate': eventDate,
            'eventType': eventType
          });
          console.log(dashData.found);
          dashboardEvents = dashData.found;
        });
      }
    });
  });



  // listener for sendEventData
  socket.on('sendEventData', function(data) {
    eventData = data;
  });

});

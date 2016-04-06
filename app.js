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

var userData;
var eventData;
var dashboardEvents;

app.engine('.hbs', exphbs({
  defaultLayout: 'page',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// lets you access css, js, and img files
app.use(express.static(path.join(__dirname + '/dist')));

// instantiates http server
http.listen(3005, function() {
  console.log('listening on *:3005');
});

/************** ROUTING **************/

// routing for landing page
app.get('/', function(req, res) {
  res.render('landing');
});

// routing for dashboard page
app.get('/dash', function(req, res) {
  // renders dashboard template and fills it with data
  res.render('dashboard', dashboardEvents);
});

// routing for event page
app.get('/event/:eventID', function(req, res) {
  // renders event template and fills it with data
  res.render('event', eventData);
});

/************** socket.io **************/

// starts socket connection
io.on('connection', function(socket) {

  console.log('socket.io connected');
  
  socket.on('global', function(data) {
    userData = data.userData;
    eventData = data.eventData;
    dashboardEvents = data.dashData;
    console.log('global recieved');
  });

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
    console.log(1);
    MongoClient.connect(url, function(err, db) {

      assert.equal(null, err);

      for (var event in userData.eventsAttending) {
        mongo.findDocument(db, 'events', 'eventID', userData.eventsAttending[event].id, function(result) {
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
        });
      }
      dashboardEvents = dashData.found;
    });
  });



  // listener for sendEventData
  socket.on('sendEventData', function(data) {
    eventData = data;
  });

});

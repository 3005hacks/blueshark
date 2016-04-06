$("#dashboard").load();

// // object populated on user login
var userData = {
  name: null,
  userID: null,
  userAccessToken: null,
  loginStatus: false,
  proPicURL: null,
  eventsAttending: null,
};

// // object populated when event is created or selected
var eventData = {
  eventID: null,
  name: null,
  coverPhoto: null,
  startTime: null,
  attendees: null,
  description: null,
  wishlist: null,
  suggestedAmount: null,
  squareCashInfo: null,
  hostID: null,
};

// SOCKET.IO

// instantiates socket
var socket = io();

socket.emit('global', {userData, eventData});

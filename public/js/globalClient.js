// // object populated on user login
userData = {
  name: null,
  userID: null,
  userAccessToken: null,
  loginStatus: false,
  proPicURL: null,
  eventsAttending: null,
};

// // object populated when event is created or selected
eventData = {
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

var dashData = {
  'events' : []
};

// SOCKET.IO

// instantiates socket
var socket = io();

console.log('global emitting');
socket.emit('global', {userData, eventData});

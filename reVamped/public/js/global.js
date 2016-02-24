/*

name: global.js
description: contains objects and variables used throughout client-side code

*/

// object populated on user login
userData = {
  name: null,
  userID: null,
  userAccessToken: null,
  loginStatus: false,
  proPicURL: null,
  eventsAttending: null,
};

// object populated when event is created or selected
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
/*

name: dashboard.js
description: client-side code for populating dashboard and other front-end functions

*/

// instantiates socket
var socket = io();

// SOPHIE
function openCreateEvent() {
  Modal.show('.create-event');
}

// SOPHIE
function closeDialog() {
  Modal.hide()
}

// SOPHIE
function openSettings(){
  Modal.show('.settings');
}

// // on Make Event submit
// $('#make-event-submit').click( function(){
//   // records data from Add an Event box
//   var link = $('.make-event-form>input[name="link"]').val();
//   var price = $('.make-event-form>input[name="price"]').val();
//   var wishlist = $('.make-event-form>input[name="wishlist"]').val();
//   var squareCash = $('.make-event-form>input[name="cashtag"]').val();

//   // populates global eventData object and saves to db
//   makeEvent(link, price, wishlist, squareCash);

//   socket.emit("makeEvent", eventData);

//   // sends data to app.js to fill event template
//   socket.emit('sendEventData', eventData);

//   // opens eventUI page
//   window.open('/event/'+eventData.eventID,'_self');
// });

// on Make Event submit
$('#make-event-submit').click( function() {
  // records data from Add an Event box
  var link = $('.make-event-form>input[name="link"]').val();
  var price = $('.make-event-form>input[name="price"]').val();
  var wishlist = $('.make-event-form>input[name="wishlist"]').val();
  var squareCash = $('.make-event-form>input[name="cashtag"]').val();

  // event ID
  eventData.eventID = link.split("/")[4];

  // suggested amount
  eventData.suggestedAmount = price;

  // wishlist
  eventData.wishlist = wishlist;

  // SquareCash username?
  eventData.squareCashInfo = squareCash;

  // FB API call for event information
  FB.api('/', 'POST', {
      batch: [
        { method: 'GET', relative_url: '/' + eventData.eventID},
        { method: 'GET', relative_url: '/' + eventData.eventID + '/attending'},
        { method: 'GET', relative_url: '/' + eventData.eventID + '?fields=cover'},
        { method: 'GET', relative_url: '/' + eventData.eventID + '/owner'},
      ]
    },
    function (response) {
      if (response && !response.error) {
        // general event data
        eventParsedResponse = JSON.parse(response[0].body);

        // event name
        eventData.name = eventParsedResponse.name;

        // event description
        eventData.description = eventParsedResponse.description;

        // event start time
        eventData.startTime = eventParsedResponse.start_time;

        // list of attendees
        eventData.attendees = JSON.parse(response[1].body);

        // URL of event cover photo, hosted on FB server
        eventData.coverPhoto = JSON.parse(response[2].body).cover.source;

        // ID of event owner
        eventData.hostID = JSON.parse(response[3].body);
        
        // sends data to app.js to fill event template
        socket.emit('sendEventData', eventData);

        // opens eventUI page
        window.open('/event/'+eventData.eventID,'_self');
      }
    });

});

// goes through list of events being attended by user and populates dashboard
// function populateDashboard() {
//   for (var event in userData.eventsAttending) {

//     // event ID
//     var eventID = userData.eventsAttending[event].id;

//     // event name
//     var eventName = userData.eventsAttending[event].name;

//     // event start date
//     var eventDate = userData.eventsAttending[event].start_time;

//     // checks database for event
//     socket.emit("findEvent", eventID, function(err, data){
//       if (err != null) {
//         console.log(err);
//         console.log('dafuqqqq');
//         callback(err);
//       }
//       else {
//         console.log('data');
//       }
//     });

//     // console.log(123);
//     // socket.on('findEventSuccess', function(eventIsBlueshark) {
//     //   console.log(12322);
//     //   if (eventIsBlueshark) {
//     //     var eventHost = 'Host';
//     //   }
//     //   else {
//     //     var eventHost = 'Attending';
//     //   }
//     // });
//     // console.log(eventHost);
//   }
// };
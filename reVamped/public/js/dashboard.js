// instantiates socket
var socket = io();

function emitEvent() {

    socket.emit("createEvent", eventData);
}

function getEvent(eventID, callback) {

  socket.emit("findEvent", eventID, function(err, data){
    if (err != null) {
      console.log(err);
      console.log('dafuqqqq');
      callback(err);
    }
    else {
      callback(null, data);
    }
  });
}

function openCreateEvent() {
  Modal.show('.create-event');
}

function closeDialog() {
  Modal.hide()
}

function openSettings(){
  Modal.show('.settings');
}

// on Make Event submit
$('#make-event-submit').click( function(){

    var link = $('.make-event-form>input[name="link"]').val();
    var price = $('.make-event-form>input[name="price"]').val();
    var wishlist = $('.make-event-form>input[name="wishlist"]').val();
    var squareCash = $('.make-event-form>input[name="cashtag"]').val();

    makeEvent(link, price, wishlist, squareCash, emitEvent);
    closeDialog();

    // opens eventUI page
    window.open('/'+eventData.eventID,'_self');
});

function populateDashboard() {
  for (var event in userData.eventsAttending) {
    // console.log(userData.eventsAttending[event]);

    var eventName = userData.eventsAttending[event].name;
    var eventDate = userData.eventsAttending[event].start_time;

    var eventID = userData.eventsAttending[event].id;
    getEvent(eventID, function(err, data){
      if (err != null) {
        console.log(err);
        console.log('bruhhh');
      }
      else {
        console.log('data');
      }
    });
    // console.log(123);
    // socket.on('findEventSuccess', function(eventIsBlueshark) {
    //   console.log(12322);
    //   if (eventIsBlueshark) {
    //     var eventHost = 'Host';
    //   }
    //   else {
    //     var eventHost = 'Attending';
    //   }
    // });
    // console.log(eventHost);
  }
};

// socket.on('fbEventURL', function(msg){
//     console.log(msg);
//     $('.form-number').html(msg);
// });
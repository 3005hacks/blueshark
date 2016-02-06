Events = new Mongo.Collection("events");

if (Meteor.isClient) {

  Template.hello.helpers({
  });

  Template.hello.events({
    "submit .new-event": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var fbEventLink = event.target.link.value;
      var recommendedPrice = event.target.price.value;
      var cashName = event.target.cashtag.value;

      // Events.insert({
      //   recommendedPrice: recommendedPrice,
      //   cashName: cashName
      // })

      var urlSplit = fbEventLink.split("/");
      var eventId = urlSplit[4];
      console.log(eventId);
 
      // Clear form
      // event.target.fb-event-link.value = "";
      // event.target.recommended-price.value = "";
      // event.target.cash-name.value = "";
    }
  });

  // Routing
  Router.route('/', function () {
    this.render('hello');
  });

  Router.route('/events/:_id', function () {
    this.layout('event', {
      data: function () {
        return Events.findOne({_id: this.params._id});
      }
    });
  });

  // FB pull
  window.fbAsyncInit = function() {
    console.log("Fb initi");
    FB.init({
      appId : '478980925626054',
      status : true,
      xfbml : true,
      version : 'v2.4'
    });
    isFBinit = true;


    FB.api(
      "/{event-id}/attending",
      function (response) {
        if (response && !response.error) {
          /* handle the result */
          console.log("ok");
        }
      }
  );
  };
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}

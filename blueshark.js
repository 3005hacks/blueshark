Events = new Mongo.Collection("events");
var isFBinit = false;

currentUserData = {
  name: null,
  userID: null,
  userAccessToken: null,
  loginStatus: false,
  proPicURL: null
}

var currentUserDep = new Tracker.Dependency();

if (Meteor.isClient) {
  window.fbAsyncInit = function() {
    console.log("fb initializing...");
    FB.init({
      appId : '478980925626054',
      status : true,
      xfbml : true,
      version : 'v2.4'
    });

    isFBinit = true;
    console.log("fb initialized");

    // triggered on fbLogin and fbLogout
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        currentUserData.userID = response.authResponse.userID;
        currentUserData.userAccessToken = response.authResponse.accessToken;

        FB.api('/' + currentUserData.userID,
            function (response) {
              if (response && !response.error) {

                currentUserData.proPicURL = "https://graph.facebook.com/" + currentUserData.userID + "/picture";
                currentUserData.name = response.name;
                
                currentUserDep.changed();
              }
            }
        );

        currentUserData.loginStatus = true;
        currentUserDep.changed();

      }
    });
  };

  Template.login.events({
    'click .login-button': function (e) {
      e.preventDefault();
      Meteor.call('fbLogin');
    },

    'click .logout-button': function (e) {
      e.preventDefault();
      Meteor.call('fbLogout');
    }
  });

  Template.login.helpers({
    currentUserName: function() {
      currentUserDep.depend();
      return currentUserData.name;
    },

    // returns src for user profile picture to <img>
    currentUserProPic: function() {
      currentUserDep.depend();
      return currentUserData.proPicURL;
    }
  });

  Template.createEvent.events({
    "submit .new-event": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var eventUrl = event.target.link.value;
      var price = event.target.price.value;
      var cashName = event.target.cashtag.value;


      var thisId = Events.insert({
        eventUrl: eventUrl,
        price: price,
        cashName: cashName,
        title: null,
        description: null,
        time: null,
      })

      var urlSplit = eventUrl.split("/");
      var eventId = urlSplit[4];



      Meteor.call('getFbEvent', eventId, thisId);
      Meteor.call('removeAllPosts');
 
      // Clear form
      // event.target.fb-event-link.value = "";
      // event.target.recommended-price.value = "";
      // event.target.cash-name.value = "";
    }
  });

  Template.registerHelper('isUserLoggedIn', function() {
    currentUserDep.depend();
    return currentUserData.loginStatus;
  });

  // Routing
  Router.route('/', function () {
    this.render('createEvent');
  });

  Router.route('/events/:_id', function () {
    this.layout('event', {
      data: function () {
        return Events.findOne({_id: this.params._id});
      }
    });
  });

  //Wish List Item Helper Functions
  Template.wishListItem.helpers({
    'name': function(){
      return 0;
    },



  });

  //Pay button event functions
  Template.pay.events({
    'click': function(){
      payView(true);
    }

  });
  Template.pay.helpers({

  });

  Template.event.helpers({
    'payView': function(x){
      return x;
    }
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({
  // fbLogin: function() {
  //   console.log('test');
  // }

  fbLogin: function() {
    if (isFBinit){
      FB.login();
    }
  },

  fbLogout: function() {
    if (isFBinit){

      FB.logout();
      currentUserData.loginStatus = false;
      currentUserDep.changed();
      console.log('logged out');
    }
  },

  getFbEvent: function(eventId, thisId) {
      FB.api('/', 'POST', {
          batch: [
            { method: 'GET', relative_url: '/' + eventId + '/attending?access_token=' + currentUserData.userAccessToken},
            { method: 'GET', relative_url: '/' + eventId + '?access_token=' + currentUserData.userAccessToken},
          ]
        },
        function (response) {
          if (response && !response.error) {
            var attendees = JSON.parse(response[0].body).data;     
            var title = JSON.parse(response[1].body).name;
            var description = JSON.parse(response[1].body).description;
            var time = JSON.parse(response[1].body).start_time;

            Events.update(
              { _id : thisId }, 
              { $set:
                {
                  title: title,
                  description: description,
                  time: time,
                }
              }
            );
          }
        }
      );
  }

});
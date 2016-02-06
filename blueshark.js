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
    console.log("fb  initialized");

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

  Session.setDefault('makeEvent', false);
  Session.setDefault('findEvent', false);

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

  Template.makeEvent.events({
    'click .new-event': function(e) {
      // Prevent default browser form submit
      e.preventDefault();
 
      // Get value from form element
      var eventUrl = $('input[name="link1"]').val();
      var price = $('input[name="price"]').val();
      var cashName = $('input[name="cashtag"]').val();

      var thisId = Events.insert({
        eventUrl: eventUrl,
        price: price,
        cashName: cashName,
        title: null,
        description: null,
        time: null,
      });

      var urlSplit = eventUrl.split("/");
      var eventId = urlSplit[4];

      Meteor.call('getFbEvent', eventId, thisId);
 
      // Clear form
      $('input[name="link1"]').val('');
      $('input[name="price"]').val('');
      $('input[name="cashtag"]').val('');
    }
  });

  Template.findEvent.events({
    'click .find-event': function(e) {
      // Prevent default browser form submit
      e.preventDefault();

      // Get value from form element
      var eventUrl = $('input[name="link2"]').val();

      var thisId = Events.findOne({
        eventUrl: eventUrl
      });

      console.log(thisId);

    }
  });

  Template.home.events({

    'click .make-event': function() {
      Session.set('showCreate',true);
      Session.set('findEvent', false);
      Session.set('makeEvent', true);
    },

    'click .find-event': function() {
      Session.set('showCreate',false);
      Session.set('findEvent', true);
      Session.set('makeEvent', false);
    }
  });

  Template.home.helpers({
    showCreateDiv: function() {
      return Session.get('showCreate');
    }
  });

  Template.body.helpers({
    makeEventShow: function(){
      return Session.get('makeEvent');
    },

    findEventShow: function(){
      return Session.get('findEvent');
    }
  });

  Template.registerHelper('isUserLoggedIn', function() {
    currentUserDep.depend();
    return currentUserData.loginStatus;
  });

  // Routing
  Router.route('/', function () {
    this.render('home');
  });

  Router.route('/events/:_id', function () {
    this.layout('event', {
      data: function () {
        return Events.findOne({_id: this.params._id});
      }
    });
  });
  
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Meteor.methods({

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
          console.log('hehehe');
        }
      );
  }

});
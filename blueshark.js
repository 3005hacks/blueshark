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

  Template.landingPage.events({
    'click .make-event':function(){
      Session.set('findEvent', false);
      Session.set('makeEvent', true);
    },
    'click .find-event':function(){
      Session.set('findEvent', true);
      Session.set('makeEvent', false);
    }
  });

  Template.body.helpers({
    makeEventShow: function(){
      return Session.get('makeEvent');
    }
  });

  Template.registerHelper('isUserLoggedIn', function() {
    currentUserDep.depend();
    return currentUserData.loginStatus;
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
  }

});
if (Meteor.isClient) {

  Meteor.subscribe("friends");

  window.fbAsyncInit = function() {
    console.log("fb initializing...");
    FB.init({
      appId : '478980925626054',
      status : true,
      xfbml : true
    });
    isFBinit = true;
    console.log("fb initialized");

    // triggered on fbLogin and fbLogout
    FB.Event.subscribe('auth.authResponseChange', function(response) {
      if (response.status === 'connected') {
        currentUserData.userID = response.authResponse.userID;
        currentUserData.userAccessToken = response.authResponse.accessToken;

        FB.api('/', 'POST', {
            batch: [
              { method: 'GET', relative_url: 'me/friends'},
              { method: "GET", relative_url: currentUserData.userID},
            ]
          },
            function (response) {
              if (response && !response.error) {
                var friendsData = JSON.parse(response[0].body).data;                  
                for (var key in friendsData) {
                  var friend = friendsData[key];
                  Friends.insert({
                    name: friend.name,
                    id: friend.id,
                    proPicURL: "https://graph.facebook.com/" + friend.id + "/picture"
                  });
                }

                currentUserData.proPicURL = "https://graph.facebook.com/" + currentUserData.userID + "/picture";
                currentUserData.name = JSON.parse(response[1].body).name;

                currentUserDep.changed();
              }
            }
        );

        currentUserData.loginStatus = true;
        currentUserDep.changed();
      }
    });
  };

  Template.hello.helpers({
  });

  Template.hello.events({
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

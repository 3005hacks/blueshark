if (Meteor.isClient) {

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

//HELPERS AND EVENTS ....
Session.setDefault("payView", true);
Session.setDefault("bringView", false);

  //Wish List Item Helper Functions
  Template.wishListItem.helpers({

  });

  //Pay button event functions
  Template.pay.events({
    'click': function(){
      Session.set("payView", true);
      Session.set("bringView", false);
    }

  });
  //helpers
  Template.pay.helpers({

  });

  //Pay button event functions
  Template.bring.events({
    'click': function(){
      Session.set("bringView", true);
      Session.set("payView", false);
    }

  });
  //helpers
  Template.pay.helpers({

  });

  Template.event.helpers({
    'payView': function(){
      return Session.get("payView");
    },
    'bringView': function(){
      return Session.get("bringView");
    }
    
  });}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}
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

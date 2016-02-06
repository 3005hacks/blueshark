if (Meteor.isClient) {

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

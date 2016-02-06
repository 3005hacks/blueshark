if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}


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
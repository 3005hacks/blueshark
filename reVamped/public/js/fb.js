/*

name: fb.js
description: client-side code for Facebook events and users access

*/

// instantiates facebook API
window.fbAsyncInit = function() {
	FB.init({
	  appId      : '478980925626054',
	  xfbml      : true,
	  version    : 'v2.5'
	});

	// triggered on fbLogin and fbLogout
	FB.Event.subscribe('auth.authResponseChange', function(response) {
		if (response.status === 'connected') {
	  	console.log('connected');
	  	$('.landing').show();

	  	userData.loginStatus = true;
	  	userData.userID = response.authResponse.userID;
      userData.userAccessToken = response.authResponse.accessToken;

      FB.api('/', 'POST', {
	    		// using batch POST request so if we want to pull more data later we can
	        batch: [
	          { method: "GET", relative_url: userData.userID},
	          { method: "GET", relative_url: userData.userID + '/events'},
	        ]
	      },
        function (response) {
          if (response && !response.error) {
            userData.name = JSON.parse(response[0].body).name;
            userData.proPicURL = "https://graph.facebook.com/" + userData.userID + "/picture";
            userData.eventsAttending = JSON.parse(response[1].body).data;
          }

          // transfers data to app.js for dashboard to access
          populateDashboard();
        });
			}
	});

};

// populates global eventData object
function makeEvent(link, price, wishlist, squarecashName, callback) {

  // event ID
	eventData.eventID = link.split("/")[4];

  // suggested amount
	eventData.suggestedAmount = price;

  // wishlist
	eventData.wishlist = wishlist;

  // SquareCash username?
  eventData.squareCashInfo = squarecashName;

  // FB API call for event information
  FB.api('/', 'POST', {
	    batch: [
				{ method: 'GET', relative_url: '/' + eventData.eventID},
				{ method: 'GET', relative_url: '/' + eventData.eventID + '/attending'},
				{ method: 'GET', relative_url: '/' + eventData.eventID + '?fields=cover'},
				{ method: 'GET', relative_url: '/' + eventData.eventID + '/owner'},
			]
  	},
    function (response) {
      if (response && !response.error) {
      	console.log(response);

        // general event data
      	eventParsedResponse = JSON.parse(response[0].body);

        // event name
        eventData.name = eventParsedResponse.name;

        // event description
      	eventData.description = eventParsedResponse.description;

        // event start time
      	eventData.startTime = eventParsedResponse.start_time;

        // list of attendees
      	eventData.attendees = JSON.parse(response[1].body);

        // URL of event cover photo, hosted on FB server
      	eventData.coverPhoto = JSON.parse(response[2].body).cover.source;

        // ID of event owner
      	eventData.hostID = JSON.parse(response[3].body);
      }

      // callback calls eventEmitter
      callback();
    });
};

// weird FB stuff - do we need this????
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}
(document, 'script', 'facebook-jssdk'));
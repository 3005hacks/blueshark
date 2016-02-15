window.fbAsyncInit = function() {
	FB.init({
	  appId      : '478980925626054',
	  xfbml      : true,
	  version    : 'v2.5'
	});


	// // triggered on fbLogin and fbLogout
	// FB.Event.subscribe('auth.authResponseChange', function(response) {
	// 	if (response.status === 'unknown') {
	// 		fbLogin();
	// 	}
	// 	else if  (response.status === 'not_authorized') {
	// 		console.log(1);
	// 	}
	// 	else {
	// 		console.log(2);	
	// 	}
	// });

};

function fbLogin() {
	FB.login(function(response) {
	  if (response.status === 'connected') {
	  	console.log('connected');
	  	$('.landing').show();

	  	currentUserData.loginStatus = true;
	  	currentUserData.userID = response.authResponse.userID;
      currentUserData.userAccessToken = response.authResponse.accessToken;

      FB.api('/', 'POST', {
    		// using batch POST request so if we want to pull more data later we can
        batch: [
          { method: "GET", relative_url: currentUserData.userID},
        ]
      },
        function (response) {
          if (response && !response.error) {
          	console.log(response);
            currentUserData.name = JSON.parse(response[0].body).name;
            currentUserData.proPicURL = "https://graph.facebook.com/" + currentUserData.userID + "/picture";
          }
        });
		};
	}, {scope:'user_events'});
}

function makeEvent(link, price, wishlist) {

	// link in the form of 'www.facebook.com/events/123456789'
	currentEvent.eventID = link.split("/")[4];

	currentEvent.suggestedAmount = price;
	currentEvent.wishlist = wishlist;

  FB.api('/', 'POST', {
			// using batch POST request so if we want to pull more data later we can
	    batch: [
				{ method: 'GET', relative_url: '/' + currentEvent.eventID},
				{ method: 'GET', relative_url: '/' + currentEvent.eventID + '/attending'},
				{ method: 'GET', relative_url: '/' + currentEvent.eventID + '?fields=cover'},
			]
  	},
    function (response) {
      if (response && !response.error) {
      	console.log(response);

      	eventParsedResponse = JSON.parse(response[0].body);
        currentEvent.name = eventParsedResponse.name;
      	currentEvent.description = eventParsedResponse.description;
      	currentEvent.startTime = eventParsedResponse.start_time;

      	currentEvent.attendees = JSON.parse(response[1].body);

      	currentEvent.coverPhoto = JSON.parse(response[2].body).cover.source;
      }
    }
  );

};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}
(document, 'script', 'facebook-jssdk'));
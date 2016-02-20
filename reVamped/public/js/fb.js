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

	  	userData.loginStatus = true;
	  	userData.userID = response.authResponse.userID;
      userData.userAccessToken = response.authResponse.accessToken;

      FB.api('/', 'POST', {
    		// using batch POST request so if we want to pull more data later we can
        batch: [
          { method: "GET", relative_url: userData.userID},
        ]
      },
        function (response) {
          if (response && !response.error) {
          	console.log(response);
            userData.name = JSON.parse(response[0].body).name;
            userData.proPicURL = "https://graph.facebook.com/" + userData.userID + "/picture";
          }
        });
		};
	}, {scope:'user_events'});
}

function makeEvent(link, price, wishlist) {

	// link in the form of 'www.facebook.com/events/123456789'
	eventData.eventID = link.split("/")[4];

	eventData.suggestedAmount = price;
	eventData.wishlist = wishlist;

  FB.api('/', 'POST', {
			// using batch POST request so if we want to pull more data later we can
	    batch: [
				{ method: 'GET', relative_url: '/' + eventData.eventID},
				{ method: 'GET', relative_url: '/' + eventData.eventID + '/attending'},
				{ method: 'GET', relative_url: '/' + eventData.eventID + '?fields=cover'},
			]
  	},
    function (response) {
      if (response && !response.error) {
      	console.log(response);

      	eventParsedResponse = JSON.parse(response[0].body);
        eventData.name = eventParsedResponse.name;
      	eventData.description = eventParsedResponse.description;
      	eventData.startTime = eventParsedResponse.start_time;

      	eventData.attendees = JSON.parse(response[1].body);

      	eventData.coverPhoto = JSON.parse(response[2].body).cover.source;
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
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

// FB SDK
(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}
(document, 'script', 'facebook-jssdk'));
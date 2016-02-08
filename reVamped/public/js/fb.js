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
	  }
	});
};

(function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	if (d.getElementById(id)) {return;}
	js = d.createElement(s); js.id = id;
	js.src = "//connect.facebook.net/en_US/sdk.js";
	fjs.parentNode.insertBefore(js, fjs);
}
(document, 'script', 'facebook-jssdk'));
// instantiates socket
var socket = io();

socket.on('global', function(data) {
	userData = data.userData;
	eventData = data.eventData;
})
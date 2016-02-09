// instantiates socket
var socket = io();

// on Make Event button click
$('.make-event').click( function(){
    $('.make-event-form').slideToggle();
    $('.paragraph').toggle();
    $('.make-event').toggleClass('active');
});

// on Find Event button click
$('.find-event').click( function(){
    $('.find-event-form').slideToggle();
    $('.find-event').toggleClass('active');
});

// on Make Event submit
$('#make-event-submit').click( function(){

    // console.log each input in Make Event form
    $('.make-event-form>input[type="text"]').each( function(index){
        console.log($(this).val());
    });
});

// on Make Event submit
$('#find-event-submit').click( function(){

    // console.log each input in Find Event form
    $('.find-event-form>input[type="text"]').each( function(index){
        console.log($(this).val());
    });
});

$('input[name="link"]').click( function(){

});

socket.on('fbEventURL', function(msg){
    console.log(msg);
    $('.form-number').html(msg);
});
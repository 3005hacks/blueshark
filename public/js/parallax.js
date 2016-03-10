$(function() {

  $(window).scroll(function() {
    /************************
     * Parallax image effect *
     ************************/
    var FACTOR = 0.5;
    var $headerImage = $('.header-image');

    /* Calculate percentComplete, which goes from 0 to 1 */
    var distanceScrolled = Math.max(0, $(window).scrollTop());
    var totalDistanceToScroll = $headerImage.height();
    var percentComplete = Math.min(distanceScrolled / totalDistanceToScroll, 1);

    /* Use percentComplete to determine how much we translate */
    var translateY = (percentComplete * 100 * FACTOR);

    /* Apply the transform */
    $headerImage.css({'transform': 'translateY(' + translateY + '%)'});
  });
});
/*!
 * avgrund 0.1
 * http://lab.hakim.se/avgrund
 * MIT licensed
 *
 * Copyright (C) 2012 Hakim El Hattab, http://hakim.se
 */
var Modal = (function(){

  var container = document.documentElement,
    // popup = document.querySelector( '.modal' ),
    currentState = null;

  container.className = container.className.replace( /\s+$/gi, '' ) + ' avgrund-ready';

  // Deactivate on ESC
  function onDocumentKeyUp( event ) {
    if( event.keyCode === 27 ) {
      deactivate();
    }
  }

  // Deactivate on click outside
  function onDocumentClick( event ) {
    cover = document.querySelector( '.cover' );
    if( event.target === cover ) {
      deactivate();
    }
  }

  function activate( state ) {
    document.addEventListener( 'keyup', onDocumentKeyUp, false );
    document.addEventListener( 'click', onDocumentClick, false );
    document.addEventListener( 'touchstart', onDocumentClick, false );

    removeClass( popup, currentState );
    addClass( popup, 'no-transition' );
    addClass( popup, state );

    currentState = state;
  }

  function deactivate() {
    document.removeEventListener( 'keyup', onDocumentKeyUp, false );
    document.removeEventListener( 'click', onDocumentClick, false );
    document.removeEventListener( 'touchstart', onDocumentClick, false );

    removeClass( container, 'dialog-is-open' );
    removeClass( container, 'create-event-is-open' );
    removeClass( container, 'settings-is-open' );
    removeClass( popup, 'avgrund-popup-animate')
  }

  function disableBlur() {
    addClass( document.documentElement, 'no-blur' );
  }

  function addClass( element, name ) {
    element.className = element.className.replace( /\s+$/gi, '' ) + ' ' + name;
  }

  function removeClass( element, name ) {
    element.className = element.className.replace( name, '' );
  }

  function show(selector){
    popup = document.querySelector( selector );
    selectorName = selector.slice(1);
    addClass(container, selectorName + '-is-open dialog-is-open');
    activate();
    return this;
  }
  function hide() {
    deactivate();
  }

  return {
    activate: activate,
    deactivate: deactivate,
    disableBlur: disableBlur,
    show: show,
    hide: hide
  }

})();
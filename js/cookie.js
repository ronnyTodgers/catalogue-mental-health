(function($) {
	"use strict"; // Start of use strict
  
	// Toggle the side navigation
	$("#sidebarToggle, #sidebarToggleTop").on('click', function(e) {
	  $("body").toggleClass("sidebar-toggled");
	  $(".sidebar").toggleClass("toggled");
	  if ($(".sidebar").hasClass("toggled")) {
		$('.sidebar .collapse').collapse('hide');
	  };
	});
  
	// Close any open menu accordions when window is resized below 768px
	$(window).resize(function() {
	  if ($(window).width() < 768) {
		$('.sidebar .collapse').collapse('hide');
	  };
	});
  
	// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
	$('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function(e) {
	  if ($(window).width() > 768) {
		var e0 = e.originalEvent,
		  delta = e0.wheelDelta || -e0.detail;
		this.scrollTop += (delta < 0 ? 1 : -1) * 30;
		e.preventDefault();
	  }
	});
  
	// Scroll to top button appear
	$(document).on('scroll', function() {
	  var scrollDistance = $(this).scrollTop();
	  if (scrollDistance > 100) {
		$('.scroll-to-top').fadeIn();
	  } else {
		$('.scroll-to-top').fadeOut();
	  }
	});
  
	// Smooth scrolling using jQuery easing
	$(document).on('click', 'a.scroll-to-top', function(e) {
	  var $anchor = $(this);
	  $('html, body').stop().animate({
		scrollTop: ($($anchor.attr('href')).offset().top)
	  }, 1000, 'easeInOutExpo');
	  e.preventDefault();
	});
  
  })(jQuery); // End of use strict
  
  function createCookie(name, value, days) {
	  var expires;
  
	  if (days) {
		  var date = new Date();
		  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		  expires = "; expires=" + date.toGMTString();
	  } else {
		  expires = "";
	  }
	  document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
  }
  
  function readCookie(name) {
	  var nameEQ = encodeURIComponent(name) + "=";
	  var ca = document.cookie.split(';');
	  for (var i = 0; i < ca.length; i++) {
		  var c = ca[i];
		  while (c.charAt(0) === ' ')
			  c = c.substring(1, c.length);
		  if (c.indexOf(nameEQ) === 0)
			  return decodeURIComponent(c.substring(nameEQ.length, c.length));
	  }
	  return null;
  }
  
  function eraseCookie(name) {
	  createCookie(name, "", -1);
  }
  
  function testCookiePolicy(){
	var offset = new Date().getTimezoneOffset();
	var policy=readCookie("CMHMcookiePolicy");
	if ((offset >= -180) && (offset <= 0) && policy==null) { // European time zones
	  $("#myCookieConsent").fadeIn(400);
	} else if (policy=="Reject") {
	  window['ga-disable-UA-152615597-1'] = true;
	} else {
	   window['ga-disable-UA-152615597-1'] = false;
	}
  
  }
  $(document).ready(function(){
	  $(".cookieButton").click(function(){
	  var expire=new Date();
	  expire=new Date(expire.getTime()+7776000000);
	  if(!$(this).hasClass('cookieRefuse')) {
		createCookie("CMHMcookiePolicy", "Accept", 90);
	  } else {
		createCookie("CMHMcookiePolicy", "Reject", 90);
	  }
	  $("#myCookieConsent").hide(400);
	  });
  });
  testCookiePolicy();
  // Cookie Compliancy END
  
  ;(function($) {
  
	if (typeof $.fn.tooltip.Constructor === 'undefined') {
	  throw new Error('Bootstrap Tooltip must be included first!');
	}
  
	var Tooltip = $.fn.tooltip.Constructor;
  
	// add customClass option to Bootstrap Tooltip
	$.extend( Tooltip.Default, {
	  customClass: ''
	});
  
	var _show = Tooltip.prototype.show;
  
	Tooltip.prototype.show = function () {
  
	  // invoke parent method
	  _show.apply(this,Array.prototype.slice.apply(arguments));
  
	  if ( this.config.customClass ) {
		  var tip = this.getTipElement();
		  $(tip).addClass(this.config.customClass);
	  }
  
	};
  
  })(window.jQuery);
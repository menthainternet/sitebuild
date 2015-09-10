;(function (global, undefined) {
'use strict';
var $ = global.jQuery;
$(function () {

  $(document).foundation();


// responsive menu ----------------------------

  // root action
  $('.responsiveMenu-root').click(function() {
    $('.responsiveMenu > ul').slideToggle(200);
  });

  //sub menu actions
  $('.responsiveMenu-level02 > li:last-child').focusout(function() {
    if (!$('.responsiveMenu-root:visible').length) {
      $('.responsiveMenu-level02').slideUp(200);
    }
  });

  $('.responsiveMenu-level03 > li:last-child').focusout(function() {
    if (!$('.responsiveMenu-root:visible').length) {
      $('.responsiveMenu-level03').slideUp(200);
    }
  });

  $('.responsiveMenu-item--hasSubMenu > a').click(function() {
    $(this).parent('.responsiveMenu-item--hasSubMenu').children('ul').slideToggle(200);
  });

  $('.responsiveMenu-item--hasSubMenu').hover(
    function() {
      if (!$('.responsiveMenu-root:visible').length) {
        $(this).children('ul').slideDown(0);
      }
    },
    function() {
      if (!$('.responsiveMenu-root:visible').length) {
        $(this).children('ul').slideUp(0);
      }
    }
  );

  // reset menu on resize
  $(global).resize(function() {
    if (!$('.responsiveMenu-root:visible').length) {
      $('.responsiveMenu ul').removeAttr('style');
    }
  });

// --------------------------------------------


});
})(this);

;(function (global, undefined) {
'use strict';
var $ = global.jQuery;
$(function () {

  // ajax loading indicator
  var $loader = $('#loading_indicator');
  $(document).ajaxSend(function() {
    $loader.removeClass('activity').addClass('activity');
  });

  $(document).ajaxStop(function() {
    $loader.removeClass('activity')
  });

});
})(this);

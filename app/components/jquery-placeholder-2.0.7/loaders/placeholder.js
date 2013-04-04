Modernizr.addTest('placeholder', function() {
  return !!('placeholder' in (Modernizr.input || document.createElement('input')) &&
            'placeholder' in (Modernizr.textarea || document.createElement('textarea')));
});
Modernizr.load([
{
  test: Modernizr.placeholder,
  nope: '/components/jquery-placeholder-2.0.7/jquery.placeholder.min.js',
  callback: function () {
    jQuery('input, textarea').placeholder();
  }
}]);

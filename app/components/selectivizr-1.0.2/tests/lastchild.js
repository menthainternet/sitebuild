Modernizr.testStyles('#modernizr div { width: 100px; } #modernizr :last-child { width: 200px; display: block; }', function (elem) {
  Modernizr.addTest('lastchild', elem.lastChild.offsetWidth > elem.firstChild.offsetWidth);
}, 2);
Modernizr.load([
{
  test: Modernizr.lastchild,
  nope: '/components/selectivizr-1.0.2/selectivizr.min.js'
}]);

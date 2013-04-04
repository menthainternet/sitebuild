Modernizr.testStyles('#modernizr :nth-child(even) { height: 10px; }', function (elem) {
  Modernizr.addTest('nthchild', elem.getElementsByTagName('div')[1].offsetHeight == 10);
}, 2);
Modernizr.load([
{
  test: Modernizr.nthchild,
  nope: '/components/selectivizr-1.0.2/selectivizr.min.js'
}]);

var elementResizeEvent = require('element-resize-event');

function setUpPolyfill() {
  if (!window) {
    throw new Error('No Window');
  }

  var orig = Element.prototype.addEventListener;
  Element.prototype.addEventListener = function(type, listener) {
    if (type === 'resize')
      elementResizeEvent(this, listener);
    else{
      orig.apply(this, arguments);
    }
  }
};

setUpPolyfill();
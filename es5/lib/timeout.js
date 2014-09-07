"use strict";
Object.defineProperties(exports, {
  timeoutStream: {get: function() {
      return timeoutStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__1.async,
    timeout = $__1.timeout,
    reject = $__1.reject;
var timeoutStream = (function(readStream, streamTimeout) {
  var originalRead = readStream.read;
  var startTimeout = (function() {
    return timeout(streamTimeout).then((function() {
      return reject(error(408, 'stream timeout'));
    }));
  });
  var timeoutRead = (function() {
    return Promise.race([originalRead(), startTimeout()]);
  });
  var newStream = Object.create(readStream);
  newStream.read = timeoutRead;
  return newStream;
});

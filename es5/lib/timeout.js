"use strict";
Object.defineProperties(exports, {
  timeoutStream: {get: function() {
      return timeoutStream;
    }},
  timeoutStreamFilter: {get: function() {
      return timeoutStreamFilter;
    }},
  makeTimeoutStreamFilter: {get: function() {
      return makeTimeoutStreamFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_error__,
    $__quiver_45_core_47_component__,
    $__quiver_45_core_47_promise__,
    $__stream__;
var error = ($__quiver_45_core_47_error__ = require("quiver-core/error"), $__quiver_45_core_47_error__ && $__quiver_45_core_47_error__.__esModule && $__quiver_45_core_47_error__ || {default: $__quiver_45_core_47_error__}).error;
var configMiddleware = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).configMiddleware;
var $__2 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    async = $__2.async,
    timeout = $__2.timeout,
    reject = $__2.reject;
var makeStreamConvertFilter = ($__stream__ = require("./stream"), $__stream__ && $__stream__.__esModule && $__stream__ || {default: $__stream__}).makeStreamConvertFilter;
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
var timeoutStreamFilter = makeStreamConvertFilter().middleware(configMiddleware((function(config) {
  var $__5,
      $__6;
  var $__4 = config,
      filterMode = ($__5 = $__4.filterMode) === void 0 ? 'inout' : $__5,
      streamTimeout = ($__6 = $__4.streamTimeout) === void 0 ? -1 : $__6;
  if (!(streamTimeout > 0))
    return;
  config.streamConverter = (function(readStream) {
    return timeoutStream(readStream, streamTimeout);
  });
})));
var makeTimeoutStreamFilter = timeoutStreamFilter.factory();

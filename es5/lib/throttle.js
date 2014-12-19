"use strict";
Object.defineProperties(exports, {
  throttledStream: {get: function() {
      return throttledStream;
    }},
  throttledStreamFilter: {get: function() {
      return throttledStreamFilter;
    }},
  makeThrottledStreamFilter: {get: function() {
      return makeThrottledStreamFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__stream__;
var $__0 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    async = $__0.async,
    timeout = $__0.timeout;
var configMiddleware = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).configMiddleware;
var makeStreamConvertFilter = ($__stream__ = require("./stream"), $__stream__ && $__stream__.__esModule && $__stream__ || {default: $__stream__}).makeStreamConvertFilter;
var throttledStream = (function(readStream, throttleRate) {
  throttleRate = throttleRate / 10;
  var originalRead = readStream.read;
  var currentRate = 0;
  var lastUpdate = Date.now();
  var isClosed = false;
  var throttledRead = async($traceurRuntime.initGeneratorFunction(function $__5() {
    var now,
        timeElapsed,
        $__3,
        closed,
        data,
        $__6,
        $__7,
        $__8,
        $__9;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = (isClosed) ? 1 : 2;
            break;
          case 1:
            $ctx.returnValue = {closed: isClosed};
            $ctx.state = -2;
            break;
          case 2:
            now = Date.now();
            timeElapsed = now - lastUpdate;
            $ctx.state = 30;
            break;
          case 30:
            $ctx.state = (timeElapsed > 120) ? 11 : 10;
            break;
          case 11:
            currentRate = 0;
            lastUpdate = now;
            $ctx.state = 12;
            break;
          case 10:
            $ctx.state = (currentRate > throttleRate) ? 4 : 12;
            break;
          case 4:
            $ctx.state = 5;
            return timeout(100);
          case 5:
            $ctx.maybeThrow();
            $ctx.state = 7;
            break;
          case 7:
            currentRate = 0;
            lastUpdate = now;
            $ctx.state = 12;
            break;
          case 12:
            $__6 = originalRead();
            $ctx.state = 19;
            break;
          case 19:
            $ctx.state = 15;
            return $__6;
          case 15:
            $__7 = $ctx.sent;
            $ctx.state = 17;
            break;
          case 17:
            $__3 = $__7;
            $__8 = $__3.closed;
            closed = $__8;
            $__9 = $__3.data;
            data = $__9;
            $ctx.state = 21;
            break;
          case 21:
            $ctx.state = (closed) ? 24 : 23;
            break;
          case 24:
            isClosed = true;
            $ctx.state = 25;
            break;
          case 25:
            $ctx.returnValue = {closed: closed};
            $ctx.state = -2;
            break;
          case 23:
            if (!Buffer.isBuffer(data))
              data = new Buffer(data);
            currentRate += data.length;
            $ctx.state = 32;
            break;
          case 32:
            $ctx.returnValue = {data: data};
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  }));
  var newStream = Object.create(readStream);
  newStream.read = throttledRead;
  return newStream;
});
var throttledStreamFilter = makeStreamConvertFilter().middleware(configMiddleware((function(config) {
  var $__4;
  var $__3 = config,
      throttleRate = ($__4 = $__3.throttleRate) === void 0 ? -1 : $__4;
  if (!(throttleRate > 0))
    return;
  config.replaceStreamable = true;
  config.streamConverter = (function(readStream) {
    return throttledStream(readStream, throttleRate);
  });
})));
var makeThrottledStreamFilter = throttledStreamFilter.factory();

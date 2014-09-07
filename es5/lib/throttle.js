"use strict";
Object.defineProperties(exports, {
  throttledStream: {get: function() {
      return throttledStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__;
var $__0 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__0.async,
    timeout = $__0.timeout;
var throttledStream = (function(readStream, throttleRate) {
  throttleRate = throttleRate / 10;
  var originalRead = readStream.read;
  var currentRate = 0;
  var lastUpdate = Date.now();
  var isClosed = false;
  var throttledRead = async($traceurRuntime.initGeneratorFunction(function $__2() {
    var now,
        timeElapsed,
        $__1,
        closed,
        data,
        $__3,
        $__4,
        $__5,
        $__6;
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
            $__3 = originalRead();
            $ctx.state = 19;
            break;
          case 19:
            $ctx.state = 15;
            return $__3;
          case 15:
            $__4 = $ctx.sent;
            $ctx.state = 17;
            break;
          case 17:
            $__1 = $__4;
            $__5 = $__1.closed;
            closed = $__5;
            $__6 = $__1.data;
            data = $__6;
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
    }, $__2, this);
  }));
  var newStream = Object.create(readStream);
  newStream.read = throttledRead;
  return newStream;
});

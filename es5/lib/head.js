"use strict";
Object.defineProperties(exports, {
  extractStreamHead: {get: function() {
      return extractStreamHead;
    }},
  extractFixedStreamHead: {get: function() {
      return extractFixedStreamHead;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__buffertools__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var pushbackStream = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).pushbackStream;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var indexOf = buffertools.indexOf;
var extractStreamHead = async($traceurRuntime.initGeneratorFunction(function $__5(readStream, separator) {
  var options,
      headBuffer,
      $__4,
      closed,
      data,
      previousBufferSize,
      separatorIndex,
      headContent,
      restIndex,
      restBuffer,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          options = $arguments[2] !== (void 0) ? $arguments[2] : {};
          if (!Buffer.isBuffer(separator))
            separator = new Buffer(separator);
          headBuffer = new Buffer(0);
          $ctx.state = 23;
          break;
        case 23:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__6 = readStream.read;
          $__7 = $__6.call(readStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__7;
        case 2:
          $__8 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__4 = $__8;
          $__9 = $__4.closed;
          closed = $__9;
          $__10 = $__4.data;
          data = $__10;
          $ctx.state = 8;
          break;
        case 8:
          if (closed)
            throw error(400, 'Bad Request');
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          $ctx.state = 18;
          break;
        case 18:
          $ctx.state = (data.length == 0) ? 23 : 15;
          break;
        case 15:
          previousBufferSize = headBuffer.length;
          headBuffer = Buffer.concat([headBuffer, data]);
          separatorIndex = indexOf(headBuffer, separator);
          $ctx.state = 20;
          break;
        case 20:
          $ctx.state = (separatorIndex != -1) ? 11 : 23;
          break;
        case 11:
          headContent = headBuffer.slice(0, separatorIndex);
          restIndex = separatorIndex - previousBufferSize + separator.length;
          if (restIndex != data.length) {
            restBuffer = data.slice(restIndex);
            readStream = pushbackStream(readStream, [restBuffer]);
          }
          $ctx.state = 12;
          break;
        case 12:
          $ctx.returnValue = [headContent, readStream];
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__5, this);
}));
var extractFixedStreamHead = async($traceurRuntime.initGeneratorFunction(function $__11(readStream, size) {
  var remaining,
      headBuffers,
      $__4,
      closed,
      data,
      bufferSize,
      $__12,
      $__13,
      $__14,
      $__15,
      $__16;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          remaining = size;
          headBuffers = [];
          $ctx.state = 30;
          break;
        case 30:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__12 = readStream.read;
          $__13 = $__12.call(readStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__13;
        case 2:
          $__14 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__4 = $__14;
          $__15 = $__4.closed;
          closed = $__15;
          $__16 = $__4.data;
          data = $__16;
          $ctx.state = 8;
          break;
        case 8:
          if (closed)
            throw error(400, 'Bad Request');
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          $ctx.state = 23;
          break;
        case 23:
          $ctx.state = (data.length == 0) ? 30 : 20;
          break;
        case 20:
          bufferSize = data.length;
          $ctx.state = 25;
          break;
        case 25:
          $ctx.state = (bufferSize == remaining) ? 11 : 10;
          break;
        case 11:
          headBuffers.push(data);
          $ctx.state = 12;
          break;
        case 12:
          $ctx.returnValue = [Buffer.concat(headBuffers), readStream];
          $ctx.state = -2;
          break;
        case 10:
          $ctx.state = (bufferSize > remaining) ? 16 : 15;
          break;
        case 16:
          headBuffers.push(data.slice(0, remaining));
          readStream = pushbackStream(readStream, [data.slice(remaining)]);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.returnValue = [Buffer.concat(headBuffers), readStream];
          $ctx.state = -2;
          break;
        case 15:
          headBuffers.push(data);
          remaining = remaining - bufferSize;
          $ctx.state = 30;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}));

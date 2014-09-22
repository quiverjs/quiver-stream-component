"use strict";
Object.defineProperties(exports, {
  convertStream: {get: function() {
      return convertStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_util__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var createChannel = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).createChannel;
var pipeConvert = async($traceurRuntime.initGeneratorFunction(function $__4(converter, readStream, writeStream) {
  var closed,
      $__3,
      data,
      converted,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11,
      $__12,
      $__13,
      err;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.pushTry(30, null);
          $ctx.state = 33;
          break;
        case 33:
          $ctx.state = (true) ? 5 : 29;
          break;
        case 5:
          $__5 = writeStream.prepareWrite;
          $__6 = $__5.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__6;
        case 2:
          $__7 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__8 = $__7.closed;
          closed = $__8;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = (closed) ? 9 : 10;
          break;
        case 9:
          $ctx.returnValue = readStream.closeRead();
          $ctx.state = -2;
          break;
        case 10:
          $__9 = readStream.read;
          $__10 = $__9.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__10;
        case 13:
          $__11 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__3 = $__11;
          $__12 = $__3.closed;
          closed = $__12;
          $__13 = $__3.data;
          data = $__13;
          $ctx.state = 19;
          break;
        case 19:
          $ctx.state = (closed) ? 20 : 21;
          break;
        case 20:
          $ctx.returnValue = writeStream.closeWrite();
          $ctx.state = -2;
          break;
        case 21:
          $ctx.state = 24;
          return converter(data);
        case 24:
          converted = $ctx.sent;
          $ctx.state = 26;
          break;
        case 26:
          writeStream.write(converted);
          $ctx.state = 33;
          break;
        case 29:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 30:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 36;
          break;
        case 36:
          try {
            writeStream.closeWrite(err);
          } finally {
            readStream.closeRead(err);
          }
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__4, this);
}));
var convertStream = (function(converter, inputStream) {
  var $__2 = createChannel(),
      readStream = $__2.readStream,
      writeStream = $__2.writeStream;
  pipeConvert(converter, inputStream, writeStream).catch((function(err) {}));
  return readStream;
});

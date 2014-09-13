"use strict";
Object.defineProperties(exports, {
  pipeSizedBuffer: {get: function() {
      return pipeSizedBuffer;
    }},
  sizeWindowedStream: {get: function() {
      return sizeWindowedStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_util__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var createChannel = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).createChannel;
var pipeSizedBuffer = async($traceurRuntime.initGeneratorFunction(function $__3(readStream, writeStream, minSize, maxSize) {
  var buffer,
      closed,
      $__2,
      data,
      bufferLength,
      division,
      sliceStartIndex,
      sliceEndIndex,
      slice,
      $__4,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11,
      $__12,
      err;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.pushTry(33, null);
          $ctx.state = 36;
          break;
        case 36:
          buffer = null;
          $ctx.state = 32;
          break;
        case 32:
          $ctx.state = (true) ? 5 : 30;
          break;
        case 5:
          $__4 = writeStream.prepareWrite;
          $__5 = $__4.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__5;
        case 2:
          $__6 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__7 = $__6.closed;
          closed = $__7;
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
          $ctx.state = (!buffer || buffer.length < minSize) ? 16 : 27;
          break;
        case 16:
          $__8 = readStream.read;
          $__9 = $__8.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__9;
        case 13:
          $__10 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__2 = $__10;
          $__11 = $__2.closed;
          closed = $__11;
          $__12 = $__2.data;
          data = $__12;
          $ctx.state = 19;
          break;
        case 19:
          $ctx.state = (closed) ? 22 : 21;
          break;
        case 22:
          if (buffer)
            writeStream.write(buffer);
          writeStream.closeWrite();
          $ctx.state = 23;
          break;
        case 23:
          $ctx.state = -2;
          break;
        case 21:
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          if (buffer) {
            buffer = Buffer.concat([buffer, data]);
          } else {
            buffer = data;
          }
          $ctx.state = 10;
          break;
        case 27:
          bufferLength = buffer.length;
          if (bufferLength <= maxSize) {
            writeStream.write(buffer);
            buffer = null;
          } else {
            division = (bufferLength / maxSize) | 0;
            sliceStartIndex = 0;
            sliceEndIndex = maxSize;
            while (sliceEndIndex <= bufferLength) {
              slice = buffer.slice(sliceStartIndex, sliceEndIndex);
              writeStream.write(slice);
              sliceStartIndex = sliceEndIndex;
              sliceEndIndex += maxSize;
            }
            if (sliceStartIndex == bufferLength) {
              buffer = null;
            } else {
              buffer = buffer.slice(sliceStartIndex);
            }
          }
          $ctx.state = 32;
          break;
        case 30:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 33:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 39;
          break;
        case 39:
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
  }, $__3, this);
}));
var sizeWindowedStream = (function(rawStream, minSize) {
  var maxSize = arguments[2] !== (void 0) ? arguments[2] : minSize;
  minSize = minSize | 0;
  maxSize = maxSize | 0;
  if (minSize <= 0 || maxSize < minSize)
    throw new Error('invalid minSize/maxSize');
  var $__2 = createChannel(),
      readStream = $__2.readStream,
      writeStream = $__2.writeStream;
  pipeSizedBuffer(rawStream, writeStream, minSize, maxSize);
  return readStream;
});

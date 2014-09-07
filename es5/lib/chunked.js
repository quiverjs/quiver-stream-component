"use strict";
Object.defineProperties(exports, {
  streamToChunkedStream: {get: function() {
      return streamToChunkedStream;
    }},
  streamToUnchunkedStream: {get: function() {
      return streamToUnchunkedStream;
    }},
  __esModule: {value: true}
});
var $__quiver_45_error__,
    $__quiver_45_promise__,
    $__buffertools__,
    $__quiver_45_stream_45_util__,
    $__head_46_js__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var $__5 = buffertools,
    compareBuffer = $__5.compare,
    indexOf = $__5.indexOf;
var $__3 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    createChannel = $__3.createChannel,
    pushbackStream = $__3.pushbackStream;
var $__4 = ($__head_46_js__ = require("./head.js"), $__head_46_js__ && $__head_46_js__.__esModule && $__head_46_js__ || {default: $__head_46_js__}),
    extractStreamHead = $__4.extractStreamHead,
    extractFixedStreamHead = $__4.extractFixedStreamHead;
var pipeChunkedStream = async($traceurRuntime.initGeneratorFunction(function $__6(readStream, writeStream) {
  var options,
      closed,
      $__5,
      data,
      chunkHead,
      chunkSize,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11,
      $__12,
      $__13,
      $__14,
      $__15,
      err;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          options = $arguments[2] !== (void 0) ? $arguments[2] : {};
          $ctx.state = 38;
          break;
        case 38:
          $ctx.pushTry(28, null);
          $ctx.state = 31;
          break;
        case 31:
          $ctx.state = (true) ? 5 : 27;
          break;
        case 5:
          $__7 = writeStream.prepareWrite;
          $__8 = $__7.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__8;
        case 2:
          $__9 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__10 = $__9.closed;
          closed = $__10;
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
          $__11 = readStream.read;
          $__12 = $__11.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__12;
        case 13:
          $__13 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__5 = $__13;
          $__14 = $__5.closed;
          closed = $__14;
          $__15 = $__5.data;
          data = $__15;
          $ctx.state = 19;
          break;
        case 19:
          $ctx.state = (closed) ? 22 : 21;
          break;
        case 22:
          chunkHead = '0\r\n\r\n';
          writeStream.write(chunkHead);
          writeStream.closeWrite();
          $ctx.state = 23;
          break;
        case 23:
          $ctx.state = -2;
          break;
        case 21:
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          chunkSize = data.length;
          chunkHead = chunkSize.toString(16) + '\r\n';
          writeStream.write(chunkHead);
          writeStream.write(data);
          writeStream.write('\r\n');
          $ctx.state = 31;
          break;
        case 27:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 28:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 34;
          break;
        case 34:
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
  }, $__6, this);
}));
var chunkSeparator = new Buffer('\r\n');
var extractTrailingHeaders = async($traceurRuntime.initGeneratorFunction(function $__16(readStream) {
  var headers,
      $__5,
      head,
      readStream,
      $__17,
      $__18,
      $__19,
      $__20;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          headers = [];
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__17 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__17;
        case 2:
          $__18 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__5 = $__18;
          $__19 = $__5[0];
          head = $__19;
          $__20 = $__5[1];
          readStream = $__20;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = (head.length == 0) ? 9 : 10;
          break;
        case 9:
          $ctx.returnValue = headers;
          $ctx.state = -2;
          break;
        case 10:
          headers.push(head);
          $ctx.state = 16;
          break;
        default:
          return $ctx.end();
      }
  }, $__16, this);
}));
var pipeChunk = async($traceurRuntime.initGeneratorFunction(function $__21(readStream, writeStream, size) {
  var closed,
      $__5,
      data,
      bufferSize,
      head,
      rest,
      $__22,
      $__23,
      $__24,
      $__25,
      $__26,
      $__27,
      $__28,
      $__29,
      $__30;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__22 = writeStream.prepareWrite;
          $__23 = $__22.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__23;
        case 2:
          $__24 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__25 = $__24.closed;
          closed = $__25;
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
          $__26 = readStream.read;
          $__27 = $__26.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__27;
        case 13:
          $__28 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__5 = $__28;
          $__29 = $__5.closed;
          closed = $__29;
          $__30 = $__5.data;
          data = $__30;
          $ctx.state = 19;
          break;
        case 19:
          if (closed)
            throw error(400, 'Bad Request');
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          bufferSize = data.length;
          $ctx.state = 31;
          break;
        case 31:
          $ctx.state = (bufferSize == size) ? 22 : 21;
          break;
        case 22:
          writeStream.write(data);
          $ctx.state = 23;
          break;
        case 23:
          $ctx.returnValue = readStream;
          $ctx.state = -2;
          break;
        case 21:
          $ctx.state = (bufferSize > size) ? 27 : 26;
          break;
        case 27:
          head = data.slice(0, size);
          rest = data.slice(size);
          writeStream.write(head);
          $ctx.state = 28;
          break;
        case 28:
          $ctx.returnValue = pushbackStream(readStream, [rest]);
          $ctx.state = -2;
          break;
        case 26:
          size = size - bufferSize;
          writeStream.write(data);
          $ctx.state = 0;
          break;
        default:
          return $ctx.end();
      }
  }, $__21, this);
}));
var pipeUnchunkedStream = async($traceurRuntime.initGeneratorFunction(function $__31(readStream, writeStream) {
  var options,
      $__5,
      chunkHead,
      readStream,
      chunkSizeText,
      extensionIndex,
      chunkSize,
      trailingHeaders,
      head,
      $__32,
      $__33,
      $__34,
      $__35,
      $__36,
      $__37,
      $__38,
      $__39,
      err;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          options = $arguments[2] !== (void 0) ? $arguments[2] : {};
          $ctx.state = 45;
          break;
        case 45:
          $ctx.pushTry(35, null);
          $ctx.state = 38;
          break;
        case 38:
          $ctx.state = (true) ? 5 : 34;
          break;
        case 5:
          $__32 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__32;
        case 2:
          $__33 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__5 = $__33;
          $__34 = $__5[0];
          chunkHead = $__34;
          $__35 = $__5[1];
          readStream = $__35;
          $ctx.state = 8;
          break;
        case 8:
          chunkSizeText = chunkHead;
          extensionIndex = indexOf(chunkHead, ';');
          if (extensionIndex != -1) {
            chunkSizeText = chunkHead.slice(0, extensionIndex);
          }
          if (chunkSizeText.length == 0 || /[^0-9a-fA-F]/.test(chunkSizeText)) {
            throw error(400, 'malformed chunked stream');
          }
          chunkSize = parseInt(chunkSizeText, 16);
          $ctx.state = 31;
          break;
        case 31:
          $ctx.state = (chunkSize == 0) ? 9 : 14;
          break;
        case 9:
          $ctx.state = 10;
          return extractTrailingHeaders(readStream);
        case 10:
          trailingHeaders = $ctx.sent;
          $ctx.state = 12;
          break;
        case 12:
          writeStream.closeWrite();
          readStream.closeRead();
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = -2;
          break;
        case 14:
          $ctx.state = 19;
          return pipeChunk(readStream, writeStream, chunkSize);
        case 19:
          readStream = $ctx.sent;
          $ctx.state = 21;
          break;
        case 21:
          $__36 = extractFixedStreamHead(readStream, 2);
          $ctx.state = 27;
          break;
        case 27:
          $ctx.state = 23;
          return $__36;
        case 23:
          $__37 = $ctx.sent;
          $ctx.state = 25;
          break;
        case 25:
          $__5 = $__37;
          $__38 = $__5[0];
          head = $__38;
          $__39 = $__5[1];
          readStream = $__39;
          $ctx.state = 29;
          break;
        case 29:
          if (compareBuffer(head, chunkSeparator) != 0)
            throw error(400, 'Bad Request');
          $ctx.state = 38;
          break;
        case 34:
          $ctx.popTry();
          $ctx.state = -2;
          break;
        case 35:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 41;
          break;
        case 41:
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
  }, $__31, this);
}));
var streamToChunkedStream = (function(unchunkedStream) {
  var $__5 = createChannel(),
      readStream = $__5.readStream,
      writeStream = $__5.writeStream;
  pipeChunkedStream(unchunkedStream, writeStream);
  return readStream;
});
var streamToUnchunkedStream = (function(chunkedStream) {
  var $__5 = createChannel(),
      readStream = $__5.readStream,
      writeStream = $__5.writeStream;
  pipeUnchunkedStream(chunkedStream, writeStream);
  return readStream;
});

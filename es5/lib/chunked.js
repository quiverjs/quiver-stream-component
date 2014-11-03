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
    $__head__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var $__5 = buffertools,
    compareBuffer = $__5.compare,
    indexOf = $__5.indexOf;
var $__3 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    createChannel = $__3.createChannel,
    pushbackStream = $__3.pushbackStream;
var $__4 = ($__head__ = require("./head"), $__head__ && $__head__.__esModule && $__head__ || {default: $__head__}),
    extractStreamHead = $__4.extractStreamHead,
    extractFixedStreamHead = $__4.extractFixedStreamHead;
var pipeChunkedStream = async($traceurRuntime.initGeneratorFunction(function $__8(readStream, writeStream) {
  var options,
      closed,
      $__7,
      data,
      chunkHead,
      chunkSize,
      $__9,
      $__10,
      $__11,
      $__12,
      $__13,
      $__14,
      $__15,
      $__16,
      $__17,
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
          $__9 = writeStream.prepareWrite;
          $__10 = $__9.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__10;
        case 2:
          $__11 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__12 = $__11.closed;
          closed = $__12;
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
          $__13 = readStream.read;
          $__14 = $__13.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__14;
        case 13:
          $__15 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__7 = $__15;
          $__16 = $__7.closed;
          closed = $__16;
          $__17 = $__7.data;
          data = $__17;
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
  }, $__8, this);
}));
var chunkSeparator = new Buffer('\r\n');
var extractTrailingHeaders = async($traceurRuntime.initGeneratorFunction(function $__18(readStream) {
  var headers,
      $__6,
      head,
      readStream,
      $__19,
      $__20,
      $__21,
      $__22;
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
          $__19 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__19;
        case 2:
          $__20 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__20;
          $__21 = $__6[0];
          head = $__21;
          $__22 = $__6[1];
          readStream = $__22;
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
  }, $__18, this);
}));
var pipeChunk = async($traceurRuntime.initGeneratorFunction(function $__23(readStream, writeStream, size) {
  var closed,
      $__7,
      data,
      bufferSize,
      head,
      rest,
      $__24,
      $__25,
      $__26,
      $__27,
      $__28,
      $__29,
      $__30,
      $__31,
      $__32;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__24 = writeStream.prepareWrite;
          $__25 = $__24.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__25;
        case 2:
          $__26 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__27 = $__26.closed;
          closed = $__27;
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
          $__28 = readStream.read;
          $__29 = $__28.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__29;
        case 13:
          $__30 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__7 = $__30;
          $__31 = $__7.closed;
          closed = $__31;
          $__32 = $__7.data;
          data = $__32;
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
  }, $__23, this);
}));
var pipeUnchunkedStream = async($traceurRuntime.initGeneratorFunction(function $__33(readStream, writeStream) {
  var options,
      $__6,
      chunkHead,
      readStream,
      chunkSizeText,
      extensionIndex,
      chunkSize,
      trailingHeaders,
      $__7,
      head,
      $__34,
      $__35,
      $__36,
      $__37,
      $__38,
      $__39,
      $__40,
      $__41,
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
          $__34 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__34;
        case 2:
          $__35 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__35;
          $__36 = $__6[0];
          chunkHead = $__36;
          $__37 = $__6[1];
          readStream = $__37;
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
          $__38 = extractFixedStreamHead(readStream, 2);
          $ctx.state = 27;
          break;
        case 27:
          $ctx.state = 23;
          return $__38;
        case 23:
          $__39 = $ctx.sent;
          $ctx.state = 25;
          break;
        case 25:
          $__7 = $__39;
          $__40 = $__7[0];
          head = $__40;
          $__41 = $__7[1];
          readStream = $__41;
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
  }, $__33, this);
}));
var streamToChunkedStream = (function(unchunkedStream) {
  var $__6 = createChannel(),
      readStream = $__6.readStream,
      writeStream = $__6.writeStream;
  pipeChunkedStream(unchunkedStream, writeStream);
  return readStream;
});
var streamToUnchunkedStream = (function(chunkedStream) {
  var $__6 = createChannel(),
      readStream = $__6.readStream,
      writeStream = $__6.writeStream;
  pipeUnchunkedStream(chunkedStream, writeStream);
  return readStream;
});

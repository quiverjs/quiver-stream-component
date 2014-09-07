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
    $__pushback_46_js__,
    $__stream_45_head_46_js__;
var error = ($__quiver_45_error__ = require("quiver-error"), $__quiver_45_error__ && $__quiver_45_error__.__esModule && $__quiver_45_error__ || {default: $__quiver_45_error__}).error;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var $__6 = buffertools,
    compareBuffer = $__6.compare,
    indexOf = $__6.indexOf;
var createChannel = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).createChannel;
var pushbackStream = ($__pushback_46_js__ = require("./pushback.js"), $__pushback_46_js__ && $__pushback_46_js__.__esModule && $__pushback_46_js__ || {default: $__pushback_46_js__}).pushbackStream;
var $__5 = ($__stream_45_head_46_js__ = require("./stream-head.js"), $__stream_45_head_46_js__ && $__stream_45_head_46_js__.__esModule && $__stream_45_head_46_js__ || {default: $__stream_45_head_46_js__}),
    extractStreamHead = $__5.extractStreamHead,
    extractFixedStreamHead = $__5.extractFixedStreamHead;
var pipeChunkedStream = async($traceurRuntime.initGeneratorFunction(function $__7(readStream, writeStream) {
  var options,
      closed,
      $__6,
      data,
      chunkHead,
      chunkSize,
      $__8,
      $__9,
      $__10,
      $__11,
      err,
      $__12,
      $__13,
      $__14,
      $__15,
      $__16;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          options = $arguments[2] !== (void 0) ? $arguments[2] : {};
          $ctx.state = 58;
          break;
        case 58:
          $ctx.state = (true) ? 13 : -2;
          break;
        case 13:
          $ctx.pushTry(11, null);
          $ctx.state = 14;
          break;
        case 14:
          $__8 = writeStream.prepareWrite;
          $__9 = $__8.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__9;
        case 2:
          $__10 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__11 = $__10.closed;
          closed = $__11;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.popTry();
          $ctx.state = 16;
          break;
        case 11:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 9;
          break;
        case 9:
          $ctx.returnValue = readStream.closeRead(err);
          $ctx.state = -2;
          break;
        case 16:
          $ctx.state = (closed) ? 18 : 19;
          break;
        case 18:
          $ctx.returnValue = readStream.closeRead();
          $ctx.state = -2;
          break;
        case 19:
          $ctx.pushTry(31, null);
          $ctx.state = 34;
          break;
        case 34:
          $__12 = readStream.read;
          $__13 = $__12.call(readStream);
          $ctx.state = 26;
          break;
        case 26:
          $ctx.state = 22;
          return $__13;
        case 22:
          $__14 = $ctx.sent;
          $ctx.state = 24;
          break;
        case 24:
          $__6 = $__14;
          $__15 = $__6.closed;
          closed = $__15;
          $__16 = $__6.data;
          data = $__16;
          $ctx.state = 28;
          break;
        case 28:
          $ctx.popTry();
          $ctx.state = 36;
          break;
        case 31:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 29;
          break;
        case 29:
          $ctx.returnValue = writeStream.closeWrite(err);
          $ctx.state = -2;
          break;
        case 36:
          $ctx.state = (closed) ? 40 : 39;
          break;
        case 40:
          chunkHead = '0\r\n\r\n';
          writeStream.write(chunkHead);
          writeStream.closeWrite();
          $ctx.state = 41;
          break;
        case 41:
          $ctx.state = -2;
          break;
        case 39:
          $ctx.pushTry(47, null);
          $ctx.state = 50;
          break;
        case 50:
          if (!Buffer.isBuffer(data))
            data = new Buffer(data);
          chunkSize = data.length;
          chunkHead = chunkSize.toString(16) + '\r\n';
          writeStream.write(chunkHead);
          writeStream.write(data);
          writeStream.write('\r\n');
          $ctx.state = 52;
          break;
        case 52:
          $ctx.popTry();
          $ctx.state = 58;
          break;
        case 47:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 45;
          break;
        case 45:
          readStream.closeRead(err);
          writeStream.closeWrite(err);
          $ctx.state = 46;
          break;
        case 46:
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__7, this);
}));
var chunkSeparator = new Buffer('\r\n');
var extractTrailingHeaders = async($traceurRuntime.initGeneratorFunction(function $__17(readStream) {
  var headers,
      $__6,
      head,
      readStream,
      $__18,
      $__19,
      $__20,
      $__21;
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
          $__18 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__18;
        case 2:
          $__19 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__19;
          $__20 = $__6[0];
          head = $__20;
          $__21 = $__6[1];
          readStream = $__21;
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
  }, $__17, this);
}));
var pipeChunk = async($traceurRuntime.initGeneratorFunction(function $__22(readStream, writeStream, size) {
  var closed,
      $__6,
      data,
      bufferSize,
      head,
      rest,
      $__23,
      $__24,
      $__25,
      $__26,
      $__27,
      $__28,
      $__29,
      $__30,
      $__31;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__23 = writeStream.prepareWrite;
          $__24 = $__23.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__24;
        case 2:
          $__25 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__26 = $__25.closed;
          closed = $__26;
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
          $__27 = readStream.read;
          $__28 = $__27.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__28;
        case 13:
          $__29 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__6 = $__29;
          $__30 = $__6.closed;
          closed = $__30;
          $__31 = $__6.data;
          data = $__31;
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
  }, $__22, this);
}));
var pipeUnchunkedStream = async($traceurRuntime.initGeneratorFunction(function $__32(readStream, writeStream) {
  var options,
      $__6,
      chunkHead,
      readStream,
      chunkSizeText,
      extensionIndex,
      chunkSize,
      trailingHeaders,
      head,
      $__33,
      $__34,
      $__35,
      $__36,
      $__37,
      $__38,
      $__39,
      $__40,
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
          $__33 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__33;
        case 2:
          $__34 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__6 = $__34;
          $__35 = $__6[0];
          chunkHead = $__35;
          $__36 = $__6[1];
          readStream = $__36;
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
          $__37 = extractFixedStreamHead(readStream, 2);
          $ctx.state = 27;
          break;
        case 27:
          $ctx.state = 23;
          return $__37;
        case 23:
          $__38 = $ctx.sent;
          $ctx.state = 25;
          break;
        case 25:
          $__6 = $__38;
          $__39 = $__6[0];
          head = $__39;
          $__40 = $__6[1];
          readStream = $__40;
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
          } catch (err) {}
          readStream.closeRead(err);
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__32, this);
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

"use strict";
Object.defineProperties(exports, {
  streamToChunkedStream: {get: function() {
      return streamToChunkedStream;
    }},
  streamToUnchunkedStream: {get: function() {
      return streamToUnchunkedStream;
    }},
  chunkedTransformHandler: {get: function() {
      return chunkedTransformHandler;
    }},
  unchunkedTransformHandler: {get: function() {
      return unchunkedTransformHandler;
    }},
  makeChunkedTransformHandler: {get: function() {
      return makeChunkedTransformHandler;
    }},
  makeUnchunkedTransformHandler: {get: function() {
      return makeUnchunkedTransformHandler;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_error__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__quiver_45_core_47_stream_45_util__,
    $__buffertools__,
    $__head__;
var error = ($__quiver_45_core_47_error__ = require("quiver-core/error"), $__quiver_45_core_47_error__ && $__quiver_45_core_47_error__.__esModule && $__quiver_45_core_47_error__ || {default: $__quiver_45_core_47_error__}).error;
var async = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}).async;
var simpleHandler = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).simpleHandler;
var $__3 = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}),
    createChannel = $__3.createChannel,
    pushbackStream = $__3.pushbackStream;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var $__6 = buffertools,
    compareBuffer = $__6.compare,
    indexOf = $__6.indexOf;
var $__5 = ($__head__ = require("./head"), $__head__ && $__head__.__esModule && $__head__ || {default: $__head__}),
    extractStreamHead = $__5.extractStreamHead,
    extractFixedStreamHead = $__5.extractFixedStreamHead;
var pipeChunkedStream = async($traceurRuntime.initGeneratorFunction(function $__9(readStream, writeStream) {
  var options,
      closed,
      $__8,
      data,
      chunkHead,
      chunkSize,
      $__10,
      $__11,
      $__12,
      $__13,
      $__14,
      $__15,
      $__16,
      $__17,
      $__18,
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
          $__10 = writeStream.prepareWrite;
          $__11 = $__10.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__11;
        case 2:
          $__12 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__13 = $__12.closed;
          closed = $__13;
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
          $__14 = readStream.read;
          $__15 = $__14.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__15;
        case 13:
          $__16 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__8 = $__16;
          $__17 = $__8.closed;
          closed = $__17;
          $__18 = $__8.data;
          data = $__18;
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
  }, $__9, this);
}));
var chunkSeparator = new Buffer('\r\n');
var extractTrailingHeaders = async($traceurRuntime.initGeneratorFunction(function $__19(readStream) {
  var headers,
      $__7,
      head,
      readStream,
      $__20,
      $__21,
      $__22,
      $__23;
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
          $__20 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__20;
        case 2:
          $__21 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__7 = $__21;
          $__22 = $__7[0];
          head = $__22;
          $__23 = $__7[1];
          readStream = $__23;
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
  }, $__19, this);
}));
var pipeChunk = async($traceurRuntime.initGeneratorFunction(function $__24(readStream, writeStream, size) {
  var closed,
      $__8,
      data,
      bufferSize,
      head,
      rest,
      $__25,
      $__26,
      $__27,
      $__28,
      $__29,
      $__30,
      $__31,
      $__32,
      $__33;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__25 = writeStream.prepareWrite;
          $__26 = $__25.call(writeStream);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__26;
        case 2:
          $__27 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__28 = $__27.closed;
          closed = $__28;
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
          $__29 = readStream.read;
          $__30 = $__29.call(readStream);
          $ctx.state = 17;
          break;
        case 17:
          $ctx.state = 13;
          return $__30;
        case 13:
          $__31 = $ctx.sent;
          $ctx.state = 15;
          break;
        case 15:
          $__8 = $__31;
          $__32 = $__8.closed;
          closed = $__32;
          $__33 = $__8.data;
          data = $__33;
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
  }, $__24, this);
}));
var pipeUnchunkedStream = async($traceurRuntime.initGeneratorFunction(function $__34(readStream, writeStream) {
  var options,
      $__7,
      chunkHead,
      readStream,
      chunkSizeText,
      extensionIndex,
      chunkSize,
      trailingHeaders,
      $__8,
      head,
      $__35,
      $__36,
      $__37,
      $__38,
      $__39,
      $__40,
      $__41,
      $__42,
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
          $__35 = extractStreamHead(readStream, chunkSeparator);
          $ctx.state = 6;
          break;
        case 6:
          $ctx.state = 2;
          return $__35;
        case 2:
          $__36 = $ctx.sent;
          $ctx.state = 4;
          break;
        case 4:
          $__7 = $__36;
          $__37 = $__7[0];
          chunkHead = $__37;
          $__38 = $__7[1];
          readStream = $__38;
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
          $__39 = extractFixedStreamHead(readStream, 2);
          $ctx.state = 27;
          break;
        case 27:
          $ctx.state = 23;
          return $__39;
        case 23:
          $__40 = $ctx.sent;
          $ctx.state = 25;
          break;
        case 25:
          $__8 = $__40;
          $__41 = $__8[0];
          head = $__41;
          $__42 = $__8[1];
          readStream = $__42;
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
  }, $__34, this);
}));
var streamToChunkedStream = (function(unchunkedStream) {
  var $__7 = createChannel(),
      readStream = $__7.readStream,
      writeStream = $__7.writeStream;
  pipeChunkedStream(unchunkedStream, writeStream);
  return readStream;
});
var streamToUnchunkedStream = (function(chunkedStream) {
  var $__7 = createChannel(),
      readStream = $__7.readStream,
      writeStream = $__7.writeStream;
  pipeUnchunkedStream(chunkedStream, writeStream);
  return readStream;
});
var chunkedTransformHandler = simpleHandler((function(args, inputStream) {
  return streamToChunkedStream(inputStream);
}), 'stream', 'stream');
var unchunkedTransformHandler = simpleHandler((function(args, inputStream) {
  return streamToUnchunkedStream(inputStream);
}), 'stream', 'stream');
var makeChunkedTransformHandler = chunkedTransformHandler.factory();
var makeUnchunkedTransformHandler = unchunkedTransformHandler.factory();

"use strict";
Object.defineProperties(exports, {
  extractStreamHead: {get: function() {
      return extractStreamHead;
    }},
  extractFixedStreamHead: {get: function() {
      return extractFixedStreamHead;
    }},
  headerExtractFilter: {get: function() {
      return headerExtractFilter;
    }},
  makeHeaderExtractFilter: {get: function() {
      return makeHeaderExtractFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_error__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_stream_45_util__,
    $__quiver_45_core_47_component__,
    $__buffertools__;
var error = ($__quiver_45_core_47_error__ = require("quiver-core/error"), $__quiver_45_core_47_error__ && $__quiver_45_core_47_error__.__esModule && $__quiver_45_core_47_error__ || {default: $__quiver_45_core_47_error__}).error;
var async = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}).async;
var pushbackStream = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}).pushbackStream;
var streamFilter = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).streamFilter;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var indexOf = buffertools.indexOf;
var extractStreamHead = async($traceurRuntime.initGeneratorFunction(function $__11(readStream, separator) {
  var $__7,
      options,
      $__6,
      maxLength,
      limit,
      headBuffer,
      $__8,
      closed,
      data,
      previousBufferSize,
      separatorIndex,
      headContent,
      restIndex,
      restBuffer,
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
          $__6 = options, maxLength = ($__7 = $__6.maxLength) === void 0 ? -1 : $__7;
          limit = maxLength > 0;
          if (!Buffer.isBuffer(separator))
            separator = new Buffer(separator);
          headBuffer = new Buffer(0);
          $ctx.state = 25;
          break;
        case 25:
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
          $__8 = $__14;
          $__15 = $__8.closed;
          closed = $__15;
          $__16 = $__8.data;
          data = $__16;
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
          $ctx.state = (data.length == 0) ? 25 : 15;
          break;
        case 15:
          previousBufferSize = headBuffer.length;
          headBuffer = Buffer.concat([headBuffer, data]);
          separatorIndex = indexOf(headBuffer, separator);
          $ctx.state = 20;
          break;
        case 20:
          $ctx.state = (separatorIndex != -1) ? 11 : 10;
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
        case 10:
          if (limit && headBuffer.length > maxLength)
            throw error(413, 'Request Entity Too Large');
          $ctx.state = 25;
          break;
        default:
          return $ctx.end();
      }
  }, $__11, this);
}));
var extractFixedStreamHead = async($traceurRuntime.initGeneratorFunction(function $__17(readStream, size) {
  var remaining,
      headBuffers,
      $__6,
      closed,
      data,
      bufferSize,
      $__18,
      $__19,
      $__20,
      $__21,
      $__22;
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
          $__18 = readStream.read;
          $__19 = $__18.call(readStream);
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
          $__21 = $__6.closed;
          closed = $__21;
          $__22 = $__6.data;
          data = $__22;
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
  }, $__17, this);
}));
var headerExtractFilter = streamFilter((function(config, handler) {
  var $__8,
      $__7;
  var $__6 = config,
      headerSeparator = ($__8 = $__6.headerSeparator) === void 0 ? '\r\n\r\n' : $__8,
      streamHeadMaxLength = ($__7 = $__6.streamHeadMaxLength) === void 0 ? -1 : $__7;
  if (!Buffer.isBuffer(separator))
    separator = new Buffer(separator);
  var extractOptions = {maxLength: streamHeadMaxLength};
  return (function(args, inputStreamable) {
    return inputStreamable.toStream.then((function(readStream) {
      return extractStreamHead(readStream, separator, extractOptions);
    })).then((function($__9) {
      var $__10 = $__9,
          header = $__10[0],
          readStream = $__10[1];
      args.header = header;
      var streamable = streamToStreamable(readStream);
      return handler(args, streamable);
    }));
  });
}));
var makeHeaderExtractFilter = headerExtractFilter.factory();

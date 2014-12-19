"use strict";
Object.defineProperties(exports, {
  convertStream: {get: function() {
      return convertStream;
    }},
  bufferConvertHandler: {get: function() {
      return bufferConvertHandler;
    }},
  bufferConvertFilter: {get: function() {
      return bufferConvertFilter;
    }},
  makeBufferConvertHandler: {get: function() {
      return makeBufferConvertHandler;
    }},
  makeBufferConvertFilter: {get: function() {
      return makeBufferConvertFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_stream_45_util__,
    $__quiver_45_core_47_component__,
    $__stream__;
var async = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}).async;
var createChannel = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}).createChannel;
var $__2 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    simpleHandlerBuilder = $__2.simpleHandlerBuilder,
    configMiddleware = $__2.configMiddleware;
var makeStreamConvertFilter = ($__stream__ = require("./stream"), $__stream__ && $__stream__.__esModule && $__stream__ || {default: $__stream__}).makeStreamConvertFilter;
var pipeConvert = async($traceurRuntime.initGeneratorFunction(function $__6(converter, readStream, writeStream) {
  var closed,
      $__5,
      data,
      converted,
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
  }, $__6, this);
}));
var convertStream = (function(converter, inputStream) {
  var $__4 = createChannel(),
      readStream = $__4.readStream,
      writeStream = $__4.writeStream;
  pipeConvert(converter, inputStream, writeStream).catch((function(err) {}));
  return readStream;
});
var bufferConvertHandler = simpleHandlerBuilder((function(config) {
  var bufferConverter = config.bufferConverter;
  if (!bufferConverter)
    throw new Error('config.bufferConverter() required');
  return (function(args, inputStream) {
    return convertStream(bufferConverter, inputStream);
  });
}), 'stream', 'stream');
var bufferConvertFilter = makeStreamConvertFilter().middleware(configMiddleware((function(config) {
  var bufferConverter = config.bufferConverter;
  if (!bufferConverter)
    throw new Error('config.bufferConverter() required');
  config.streamConverter = (function(readStream) {
    return convertStream(bufferConverter, readStream);
  });
})));
var makeBufferConvertHandler = bufferConvertHandler.factory();
var makeBufferConvertFilter = bufferConvertFilter.factory();

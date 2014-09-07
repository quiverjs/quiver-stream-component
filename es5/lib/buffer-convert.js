"use strict";
Object.defineProperties(exports, {
  bufferConvertHandler: {get: function() {
      return bufferConvertHandler;
    }},
  bufferConvertFilter: {get: function() {
      return bufferConvertFilter;
    }},
  bufferStreamFilter: {get: function() {
      return bufferStreamFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $__quiver_45_component__;
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var createChannel = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).createChannel;
var $__2 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandler = $__2.simpleHandler,
    streamHandler = $__2.streamHandler,
    streamFilter = $__2.streamFilter;
var pipeConvert = async($traceurRuntime.initGeneratorFunction(function $__4(converter, readStream, writeStream) {
  var closed,
      $__3,
      data,
      converted,
      $__5,
      $__6,
      $__7,
      $__8,
      err,
      $__9,
      $__10,
      $__11,
      $__12,
      $__13;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (true) ? 13 : -2;
          break;
        case 13:
          $ctx.pushTry(11, null);
          $ctx.state = 14;
          break;
        case 14:
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
          $__9 = readStream.read;
          $__10 = $__9.call(readStream);
          $ctx.state = 26;
          break;
        case 26:
          $ctx.state = 22;
          return $__10;
        case 22:
          $__11 = $ctx.sent;
          $ctx.state = 24;
          break;
        case 24:
          $__3 = $__11;
          $__12 = $__3.closed;
          closed = $__12;
          $__13 = $__3.data;
          data = $__13;
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
          $ctx.state = (closed) ? 38 : 39;
          break;
        case 38:
          $ctx.returnValue = writeStream.closeWrite();
          $ctx.state = -2;
          break;
        case 39:
          $ctx.pushTry(49, null);
          $ctx.state = 52;
          break;
        case 52:
          $ctx.state = 42;
          return converter(data);
        case 42:
          converted = $ctx.sent;
          $ctx.state = 44;
          break;
        case 44:
          $ctx.popTry();
          $ctx.state = 54;
          break;
        case 49:
          $ctx.popTry();
          err = $ctx.storedException;
          $ctx.state = 47;
          break;
        case 47:
          writeStream.closeWrite(err);
          readStream.closeRead(err);
          $ctx.state = 48;
          break;
        case 48:
          $ctx.state = -2;
          break;
        case 54:
          try {
            writeStream.write(converted);
          } catch (err) {
            readStream.closeRead(err);
          }
          $ctx.state = 0;
          break;
        default:
          return $ctx.end();
      }
  }, $__4, this);
}));
var convertStream = (function(converter, inputStream) {
  var $__3 = createChannel(),
      readStream = $__3.readStream,
      writeStream = $__3.writeStream;
  pipeConvert(converter, inputStream, writeStream).catch((function(err) {}));
  return readStream;
});
var convertStreamable = (function(converter, streamable, replace) {
  var originalToStream = streamable.toStream;
  if (!originalToStream)
    throw new Error('streamable do not have toStream() method');
  var convertedToStream = (function() {
    return originalToStream().then((function(readStream) {
      return convertStream(converter, readStream);
    }));
  });
  if (replace) {
    streamable.toStream = convertedToStream;
    return streamable;
  } else {
    return {toStream: convertedToStream};
  }
});
var ensureBuffer = (function(data) {
  return Buffer.isBuffer(data) ? data : new Buffer(data);
});
var bufferizeStreamable = (function(streamable) {
  if (streamable.bufferMode)
    return streamable;
  var newStreamable = convertStreamable(ensureBuffer, streamable, true);
  newStreamable.bufferMode = true;
  return newStreamable;
});
var bufferConvertHandler = (function(converter) {
  return simpleHandler((function(args, inputStream) {
    return convertStream(converter, inputStream);
  }), 'stream', 'stream');
});
var bufferConvertFilter = (function(converter, mode) {
  var replace = arguments[2] !== (void 0) ? arguments[2] : false;
  var inMode = (mode == 'in' || mode == 'inout');
  var outMode = (mode == 'out' || mode == 'inout');
  return streamFilter((function(config, handler) {
    return (function(args, inputStreamable) {
      if (inMode) {
        inputStreamable = convertStreamable(converter, inputStreamable, replace);
      }
      return handler(args, inputStreamable).then((function(resultStreamable) {
        if (!outMode)
          return resultStreamable;
        return convertStreamable(converter, resultStreamable, replace);
      }));
    });
  }));
});
var bufferStreamFilter = streamFilter((function(config, handler) {
  return (function(args, inputStreamable) {
    return handler(args, bufferizeStreamable(inputStreamable)).then(bufferizeStreamable);
  });
}));

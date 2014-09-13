"use strict";
Object.defineProperties(exports, {
  checksumStream: {get: function() {
      return checksumStream;
    }},
  checksumHandler: {get: function() {
      return checksumHandler;
    }},
  __esModule: {value: true}
});
var $__crypto__,
    $__quiver_45_promise__,
    $__quiver_45_component__;
var crypto = ($__crypto__ = require("crypto"), $__crypto__ && $__crypto__.__esModule && $__crypto__ || {default: $__crypto__}).default;
var $__3 = crypto,
    createHash = $__3.createHash,
    getHashes = $__3.getHashes;
var $__1 = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}),
    async = $__1.async,
    reject = $__1.reject;
var simpleHandlerBuilder = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).simpleHandlerBuilder;
var checksumStream = async($traceurRuntime.initGeneratorFunction(function $__4(readStream, algorithm) {
  var checksum,
      $__3,
      closed,
      data,
      $__5,
      $__6,
      $__7,
      $__8,
      $__9;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          checksum = createHash(algorithm);
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = (true) ? 5 : -2;
          break;
        case 5:
          $__5 = readStream.read;
          $__6 = $__5.call(readStream);
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
          $__3 = $__7;
          $__8 = $__3.closed;
          closed = $__8;
          $__9 = $__3.data;
          data = $__9;
          $ctx.state = 8;
          break;
        case 8:
          $ctx.state = (closed) ? 9 : 10;
          break;
        case 9:
          $ctx.returnValue = checksum.digest('hex');
          $ctx.state = -2;
          break;
        case 10:
          checksum.update(data);
          $ctx.state = 16;
          break;
        default:
          return $ctx.end();
      }
  }, $__4, this);
}));
var checksumHandler = (function(algorithm) {
  if (typeof algorithm != 'string')
    throw new Error('Missing checksum algorithm');
  var checksumField = 'checksum-' + algorithm;
  return simpleHandlerBuilder((function(config) {
    if (getHashes().indexOf(algorithm) == -1)
      return reject(error(500, 'platform do not ' + 'support checksum algorithm ' + algorithm));
    return async($traceurRuntime.initGeneratorFunction(function $__10(args, streamable) {
      var readStream;
      return $traceurRuntime.createGeneratorInstance(function($ctx) {
        while (true)
          switch ($ctx.state) {
            case 0:
              $ctx.state = (streamable[$traceurRuntime.toProperty(checksumField)]) ? 1 : 2;
              break;
            case 1:
              $ctx.returnValue = streamable[$traceurRuntime.toProperty(checksumField)];
              $ctx.state = -2;
              break;
            case 2:
              $ctx.state = 5;
              return streamable.toStream();
            case 5:
              readStream = $ctx.sent;
              $ctx.state = 7;
              break;
            case 7:
              $ctx.returnValue = checksumStream(readStream, algorithm);
              $ctx.state = -2;
              break;
            default:
              return $ctx.end();
          }
      }, $__10, this);
    }));
  }), 'streamable', 'text');
});

"use strict";
Object.defineProperties(exports, {
  checksumStream: {get: function() {
      return checksumStream;
    }},
  checksumStreamable: {get: function() {
      return checksumStreamable;
    }},
  checksumHandler: {get: function() {
      return checksumHandler;
    }},
  makeChecksumHandler: {get: function() {
      return makeChecksumHandler;
    }},
  __esModule: {value: true}
});
var $__crypto__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__;
var crypto = ($__crypto__ = require("crypto"), $__crypto__ && $__crypto__.__esModule && $__crypto__ || {default: $__crypto__}).default;
var $__3 = crypto,
    createHash = $__3.createHash,
    getHashes = $__3.getHashes;
var $__1 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    async = $__1.async,
    reject = $__1.reject;
var simpleHandlerBuilder = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).simpleHandlerBuilder;
var checksumStream = async($traceurRuntime.initGeneratorFunction(function $__6(readStream, algorithm) {
  var checksum,
      $__4,
      closed,
      data,
      $__7,
      $__8,
      $__9,
      $__10,
      $__11;
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
          $__7 = readStream.read;
          $__8 = $__7.call(readStream);
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
          $__4 = $__9;
          $__10 = $__4.closed;
          closed = $__10;
          $__11 = $__4.data;
          data = $__11;
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
  }, $__6, this);
}));
var checksumStreamable = async($traceurRuntime.initGeneratorFunction(function $__12(streamable, algorithm, checksumField) {
  var readStream,
      checksum;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          $ctx.state = (streamable[checksumField]) ? 1 : 2;
          break;
        case 1:
          $ctx.returnValue = streamable[checksumField];
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
          $ctx.state = 9;
          return checksumStream(readStream, algorithm);
        case 9:
          checksum = $ctx.sent;
          $ctx.state = 11;
          break;
        case 11:
          if (streamable.reusable)
            streamable[checksumField] = checksum;
          $ctx.state = 15;
          break;
        case 15:
          $ctx.returnValue = checksum;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__12, this);
}));
var checksumHandler = simpleHandlerBuilder((function(config) {
  var $__5;
  var $__4 = config,
      checksumAlgorithm = ($__5 = $__4.checksumAlgorithm) === void 0 ? 'sha1' : $__5;
  var checksumField = 'checksum-' + checksumAlgorithm;
  if (getHashes().indexOf(checksumAlgorithm) == -1)
    return reject(error(500, 'platform do not ' + 'support checksum algorithm ' + checksumAlgorithm));
  return (function(args, streamable) {
    return checksumStreamable(streamable, checksumAlgorithm, checksumField);
  });
}), 'streamable', 'text');
var makeChecksumHandler = checksumHandler.factory();

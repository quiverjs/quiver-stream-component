"use strict";
Object.defineProperties(exports, {
  compressorTable: {get: function() {
      return compressorTable;
    }},
  compressField: {get: function() {
      return compressField;
    }},
  compressStream: {get: function() {
      return compressStream;
    }},
  compressStreamable: {get: function() {
      return compressStreamable;
    }},
  compressHandler: {get: function() {
      return compressHandler;
    }},
  makeCompressHandler: {get: function() {
      return makeCompressHandler;
    }},
  __esModule: {value: true}
});
var $__zlib__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__quiver_45_core_47_stream_45_util__;
var zlib = ($__zlib__ = require("zlib"), $__zlib__ && $__zlib__.__esModule && $__zlib__ || {default: $__zlib__}).default;
var $__1 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    async = $__1.async,
    resolve = $__1.resolve;
var streamHandlerBuilder = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).streamHandlerBuilder;
var $__3 = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}),
    pipeStream = $__3.pipeStream,
    reuseStream = $__3.reuseStream,
    streamToStreamable = $__3.streamToStreamable,
    nodeToQuiverReadStream = $__3.nodeToQuiverReadStream,
    nodeToQuiverWriteStream = $__3.nodeToQuiverWriteStream;
var compressorTable = {
  gzip: zlib.createGzip,
  gunzip: zlib.createGunzip,
  deflate: zlib.createDeflate,
  inflate: zlib.createInflate,
  unzip: zlib.createUnzip
};
var compressFieldTable = {
  gzip: 'toGzipStreamable',
  gunzip: 'toGunzipStreamable',
  deflate: 'toDeflateStreamable',
  inflate: 'toInflateStreamable',
  unzip: 'toUnzipStreamable'
};
var compressField = (function(algorithm) {
  return compressFieldTable[algorithm];
});
var pipeNodeTransform = (function(readStream, nodeStream) {
  var writeStream = nodeToQuiverWriteStream(nodeStream);
  var resultStream = nodeToQuiverReadStream(nodeStream);
  pipeStream(readStream, writeStream);
  return resultStream;
});
var compressStream = (function(algorithm, readStream) {
  var createCompressor = compressorTable[algorithm];
  if (!createCompressor)
    throw new Error('invalid compression algorithm');
  var compressor = createCompressor();
  return pipeNodeTransform(readStream, compressor);
});
var compressStreamable = async($traceurRuntime.initGeneratorFunction(function $__6(algorithm, streamable) {
  var toCompressStreamable,
      readStream,
      compressedStream,
      compressedStreamable;
  var $arguments = arguments;
  return $traceurRuntime.createGeneratorInstance(function($ctx) {
    while (true)
      switch ($ctx.state) {
        case 0:
          toCompressStreamable = $arguments[2] !== (void 0) ? $arguments[2] : compressField(algorithm);
          $ctx.state = 14;
          break;
        case 14:
          $ctx.state = (streamable[toCompressStreamable]) ? 1 : 2;
          break;
        case 1:
          $ctx.returnValue = streamable[toCompressStreamable]();
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
          compressedStream = compressStream(algorithm, readStream);
          $ctx.state = 16;
          break;
        case 16:
          $ctx.state = (!streamable.reusable) ? 8 : 9;
          break;
        case 8:
          $ctx.returnValue = streamToStreamable(compressedStream);
          $ctx.state = -2;
          break;
        case 9:
          compressedStreamable = reuseStream(compressedStream);
          streamable[toCompressStreamable] = (function() {
            return resolve(compressedStreamable);
          });
          $ctx.state = 18;
          break;
        case 18:
          $ctx.returnValue = compressedStreamable;
          $ctx.state = -2;
          break;
        default:
          return $ctx.end();
      }
  }, $__6, this);
}));
var compressHandler = streamHandlerBuilder((function(config) {
  var $__5;
  var $__4 = config,
      compressAlgorithm = ($__5 = $__4.compressAlgorithm) === void 0 ? 'gzip' : $__5;
  if (!compressorTable[compressAlgorithm])
    throw new Error('invalid compression algorithm');
  var field = compressField(compressAlgorithm);
  return (function(args, inputStreamable) {
    return compressStreamable(compressAlgorithm, inputStreamable, field);
  });
}));
var makeCompressHandler = compressHandler.factory();

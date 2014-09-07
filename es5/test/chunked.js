"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_chunked_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamToText = $__1.streamToText,
    buffersToStream = $__1.buffersToStream;
var $__2 = ($___46__46__47_lib_47_chunked_46_js__ = require("../lib/chunked.js"), $___46__46__47_lib_47_chunked_46_js__ && $___46__46__47_lib_47_chunked_46_js__.__esModule && $___46__46__47_lib_47_chunked_46_js__ || {default: $___46__46__47_lib_47_chunked_46_js__}),
    streamToChunkedStream = $__2.streamToChunkedStream,
    streamToUnchunkedStream = $__2.streamToUnchunkedStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('chunked stream test', (function() {
  it('simple stream to chunked stream', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var testBuffers,
        testChunkedContent,
        readStream,
        chunkedStream;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['hello', 'javascript definitely rocks'];
            testChunkedContent = '5\r\nhello\r\n' + '1b\r\njavascript definitely rocks\r\n' + '0\r\n\r\n';
            readStream = buffersToStream(testBuffers);
            chunkedStream = streamToChunkedStream(readStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToText(chunkedStream).should.eventually.equal(testChunkedContent);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
  it('simple chunked stream to stream', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var testBuffers,
        testContent,
        readStream,
        unchunkedStream;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['6', '\r\n', 'hello ', '\r\n', '1b', '\r\n', 'javascript definitely rocks', '\r\n', '0', '\r\n', '\r\n'];
            testContent = 'hello javascript definitely rocks';
            readStream = buffersToStream(testBuffers);
            unchunkedStream = streamToUnchunkedStream(readStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToText(unchunkedStream).should.eventually.equal(testContent);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
  it('bad chunked stream test', async($traceurRuntime.initGeneratorFunction(function $__7() {
    var testBuffers;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = (function(buffers) {
              var readStream = buffersToStream(buffers);
              var unchunkedStream = streamToUnchunkedStream(readStream);
              return streamToText(unchunkedStream).should.be.rejected;
            });
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return testBuffers(['3', '\r\n', 'hello', '\r\n', '0', '\r\n', '\r\n']);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return testBuffers(['5\r\n', 'hello', '\r\n', '0', '\r\n']);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return testBuffers(['5\r\n', 'hello', '\r\n']);
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  })));
  it('complex chunked stream to stream', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var testBuffers,
        testContent,
        readStream,
        unchunkedStream;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['6\r', '\nhello \r', '\n1', 'b\r', '\njava', 'script definitely ', 'rocks\r\n0', '\r\n\r', '\n'];
            testContent = 'hello javascript definitely rocks';
            readStream = buffersToStream(testBuffers);
            unchunkedStream = streamToUnchunkedStream(readStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToText(unchunkedStream).should.eventually.equal(testContent);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
  it('combined chunk unchunk test', async($traceurRuntime.initGeneratorFunction(function $__9() {
    var unicodeBuffer,
        testBuffers,
        originalStream,
        chunkedStream,
        unchunkedStream;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            unicodeBuffer = new Buffer('世界你好');
            testBuffers = ['first ', 'second ', unicodeBuffer.slice(0, 5), unicodeBuffer.slice(5, 12), ' third ', 'fourth ', 'fifth'];
            originalStream = buffersToStream(testBuffers);
            chunkedStream = streamToChunkedStream(originalStream);
            unchunkedStream = streamToUnchunkedStream(chunkedStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToText(unchunkedStream).should.eventually.equal('first second 世界你好 third fourth fifth');
          case 2:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__9, this);
  })));
}));

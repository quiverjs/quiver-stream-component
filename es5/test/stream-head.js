"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_stream_45_head_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    streamToText = $__1.streamToText,
    buffersToStream = $__1.buffersToStream;
var $__2 = ($___46__46__47_lib_47_stream_45_head_46_js__ = require("../lib/stream-head.js"), $___46__46__47_lib_47_stream_45_head_46_js__ && $___46__46__47_lib_47_stream_45_head_46_js__.__esModule && $___46__46__47_lib_47_stream_45_head_46_js__ || {default: $___46__46__47_lib_47_stream_45_head_46_js__}),
    extractStreamHead = $__2.extractStreamHead,
    extractFixedStreamHead = $__2.extractFixedStreamHead;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('fixed head extractor test', (function() {
  it('trivial fixed head', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var testBuffers,
        readStream,
        $__5,
        head,
        restStream,
        $__7,
        $__8,
        $__9,
        $__10;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['1234', 'hello ', 'world'];
            readStream = buffersToStream(testBuffers);
            $ctx.state = 14;
            break;
          case 14:
            $__7 = extractFixedStreamHead(readStream, 4);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__7;
          case 2:
            $__8 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__5 = $__8;
            $__9 = $__5[0];
            head = $__9;
            $__10 = $__5[1];
            restStream = $__10;
            $ctx.state = 8;
            break;
          case 8:
            head.toString().should.equal('1234');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(restStream).should.eventually.equal('hello world');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
  it('multiple fixed head', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var testBuffers,
        readStream,
        $__5,
        head,
        restStream,
        $__12,
        $__13,
        $__14,
        $__15;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['12', '3', '4hello ', 'world'];
            readStream = buffersToStream(testBuffers);
            $ctx.state = 14;
            break;
          case 14:
            $__12 = extractFixedStreamHead(readStream, 4);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__12;
          case 2:
            $__13 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__5 = $__13;
            $__14 = $__5[0];
            head = $__14;
            $__15 = $__5[1];
            restStream = $__15;
            $ctx.state = 8;
            break;
          case 8:
            head.toString().should.equal('1234');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(restStream).should.eventually.equal('hello world');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })));
  it('unicode fixed head', async($traceurRuntime.initGeneratorFunction(function $__16() {
    var testHead,
        testHeadBuffer,
        testBuffers,
        readStream,
        $__5,
        head,
        restStream,
        $__17,
        $__18,
        $__19,
        $__20;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testHead = '世界你好';
            testHeadBuffer = new Buffer(testHead);
            testBuffers = [testHeadBuffer.slice(0, 5), testHeadBuffer.slice(5, 10), Buffer.concat([testHeadBuffer.slice(10, 12), new Buffer('hell')]), 'o world'];
            readStream = buffersToStream(testBuffers);
            $ctx.state = 14;
            break;
          case 14:
            $__17 = extractFixedStreamHead(readStream, 12);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__17;
          case 2:
            $__18 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__5 = $__18;
            $__19 = $__5[0];
            head = $__19;
            $__20 = $__5[1];
            restStream = $__20;
            $ctx.state = 8;
            break;
          case 8:
            head.toString().should.equal(testHead);
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(restStream).should.eventually.equal('hello world');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__16, this);
  })));
}));
describe('stream head dream extractor test', (function() {
  it('simple test', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var testBuffers;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = async($traceurRuntime.initGeneratorFunction(function $__11(buffers) {
              var readStream,
                  $__5,
                  head,
                  restStream,
                  $__21,
                  $__22,
                  $__23,
                  $__24;
              return $traceurRuntime.createGeneratorInstance(function($ctx) {
                while (true)
                  switch ($ctx.state) {
                    case 0:
                      readStream = buffersToStream(buffers);
                      $ctx.state = 14;
                      break;
                    case 14:
                      $__21 = extractStreamHead(readStream, '::');
                      $ctx.state = 6;
                      break;
                    case 6:
                      $ctx.state = 2;
                      return $__21;
                    case 2:
                      $__22 = $ctx.sent;
                      $ctx.state = 4;
                      break;
                    case 4:
                      $__5 = $__22;
                      $__23 = $__5[0];
                      head = $__23;
                      $__24 = $__5[1];
                      restStream = $__24;
                      $ctx.state = 8;
                      break;
                    case 8:
                      head.toString().should.equal('hello world');
                      $ctx.state = 16;
                      break;
                    case 16:
                      $ctx.state = 10;
                      return streamToText(restStream).should.eventually.equal('goodbye dream');
                    case 10:
                      $ctx.maybeThrow();
                      $ctx.state = -2;
                      break;
                    default:
                      return $ctx.end();
                  }
              }, $__11, this);
            }));
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return testBuffers(['hello ', 'world', '::', 'goodbye ', 'dream']);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return testBuffers(['hello ', 'world::goodbye ', 'dream']);
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return testBuffers(['hello ', 'world:', ':goodbye ', 'dream']);
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
  it('test beginning separate', async($traceurRuntime.initGeneratorFunction(function $__11() {
    var testBuffers,
        readStream,
        $__5,
        head,
        restStream,
        $__25,
        $__26,
        $__27,
        $__28;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = [':', ':hello ', 'world'];
            readStream = buffersToStream(testBuffers);
            $ctx.state = 14;
            break;
          case 14:
            $__25 = extractStreamHead(readStream, '::');
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
            $__5 = $__26;
            $__27 = $__5[0];
            head = $__27;
            $__28 = $__5[1];
            restStream = $__28;
            $ctx.state = 8;
            break;
          case 8:
            head.length.should.equal(0);
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return streamToText(restStream).should.eventually.equal('hello world');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__11, this);
  })));
}));

"use strict";
var $__traceur_64_0_46_0_46_6__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_stream_45_component_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var buffersToStream = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).buffersToStream;
var sizeWindowedStream = ($___46__46__47_lib_47_stream_45_component_46_js__ = require("../lib/stream-component.js"), $___46__46__47_lib_47_stream_45_component_46_js__ && $___46__46__47_lib_47_stream_45_component_46_js__.__esModule && $___46__46__47_lib_47_stream_45_component_46_js__ || {default: $___46__46__47_lib_47_stream_45_component_46_js__}).sizeWindowedStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('size windowed buffer test', (function() {
  var assertBuffer = (function(readStream, expected) {
    return readStream.read().then((function($__5) {
      var $__6 = $__5,
          closed = $__6.closed,
          data = $__6.data;
      return data.toString();
    })).should.eventually.equal(expected);
  });
  it('basic test', async($traceurRuntime.initGeneratorFunction(function $__7() {
    var testBuffers,
        readStream,
        $__5,
        closed,
        data,
        $__8,
        $__9,
        $__10,
        $__11,
        $__12;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            testBuffers = ['Foo', 'Hello World', 'Yo', 'Lorem ipsum dolo'];
            readStream = buffersToStream(testBuffers);
            readStream = sizeWindowedStream(readStream, 3, 5);
            $ctx.state = 42;
            break;
          case 42:
            $ctx.state = 2;
            return assertBuffer(readStream, 'Foo');
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return assertBuffer(readStream, 'Hello');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return assertBuffer(readStream, ' Worl');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 14;
            return assertBuffer(readStream, 'dYo');
          case 14:
            $ctx.maybeThrow();
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 18;
            return assertBuffer(readStream, 'Lorem');
          case 18:
            $ctx.maybeThrow();
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return assertBuffer(readStream, ' ipsu');
          case 22:
            $ctx.maybeThrow();
            $ctx.state = 24;
            break;
          case 24:
            $ctx.state = 26;
            return assertBuffer(readStream, 'm dol');
          case 26:
            $ctx.maybeThrow();
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return assertBuffer(readStream, 'o');
          case 30:
            $ctx.maybeThrow();
            $ctx.state = 32;
            break;
          case 32:
            $__8 = readStream.read;
            $__9 = $__8.call(readStream);
            $ctx.state = 38;
            break;
          case 38:
            $ctx.state = 34;
            return $__9;
          case 34:
            $__10 = $ctx.sent;
            $ctx.state = 36;
            break;
          case 36:
            $__5 = $__10;
            $__11 = $__5.closed;
            closed = $__11;
            $__12 = $__5.data;
            data = $__12;
            $ctx.state = 40;
            break;
          case 40:
            should.exist(closed);
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  })));
}));

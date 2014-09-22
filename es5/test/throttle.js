"use strict";
var $__traceur_64_0_46_0_46_6__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_throttle_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_6__ = require("traceur"), $__traceur_64_0_46_0_46_6__ && $__traceur_64_0_46_0_46_6__.__esModule && $__traceur_64_0_46_0_46_6__ || {default: $__traceur_64_0_46_0_46_6__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    buffersToStream = $__1.buffersToStream,
    streamToBuffers = $__1.streamToBuffers;
var throttledStream = ($___46__46__47_lib_47_throttle_46_js__ = require("../lib/throttle.js"), $___46__46__47_lib_47_throttle_46_js__ && $___46__46__47_lib_47_throttle_46_js__.__esModule && $___46__46__47_lib_47_throttle_46_js__ || {default: $___46__46__47_lib_47_throttle_46_js__}).throttledStream;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var testRate = 1024;
var testBuffers = [];
for (var i = 0; i < 10; i++) {
  testBuffers.push(new Buffer(128));
}
describe('throttle test', (function() {
  it('basic throttle', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var readStream,
        start,
        end,
        diff;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            readStream = buffersToStream(testBuffers);
            readStream = throttledStream(readStream, testRate);
            start = Date.now();
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return streamToBuffers(readStream).should.eventually.eql(testBuffers);
          case 2:
            $ctx.maybeThrow();
            $ctx.state = 4;
            break;
          case 4:
            end = Date.now();
            diff = end - start;
            if (diff < 1000 || diff > 1500) {
              throw new Error('Expect throttled stream to finish in 1 second');
            }
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
}));

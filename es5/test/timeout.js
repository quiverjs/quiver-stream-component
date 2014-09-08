"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_component__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_timeout_46_js__,
    $___46__46__47_lib_47_component_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandler = $__1.simpleHandler,
    loadStreamHandler = $__1.loadStreamHandler;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    createChannel = $__2.createChannel,
    textToStreamable = $__2.textToStreamable,
    streamableToText = $__2.streamableToText,
    streamToStreamable = $__2.streamToStreamable;
var timeoutStream = ($___46__46__47_lib_47_timeout_46_js__ = require("../lib/timeout.js"), $___46__46__47_lib_47_timeout_46_js__ && $___46__46__47_lib_47_timeout_46_js__.__esModule && $___46__46__47_lib_47_timeout_46_js__ || {default: $___46__46__47_lib_47_timeout_46_js__}).timeoutStream;
var timeoutStreamFilter = ($___46__46__47_lib_47_component_46_js__ = require("../lib/component.js"), $___46__46__47_lib_47_component_46_js__ && $___46__46__47_lib_47_component_46_js__.__esModule && $___46__46__47_lib_47_component_46_js__ || {default: $___46__46__47_lib_47_component_46_js__}).timeoutStreamFilter;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('timeout stream test', (function() {
  it('basic test', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var $__7,
        readStream,
        writeStream,
        closed,
        data,
        $__9,
        $__10,
        $__11,
        $__12,
        $__13;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $__7 = createChannel(), readStream = $__7.readStream, writeStream = $__7.writeStream;
            readStream = timeoutStream(readStream, 100);
            writeStream.write('foo');
            $ctx.state = 14;
            break;
          case 14:
            $__9 = readStream.read;
            $__10 = $__9.call(readStream);
            $ctx.state = 6;
            break;
          case 6:
            $ctx.state = 2;
            return $__10;
          case 2:
            $__11 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $__7 = $__11;
            $__12 = $__7.closed;
            closed = $__12;
            $__13 = $__7.data;
            data = $__13;
            $ctx.state = 8;
            break;
          case 8:
            data.should.equal('foo');
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return readStream.read().should.be.rejected;
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
  it('timeout filter test', async($traceurRuntime.initGeneratorFunction(function $__14() {
    var component,
        handler,
        $__7,
        readStream,
        writeStream,
        streamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            component = simpleHandler((function(args, name) {
              return 'Hello, ' + name;
            }), 'text', 'text').addMiddleware(timeoutStreamFilter('in'));
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return loadStreamHandler({streamTimeout: 100}, component);
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, textToStreamable('World')).then(streamableToText).should.eventually.equal('Hello, World');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $__7 = createChannel(), readStream = $__7.readStream, writeStream = $__7.writeStream;
            writeStream.write('foo');
            streamable = streamToStreamable(readStream);
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return handler({}, streamable).should.be.rejected;
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__14, this);
  })));
}));

"use strict";
var $__quiver_45_core_47_traceur__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__quiver_45_core_47_stream_45_util__,
    $___46__46__47_lib_47_stream_45_component__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__quiver_45_core_47_traceur__ = require("quiver-core/traceur"), $__quiver_45_core_47_traceur__ && $__quiver_45_core_47_traceur__.__esModule && $__quiver_45_core_47_traceur__ || {default: $__quiver_45_core_47_traceur__});
var async = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}).async;
var $__1 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    simpleHandler = $__1.simpleHandler,
    simpleHandlerLoader = $__1.simpleHandlerLoader;
var $__2 = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}),
    textToStream = $__2.textToStream,
    streamToText = $__2.streamToText,
    buffersToStream = $__2.buffersToStream;
var $__3 = ($___46__46__47_lib_47_stream_45_component__ = require("../lib/stream-component"), $___46__46__47_lib_47_stream_45_component__ && $___46__46__47_lib_47_stream_45_component__.__esModule && $___46__46__47_lib_47_stream_45_component__ || {default: $___46__46__47_lib_47_stream_45_component__}),
    bufferConvertHandler = $__3.bufferConvertHandler,
    bufferConvertFilter = $__3.bufferConvertFilter,
    bufferStreamFilter = $__3.bufferStreamFilter;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('buffer convert test', (function() {
  it('uppercase handler', async($traceurRuntime.initGeneratorFunction(function $__6() {
    var toUpperCase,
        component,
        handler,
        inputStreamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            toUpperCase = (function(data) {
              return data.toString().toUpperCase();
            });
            component = bufferConvertHandler().configOverride({bufferConverter: toUpperCase});
            $ctx.state = 14;
            break;
          case 14:
            $ctx.state = 2;
            return component.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, textToStream('Hello World')).then(streamToText).should.eventually.equal('HELLO WORLD');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            inputStreamable = buffersToStream(['Hell', 'o Wo', 'rld']);
            $ctx.state = 16;
            break;
          case 16:
            $ctx.state = 10;
            return handler({}, inputStreamable).then(streamToText).should.eventually.equal('HELLO WORLD');
          case 10:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__6, this);
  })));
  it('filter convert test', async($traceurRuntime.initGeneratorFunction(function $__7() {
    var toUpperCase,
        toLowerCase,
        inFilter,
        outFilter,
        component,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            toUpperCase = (function(data) {
              return data.toString().toUpperCase();
            });
            toLowerCase = (function(data) {
              return data.toString().toLowerCase();
            });
            inFilter = bufferConvertFilter().configOverride({
              filterMode: 'in',
              bufferConverter: toUpperCase
            });
            outFilter = bufferConvertFilter().configOverride({
              filterMode: 'out',
              bufferConverter: toLowerCase
            });
            component = simpleHandler((function(args, name) {
              name.should.equal('JOHN');
              return 'Hello, ' + name;
            }), 'text', 'text').middleware(inFilter).middleware(outFilter);
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return component.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler({}, 'John').should.eventually.equal('hello, john');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__7, this);
  })));
}));

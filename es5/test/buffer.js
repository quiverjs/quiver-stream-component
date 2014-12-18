"use strict";
var $__traceur_64_0_46_0_46_7__,
    $__quiver_45_promise__,
    $__quiver_45_component__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_stream_45_component__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_7__ = require("traceur"), $__traceur_64_0_46_0_46_7__ && $__traceur_64_0_46_0_46_7__.__esModule && $__traceur_64_0_46_0_46_7__ || {default: $__traceur_64_0_46_0_46_7__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var $__1 = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}),
    simpleHandler = $__1.simpleHandler,
    loadSimpleHandler = $__1.loadSimpleHandler;
var $__2 = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}),
    buffersToStreamable = $__2.buffersToStreamable,
    streamableToText = $__2.streamableToText;
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
        handler1,
        handler2,
        inputStreamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            toUpperCase = (function(data) {
              return data.toString().toUpperCase();
            });
            component = bufferConvertHandler(toUpperCase);
            $ctx.state = 18;
            break;
          case 18:
            $ctx.state = 2;
            return loadSimpleHandler({}, component, 'text', 'text');
          case 2:
            handler1 = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return handler1({}, 'Hello World').should.eventually.equal('HELLO WORLD');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = 8;
            break;
          case 8:
            $ctx.state = 10;
            return loadSimpleHandler({}, component, 'streamable', 'text');
          case 10:
            handler2 = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            inputStreamable = buffersToStreamable(['Hell', 'o Wo', 'rld']);
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 14;
            return handler2({}, inputStreamable).should.eventually.equal('HELLO WORLD');
          case 14:
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
            component = simpleHandler((function(args, name) {
              name.should.equal('JOHN');
              return 'Hello, ' + name;
            }), 'text', 'text').middleware(bufferConvertFilter(toUpperCase, 'in')).middleware(bufferConvertFilter(toLowerCase, 'out'));
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

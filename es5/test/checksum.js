"use strict";
var $__traceur_64_0_46_0_46_58__,
    $__quiver_45_promise__,
    $__quiver_45_stream_45_util__,
    $___46__46__47_lib_47_stream_45_component_46_js__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__traceur_64_0_46_0_46_58__ = require("traceur"), $__traceur_64_0_46_0_46_58__ && $__traceur_64_0_46_0_46_58__.__esModule && $__traceur_64_0_46_0_46_58__ || {default: $__traceur_64_0_46_0_46_58__});
var async = ($__quiver_45_promise__ = require("quiver-promise"), $__quiver_45_promise__ && $__quiver_45_promise__.__esModule && $__quiver_45_promise__ || {default: $__quiver_45_promise__}).async;
var buffersToStreamable = ($__quiver_45_stream_45_util__ = require("quiver-stream-util"), $__quiver_45_stream_45_util__ && $__quiver_45_stream_45_util__.__esModule && $__quiver_45_stream_45_util__ || {default: $__quiver_45_stream_45_util__}).buffersToStreamable;
var checksumHandler = ($___46__46__47_lib_47_stream_45_component_46_js__ = require("../lib/stream-component.js"), $___46__46__47_lib_47_stream_45_component_46_js__ && $___46__46__47_lib_47_stream_45_component_46_js__.__esModule && $___46__46__47_lib_47_stream_45_component_46_js__ || {default: $___46__46__47_lib_47_stream_45_component_46_js__}).checksumHandler;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
describe('stream checksum test', (function() {
  it('sha1sum', async($traceurRuntime.initGeneratorFunction(function $__5() {
    var main,
        handler,
        streamable;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            main = checksumHandler('sha1');
            $ctx.state = 10;
            break;
          case 10:
            $ctx.state = 2;
            return main.loadHandler({});
          case 2:
            handler = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            streamable = buffersToStreamable(['Hello ', 'World\n']);
            $ctx.state = 12;
            break;
          case 12:
            $ctx.state = 6;
            return handler({}, streamable).should.eventually.equal('648a6a6ffffdaa0badb23b8baf90b6168dd16b3a');
          case 6:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__5, this);
  })));
}));

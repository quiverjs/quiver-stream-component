"use strict";
var $__quiver_45_core_47_traceur__,
    $__zlib__,
    $__buffertools__,
    $__quiver_45_core_47_promise__,
    $__quiver_45_core_47_component__,
    $__quiver_45_core_47_stream_45_util__,
    $___46__46__47_lib_47_stream_45_component__,
    $__chai__,
    $__chai_45_as_45_promised__;
($__quiver_45_core_47_traceur__ = require("quiver-core/traceur"), $__quiver_45_core_47_traceur__ && $__quiver_45_core_47_traceur__.__esModule && $__quiver_45_core_47_traceur__ || {default: $__quiver_45_core_47_traceur__});
var zlib = ($__zlib__ = require("zlib"), $__zlib__ && $__zlib__.__esModule && $__zlib__ || {default: $__zlib__}).default;
var buffertools = ($__buffertools__ = require("buffertools"), $__buffertools__ && $__buffertools__.__esModule && $__buffertools__ || {default: $__buffertools__}).default;
var $__2 = ($__quiver_45_core_47_promise__ = require("quiver-core/promise"), $__quiver_45_core_47_promise__ && $__quiver_45_core_47_promise__.__esModule && $__quiver_45_core_47_promise__ || {default: $__quiver_45_core_47_promise__}),
    async = $__2.async,
    promisify = $__2.promisify;
var $__3 = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}),
    simpleHandler = $__3.simpleHandler,
    transformFilter = $__3.transformFilter,
    loadStreamHandler = $__3.loadStreamHandler;
var $__4 = ($__quiver_45_core_47_stream_45_util__ = require("quiver-core/stream-util"), $__quiver_45_core_47_stream_45_util__ && $__quiver_45_core_47_stream_45_util__.__esModule && $__quiver_45_core_47_stream_45_util__ || {default: $__quiver_45_core_47_stream_45_util__}),
    textToStreamable = $__4.textToStreamable,
    streamToBuffer = $__4.streamToBuffer,
    streamableToBuffer = $__4.streamableToBuffer;
var compressHandler = ($___46__46__47_lib_47_stream_45_component__ = require("../lib/stream-component"), $___46__46__47_lib_47_stream_45_component__ && $___46__46__47_lib_47_stream_45_component__.__esModule && $___46__46__47_lib_47_stream_45_component__ || {default: $___46__46__47_lib_47_stream_45_component__}).compressHandler;
var chai = ($__chai__ = require("chai"), $__chai__ && $__chai__.__esModule && $__chai__ || {default: $__chai__}).default;
var chaiAsPromised = ($__chai_45_as_45_promised__ = require("chai-as-promised"), $__chai_45_as_45_promised__ && $__chai_45_as_45_promised__.__esModule && $__chai_45_as_45_promised__ || {default: $__chai_45_as_45_promised__}).default;
chai.use(chaiAsPromised);
var should = chai.should();
var gzip = promisify(zlib.gzip);
var gunzip = promisify(zlib.gunzip);
var testContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra felis sed luctus vulputate. Vivamus imperdiet elit neque, vitae hendrerit nisl feugiat ut. Morbi et mauris a lorem placerat porta eu non quam. Vivamus felis eros, venenatis nec faucibus sed, aliquet vel justo. Nam in cursus ex. Morbi a pellentesque nunc. Aliquam quis sodales enim, id cursus turpis. Suspendisse scelerisque nulla vel placerat aliquam.';
describe('compress stream test', (function() {
  it('basic gzip compression', async($traceurRuntime.initGeneratorFunction(function $__8() {
    var compressed,
        uncompressed,
        gzipHandler,
        inputStreamable,
        resultBuffer,
        cachedStreamable,
        cachedBuffer,
        gunzipHandler,
        main,
        handler;
    return $traceurRuntime.createGeneratorInstance(function($ctx) {
      while (true)
        switch ($ctx.state) {
          case 0:
            $ctx.state = 2;
            return gzip(testContent);
          case 2:
            compressed = $ctx.sent;
            $ctx.state = 4;
            break;
          case 4:
            $ctx.state = 6;
            return gunzip(compressed);
          case 6:
            uncompressed = $ctx.sent;
            $ctx.state = 8;
            break;
          case 8:
            uncompressed.toString().should.equal(testContent);
            $ctx.state = 34;
            break;
          case 34:
            $ctx.state = 10;
            return loadStreamHandler({}, compressHandler('gzip'));
          case 10:
            gzipHandler = $ctx.sent;
            $ctx.state = 12;
            break;
          case 12:
            inputStreamable = textToStreamable(testContent);
            $ctx.state = 36;
            break;
          case 36:
            $ctx.state = 14;
            return gzipHandler({}, inputStreamable).then(streamableToBuffer);
          case 14:
            resultBuffer = $ctx.sent;
            $ctx.state = 16;
            break;
          case 16:
            should.equal(buffertools.compare(resultBuffer, compressed), 0);
            should.exist(inputStreamable.toGzipStreamable);
            $ctx.state = 38;
            break;
          case 38:
            $ctx.state = 18;
            return inputStreamable.toGzipStreamable();
          case 18:
            cachedStreamable = $ctx.sent;
            $ctx.state = 20;
            break;
          case 20:
            $ctx.state = 22;
            return cachedStreamable.toStream().then(streamToBuffer);
          case 22:
            cachedBuffer = $ctx.sent;
            $ctx.state = 24;
            break;
          case 24:
            should.equal(buffertools.compare(resultBuffer, compressed), 0);
            gzipHandler = compressHandler().configOverride({compressAlgorithm: 'gzip'});
            gunzipHandler = compressHandler().configOverride({compressAlgorithm: 'gunzip'});
            main = simpleHandler((function(args) {
              return testContent;
            }), 'void', 'text').middleware(transformFilter(gzipHandler, 'out')).middleware(transformFilter(gunzipHandler, 'out'));
            $ctx.state = 40;
            break;
          case 40:
            $ctx.state = 26;
            return main.loadHandler({});
          case 26:
            handler = $ctx.sent;
            $ctx.state = 28;
            break;
          case 28:
            $ctx.state = 30;
            return handler().should.eventually.equal(testContent);
          case 30:
            $ctx.maybeThrow();
            $ctx.state = -2;
            break;
          default:
            return $ctx.end();
        }
    }, $__8, this);
  })));
}));

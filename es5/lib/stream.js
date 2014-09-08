"use strict";
Object.defineProperties(exports, {
  convertStreamable: {get: function() {
      return convertStreamable;
    }},
  streamConvertFilter: {get: function() {
      return streamConvertFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_component__;
var streamFilter = ($__quiver_45_component__ = require("quiver-component"), $__quiver_45_component__ && $__quiver_45_component__.__esModule && $__quiver_45_component__ || {default: $__quiver_45_component__}).streamFilter;
var convertStreamable = (function(converter, streamable, inReplace) {
  var originalToStream = streamable.toStream;
  if (!originalToStream)
    throw new Error('streamable do not have toStream() method');
  var convertedToStream = (function() {
    return originalToStream().then(converter);
  });
  if (inReplace) {
    streamable.toStream = convertedToStream;
    return streamable;
  } else {
    return {toStream: convertedToStream};
  }
});
var streamableConverter = (function(streamConverter, active, inReplace) {
  if (!active)
    return (function(streamable) {
      return streamable;
    });
  return (function(streamable) {
    return convertStreamable(streamConverter, streamable, inReplace);
  });
});
var streamConvertFilter = (function(converterBuilder, mode) {
  var inReplace = arguments[2] !== (void 0) ? arguments[2] : false;
  if (!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode');
  var inMode = (mode == 'in' || mode == 'inout');
  var outMode = (mode == 'out' || mode == 'inout');
  return streamFilter((function(config, handler) {
    var converter = converterBuilder(config);
    if (!converter)
      return handler;
    var inConvert = streamableConverter(converter, inMode, inReplace);
    var outConvert = streamableConverter(converter, outMode, inReplace);
    return (function(args, inputStreamable) {
      return handler(args, inConvert(inputStreamable)).then(outConvert);
    });
  }));
});

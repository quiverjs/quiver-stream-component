"use strict";
Object.defineProperties(exports, {
  convertStreamable: {get: function() {
      return convertStreamable;
    }},
  streamConvertFilter: {get: function() {
      return streamConvertFilter;
    }},
  makeStreamConvertFilter: {get: function() {
      return makeStreamConvertFilter;
    }},
  __esModule: {value: true}
});
var $__quiver_45_core_47_component__;
var streamFilter = ($__quiver_45_core_47_component__ = require("quiver-core/component"), $__quiver_45_core_47_component__ && $__quiver_45_core_47_component__.__esModule && $__quiver_45_core_47_component__ || {default: $__quiver_45_core_47_component__}).streamFilter;
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
var streamConvertFilter = streamFilter((function(config, handler) {
  var $__2;
  var $__1 = config,
      mode = $__1.filterMode,
      streamConverter = $__1.streamConverter,
      replaceStreamable = ($__2 = $__1.replaceStreamable) === void 0 ? false : $__2;
  if (!streamConverter)
    throw new Error('config.streamConverter() required');
  if (!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode');
  var inMode = (mode == 'in' || mode == 'inout');
  var outMode = (mode == 'out' || mode == 'inout');
  var inConvert = streamableConverter(streamConverter, inMode, replaceStreamable);
  var outConvert = streamableConverter(streamConverter, outMode, replaceStreamable);
  return (function(args, inputStreamable) {
    return handler(args, inConvert(inputStreamable)).then(outConvert);
  });
}));
var makeStreamConvertFilter = streamConvertFilter.factory();

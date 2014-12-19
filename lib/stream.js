import { streamFilter } from 'quiver-core/component'

export var convertStreamable = 
(converter, streamable, inReplace) => {
  var originalToStream = streamable.toStream
  if(!originalToStream) throw new Error(
    'streamable do not have toStream() method')

  var convertedToStream = () =>
    originalToStream().then(converter)

  if(inReplace) {
    streamable.toStream = convertedToStream
    return streamable

  } else {
    return { toStream: convertedToStream }
  } 
}

var streamableConverter = (streamConverter, active, inReplace) => {
  if(!active) return streamable => streamable

  return streamable =>
    convertStreamable(streamConverter, streamable, inReplace)
}

export var streamConvertFilter = streamFilter(
(config, handler) => {
  var {
    filterMode: mode,
    streamConverter,  
    replaceStreamable=false
  } = config

  if(!streamConverter) throw new Error(
    'config.streamConverter() required')

  if(!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode')

  var inMode = (mode == 'in' || mode == 'inout')
  var outMode = (mode == 'out' || mode == 'inout')

  var inConvert = streamableConverter(
    streamConverter, inMode, replaceStreamable)

  var outConvert = streamableConverter(
    streamConverter, outMode, replaceStreamable)

  return (args, inputStreamable) => {
    return handler(args, inConvert(inputStreamable))
      .then(outConvert)
  }
})

export var makeStreamConvertFilter = 
  streamConvertFilter.factory()
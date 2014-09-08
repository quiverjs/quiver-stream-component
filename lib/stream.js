import { streamFilter } from 'quiver-component'

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

export var streamConvertFilter = 
(converterBuilder, mode, inReplace=false) => {
  if(!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode')

  var inMode = (mode == 'in' || mode == 'inout')
  var outMode = (mode == 'out' || mode == 'inout')

  return streamFilter((config, handler) => {
    var converter = converterBuilder(config)
    if(!converter) return handler

    var inConvert = streamableConverter(
      converter, inMode, inReplace)

    var outConvert = streamableConverter(
      converter, outMode, inReplace)

    return (args, inputStreamable) => {
      return handler(args, inConvert(inputStreamable))
        .then(outConvert)
    }
  })
}
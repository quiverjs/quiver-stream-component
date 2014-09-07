import { streamFilter } from 'quiver-component'

export var convertStreamable = 
(converter, streamable, replaceStreamable) => {
  var originalToStream = streamable.toStream
  if(!originalToStream) throw new Error(
    'streamable do not have toStream() method')

  var convertedToStream = () =>
    originalToStream().then(converter)

  if(replaceStreamable) {
    streamable.toStream = convertedToStream
    return streamable

  } else {
    return { toStream: convertedToStream }
  } 
}

export var streamConvertFilter = 
(streamConverter, mode, replaceStreamable=false) => {
  if(!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode')

  var inMode = (mode == 'in' || mode == 'inout')
  var outMode = (mode == 'out' || mode == 'inout')

  return streamFilter((config, handler) =>
    (args, inputStreamable) => {
      if(inMode) {
        inputStreamable = convertStreamable(
          streamConverter, inputStreamable, replaceStreamable)
      }

      return handler(args, inputStreamable)
      .then(resultStreamable => {
        if(!outMode) return resultStreamable

        return convertStreamable(streamConverter, 
          resultStreamable, replaceStreamable)
      })
    })
}
import { streamFilter } from 'quiver-core/component'

export let convertStreamable = 
(converter, streamable, inReplace) => {
  let originalToStream = streamable.toStream
  if(!originalToStream) throw new Error(
    'streamable do not have toStream() method')

  let convertedToStream = () =>
    originalToStream().then(converter)

  if(inReplace) {
    streamable.toStream = convertedToStream
    return streamable

  } else {
    return { toStream: convertedToStream }
  } 
}

let streamableConverter = (streamConverter, active, inReplace) => {
  if(!active) return streamable => streamable

  return streamable =>
    convertStreamable(streamConverter, streamable, inReplace)
}

export let streamConvertFilter = streamFilter(
(config, handler) => {
  let {
    filterMode: mode,
    streamConverter,  
    replaceStreamable=false
  } = config

  if(!streamConverter) throw new Error(
    'config.streamConverter() required')

  if(!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode')

  let inMode = (mode == 'in' || mode == 'inout')
  let outMode = (mode == 'out' || mode == 'inout')

  let inConvert = streamableConverter(
    streamConverter, inMode, replaceStreamable)

  let outConvert = streamableConverter(
    streamConverter, outMode, replaceStreamable)

  return (args, inputStreamable) => {
    return handler(args, inConvert(inputStreamable))
      .then(outConvert)
  }
})

export let makeStreamConvertFilter = 
  streamConvertFilter.factory()
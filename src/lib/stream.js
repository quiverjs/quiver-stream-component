import { streamFilter } from 'quiver-core/component/constructor'

export const convertStreamable =
(converter, streamable, inReplace) => {
  const originalToStream = streamable.toStream
  if(!originalToStream) throw new Error(
    'streamable do not have toStream() method')

  const convertedToStream = () =>
    originalToStream().then(converter)

  if(inReplace) {
    streamable.toStream = convertedToStream
    return streamable

  } else {
    return { toStream: convertedToStream }
  }
}

const streamableConverter = (streamConverter, active, inReplace) => {
  if(!active) return streamable => streamable

  return streamable =>
    convertStreamable(streamConverter, streamable, inReplace)
}

export const streamConvertFilter = streamFilter(
(config, handler) => {
  const mode = config.get('filterMode')
  const streamConverter = config.get('streamConverter')
  const replaceStreamable = config.get('replaceStreamable', false)

  if(!streamConverter) throw new Error(
    'config.streamConverter() required')

  if(!(mode == 'in' || mode == 'out' || mode == 'inout'))
    throw new Error('invalid stream convert mode')

  const inMode = (mode == 'in' || mode == 'inout')
  const outMode = (mode == 'out' || mode == 'inout')

  const inConvert = streamableConverter(
    streamConverter, inMode, replaceStreamable)

  const outConvert = streamableConverter(
    streamConverter, outMode, replaceStreamable)

  return (args, inputStreamable) => {
    return handler(args, inConvert(inputStreamable))
      .then(outConvert)
  }
})

export const makeStreamConvertFilter =
  streamConvertFilter.export()

import { extract } from 'quiver-core/util/immutable'
import { createChannel } from 'quiver-core/stream-util'
import {
  simpleHandlerBuilder, configMiddleware
} from 'quiver-core/component/constructor'

import { makeStreamConvertFilter } from './stream'

const pipeConvert = async function(converter, readStream, writeStream) {
  try {
    while(true) {
      const { closed: writeClosed } = await writeStream.prepareWrite()
      if(writeClosed) return readStream.closeRead()

      const { closed, data } = await readStream.read()
      if(closed) return writeStream.closeWrite()

      const converted = await converter(data)

      writeStream.write(converted)
    }

  } catch(err) {
    try {
      writeStream.closeWrite(err)
    } finally {
      readStream.closeRead(err)
    }
  }
}

export const convertStream = (converter, inputStream) => {
  const { readStream, writeStream } = createChannel()

  pipeConvert(converter, inputStream, writeStream)
  .catch(err => {})

  return readStream
}
export const bufferConvertHandler = simpleHandlerBuilder(
config => {
  const { bufferConverter } = config::extract()

  if(!bufferConverter) throw new Error(
      'config.bufferConverter required')

  return (args, inputStream) => {
    return convertStream(bufferConverter, inputStream)
  }
}, {
  inputType: 'stream',
  outputType: 'stream'
})

export const bufferConvertFilter = makeStreamConvertFilter()
  .addMiddleware(configMiddleware(
  config => {
    const { bufferConverter } = config::extract()

    if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

    const streamConverter = readStream =>
      convertStream(bufferConverter, readStream)

    return config.set('streamConverter', streamConverter)
  }))

export const makeBufferConvertHandler =
  bufferConvertHandler.export()

export const makeBufferConvertFilter =
  bufferConvertFilter.export()

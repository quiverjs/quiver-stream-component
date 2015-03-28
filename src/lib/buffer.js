import { async } from 'quiver/promise'
import { createChannel } from 'quiver/stream-util'
import { 
  simpleHandlerBuilder, configMiddleware 
} from 'quiver/component'

import { makeStreamConvertFilter } from './stream'

const pipeConvert = async(
function*(converter, readStream, writeStream) {
  try {
    while(true) {
      const { closed: writeClosed } = yield writeStream.prepareWrite()
      if(writeClosed) return readStream.closeRead()

      const { closed, data } = yield readStream.read()
      if(closed) return writeStream.closeWrite()

      const converted = yield converter(data)

      writeStream.write(converted)
    }

  } catch(err) {
    try {
      writeStream.closeWrite(err)
    } finally {
      readStream.closeRead(err)
    }
  }
})

export const convertStream = (converter, inputStream) => {
  const { readStream, writeStream } = createChannel()

  pipeConvert(converter, inputStream, writeStream)
  .catch(err=>{})

  return readStream
}
export const bufferConvertHandler = simpleHandlerBuilder(
config => {
  const { bufferConverter } = config

  if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

  return (args, inputStream) => {
    return convertStream(bufferConverter, inputStream)
  }
}, 'stream', 'stream')

export const bufferConvertFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    const { bufferConverter } = config

    if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

    config.streamConverter = readStream =>
      convertStream(bufferConverter, readStream)
  }))

export const makeBufferConvertHandler = 
  bufferConvertHandler.factory()

export const makeBufferConvertFilter = 
  bufferConvertFilter.factory()
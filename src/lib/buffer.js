import { async } from 'quiver-core/promise'
import { createChannel } from 'quiver-core/stream-util'
import { 
  simpleHandlerBuilder, configMiddleware 
} from 'quiver-core/component'

import { makeStreamConvertFilter } from './stream'

let pipeConvert = async(
function*(converter, readStream, writeStream) {
  try {
    while(true) {
      let { closed: writeClosed } = yield writeStream.prepareWrite()
      if(writeClosed) return readStream.closeRead()

      let { closed, data } = yield readStream.read()
      if(closed) return writeStream.closeWrite()

      let converted = yield converter(data)

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

export let convertStream = (converter, inputStream) => {
  let { readStream, writeStream } = createChannel()

  pipeConvert(converter, inputStream, writeStream)
  .catch(err=>{})

  return readStream
}
export let bufferConvertHandler = simpleHandlerBuilder(
config => {
  let { bufferConverter } = config

  if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

  return (args, inputStream) => {
    return convertStream(bufferConverter, inputStream)
  }
}, 'stream', 'stream')

export let bufferConvertFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    let { bufferConverter } = config

    if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

    config.streamConverter = readStream =>
      convertStream(bufferConverter, readStream)
  }))

export let makeBufferConvertHandler = 
  bufferConvertHandler.factory()

export let makeBufferConvertFilter = 
  bufferConvertFilter.factory()
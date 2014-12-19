import { async } from 'quiver-core/promise'
import { createChannel } from 'quiver-core/stream-util'
import { 
  simpleHandlerBuilder, configMiddleware 
} from 'quiver-core/component'

import { makeStreamConvertFilter } from './stream'

var pipeConvert = async(
function*(converter, readStream, writeStream) {
  try {
    while(true) {
      var { closed } = yield writeStream.prepareWrite()
      if(closed) return readStream.closeRead()

      var { closed, data } = yield readStream.read()
      if(closed) return writeStream.closeWrite()

      var converted = yield converter(data)

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

export var convertStream = (converter, inputStream) => {
  var { readStream, writeStream } = createChannel()

  pipeConvert(converter, inputStream, writeStream)
  .catch(err=>{})

  return readStream
}
export var bufferConvertHandler = simpleHandlerBuilder(
config => {
  var { bufferConverter } = config

  if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

  return (args, inputStream) => {
    return convertStream(bufferConverter, inputStream)
  }
}, 'stream', 'stream')

export var bufferConvertFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    var { bufferConverter } = config

    if(!bufferConverter) throw new Error(
      'config.bufferConverter() required')

    config.streamConverter = readStream =>
      convertStream(bufferConverter, readStream)
  }))

export var makeBufferConvertHandler = 
  bufferConvertHandler.factory()

export var makeBufferConvertFilter = 
  bufferConvertFilter.factory()
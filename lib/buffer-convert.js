import { async } from 'quiver-promise'
import { createChannel } from 'quiver-stream-util'
import { 
  simpleHandler, streamHandler, streamFilter
} from 'quiver-component'

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

var convertStream = (converter, inputStream) => {
  var { readStream, writeStream } = createChannel()

  pipeConvert(converter, inputStream, writeStream)
  .catch(err=>{})

  return readStream
}

var convertStreamable = (converter, streamable, replace) => {
  var originalToStream = streamable.toStream
  if(!originalToStream) throw new Error(
    'streamable do not have toStream() method')

  var convertedToStream = () =>
    originalToStream().then(readStream =>
      convertStream(converter, readStream))

  if(replace) {
    streamable.toStream = convertedToStream
    return streamable

  } else {
    return { toStream: convertedToStream }
  } 
}

var ensureBuffer = data =>
  Buffer.isBuffer(data) ? data : new Buffer(data)

var bufferizeStreamable = streamable => {
  if(streamable.bufferMode) return streamable

  var newStreamable = convertStreamable(
    ensureBuffer, streamable, true)

  newStreamable.bufferMode = true

  return newStreamable
}

export var bufferConvertHandler = converter =>
  simpleHandler((args, inputStream) => {
    return convertStream(converter, inputStream)
  }, 'stream', 'stream')

export var bufferConvertFilter = (converter, mode, replace=false) => {
  var inMode = (mode == 'in' || mode == 'inout')
  var outMode = (mode == 'out' || mode == 'inout')

  return streamFilter((config, handler) =>
    (args, inputStreamable) => {
      if(inMode) {
        inputStreamable = convertStreamable(
          converter, inputStreamable, replace)
      }

      return handler(args, inputStreamable)
      .then(resultStreamable => {
        if(!outMode) return resultStreamable

        return convertStreamable(converter, 
          resultStreamable, replace)
      })
    })
}

export var bufferStreamFilter = streamFilter((config, handler) =>
  (args, inputStreamable) => {
    return handler(args, bufferizeStreamable(inputStreamable))
    .then(bufferizeStreamable)
  })
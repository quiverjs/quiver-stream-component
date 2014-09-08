import { async } from 'quiver-promise'
import { createChannel } from 'quiver-stream-util'

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
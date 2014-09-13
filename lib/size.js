import { async } from 'quiver-promise'
import { createChannel } from 'quiver-stream-util'

export var pipeSizedBuffer = async(
function*(readStream, writeStream, minSize, maxSize) {
  try {
    var buffer = null

    while(true) {
      var { closed } = yield writeStream.prepareWrite()
      if(closed) return readStream.closeRead()

      while(!buffer || buffer.length < minSize) {
        var { closed, data } = yield readStream.read()
        if(closed) {
          if(buffer) writeStream.write(buffer)

          writeStream.closeWrite()
          return
        }

        if(!Buffer.isBuffer(data)) data = new Buffer(data)

        if(buffer) {
          buffer = Buffer.concat([buffer, data])
        } else {
          buffer = data
        }
      }

      var bufferLength = buffer.length

      if(bufferLength <= maxSize) {
        writeStream.write(buffer)
        buffer = null

      } else {
        var division = (bufferLength / maxSize) | 0

        var sliceStartIndex = 0
        var sliceEndIndex = maxSize

        while(sliceEndIndex <= bufferLength) {
          var slice = buffer.slice(
            sliceStartIndex, sliceEndIndex)

          writeStream.write(slice)

          sliceStartIndex = sliceEndIndex
          sliceEndIndex += maxSize
        }

        if(sliceStartIndex == bufferLength) {
          buffer = null
        } else {
          buffer = buffer.slice(sliceStartIndex)
        }
      }
    }
  } catch(err) {
    try {
      writeStream.closeWrite(err)
    } finally {
      readStream.closeRead(err)
    }
  }
})

export var sizeWindowedStream = 
(rawStream, minSize, maxSize=minSize) => {
  minSize = minSize|0
  maxSize = maxSize|0

  if(minSize <= 0 || maxSize < minSize)
    throw new Error('invalid minSize/maxSize')

  var { 
    readStream, writeStream 
  } = createChannel()

  pipeSizedBuffer(rawStream, writeStream, 
    minSize, maxSize)

  return readStream
}
import { async } from 'quiver-core/promise'
import { createChannel } from 'quiver-core/stream-util'

export let pipeSizedBuffer = async(
function*(readStream, writeStream, minSize, maxSize) {
  try {
    let buffer = null

    while(true) {
      let { closed } = yield writeStream.prepareWrite()
      if(closed) return readStream.closeRead()

      while(!buffer || buffer.length < minSize) {
        let { closed, data } = yield readStream.read()
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

      let bufferLength = buffer.length

      if(bufferLength <= maxSize) {
        writeStream.write(buffer)
        buffer = null

      } else {
        let division = (bufferLength / maxSize) | 0

        let sliceStartIndex = 0
        let sliceEndIndex = maxSize

        while(sliceEndIndex <= bufferLength) {
          let slice = buffer.slice(
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

export let sizeWindowedStream = 
(rawStream, minSize, maxSize=minSize) => {
  minSize = minSize|0
  maxSize = maxSize|0

  if(minSize <= 0 || maxSize < minSize)
    throw new Error('invalid minSize/maxSize')

  let { 
    readStream, writeStream 
  } = createChannel()

  pipeSizedBuffer(rawStream, writeStream, 
    minSize, maxSize)

  return readStream
}
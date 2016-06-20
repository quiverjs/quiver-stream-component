import { createChannel } from 'quiver-core/stream-util'

export const pipeSizedBuffer = async function(
  readStream, writeStream, minSize, maxSize)
{
  try {
    let buffer = null

    while(true) {
      const { closed } = await writeStream.prepareWrite()
      if(closed) return readStream.closeRead()

      while(!buffer || buffer.length < minSize) {
        let { closed, data } = await readStream.read()
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

      const bufferLength = buffer.length

      if(bufferLength <= maxSize) {
        writeStream.write(buffer)
        buffer = null

      } else {
        let sliceStartIndex = 0
        let sliceEndIndex = maxSize

        while(sliceEndIndex <= bufferLength) {
          const slice = buffer.slice(
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
}

export const sizeWindowedStream = (rawStream, minSize, maxSize=minSize) => {
  minSize = minSize|0
  maxSize = maxSize|0

  if(minSize <= 0 || maxSize < minSize)
    throw new Error('invalid minSize/maxSize')

  const {
    readStream, writeStream
  } = createChannel()

  pipeSizedBuffer(rawStream, writeStream,
    minSize, maxSize)

  return readStream
}

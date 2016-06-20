import { error } from 'quiver-core/util/error'
import { streamFilter } from 'quiver-core/component/constructor'
import {
  pushbackStream, streamToStreamable
} from 'quiver-core/stream-util'

export const extractStreamHead = async function(readStream, separator, options={}) {
  const { maxLength=-1 } = options
  const limit = maxLength > 0

  if(!Buffer.isBuffer(separator))
    separator = new Buffer(separator)

  let headBuffer = new Buffer(0)

  while(true) {
    let { closed, data } = await readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    const previousBufferSize = headBuffer.length
    headBuffer = Buffer.concat([headBuffer, data])

    const separatorIndex = headBuffer.indexOf(separator)
    if(separatorIndex != -1) {
      const headContent = headBuffer.slice(0, separatorIndex)

      const restIndex = separatorIndex - previousBufferSize
        + separator.length

      if(restIndex != data.length) {
        const restBuffer = data.slice(restIndex)
        readStream = pushbackStream(readStream, [restBuffer])
      }

      return [headContent, readStream]
    }

    if(limit && headBuffer.length > maxLength)
      throw error(413, 'Request Entity Too Large')
  }
}

export const extractFixedStreamHead = async function(readStream, size) {
  let remaining = size
  const headBuffers = []

  while(true) {
    let { closed, data } = await readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    const bufferSize = data.length

    if(bufferSize == remaining) {
      headBuffers.push(data)
      return [Buffer.concat(headBuffers), readStream]
    }

    if(bufferSize > remaining) {
      headBuffers.push(data.slice(0, remaining))

      readStream = pushbackStream(readStream,
        [data.slice(remaining)])

      return [Buffer.concat(headBuffers), readStream]
    }

    headBuffers.push(data)
    remaining = remaining - bufferSize
  }
}

export const headerExtractFilter = streamFilter(
(config, handler) => {
  let separator = config.get('headerSeparator', '\r\n\r\n')
  const streamHeadMaxLength = config.get('streamHeadMaxLength', -1)

  if(!Buffer.isBuffer(separator)) {
    separator = new Buffer(separator)
  }

  const extractOptions = {
    maxLength: streamHeadMaxLength
  }

  return (args, inputStreamable) =>
    inputStreamable.toStream
    .then(readStream =>
      extractStreamHead(readStream, separator, extractOptions))
    .then(([header, readStream]) => {
      args.header = header
      const streamable = streamToStreamable(readStream)

      return handler(args, streamable)
    })
})

export const makeHeaderExtractFilter =
  headerExtractFilter.export()

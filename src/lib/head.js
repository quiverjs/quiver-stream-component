import { error } from 'quiver-core/error'
import { async } from 'quiver-core/promise'
import { pushbackStream } from 'quiver-core/stream-util'
import { streamFilter } from 'quiver-core/component'

import buffertools from 'buffertools'
let { indexOf } = buffertools

export let extractStreamHead = async(
function*(readStream, separator, options={}) {
  let { maxLength=-1 } = options
  let limit = maxLength > 0

  if(!Buffer.isBuffer(separator)) 
    separator = new Buffer(separator)

  let headBuffer = new Buffer(0)

  while(true) {
    let { closed, data } = yield readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    let previousBufferSize = headBuffer.length
    headBuffer = Buffer.concat([headBuffer, data])

    let separatorIndex = indexOf(headBuffer, separator)
    if(separatorIndex != -1) {
      let headContent = headBuffer.slice(0, separatorIndex)

      let restIndex = separatorIndex - previousBufferSize 
        + separator.length

      if(restIndex != data.length) {
        let restBuffer = data.slice(restIndex)
        readStream = pushbackStream(readStream, [restBuffer])
      }

      return [headContent, readStream]
    }

    if(limit && headBuffer.length > maxLength)
      throw error(413, 'Request Entity Too Large')
  }
})

export let extractFixedStreamHead = async(
function*(readStream, size) {
  let remaining = size
  let headBuffers = []

  while(true) {
    let { closed, data } = yield readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    let bufferSize = data.length

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
})

export let headerExtractFilter = streamFilter(
(config, handler) => {
  let {
    headerSeparator='\r\n\r\n',
    streamHeadMaxLength=-1 
  } = config

  if(!Buffer.isBuffer(separator)) 
    separator = new Buffer(separator)

  let extractOptions = {
    maxLength: streamHeadMaxLength
  }

  return (args, inputStreamable) =>
    inputStreamable.toStream
    .then(readStream =>
      extractStreamHead(readStream, separator, extractOptions))
    .then(([header, readStream]) => {
      args.header = header
      let streamable = streamToStreamable(readStream)

      return handler(args, streamable)
    })
})

export let makeHeaderExtractFilter = 
  headerExtractFilter.factory()
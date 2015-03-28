import { error } from 'quiver/error'
import { async } from 'quiver/promise'
import { simpleHandler } from 'quiver/component'

import { 
  createChannel, pushbackStream 
} from 'quiver/stream-util'

import { 
  extractStreamHead, extractFixedStreamHead 
} from './head'

const pipeChunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      const { closed: writeClosed } = yield writeStream.prepareWrite()

      if(writeClosed) return readStream.closeRead()

      let { closed, data } = yield readStream.read()

      if(closed) {
        const chunkHead = '0\r\n\r\n'
        writeStream.write(chunkHead)
        writeStream.closeWrite()
        return
      }

      if(!Buffer.isBuffer(data)) data = new Buffer(data)
      const chunkSize = data.length
      const chunkHead = chunkSize.toString(16) + '\r\n'

      writeStream.write(chunkHead)
      writeStream.write(data)
      writeStream.write('\r\n')
    }
  } catch(err) {
    try {
      writeStream.closeWrite(err)
    } finally {
      readStream.closeRead(err)
    }
  }
})

const chunkSeparator = new Buffer('\r\n')

const extractTrailingHeaders = async(function*(readStream) {
  const headers = []

  while(true) {
    let head
    ;([head, readStream]) = yield extractStreamHead(
      readStream, chunkSeparator)

    if(head.length == 0) return headers
    headers.push(head)
  }
})

const pipeChunk = async(function*(readStream, writeStream, size) {
  while(true) {
    const { closed: writeClosed } = yield writeStream.prepareWrite()
    if(writeClosed) return readStream.closeRead()

    let { closed, data } = yield readStream.read()
    if(closed) throw error(400, 'Bad Request')

    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    const bufferSize = data.length

    if(bufferSize == size) {
      writeStream.write(data)
      return readStream
    }

    if(bufferSize > size) {
      const head = data.slice(0, size)
      const rest = data.slice(size)

      writeStream.write(head)
      return pushbackStream(readStream, [rest])
    }

    size = size - bufferSize
    writeStream.write(data)
  }
})

const pipeUnchunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      let chunkHead
      ;([chunkHead, readStream]) = yield extractStreamHead(
        readStream, chunkSeparator)

      let chunkSizeText = chunkHead
      const extensionIndex = chunkHead.indexOf(';')
      if(extensionIndex != -1) {
        chunkSizeText = chunkHead.slice(0, extensionIndex)
      }

      if(chunkSizeText.length == 0 || 
         /[^0-9a-fA-F]/.test(chunkSizeText)) 
      {
        throw error(400, 'malformed chunked stream')
      }

      const chunkSize = parseInt(chunkSizeText, 16)
      if(chunkSize == 0) {
        const trailingHeaders = yield extractTrailingHeaders(readStream)
        writeStream.closeWrite()
        readStream.closeRead()
        return

      }

      readStream = yield pipeChunk(readStream, writeStream, chunkSize)
      let head
      ;([head, readStream]) = yield extractFixedStreamHead(readStream, 2)

      if(Buffer.compare(head, chunkSeparator) != 0)
        throw error(400, 'Bad Request')
    }

  } catch(err) {
    try {
      writeStream.closeWrite(err)
    } finally {
      readStream.closeRead(err)
    }
  }
})

export const streamToChunkedStream = unchunkedStream => {
  const { readStream, writeStream } = createChannel()

  pipeChunkedStream(unchunkedStream, writeStream)

  return readStream
}

export const streamToUnchunkedStream = chunkedStream => {
  const { readStream, writeStream } = createChannel()

  pipeUnchunkedStream(chunkedStream, writeStream)

  return readStream
}

export const chunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToChunkedStream(inputStream),
'stream', 'stream')

export const unchunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToUnchunkedStream(inputStream),
'stream', 'stream')

export const makeChunkedTransformHandler = 
  chunkedTransformHandler.factory()

export const makeUnchunkedTransformHandler = 
  unchunkedTransformHandler.factory()
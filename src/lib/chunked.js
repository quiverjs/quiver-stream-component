import { error } from 'quiver-core/error'
import { async } from 'quiver-core/promise'
import { simpleHandler } from 'quiver-core/component'

import { 
  createChannel, pushbackStream 
} from 'quiver-core/stream-util'

import buffertools from 'buffertools'
let { 
  compare: compareBuffer,
  indexOf
} = buffertools

import { 
  extractStreamHead, extractFixedStreamHead 
} from './head'

let pipeChunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      let { closed: writeClosed } = yield writeStream.prepareWrite()

      if(writeClosed) return readStream.closeRead()

      let { closed, data } = yield readStream.read()

      if(closed) {
        let chunkHead = '0\r\n\r\n'
        writeStream.write(chunkHead)
        writeStream.closeWrite()
        return
      }

      if(!Buffer.isBuffer(data)) data = new Buffer(data)
      let chunkSize = data.length
      let chunkHead = chunkSize.toString(16) + '\r\n'

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

let chunkSeparator = new Buffer('\r\n')

let extractTrailingHeaders = async(function*(readStream) {
  let headers = []

  while(true) {
    var [head, readStream] = yield extractStreamHead(
      readStream, chunkSeparator)

    if(head.length == 0) return headers
    headers.push(head)
  }
})

let pipeChunk = async(function*(readStream, writeStream, size) {
  while(true) {
    let { closed: writeClosed } = yield writeStream.prepareWrite()
    if(writeClosed) return readStream.closeRead()

    let { closed, data } = yield readStream.read()
    if(closed) throw error(400, 'Bad Request')

    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    let bufferSize = data.length

    if(bufferSize == size) {
      writeStream.write(data)
      return readStream
    }

    if(bufferSize > size) {
      let head = data.slice(0, size)
      let rest = data.slice(size)

      writeStream.write(head)
      return pushbackStream(readStream, [rest])
    }

    size = size - bufferSize
    writeStream.write(data)
  }
})

let pipeUnchunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      var [chunkHead, readStream] = yield extractStreamHead(
        readStream, chunkSeparator)

      let chunkSizeText = chunkHead
      let extensionIndex = indexOf(chunkHead, ';')
      if(extensionIndex != -1) {
        chunkSizeText = chunkHead.slice(0, extensionIndex)
      }

      if(chunkSizeText.length == 0 || 
         /[^0-9a-fA-F]/.test(chunkSizeText)) 
      {
        throw error(400, 'malformed chunked stream')
      }

      let chunkSize = parseInt(chunkSizeText, 16)
      if(chunkSize == 0) {
        let trailingHeaders = yield extractTrailingHeaders(readStream)
        writeStream.closeWrite()
        readStream.closeRead()
        return

      }

      readStream = yield pipeChunk(readStream, writeStream, chunkSize)
      var [head, readStream] = yield extractFixedStreamHead(readStream, 2)

      if(compareBuffer(head, chunkSeparator) != 0)
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

export let streamToChunkedStream = unchunkedStream => {
  let { readStream, writeStream } = createChannel()

  pipeChunkedStream(unchunkedStream, writeStream)

  return readStream
}

export let streamToUnchunkedStream = chunkedStream => {
  let { readStream, writeStream } = createChannel()

  pipeUnchunkedStream(chunkedStream, writeStream)

  return readStream
}

export let chunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToChunkedStream(inputStream),
'stream', 'stream')

export let unchunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToUnchunkedStream(inputStream),
'stream', 'stream')

export let makeChunkedTransformHandler = 
  chunkedTransformHandler.factory()

export let makeUnchunkedTransformHandler = 
  unchunkedTransformHandler.factory()
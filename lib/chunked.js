import { error } from 'quiver-error'
import { async } from 'quiver-promise'

import buffertools from 'buffertools'
var { 
  compare: compareBuffer,
  indexOf
} = buffertools

import { createChannel } from 'quiver-stream-util'

import { pushbackStream } from './pushback.js'

import { 
  extractStreamHead, extractFixedStreamHead 
} from './stream-head.js'

var pipeChunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      var { closed } = yield writeStream.prepareWrite()

      if(closed) return readStream.closeRead()

      var { closed, data } = yield readStream.read()

      if(closed) {
        var chunkHead = '0\r\n\r\n'
        writeStream.write(chunkHead)
        writeStream.closeWrite()
        return
      }

      if(!Buffer.isBuffer(data)) data = new Buffer(data)
      var chunkSize = data.length
      var chunkHead = chunkSize.toString(16) + '\r\n'

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

var chunkSeparator = new Buffer('\r\n')

var extractTrailingHeaders = async(function*(readStream) {
  var headers = []

  while(true) {
    var [head, readStream] = yield extractStreamHead(
      readStream, chunkSeparator)

    if(head.length == 0) return headers
    headers.push(head)
  }
})

var pipeChunk = async(function*(readStream, writeStream, size) {
  while(true) {
    var { closed } = yield writeStream.prepareWrite()
    if(closed) return readStream.closeRead()

    var { closed, data } = yield readStream.read()
    if(closed) throw error(400, 'Bad Request')

    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    var bufferSize = data.length

    if(bufferSize == size) {
      writeStream.write(data)
      return readStream
    }

    if(bufferSize > size) {
      var head = data.slice(0, size)
      var rest = data.slice(size)

      writeStream.write(head)
      return pushbackStream(readStream, [rest])
    }

    size = size - bufferSize
    writeStream.write(data)
  }
})

var pipeUnchunkedStream = async(
function*(readStream, writeStream, options={}) {
  try {
    while(true) {
      var [chunkHead, readStream] = yield extractStreamHead(
        readStream, chunkSeparator)

      var chunkSizeText = chunkHead
      var extensionIndex = indexOf(chunkHead, ';')
      if(extensionIndex != -1) {
        chunkSizeText = chunkHead.slice(0, extensionIndex)
      }

      if(chunkSizeText.length == 0 || 
         /[^0-9a-fA-F]/.test(chunkSizeText)) 
      {
        throw error(400, 'malformed chunked stream')
      }

      var chunkSize = parseInt(chunkSizeText, 16)
      if(chunkSize == 0) {
        var trailingHeaders = yield extractTrailingHeaders(readStream)
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

export var streamToChunkedStream = unchunkedStream => {
  var { readStream, writeStream } = createChannel()

  pipeChunkedStream(unchunkedStream, writeStream)

  return readStream
}

export var streamToUnchunkedStream = chunkedStream => {
  var { readStream, writeStream } = createChannel()

  pipeUnchunkedStream(chunkedStream, writeStream)

  return readStream
}
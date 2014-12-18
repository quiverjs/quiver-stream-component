import { 
  simpleHandler, streamHandler, streamFilter
} from 'quiver-component'

import { 
  streamToStreamable 
} from 'quiver-stream-util'

import {
  convertStream,
  bufferizeStreamable
} from './buffer'

import {
  streamConvertFilter
} from './stream'

import {
  compressField,
  compressorTable,
  compressStreamable
} from './compress'

import {
  streamToChunkedStream,
  streamToUnchunkedStream
} from './chunked'

import {
  extractStreamHead
} from './head'

import {
  throttledStream
} from './throttle'

import {
  timeoutStream
} from './timeout'

export var bufferConvertHandler = converter =>
  simpleHandler((args, inputStream) => {
    return convertStream(converter, inputStream)
  }, 'stream', 'stream')

export var bufferConvertFilter = 
(bufferConverter, mode, inReplace=false) => {
  var converterBuilder = config => 
    readStream =>
      convertStream(bufferConverter, readStream)

  return streamConvertFilter(
    converterBuilder, mode, inReplace)
}

export var compressHandler = algorithm => {
  if(!compressorTable[algorithm])
    throw new Error('invalid compression algorithm')

  var field = compressField(algorithm)

  return streamHandler(
    (args, inputStreamable) => 
      compressStreamable(algorithm, 
        inputStreamable, field))
}

export var chunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToChunkedStream(inputStream),
'stream', 'stream')
.factory()

export var unchunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToUnchunkedStream(inputStream),
'stream', 'stream')
.factory()

export var headerExtractFilter = separator => {
  if(!Buffer.isBuffer(separator)) 
    separator = new Buffer(separator)

  return streamFilter((config, handler) => {
    var { streamHeadMaxLength=-1 } = config
    var extractOptions = {
      maxLength: streamHeadMaxLength
    }

    return (args, inputStreamable) =>
      inputStreamable.toStream
      .then(readStream =>
        extractStreamHead(readStream, separator, extractOptions))
      .then(([header, readStream]) => {
        args.header = header
        var streamable = streamToStreamable(readStream)

        return handler(args, streamable)
      })
  })
}

export var throttledStreamFilter = (mode='inout') => {
  var converterBuilder = config => {
    var { streamThrottleRate=-1 } = config
    if(!(streamThrottleRate > 0)) return null

    return readStream =>
      throttledStream(readStream, streamThrottleRate)
  }

  return streamConvertFilter(converterBuilder, mode, true)
}

export var timeoutStreamFilter = (mode='inout') => {
  var converterBuilder = config => {
    var { streamTimeout=-1 } = config
    if(!(streamTimeout > 0)) return null

    return readStream =>
      timeoutStream(readStream, streamTimeout)
  }

  return streamConvertFilter(converterBuilder, mode, true)
}
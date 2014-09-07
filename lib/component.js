import { 
  simpleHandler, streamHandler, streamFilter
} from 'quiver-component'

import { streamToStreamable } from 'quiver-stream-util'

import {
  convertStream,
  bufferizeStreamable
} from './buffer.js'

import {
  streamConvertFilter
} from './stream.js'

import {
  streamToChunkedStream,
  streamToUnchunkedStream
} from './chunked.js'

import {
  extractStreamHead
} from './head.js'

import {
  throttledStream
} from './throttle.js'

import {
  timeoutStream
} from './timeout.js'

export var bufferConvertHandler = converter =>
  simpleHandler((args, inputStream) => {
    return convertStream(converter, inputStream)
  }, 'stream', 'stream')

export var bufferConvertFilter = 
(converter, mode, replaceStreamable=false) => {
  var streamConverter = readStream =>
    convertStream(converter, readStream)

  return streamConvertFilter(streamConverter, mode, replaceStreamable)
}

export var bufferizeStreamFilter = streamFilter((config, handler) =>
  (args, inputStreamable) => {
    return handler(args, bufferizeStreamable(inputStreamable))
    .then(bufferizeStreamable)
  })

export var chunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToChunkedStream(inputStream),
'stream', 'stream')

export var unchunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToUnchunkedStream(inputStream),
'stream', 'stream')

export var headerExtractFilter = separator => {
  if(!Buffer.isBuffer(separator)) 
    separator = new Buffer(separator)

  return streamFilter((config, handler) =>
    (args, inputStreamable) =>
      inputStreamable.toStream
      .then(readStream =>
        extractStreamHead(readStream, separator))
      .then(([header, readStream]) => {
        args.header = header
        var streamable = streamToStreamable(readStream)

        return handler(args, streamable)
      }))
}

export var throttledStreamFilter = (rate, mode) => {
  var streamConverter = readStream =>
    throttledStream(readStream, rate)

  return streamConvertFilter(streamConverter, mode, true)
}

export var timeoutStreamFilter = (timeout, mode) => {
  var streamConverter = readStream =>
    timeoutStream(readStream, timeout)

  return streamConvertFilter(streamConverter, mode, true)
}
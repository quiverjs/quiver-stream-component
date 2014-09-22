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
(bufferConverter, mode, inReplace=false) => {
  var converterBuilder = config => 
    readStream =>
      convertStream(bufferConverter, readStream)

  return streamConvertFilter(
    converterBuilder, mode, inReplace)
}

export var chunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToChunkedStream(inputStream),
'stream', 'stream')
.privatizedConstructor()

export var unchunkedTransformHandler = simpleHandler(
(args, inputStream) =>
  streamToUnchunkedStream(inputStream),
'stream', 'stream')
.privatizedConstructor()

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
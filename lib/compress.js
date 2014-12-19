import zlib from 'zlib'

import { async, resolve } from 'quiver-core/promise'
import { streamHandlerBuilder } from 'quiver-core/component'

import { 
  pipeStream,
  reuseStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream,
} from 'quiver-core/stream-util'

export var compressorTable = {
  gzip: zlib.createGzip,
  gunzip: zlib.createGunzip,
  deflate: zlib.createDeflate,
  inflate: zlib.createInflate,
  unzip: zlib.createUnzip
}

var compressFieldTable = {
  gzip: 'toGzipStreamable',
  gunzip: 'toGunzipStreamable',
  deflate: 'toDeflateStreamable',
  inflate: 'toInflateStreamable',
  unzip: 'toUnzipStreamable'
}

export var compressField = algorithm => {
  return compressFieldTable[algorithm]
}

var pipeNodeTransform = (readStream, nodeStream) => {
  var writeStream = nodeToQuiverWriteStream(nodeStream)
  var resultStream = nodeToQuiverReadStream(nodeStream)

  pipeStream(readStream, writeStream)

  return resultStream
}

export var compressStream = (algorithm, readStream) => {
  var createCompressor = compressorTable[algorithm]

  if(!createCompressor) 
    throw new Error('invalid compression algorithm')

  var compressor = createCompressor()

  return pipeNodeTransform(readStream, compressor)
}

export var compressStreamable = async(
function*(algorithm, streamable, 
  toCompressStreamable=compressField(algorithm)) 
{
  if(streamable[toCompressStreamable]) 
    return streamable[toCompressStreamable]()

  var readStream = yield streamable.toStream()
  var compressedStream = compressStream(algorithm, readStream)

  if(!streamable.reusable)
    return streamToStreamable(compressedStream)

  var compressedStreamable = reuseStream(compressedStream)

  streamable[toCompressStreamable] = () =>
    resolve(compressedStreamable)

  return compressedStreamable
})

export var compressHandler = streamHandlerBuilder(
config => {
  var { compressAlgorithm='gzip' } = config

  if(!compressorTable[compressAlgorithm])
    throw new Error('invalid compression algorithm')

  var field = compressField(compressAlgorithm)

  return (args, inputStreamable) => 
    compressStreamable(compressAlgorithm, 
      inputStreamable, field)
})

export var makeCompressHandler = compressHandler.factory()
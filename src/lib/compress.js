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

export let compressorTable = {
  gzip: zlib.createGzip,
  gunzip: zlib.createGunzip,
  deflate: zlib.createDeflate,
  inflate: zlib.createInflate,
  unzip: zlib.createUnzip
}

let compressFieldTable = {
  gzip: 'toGzipStreamable',
  gunzip: 'toGunzipStreamable',
  deflate: 'toDeflateStreamable',
  inflate: 'toInflateStreamable',
  unzip: 'toUnzipStreamable'
}

export let compressField = algorithm => {
  return compressFieldTable[algorithm]
}

let pipeNodeTransform = (readStream, nodeStream) => {
  let writeStream = nodeToQuiverWriteStream(nodeStream)
  let resultStream = nodeToQuiverReadStream(nodeStream)

  pipeStream(readStream, writeStream)

  return resultStream
}

export let compressStream = (algorithm, readStream) => {
  let createCompressor = compressorTable[algorithm]

  if(!createCompressor) 
    throw new Error('invalid compression algorithm')

  let compressor = createCompressor()

  return pipeNodeTransform(readStream, compressor)
}

export let compressStreamable = async(
function*(algorithm, streamable, 
  toCompressStreamable=compressField(algorithm)) 
{
  if(streamable[toCompressStreamable]) 
    return streamable[toCompressStreamable]()

  let readStream = yield streamable.toStream()
  let compressedStream = compressStream(algorithm, readStream)

  if(!streamable.reusable)
    return streamToStreamable(compressedStream)

  let compressedStreamable = reuseStream(compressedStream)

  streamable[toCompressStreamable] = () =>
    resolve(compressedStreamable)

  return compressedStreamable
})

export let compressHandler = streamHandlerBuilder(
config => {
  let { compressAlgorithm='gzip' } = config

  if(!compressorTable[compressAlgorithm])
    throw new Error('invalid compression algorithm')

  let field = compressField(compressAlgorithm)

  return (args, inputStreamable) => 
    compressStreamable(compressAlgorithm, 
      inputStreamable, field)
})

export let makeCompressHandler = compressHandler.factory()
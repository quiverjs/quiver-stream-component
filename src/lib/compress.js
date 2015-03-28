import zlib from 'zlib'

import { async, resolve } from 'quiver/promise'
import { streamHandlerBuilder } from 'quiver/component'

import { 
  pipeStream,
  reuseStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream,
} from 'quiver/stream-util'

export const compressorTable = {
  gzip: zlib.createGzip,
  gunzip: zlib.createGunzip,
  deflate: zlib.createDeflate,
  inflate: zlib.createInflate,
  unzip: zlib.createUnzip
}

const compressFieldTable = {
  gzip: 'toGzipStreamable',
  gunzip: 'toGunzipStreamable',
  deflate: 'toDeflateStreamable',
  inflate: 'toInflateStreamable',
  unzip: 'toUnzipStreamable'
}

export const compressField = algorithm => {
  return compressFieldTable[algorithm]
}

const pipeNodeTransform = (readStream, nodeStream) => {
  const writeStream = nodeToQuiverWriteStream(nodeStream)
  const resultStream = nodeToQuiverReadStream(nodeStream)

  pipeStream(readStream, writeStream)

  return resultStream
}

export const compressStream = (algorithm, readStream) => {
  const createCompressor = compressorTable[algorithm]

  if(!createCompressor) 
    throw new Error('invalid compression algorithm')

  const compressor = createCompressor()

  return pipeNodeTransform(readStream, compressor)
}

export const compressStreamable = async(
function*(algorithm, streamable, toCompressStreamable) {
  if(!toCompressStreamable)
    toCompressStreamable=compressField(algorithm)

  if(streamable[toCompressStreamable]) 
    return streamable[toCompressStreamable]()

  const readStream = yield streamable.toStream()
  const compressedStream = compressStream(algorithm, readStream)

  if(!streamable.reusable)
    return streamToStreamable(compressedStream)

  const compressedStreamable = reuseStream(compressedStream)

  streamable[toCompressStreamable] = () =>
    resolve(compressedStreamable)

  return compressedStreamable
})

export const compressHandler = streamHandlerBuilder(
config => {
  const { compressAlgorithm='gzip' } = config

  if(!compressorTable[compressAlgorithm])
    throw new Error('invalid compression algorithm')

  const field = compressField(compressAlgorithm)

  return (args, inputStreamable) => {
    return compressStreamable(compressAlgorithm, 
      inputStreamable, field)
  }
})

export const makeCompressHandler = compressHandler.factory()
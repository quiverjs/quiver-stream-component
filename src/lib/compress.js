import zlib from 'zlib'

import { streamHandlerBuilder } from 'quiver-core/component/constructor'

import {
  pipeStream,
  reuseStream,
  streamToStreamable,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream,
} from 'quiver-core/stream-util'

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

export const compressStreamable = async function(
  algorithm, streamable, toCompressStreamable=compressField(algorithm))
{
  if(streamable[toCompressStreamable])
    return streamable[toCompressStreamable]()

  const readStream = await streamable.toStream()
  const compressedStream = compressStream(algorithm, readStream)

  if(!streamable.reusable)
    return streamToStreamable(compressedStream)

  const compressedStreamable = reuseStream(compressedStream)

  streamable[toCompressStreamable] = () =>
    Promise.resolve(compressedStreamable)

  return compressedStreamable
}

export const compressHandler = streamHandlerBuilder(
config => {
  const compressAlgorithm = config.get('compressAlgorithm', 'gzip')

  if(!compressorTable[compressAlgorithm])
    throw new Error('invalid compression algorithm')

  const field = compressField(compressAlgorithm)

  return (args, inputStreamable) => {
    return compressStreamable(compressAlgorithm,
      inputStreamable, field)
  }
})

export const makeCompressHandler = compressHandler.export()

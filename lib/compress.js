import zlib from 'zlib'

import { async } from 'quiver-promise'

import { 
  pipeStream,
  reuseStream,
  nodeToQuiverReadStream,
  nodeToQuiverWriteStream,
} from 'quiver-stream-util'

export var compressorTable = {
  gzip: zlib.createGzip,
  gunzip: zlib.createGunzip,
  deflate: zlib.createDeflate,
  inflate: zlib.createInflate,
  unzip: zlib.createUnzip
}

export var compressField = algorithm => {
  return 'to' + algorithm[0].toUpperCase() +
    algorithm.slice(1) + 'Stream'
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
  toCompressStream=compressField(algorithm)) 
{
  if(streamable[toCompressStream]) 
    return streamable[toCompressStream]()

  var readStream = yield streamable.toStream()
  var compressedStream = compressStream(algorithm, readStream)

  if(!streamable.reusable)
    return compressedStream

  var compressedStreamable = reuseStream(compressedStream)

  streamable[toCompressStream] = () =>
    compressedStreamable.toStream()

  return compressedStreamable.toStream()
})
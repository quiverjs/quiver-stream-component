import { async } from 'quiver-core/promise'
import {
  streamToText,
  buffersToStream
} from 'quiver-core/stream-util'

import { 
  streamToChunkedStream, streamToUnchunkedStream 
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('chunked stream test', () => {
  it('simple stream to chunked stream', async(function*() {
    let testBuffers = [
      'hello',
      'javascript definitely rocks'
    ]

    let testChunkedContent = '5\r\nhello\r\n' +
        '1b\r\njavascript definitely rocks\r\n' +
        '0\r\n\r\n'

    let readStream = buffersToStream(testBuffers)
    let chunkedStream = streamToChunkedStream(readStream)

    yield streamToText(chunkedStream)
      .should.eventually.equal(testChunkedContent)
  }))

  it('simple chunked stream to stream', async(function*() {
    let testBuffers = [
      '6',
      '\r\n',
      'hello ',
      '\r\n',
      '1b',
      '\r\n',
      'javascript definitely rocks',
      '\r\n',
      '0',
      '\r\n',
      '\r\n'
    ]

    let testContent = 'hello javascript definitely rocks'

    let readStream = buffersToStream(testBuffers)
    let unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('bad chunked stream test', async(function*() {
    let testBuffers = buffers => {
      let readStream = buffersToStream(buffers)
      let unchunkedStream = streamToUnchunkedStream(readStream)

      return streamToText(unchunkedStream)
        .should.be.rejected
    }

    yield testBuffers([
      '3', // wrong count
      '\r\n',
      'hello',
      '\r\n',
      '0',
      '\r\n',
      '\r\n'
    ])

    yield testBuffers([
      '5\r\n',
      'hello',
      '\r\n',
      '0',
      '\r\n' // missing last \r\n
    ])

    yield testBuffers([
      '5\r\n',
      'hello',
      '\r\n' // no trailer
    ])
  }))

  it('complex chunked stream to stream', async(function*() {
    let testBuffers = [
      '6\r',
      '\nhello \r',
      '\n1',
      'b\r',
      '\njava',
      'script definitely ',
      'rocks\r\n0',
      '\r\n\r',
      '\n'
    ]

    let testContent = 'hello javascript definitely rocks'

    let readStream = buffersToStream(testBuffers)
    let unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('combined chunk unchunk test', async(function*() {
    let unicodeBuffer = new Buffer('世界你好')

    let testBuffers = [
      'first ',
      'second ',
      unicodeBuffer.slice(0, 5),
      unicodeBuffer.slice(5, 12),
      ' third ',
      'fourth ',
      'fifth'
    ]

    let originalStream = buffersToStream(testBuffers)
    let chunkedStream = streamToChunkedStream(originalStream)
    let unchunkedStream = streamToUnchunkedStream(chunkedStream)

    yield streamToText(unchunkedStream).should.eventually.equal(
      'first second 世界你好 third fourth fifth')
  }))
})
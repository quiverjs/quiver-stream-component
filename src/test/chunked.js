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
const should = chai.should()

describe('chunked stream test', () => {
  it('simple stream to chunked stream', async(function*() {
    const testBuffers = [
      'hello',
      'javascript definitely rocks'
    ]

    const testChunkedContent = '5\r\nhello\r\n' +
        '1b\r\njavascript definitely rocks\r\n' +
        '0\r\n\r\n'

    const readStream = buffersToStream(testBuffers)
    const chunkedStream = streamToChunkedStream(readStream)

    yield streamToText(chunkedStream)
      .should.eventually.equal(testChunkedContent)
  }))

  it('simple chunked stream to stream', async(function*() {
    const testBuffers = [
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

    const testContent = 'hello javascript definitely rocks'

    const readStream = buffersToStream(testBuffers)
    const unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('bad chunked stream test', async(function*() {
    const testBuffers = buffers => {
      const readStream = buffersToStream(buffers)
      const unchunkedStream = streamToUnchunkedStream(readStream)

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
    const testBuffers = [
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

    const testContent = 'hello javascript definitely rocks'

    const readStream = buffersToStream(testBuffers)
    const unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('combined chunk unchunk test', async(function*() {
    const unicodeBuffer = new Buffer('世界你好')

    const testBuffers = [
      'first ',
      'second ',
      unicodeBuffer.slice(0, 5),
      unicodeBuffer.slice(5, 12),
      ' third ',
      'fourth ',
      'fifth'
    ]

    const originalStream = buffersToStream(testBuffers)
    const chunkedStream = streamToChunkedStream(originalStream)
    const unchunkedStream = streamToUnchunkedStream(chunkedStream)

    yield streamToText(unchunkedStream).should.eventually.equal(
      'first second 世界你好 third fourth fifth')
  }))
})
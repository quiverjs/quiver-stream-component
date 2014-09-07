import 'traceur'

import { async } from 'quiver-promise'
import {
  streamToText,
  buffersToStream
} from 'quiver-stream-util'

import { 
  streamToChunkedStream, streamToUnchunkedStream 
} from '../lib/chunked.js'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('chunked stream test', () => {
  it('simple stream to chunked stream', async(function*() {
    var testBuffers = [
      'hello',
      'javascript definitely rocks'
    ]

    var testChunkedContent = '5\r\nhello\r\n' +
        '1b\r\njavascript definitely rocks\r\n' +
        '0\r\n\r\n'

    var readStream = buffersToStream(testBuffers)
    var chunkedStream = streamToChunkedStream(readStream)

    yield streamToText(chunkedStream)
      .should.eventually.equal(testChunkedContent)
  }))

  it('simple chunked stream to stream', async(function*() {
    var testBuffers = [
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

    var testContent = 'hello javascript definitely rocks'

    var readStream = buffersToStream(testBuffers)
    var unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('complex chunked stream to stream', async(function*() {
    var testBuffers = [
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

    var testContent = 'hello javascript definitely rocks'

    var readStream = buffersToStream(testBuffers)
    var unchunkedStream = streamToUnchunkedStream(readStream)

    yield streamToText(unchunkedStream)
      .should.eventually.equal(testContent)
  }))

  it('combined chunk unchunk test', async(function*() {
    var unicodeBuffer = new Buffer('世界你好')

    var testBuffers = [
      'first ',
      'second ',
      unicodeBuffer.slice(0, 5),
      unicodeBuffer.slice(5, 12),
      ' third ',
      'fourth ',
      'fifth'
    ]

    var originalStream = buffersToStream(testBuffers)
    var chunkedStream = streamToChunkedStream(originalStream)
    var unchunkedStream = streamToUnchunkedStream(chunkedStream)

    yield streamToText(unchunkedStream).should.eventually.equal(
      'first second 世界你好 third fourth fifth')
  }))
})
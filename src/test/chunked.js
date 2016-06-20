import test from 'tape'

import { asyncTest, rejected } from 'quiver-core/util/tape'

import {
  overrideConfig
} from 'quiver-core/component/method'

import {
  loadHandler, createConfig, createArgs
} from 'quiver-core/component/util'

import {
  streamToText,
  buffersToStream
} from 'quiver-core/stream-util'

import {
  streamToChunkedStream, streamToUnchunkedStream
} from '../lib'

test('chunked stream test', assert => {
  assert::asyncTest('simple stream to chunked stream', async function(assert) {
    const testBuffers = [
      'hello',
      'javascript definitely rocks'
    ]

    const testChunkedContent = '5\r\nhello\r\n' +
        '1b\r\njavascript definitely rocks\r\n' +
        '0\r\n\r\n'

    const readStream = buffersToStream(testBuffers)
    const chunkedStream = streamToChunkedStream(readStream)

    const result = await streamToText(chunkedStream)
    assert.equal(result, testChunkedContent)

    assert.end()
  })

  assert::asyncTest('simple chunked stream to stream', async function(assert) {
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

    const result = await streamToText(unchunkedStream)
    assert.equal(result, testContent)

    assert.end()
  })

  assert::asyncTest('bad chunked stream test', async function(assert) {
    const testBuffers = async (buffers) => {
      const readStream = buffersToStream(buffers)
      const unchunkedStream = streamToUnchunkedStream(readStream)

      await assert::rejected(streamToText(unchunkedStream))
    }

    await testBuffers([
      '3', // wrong count
      '\r\n',
      'hello',
      '\r\n',
      '0',
      '\r\n',
      '\r\n'
    ])

    await testBuffers([
      '5\r\n',
      'hello',
      '\r\n',
      '0',
      '\r\n' // missing last \r\n
    ])

    await testBuffers([
      '5\r\n',
      'hello',
      '\r\n' // no trailer
    ])

    assert.end()
  })

  assert::asyncTest('complex chunked stream to stream', async function(assert) {
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

    const result = await streamToText(unchunkedStream)
    assert.equal(result, testContent)

    assert.end()
  })

  assert::asyncTest('combined chunk unchunk test', async function(assert) {
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

    const result = await streamToText(unchunkedStream)

    assert.equal(result, 'first second 世界你好 third fourth fifth')

    assert.end()
  })
})

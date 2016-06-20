import test from 'tape'

import { asyncTest } from 'quiver-core/util/tape'

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
  extractStreamHead, extractFixedStreamHead
} from '../lib'

test('fixed head extractor test', assert => {
  assert::asyncTest('trivial fixed head', async function(assert) {
    const assertBuffers = [
      '1234',
      'hello ',
      'world'
    ]

    const readStream = buffersToStream(assertBuffers)
    const [head, restStream] = await extractFixedStreamHead(
      readStream, 4)

    assert.equal(head.toString(), '1234')
    const result = await streamToText(restStream)
    assert.equal(result, 'hello world')

    assert.end()
  })

  assert::asyncTest('multiple fixed head', async function(assert) {
    const assertBuffers = [
      '12',
      '3',
      '4hello ',
      'world'
    ]

    const readStream = buffersToStream(assertBuffers)
    const [head, restStream] = await extractFixedStreamHead(
      readStream, 4)

    assert.equal(head.toString(), '1234')

    const result = await streamToText(restStream)
    assert.equal(result, 'hello world')

    assert.end()
  })

  assert::asyncTest('unicode fixed head', async function(assert) {
    const testHead = '世界你好'
    const testHeadBuffer = new Buffer(testHead)

    const assertBuffers = [
      testHeadBuffer.slice(0, 5),
      testHeadBuffer.slice(5, 10),
      Buffer.concat([testHeadBuffer.slice(10, 12), new Buffer('hell')]),
      'o world'
    ]

    const readStream = buffersToStream(assertBuffers)
    const [head, restStream] = await extractFixedStreamHead(
      readStream, 12)

    assert.equal(head.toString(), testHead)

    const result = await streamToText(restStream)
    assert.equal(result, 'hello world')

    assert.end()
  })
})

test('stream head dream extractor test', (assert) => {
  assert::asyncTest('simple test', async function() {
    const assertBuffers = async function(buffers) {
      const readStream = buffersToStream(buffers)

      const [head, restStream] = await extractStreamHead(
        readStream, '::')

      assert.equal(head.toString(), 'hello world')
      const result = await streamToText(restStream)
      assert.equal(result, 'goodbye dream')
    }

    await assertBuffers([
      'hello ',
      'world',
      '::',
      'goodbye ',
      'dream'
    ])

    await assertBuffers([
      'hello ',
      'world::goodbye ',
      'dream'
    ])

    await assertBuffers([
      'hello ',
      'world:',
      ':goodbye ',
      'dream'
    ])

    assert.end()
  })

  assert::asyncTest('test beginning separate', async function(assert) {
    const assertBuffers = [
      ':',
      ':hello ',
      'world'
    ]

    const readStream = buffersToStream(assertBuffers)

    const [head, restStream] = await extractStreamHead(
      readStream, '::')

    assert.equal(head.length, 0)

    const result = await streamToText(restStream)
    assert.equal(result, 'hello world')

    assert.end()
  })
})

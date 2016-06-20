import test from 'tape'

import { asyncTest } from 'quiver-core/util/tape'

import {
  buffersToStream
} from 'quiver-core/stream-util'

import {
  sizeWindowedStream
} from '../lib'

test('size windowed buffer test', assert => {
  assert::asyncTest('basic test', async function(assert) {
    const assertBuffer = async function(readStream, expected) {
      const { closed, data } = await readStream.read()
      const result = data.toString()
      assert.equal(result, expected)
    }

    const testBuffers = [
      'Foo',
      'Hello World',
      'Yo',
      'Lorem ipsum dolo'
    ]

    let readStream = buffersToStream(testBuffers)
    readStream = sizeWindowedStream(readStream, 3, 5)

    await assertBuffer(readStream, 'Foo')
    await assertBuffer(readStream, 'Hello')
    await assertBuffer(readStream, ' Worl')
    await assertBuffer(readStream, 'dYo')
    await assertBuffer(readStream, 'Lorem')
    await assertBuffer(readStream, ' ipsu')
    await assertBuffer(readStream, 'm dol')
    await assertBuffer(readStream, 'o')

    const { closed, data } = await readStream.read()
    assert.ok(closed)

    assert.end()
  })
})

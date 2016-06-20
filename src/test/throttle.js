import test from 'tape'

import { asyncTest } from 'quiver-core/util/tape'

import {
  buffersToStream,
  streamToBuffers
} from 'quiver-core/stream-util'

import { throttledStream } from '../lib/throttle'

const testRate = 1024

const testBuffers = []
for(let i=0; i<10; i++) {
  testBuffers.push(new Buffer(128))
}

test('throttle test', assert => {
  assert::asyncTest('basic throttle', async function(assert) {
    const readStream1 = buffersToStream(testBuffers)
    const readStream = throttledStream(readStream1, testRate)

    const start = Date.now()

    const result = await streamToBuffers(readStream)
    assert.deepEqual(result, testBuffers)

    const end = Date.now()
    const diff = end - start

    if(diff < 1000 || diff > 1500) {
      throw new Error('Expect throttled stream to finish in 1 second')
    }

    assert.end()
  })
})

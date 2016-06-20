import test from 'tape'

import { asyncTest } from 'quiver-core/util/tape'

import {
  overrideConfig
} from 'quiver-core/component/method'

import {
  loadHandler, createConfig, createArgs
} from 'quiver-core/component/util'

import {
  buffersToStreamable
} from 'quiver-core/stream-util'

import {
  checksumHandler
} from '../lib'

test('stream checksum test', assert => {
  assert::asyncTest('sha1sum', async function(assert) {
    const main = checksumHandler()
      ::overrideConfig({ checksumAlgorithm: 'sha1' })

    const config = createConfig({})
    const handler = await loadHandler(config, main)

    const testChecksum = '648a6a6ffffdaa0badb23b8baf90b6168dd16b3a'

    const streamable = buffersToStreamable([
      'Hello ', 'World\n'
    ])

    const args = createArgs()
    const result= await handler(args, streamable)
    assert.equal(result, testChecksum)

    assert.ok(streamable['checksum-sha1'])
    assert.equal(streamable['checksum-sha1'], testChecksum)

    assert.end()
  })
})

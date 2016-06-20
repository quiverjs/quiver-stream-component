import test from 'tape'

import { asyncTest, rejected } from 'quiver-core/util/tape'

import {
  overrideConfig
} from 'quiver-core/component/method'

import {
  loadHandler, createConfig, createArgs, streamHandlerLoader
} from 'quiver-core/component/util'

import {
  simpleHandler, loadStreamHandler
} from 'quiver-core/component/constructor'

import {
  createChannel, textToStreamable,
  streamableToText, streamToStreamable
} from 'quiver-core/stream-util'

import {
  timeoutStream,
  timeoutStreamFilter
} from '../lib'

test('timeout stream test', assert => {
  assert::asyncTest('basic test', async function(assert) {
    let { readStream, writeStream } = createChannel()
    readStream = timeoutStream(readStream, 100)

    writeStream.write('foo')

    const { closed, data } = await readStream.read()
    assert.equal(data, 'foo')

    await assert::rejected(readStream.read())

    assert.end()
  })

  assert::asyncTest('timeout filter test', async function(assert) {
    const timeoutFilter = timeoutStreamFilter()
      ::overrideConfig({
        filterMode: 'in'
      })

    const component = simpleHandler(
      (args, name) => 'Hello, ' + name,
      {
        inputType: 'text',
        outputType: 'text'
      })
    .addMiddleware(timeoutFilter)
    .setLoader(streamHandlerLoader)

    const config = createConfig({
      streamTimeout: 100
    })

    const handler = await loadHandler(config, component)

    const args = createArgs()
    const result = await handler(args, textToStreamable('World'))
      .then(streamableToText)

    assert.equal(result, 'Hello, World')

    const { readStream, writeStream } = createChannel()
    writeStream.write('foo')

    const streamable = streamToStreamable(readStream)

    await assert::rejected(handler(args, streamable))

    assert.end()
  })
})

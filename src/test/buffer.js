import test from 'tape'

import { asyncTest } from 'quiver-core/util/tape'

import {
  simpleHandler,
  simpleHandlerLoader
} from 'quiver-core/component/constructor'

import {
  overrideConfig
} from 'quiver-core/component/method'

import {
  loadHandler, createConfig, createArgs
} from 'quiver-core/component/util'

import {
  textToStream,
  streamToText,
  buffersToStream
} from 'quiver-core/stream-util'

import {
  bufferConvertHandler,
  bufferConvertFilter,
  bufferStreamFilter
} from '../lib'

test('buffer convert test', assert => {
  assert::asyncTest('uppercase handler', async function(assert) {
    const toUpperCase = data =>
      data.toString().toUpperCase()

    const component = bufferConvertHandler()
      ::overrideConfig({
        bufferConverter: toUpperCase
      })

    const config = createConfig()
    const handler = await loadHandler(config, component)

    const args = createArgs()
    const result1 = await handler(args, textToStream('Hello World'))
      .then(streamToText)

    assert.equal(result1, 'HELLO WORLD')

    const inputStreamable = buffersToStream(
      ['Hell', 'o Wo', 'rld'])

    const result2 = await handler(args, inputStreamable)
      .then(streamToText)

    assert.equal(result2, 'HELLO WORLD')

    assert.end()
  })

  assert::asyncTest('filter convert test', async function(assert) {
    const toUpperCase = data => {
      return data.toString().toUpperCase()
    }

    const toLowerCase = data => {
      return data.toString().toLowerCase()
    }

    const inFilter = bufferConvertFilter()
      ::overrideConfig({
        filterMode: 'in',
        bufferConverter: toUpperCase
      })

    const outFilter = bufferConvertFilter()
      ::overrideConfig({
        filterMode: 'out',
        bufferConverter: toLowerCase
      })

    const component = simpleHandler((args, name) => {
      assert.equal(name, 'JOHN')

      return 'Hello, ' + name

    }, {
      inputType: 'text',
      outputType: 'text'
    })
    .addMiddleware(inFilter)
    .addMiddleware(outFilter)

    const config = createConfig()
    const handler = await loadHandler(config, component)

    const args = createArgs()
    const result = await handler(args, 'John')
    assert.equal(result, 'hello, john')

    assert.end()
  })
})

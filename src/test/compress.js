import zlib from 'zlib'
import test from 'tape'

import { extract } from 'quiver-core/util/immutable'
import { asyncTest } from 'quiver-core/util/tape'

import {
  overrideConfig, inputHandlers
} from 'quiver-core/component/method'

import {
  loadHandler, streamHandlerLoader, createConfig, createArgs
} from 'quiver-core/component/util'

import { promisify } from 'quiver-core/util/promise'

import {
  simpleHandler,
  simpleHandlerBuilder
} from 'quiver-core/component/constructor'

import {
  textToStreamable,
  streamableToText,
  streamToBuffer,
  streamableToBuffer,
} from 'quiver-core/stream-util'

import { compressHandler } from '../lib'

const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)

const testContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra felis sed luctus vulputate. Vivamus imperdiet elit neque, vitae hendrerit nisl feugiat ut. Morbi et mauris a lorem placerat porta eu non quam. Vivamus felis eros, venenatis nec faucibus sed, aliquet vel justo. Nam in cursus ex. Morbi a pellentesque nunc. Aliquam quis sodales enim, id cursus turpis. Suspendisse scelerisque nulla vel placerat aliquam.'

test('compress stream test', assert => {
  assert::asyncTest('basic gzip compression', async function(assert) {
    const compressed = await gzip(testContent)

    const uncompressed = await gunzip(compressed)
    assert.equal(uncompressed.toString(), testContent)

    const component = compressHandler()
      ::overrideConfig({ compressAlgorithm: 'gzip' })
      .setLoader(streamHandlerLoader)

    const config = createConfig()
    let gzipHandler = await loadHandler(config, component)

    const inputStreamable = textToStreamable(testContent)

    const args = createArgs()
    const resultStreamable = await gzipHandler(args, inputStreamable)

    const resultBuffer = await streamableToBuffer(resultStreamable)

    assert.equal(Buffer.compare(
      resultBuffer, compressed), 0)

    assert.ok(inputStreamable.toGzipStreamable)

    const cachedStreamable = await inputStreamable.toGzipStreamable()

    const cachedBuffer = await cachedStreamable.toStream()
      .then(streamToBuffer)

    assert.equal(Buffer.compare(
      resultBuffer, compressed), 0)

    assert.end()
  })

  assert::asyncTest('basic gzip compression', async function(assert) {
    const gzipHandler = compressHandler()
      ::overrideConfig({
        compressAlgorithm: 'gzip'
      })

    const gunzipHandler = compressHandler()
      ::overrideConfig({
        compressAlgorithm: 'gunzip'
      })

    const main = simpleHandlerBuilder(
      config => {
        const { gzip, gunzip } = config::extract()

        return async args => {
          const streamable = textToStreamable(testContent)
          const streamable2 = await gzip(args, streamable)
          return gunzip(args, streamable2)
        }
      },
      {
        inputType: 'void',
        outputType: 'streamable'
      })
    ::inputHandlers({
      gzip: gzipHandler,
      gunzip: gunzipHandler
    })

    const config = createConfig()
    const handler = await loadHandler(config, main)

    const args = createArgs()
    const result = await handler(args)
      .then(streamableToText)

    assert.equal(result, testContent)

    assert.end()
  })
})

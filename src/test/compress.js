import zlib from 'zlib'
import { async, promisify } from 'quiver-core/promise'

import { 
  simpleHandler,
  transformFilter,
  loadStreamHandler 
} from 'quiver-core/component'

import { 
  textToStreamable, 
  streamToBuffer,
  streamableToBuffer,
} from 'quiver-core/stream-util'

import { compressHandler } from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

const gzip = promisify(zlib.gzip)
const gunzip = promisify(zlib.gunzip)

const testContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra felis sed luctus vulputate. Vivamus imperdiet elit neque, vitae hendrerit nisl feugiat ut. Morbi et mauris a lorem placerat porta eu non quam. Vivamus felis eros, venenatis nec faucibus sed, aliquet vel justo. Nam in cursus ex. Morbi a pellentesque nunc. Aliquam quis sodales enim, id cursus turpis. Suspendisse scelerisque nulla vel placerat aliquam.'

describe('compress stream test', () => {
  it('basic gzip compression', async(function*() {
    const compressed = yield gzip(testContent)

    const uncompressed = yield gunzip(compressed)
    uncompressed.toString().should.equal(testContent)

    const component = compressHandler()
      .configOverride({ compressAlgorithm: 'gzip' })
      .setLoader(loadStreamHandler)

    let gzipHandler = yield component.loadHandler({})

    const inputStreamable = textToStreamable(testContent)

    const resultStreamable = yield gzipHandler({}, inputStreamable)

    const resultBuffer = yield streamableToBuffer(resultStreamable)

    should.equal(Buffer.compare(
      resultBuffer, compressed), 0)

    should.exist(inputStreamable.toGzipStreamable)

    const cachedStreamable = yield inputStreamable.toGzipStreamable()
    
    const cachedBuffer = yield cachedStreamable.toStream()
      .then(streamToBuffer)

    should.equal(Buffer.compare(
      resultBuffer, compressed), 0)

    gzipHandler = compressHandler()
      .configOverride({
        compressAlgorithm: 'gzip'
      })

    const gunzipHandler = compressHandler()
      .configOverride({
        compressAlgorithm: 'gunzip'
      })

    const main = simpleHandler(
      args => testContent, 
      'void', 'text')
      .middleware(transformFilter(gzipHandler, 'out'))
      .middleware(transformFilter(gunzipHandler, 'out'))

    const handler = yield main.loadHandler({})

    yield handler().should.eventually.equal(testContent)
  }))
})
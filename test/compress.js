import 'quiver-core/traceur'
import zlib from 'zlib'
import buffertools from 'buffertools'
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
var should = chai.should()

var gzip = promisify(zlib.gzip)
var gunzip = promisify(zlib.gunzip)

var testContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi viverra felis sed luctus vulputate. Vivamus imperdiet elit neque, vitae hendrerit nisl feugiat ut. Morbi et mauris a lorem placerat porta eu non quam. Vivamus felis eros, venenatis nec faucibus sed, aliquet vel justo. Nam in cursus ex. Morbi a pellentesque nunc. Aliquam quis sodales enim, id cursus turpis. Suspendisse scelerisque nulla vel placerat aliquam.'

describe('compress stream test', () => {
  it('basic gzip compression', async(function*() {
    var compressed = yield gzip(testContent)

    var uncompressed = yield gunzip(compressed)
    uncompressed.toString().should.equal(testContent)

    var gzipHandler = yield loadStreamHandler({}, 
      compressHandler('gzip'))

    var inputStreamable = textToStreamable(testContent)
    var resultBuffer = yield gzipHandler({}, inputStreamable)
      .then(streamableToBuffer)

    should.equal(buffertools.compare(
      resultBuffer, compressed), 0)

    should.exist(inputStreamable.toGzipStreamable)

    var cachedStreamable = yield inputStreamable.toGzipStreamable()
    
    var cachedBuffer = yield cachedStreamable.toStream()
      .then(streamToBuffer)

    should.equal(buffertools.compare(
      resultBuffer, compressed), 0)

    var gzipHandler = compressHandler()
      .configOverride({
        compressAlgorithm: 'gzip'
      })

    var gunzipHandler = compressHandler()
      .configOverride({
        compressAlgorithm: 'gunzip'
      })

    var main = simpleHandler(
      args => testContent, 
      'void', 'text')
      .middleware(transformFilter(gzipHandler, 'out'))
      .middleware(transformFilter(gunzipHandler, 'out'))

    var handler = yield main.loadHandler({})

    yield handler().should.eventually.equal(testContent)
  }))
})
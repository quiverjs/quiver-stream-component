import 'traceur'

import { async } from 'quiver-promise'

import {
  buffersToStream,
  streamToBuffers
} from 'quiver-stream-util'

import { throttledStream } from '../lib/throttle'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

var testRate = 1024

var testBuffers = []
for(var i=0; i<10; i++) {
  testBuffers.push(new Buffer(128))
}

describe('throttle test', () => {
  it('basic throttle', async(function*() {
    var readStream = buffersToStream(testBuffers)
    readStream = throttledStream(readStream, testRate)

    var start = Date.now()

    yield streamToBuffers(readStream)
      .should.eventually.eql(testBuffers)

    var end = Date.now()
    var diff = end - start

    if(diff < 1000 || diff > 1500) {
      throw new Error('Expect throttled stream to finish in 1 second')
    }
  }))
})
import 'quiver-core/traceur'

import { async } from 'quiver-core/promise'

import {
  buffersToStream,
  streamToBuffers
} from 'quiver-core/stream-util'

import { throttledStream } from '../lib/throttle'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

let testRate = 1024

let testBuffers = []
for(let i=0; i<10; i++) {
  testBuffers.push(new Buffer(128))
}

describe('throttle test', () => {
  it('basic throttle', async(function*() {
    let readStream = buffersToStream(testBuffers)
    readStream = throttledStream(readStream, testRate)

    let start = Date.now()

    yield streamToBuffers(readStream)
      .should.eventually.eql(testBuffers)

    let end = Date.now()
    let diff = end - start

    if(diff < 1000 || diff > 1500) {
      throw new Error('Expect throttled stream to finish in 1 second')
    }
  }))
})
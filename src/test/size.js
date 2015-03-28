import { async } from 'quiver/promise'

import {
  buffersToStream
} from 'quiver/stream-util'

import {
  sizeWindowedStream
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('size windowed buffer test', () => {
  const assertBuffer = (readStream, expected) =>
    readStream.read()
      .then(({closed, data}) => 
        data.toString())
      .should.eventually.equal(expected)


  it('basic test', async(function*() {
    const testBuffers = [
      'Foo',
      'Hello World',
      'Yo',
      'Lorem ipsum dolo'
    ]

    let readStream = buffersToStream(testBuffers)
    readStream = sizeWindowedStream(readStream, 3, 5)

    yield assertBuffer(readStream, 'Foo')
    yield assertBuffer(readStream, 'Hello')
    yield assertBuffer(readStream, ' Worl')
    yield assertBuffer(readStream, 'dYo')
    yield assertBuffer(readStream, 'Lorem')
    yield assertBuffer(readStream, ' ipsu')
    yield assertBuffer(readStream, 'm dol')
    yield assertBuffer(readStream, 'o')

    const { closed, data } = yield readStream.read()
    should.exist(closed)
  }))
})
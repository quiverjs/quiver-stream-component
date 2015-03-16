import { async } from 'quiver-core/promise'

import { 
  simpleHandler, loadStreamHandler
} from 'quiver-core/component'

import {
  createChannel, textToStreamable, 
  streamableToText, streamToStreamable
} from 'quiver-core/stream-util'

import {
  timeoutStream,
  timeoutStreamFilter
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('timeout stream test', () => {
  it('basic test', async(function*() {
    let { readStream, writeStream } = createChannel()
    readStream = timeoutStream(readStream, 100)

    writeStream.write('foo')

    let { closed, data } = yield readStream.read()
    data.should.equal('foo')

    yield readStream.read()
      .should.be.rejected
  }))

  it('timeout filter test', async(function*() {
    let timeoutFilter = timeoutStreamFilter()
      .configOverride({
        filterMode: 'in'
      })

    let component = simpleHandler(
      (args, name) => 'Hello, ' + name,
      'text', 'text')
    .middleware(timeoutFilter)
    .setLoader(loadStreamHandler)

    let handler = yield component.loadHandler({
      streamTimeout: 100
    })

    yield handler({}, textToStreamable('World'))
      .then(streamableToText)
      .should.eventually.equal('Hello, World')

    let { readStream, writeStream } = createChannel()
    writeStream.write('foo')

    let streamable = streamToStreamable(readStream)

    yield handler({}, streamable)
      .should.be.rejected
  }))
})
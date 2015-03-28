import { async } from 'quiver/promise'

import { 
  simpleHandler, loadStreamHandler
} from 'quiver/component'

import {
  createChannel, textToStreamable, 
  streamableToText, streamToStreamable
} from 'quiver/stream-util'

import {
  timeoutStream,
  timeoutStreamFilter
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('timeout stream test', () => {
  it('basic test', async(function*() {
    let { readStream, writeStream } = createChannel()
    readStream = timeoutStream(readStream, 100)

    writeStream.write('foo')

    const { closed, data } = yield readStream.read()
    data.should.equal('foo')

    yield readStream.read()
      .should.be.rejected
  }))

  it('timeout filter test', async(function*() {
    const timeoutFilter = timeoutStreamFilter()
      .configOverride({
        filterMode: 'in'
      })

    const component = simpleHandler(
      (args, name) => 'Hello, ' + name,
      'text', 'text')
    .middleware(timeoutFilter)
    .setLoader(loadStreamHandler)

    const handler = yield component.loadHandler({
      streamTimeout: 100
    })

    yield handler({}, textToStreamable('World'))
      .then(streamableToText)
      .should.eventually.equal('Hello, World')

    const { readStream, writeStream } = createChannel()
    writeStream.write('foo')

    const streamable = streamToStreamable(readStream)

    yield handler({}, streamable)
      .should.be.rejected
  }))
})
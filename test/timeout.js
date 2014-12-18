import 'traceur'

import { async } from 'quiver-promise'

import { 
  simpleHandler, loadStreamHandler
} from 'quiver-component'

import {
  createChannel, textToStreamable, 
  streamableToText, streamToStreamable
} from 'quiver-stream-util'

import {
  timeoutStream
} from '../lib/timeout'

import {
  timeoutStreamFilter
} from '../lib/component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('timeout stream test', () => {
  it('basic test', async(function*() {
    var { readStream, writeStream } = createChannel()
    readStream = timeoutStream(readStream, 100)

    writeStream.write('foo')

    var { closed, data } = yield readStream.read()
    data.should.equal('foo')

    yield readStream.read()
      .should.be.rejected
  }))

  it('timeout filter test', async(function*() {
    var component = simpleHandler(
      (args, name) => 'Hello, ' + name,
      'text', 'text')
    .middleware(timeoutStreamFilter('in'))

    var handler = yield loadStreamHandler({
      streamTimeout: 100
    }, component)

    yield handler({}, textToStreamable('World'))
      .then(streamableToText)
      .should.eventually.equal('Hello, World')

    var { readStream, writeStream } = createChannel()
    writeStream.write('foo')

    var streamable = streamToStreamable(readStream)

    yield handler({}, streamable)
      .should.be.rejected
  }))
})
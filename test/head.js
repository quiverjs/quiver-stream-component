import 'traceur'

import { async } from 'quiver-promise'
import {
  streamToText,
  buffersToStream
} from 'quiver-stream-util'

import { 
  extractStreamHead, extractFixedStreamHead 
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('fixed head extractor test', () => {
  it('trivial fixed head', async(function*() {
    var testBuffers = [
      '1234',
      'hello ',
      'world'
    ]

    var readStream = buffersToStream(testBuffers)
    var [head, restStream] = yield extractFixedStreamHead(
      readStream, 4)

    head.toString().should.equal('1234')
    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))


  it('multiple fixed head', async(function*() {
    var testBuffers = [
      '12',
      '3',
      '4hello ',
      'world'
    ]

    var readStream = buffersToStream(testBuffers)
    var [head, restStream] = yield extractFixedStreamHead(
      readStream, 4)

    head.toString().should.equal('1234')
    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))

  it('unicode fixed head', async(function*() {
    var testHead = '世界你好'
    var testHeadBuffer = new Buffer(testHead)

    var testBuffers = [
      testHeadBuffer.slice(0, 5),
      testHeadBuffer.slice(5, 10),
      Buffer.concat([testHeadBuffer.slice(10, 12), new Buffer('hell')]),
      'o world'
    ]

    var readStream = buffersToStream(testBuffers)
    var [head, restStream] = yield extractFixedStreamHead(
      readStream, 12)

    head.toString().should.equal(testHead)

    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))
})

describe('stream head dream extractor test', () => {
  it('simple test', async(function*() {
    var testBuffers = async(function*(buffers) {
      var readStream = buffersToStream(buffers)

      var [head, restStream] = yield extractStreamHead(
        readStream, '::')

      head.toString().should.equal('hello world')
      yield streamToText(restStream)
        .should.eventually.equal('goodbye dream')
    })

    yield testBuffers([
      'hello ',
      'world',
      '::',
      'goodbye ',
      'dream'
    ])

    yield testBuffers([
      'hello ',
      'world::goodbye ',
      'dream'
    ])

    yield testBuffers([
      'hello ',
      'world:',
      ':goodbye ',
      'dream'
    ])
  }))

  it('test beginning separate', async(function*() {
    var testBuffers = [
      ':',
      ':hello ',
      'world'
    ]

    var readStream = buffersToStream(testBuffers)

    var [head, restStream] = yield extractStreamHead(
      readStream, '::')

    head.length.should.equal(0)

    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))
})
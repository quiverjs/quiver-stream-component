import { async } from 'quiver-core/promise'
import {
  streamToText,
  buffersToStream
} from 'quiver-core/stream-util'

import { 
  extractStreamHead, extractFixedStreamHead 
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('fixed head extractor test', () => {
  it('trivial fixed head', async(function*() {
    let testBuffers = [
      '1234',
      'hello ',
      'world'
    ]

    let readStream = buffersToStream(testBuffers)
    let [head, restStream] = yield extractFixedStreamHead(
      readStream, 4)

    head.toString().should.equal('1234')
    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))


  it('multiple fixed head', async(function*() {
    let testBuffers = [
      '12',
      '3',
      '4hello ',
      'world'
    ]

    let readStream = buffersToStream(testBuffers)
    let [head, restStream] = yield extractFixedStreamHead(
      readStream, 4)

    head.toString().should.equal('1234')
    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))

  it('unicode fixed head', async(function*() {
    let testHead = '世界你好'
    let testHeadBuffer = new Buffer(testHead)

    let testBuffers = [
      testHeadBuffer.slice(0, 5),
      testHeadBuffer.slice(5, 10),
      Buffer.concat([testHeadBuffer.slice(10, 12), new Buffer('hell')]),
      'o world'
    ]

    let readStream = buffersToStream(testBuffers)
    let [head, restStream] = yield extractFixedStreamHead(
      readStream, 12)

    head.toString().should.equal(testHead)

    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))
})

describe('stream head dream extractor test', () => {
  it('simple test', async(function*() {
    let testBuffers = async(function*(buffers) {
      let readStream = buffersToStream(buffers)

      let [head, restStream] = yield extractStreamHead(
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
    let testBuffers = [
      ':',
      ':hello ',
      'world'
    ]

    let readStream = buffersToStream(testBuffers)

    let [head, restStream] = yield extractStreamHead(
      readStream, '::')

    head.length.should.equal(0)

    yield streamToText(restStream)
      .should.eventually.equal('hello world')
  }))
})
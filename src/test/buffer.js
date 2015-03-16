import { async } from 'quiver-core/promise'

import {
  simpleHandler,
  simpleHandlerLoader
} from 'quiver-core/component'

import {
  textToStream,
  streamToText,
  buffersToStream
} from 'quiver-core/stream-util'

import {
  bufferConvertHandler,
  bufferConvertFilter,
  bufferStreamFilter
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('buffer convert test', () => {
  it('uppercase handler', async(function*() {
    let toUpperCase = data =>
      data.toString().toUpperCase()

    let component = bufferConvertHandler()
      .configOverride({
        bufferConverter: toUpperCase
      })

    let handler = yield component.loadHandler({})

    yield handler({}, textToStream('Hello World'))
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')

    let inputStreamable = buffersToStream(
      ['Hell', 'o Wo', 'rld'])

    yield handler({}, inputStreamable)
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')
  }))

  it('filter convert test', async(function*() {
    let toUpperCase = data => {
      return data.toString().toUpperCase()
    }

    let toLowerCase = data => {
      return data.toString().toLowerCase()
    }

    let inFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'in',
        bufferConverter: toUpperCase
      })

    let outFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'out',
        bufferConverter: toLowerCase
      })

    let component = simpleHandler((args, name) => {
      name.should.equal('JOHN')

      return 'Hello, ' + name
    }, 'text', 'text')
    .middleware(inFilter)
    .middleware(outFilter)

    let handler = yield component.loadHandler({})

    yield handler({}, 'John')
      .should.eventually.equal('hello, john')
  }))
})
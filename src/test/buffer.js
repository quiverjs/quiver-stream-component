import { async } from 'quiver/promise'

import {
  simpleHandler,
  simpleHandlerLoader
} from 'quiver/component'

import {
  textToStream,
  streamToText,
  buffersToStream
} from 'quiver/stream-util'

import {
  bufferConvertHandler,
  bufferConvertFilter,
  bufferStreamFilter
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('buffer convert test', () => {
  it('uppercase handler', async(function*() {
    const toUpperCase = data =>
      data.toString().toUpperCase()

    const component = bufferConvertHandler()
      .configOverride({
        bufferConverter: toUpperCase
      })

    const handler = yield component.loadHandler({})

    yield handler({}, textToStream('Hello World'))
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')

    const inputStreamable = buffersToStream(
      ['Hell', 'o Wo', 'rld'])

    yield handler({}, inputStreamable)
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')
  }))

  it('filter convert test', async(function*() {
    const toUpperCase = data => {
      return data.toString().toUpperCase()
    }

    const toLowerCase = data => {
      return data.toString().toLowerCase()
    }

    const inFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'in',
        bufferConverter: toUpperCase
      })

    const outFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'out',
        bufferConverter: toLowerCase
      })

    const component = simpleHandler((args, name) => {
      name.should.equal('JOHN')

      return 'Hello, ' + name
    }, 'text', 'text')
    .middleware(inFilter)
    .middleware(outFilter)

    const handler = yield component.loadHandler({})

    yield handler({}, 'John')
      .should.eventually.equal('hello, john')
  }))
})
import 'quiver-core/traceur'

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
var should = chai.should()

describe('buffer convert test', () => {
  it('uppercase handler', async(function*() {
    var toUpperCase = data =>
      data.toString().toUpperCase()

    var component = bufferConvertHandler()
      .configOverride({
        bufferConverter: toUpperCase
      })

    var handler = yield component.loadHandler({})

    yield handler({}, textToStream('Hello World'))
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')

    var inputStreamable = buffersToStream(
      ['Hell', 'o Wo', 'rld'])

    yield handler({}, inputStreamable)
      .then(streamToText)
      .should.eventually.equal('HELLO WORLD')
  }))

  it('filter convert test', async(function*() {
    var toUpperCase = data => {
      return data.toString().toUpperCase()
    }

    var toLowerCase = data => {
      return data.toString().toLowerCase()
    }

    var inFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'in',
        bufferConverter: toUpperCase
      })

    var outFilter = bufferConvertFilter()
      .configOverride({
        filterMode: 'out',
        bufferConverter: toLowerCase
      })

    var component = simpleHandler((args, name) => {
      name.should.equal('JOHN')

      return 'Hello, ' + name
    }, 'text', 'text')
    .middleware(inFilter)
    .middleware(outFilter)

    var handler = yield component.loadHandler({})

    yield handler({}, 'John')
      .should.eventually.equal('hello, john')
  }))
})
import 'traceur'

import { async } from 'quiver-promise'

import {
  simpleHandler,
  loadSimpleHandler
} from 'quiver-component'

import {
  buffersToStreamable,
  streamableToText
} from 'quiver-stream-util'

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

    var component = bufferConvertHandler(toUpperCase)

    var handler1 = yield loadSimpleHandler(
      {}, component, 'text', 'text')

    yield handler1({}, 'Hello World')
      .should.eventually.equal('HELLO WORLD')

    var handler2 = yield loadSimpleHandler(
      {}, component, 'streamable', 'text')

    var inputStreamable = buffersToStreamable(
      ['Hell', 'o Wo', 'rld'])

    yield handler2({}, inputStreamable)
      .should.eventually.equal('HELLO WORLD')
  }))

  it('filter convert test', async(function*() {
    var toUpperCase = data => {
      return data.toString().toUpperCase()
    }

    var toLowerCase = data => {
      return data.toString().toLowerCase()
    }

    var component = simpleHandler((args, name) => {
      name.should.equal('JOHN')

      return 'Hello, ' + name
    }, 'text', 'text')
    .middleware(bufferConvertFilter(
      toUpperCase, 'in'))
    .middleware(bufferConvertFilter(
      toLowerCase, 'out'))

    var handler = yield component.loadHandler({})

    yield handler({}, 'John')
      .should.eventually.equal('hello, john')
  }))
})
import 'traceur'

import { async } from 'quiver-promise'

import {
  buffersToStreamable
} from 'quiver-stream-util'

import {
  checksumHandler
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
var should = chai.should()

describe('stream checksum test', () => {
  it('sha1sum', async(function*() {
    var main = checksumHandler('sha1')
    var handler = yield main.loadHandler({})

    var testChecksum = '648a6a6ffffdaa0badb23b8baf90b6168dd16b3a'

    var streamable = buffersToStreamable([
      'Hello ', 'World\n'
    ])

    yield handler({}, streamable)
      .should.eventually.equal(
        testChecksum)

    should.exist(streamable['checksum-sha1'])
    streamable['checksum-sha1'].should.equal(testChecksum)
  }))
})
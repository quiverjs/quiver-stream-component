import 'quiver-core/traceur'

import { async } from 'quiver-core/promise'

import {
  buffersToStreamable
} from 'quiver-core/stream-util'

import {
  checksumHandler
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
let should = chai.should()

describe('stream checksum test', () => {
  it('sha1sum', async(function*() {
    let main = checksumHandler()
      .configOverride({ checksumAlgorithm: 'sha1' })

    let handler = yield main.loadHandler({})

    let testChecksum = '648a6a6ffffdaa0badb23b8baf90b6168dd16b3a'

    let streamable = buffersToStreamable([
      'Hello ', 'World\n'
    ])

    yield handler({}, streamable)
      .should.eventually.equal(
        testChecksum)

    should.exist(streamable['checksum-sha1'])
    streamable['checksum-sha1'].should.equal(testChecksum)
  }))
})
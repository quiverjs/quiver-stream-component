import { async } from 'quiver/promise'

import {
  buffersToStreamable
} from 'quiver/stream-util'

import {
  checksumHandler
} from '../lib/stream-component'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

chai.use(chaiAsPromised)
const should = chai.should()

describe('stream checksum test', () => {
  it('sha1sum', async(function*() {
    const main = checksumHandler()
      .configOverride({ checksumAlgorithm: 'sha1' })

    const handler = yield main.loadHandler({})

    const testChecksum = '648a6a6ffffdaa0badb23b8baf90b6168dd16b3a'

    const streamable = buffersToStreamable([
      'Hello ', 'World\n'
    ])

    yield handler({}, streamable)
      .should.eventually.equal(
        testChecksum)

    should.exist(streamable['checksum-sha1'])
    streamable['checksum-sha1'].should.equal(testChecksum)
  }))
})
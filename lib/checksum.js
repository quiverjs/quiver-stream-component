import crypto from 'crypto'
var { createHash, getHashes } = crypto

import { async, reject } from 'quiver-core/promise'
import { simpleHandlerBuilder } from 'quiver-core/component'

export var checksumStream = async(
function*(readStream, algorithm) {
  var checksum = createHash(algorithm)

  while(true) {
    var { closed, data } = yield readStream.read()
    if(closed) return checksum.digest('hex')

    checksum.update(data)
  }
})

export var checksumStreamable = async(
function*(streamable, algorithm, checksumField) {
  if(streamable[checksumField])
    return streamable[checksumField]

  var readStream = yield streamable.toStream()
  
  var checksum = yield checksumStream(readStream, algorithm)

  if(streamable.reusable)
    streamable[checksumField] = checksum

  return checksum
})

export var checksumHandler = simpleHandlerBuilder(
config => {
  var { checksumAlgorithm='sha1' } = config
  var checksumField = 'checksum-' + checksumAlgorithm

  if(getHashes().indexOf(checksumAlgorithm) == -1)
    return reject(error(500, 'platform do not ' +
      'support checksum algorithm ' + checksumAlgorithm))

  return (args, streamable) =>
    checksumStreamable(streamable, checksumAlgorithm, checksumField)

}, 'streamable', 'text')

export var makeChecksumHandler = checksumHandler.factory()
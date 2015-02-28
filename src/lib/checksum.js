import crypto from 'crypto'
let { createHash, getHashes } = crypto

import { async, reject } from 'quiver-core/promise'
import { simpleHandlerBuilder } from 'quiver-core/component'

export let checksumStream = async(
function*(readStream, algorithm) {
  let checksum = createHash(algorithm)

  while(true) {
    let { closed, data } = yield readStream.read()
    if(closed) return checksum.digest('hex')

    checksum.update(data)
  }
})

export let checksumStreamable = async(
function*(streamable, algorithm, checksumField) {
  if(streamable[checksumField])
    return streamable[checksumField]

  let readStream = yield streamable.toStream()
  
  let checksum = yield checksumStream(readStream, algorithm)

  if(streamable.reusable)
    streamable[checksumField] = checksum

  return checksum
})

export let checksumHandler = simpleHandlerBuilder(
config => {
  let { checksumAlgorithm='sha1' } = config
  let checksumField = 'checksum-' + checksumAlgorithm

  if(getHashes().indexOf(checksumAlgorithm) == -1)
    return reject(error(500, 'platform do not ' +
      'support checksum algorithm ' + checksumAlgorithm))

  return (args, streamable) =>
    checksumStreamable(streamable, checksumAlgorithm, checksumField)

}, 'streamable', 'text')

export let makeChecksumHandler = checksumHandler.factory()
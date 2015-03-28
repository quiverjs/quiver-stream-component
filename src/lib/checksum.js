import crypto from 'crypto'
const { createHash, getHashes } = crypto

import { async, reject } from 'quiver/promise'
import { simpleHandlerBuilder } from 'quiver/component'

export const checksumStream = async(
function*(readStream, algorithm) {
  const checksum = createHash(algorithm)

  while(true) {
    const { closed, data } = yield readStream.read()
    if(closed) return checksum.digest('hex')

    checksum.update(data)
  }
})

export const checksumStreamable = async(
function*(streamable, algorithm, checksumField) {
  if(streamable[checksumField])
    return streamable[checksumField]

  const readStream = yield streamable.toStream()
  
  const checksum = yield checksumStream(readStream, algorithm)

  if(streamable.reusable)
    streamable[checksumField] = checksum

  return checksum
})

export const checksumHandler = simpleHandlerBuilder(
config => {
  const { checksumAlgorithm='sha1' } = config
  const checksumField = 'checksum-' + checksumAlgorithm

  if(getHashes().indexOf(checksumAlgorithm) == -1)
    return reject(error(500, 'platform do not ' +
      'support checksum algorithm ' + checksumAlgorithm))

  return (args, streamable) =>
    checksumStreamable(streamable, checksumAlgorithm, checksumField)

}, 'streamable', 'text')

export const makeChecksumHandler = checksumHandler.factory()
import { createHash, getHashes } from 'crypto'
import { extract } from 'quiver-core/util/immutable'
import { simpleHandlerBuilder } from 'quiver-core/component/constructor'

export const checksumStream = async function(readStream, algorithm) {
  const checksum = createHash(algorithm)

  while(true) {
    const { closed, data } = await readStream.read()
    if(closed) return checksum.digest('hex')

    checksum.update(data)
  }
}

export const checksumStreamable = async function(streamable, algorithm, checksumField) {
  if(streamable[checksumField])
    return streamable[checksumField]

  const readStream = await streamable.toStream()

  const checksum = await checksumStream(readStream, algorithm)

  if(streamable.reusable)
    streamable[checksumField] = checksum

  return checksum
}

export const checksumHandler = simpleHandlerBuilder(
config => {
  const { checksumAlgorithm='sha1' } = config::extract()
  const checksumField = 'checksum-' + checksumAlgorithm

  if(getHashes().indexOf(checksumAlgorithm) == -1)
    return reject(error(500, 'platform do not ' +
      'support checksum algorithm ' + checksumAlgorithm))

  return (args, streamable) =>
    checksumStreamable(streamable, checksumAlgorithm, checksumField)

}, {
  inputType: 'streamable',
  outputType: 'text'
})

export const makeChecksumHandler = checksumHandler.export()

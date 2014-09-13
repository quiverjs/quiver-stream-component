import crypto from 'crypto'
var { createHash, getHashes } = crypto

import { async, reject } from 'quiver-promise'
import { simpleHandlerBuilder } from 'quiver-component'

export var checksumStream = async(
function*(readStream, algorithm) {
  var checksum = createHash(algorithm)

  while(true) {
    var { closed, data } = yield readStream.read()
    if(closed) return checksum.digest('hex')

    checksum.update(data)
  }
})

export var checksumHandler = algorithm => {
  if(typeof algorithm != 'string')
    throw new Error('Missing checksum algorithm')

  var checksumField = 'checksum-' + algorithm

  return simpleHandlerBuilder(config => {
    if(getHashes().indexOf(algorithm) == -1)
      return reject(error(500, 'platform do not ' +
        'support checksum algorithm ' + algorithm))

    return async(function*(args, streamable) {
      if(streamable[checksumField])
        return streamable[checksumField]

      var readStream = yield streamable.toStream()
      return checksumStream(readStream, algorithm)
    })
  }, 'streamable', 'text')
}
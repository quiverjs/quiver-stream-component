import { error } from 'quiver-core/error'
import { configMiddleware } from 'quiver-core/component'
import { async, timeout, reject } from 'quiver-core/promise'
import { makeStreamConvertFilter } from './stream'

export var timeoutStream = (readStream, streamTimeout) => {
  var originalRead = readStream.read

  var startTimeout = () =>
    timeout(streamTimeout).then(() =>
      reject(error(408, 'stream timeout')))

  var timeoutRead = () =>
    Promise.race([
      originalRead(),
      startTimeout()
    ])

  var newStream = Object.create(readStream)
  newStream.read = timeoutRead

  return newStream
}

export var timeoutStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    var { 
      filterMode='inout',
      streamTimeout=-1
    } = config

    if(!(streamTimeout > 0)) return

    config.streamConverter = readStream =>
      timeoutStream(readStream, streamTimeout)
  }))

export var makeTimeoutStreamFilter = 
  timeoutStreamFilter.factory()
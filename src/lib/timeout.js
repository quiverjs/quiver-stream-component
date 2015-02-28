import { error } from 'quiver-core/error'
import { configMiddleware } from 'quiver-core/component'
import { async, timeout, reject } from 'quiver-core/promise'
import { makeStreamConvertFilter } from './stream'

export let timeoutStream = (readStream, streamTimeout) => {
  let originalRead = readStream.read

  let startTimeout = () =>
    timeout(streamTimeout).then(() =>
      reject(error(408, 'stream timeout')))

  let timeoutRead = () =>
    Promise.race([
      originalRead(),
      startTimeout()
    ])

  let newStream = Object.create(readStream)
  newStream.read = timeoutRead

  return newStream
}

export let timeoutStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    let { 
      filterMode='inout',
      streamTimeout=-1
    } = config

    if(!(streamTimeout > 0)) return

    config.streamConverter = readStream =>
      timeoutStream(readStream, streamTimeout)
  }))

export let makeTimeoutStreamFilter = 
  timeoutStreamFilter.factory()
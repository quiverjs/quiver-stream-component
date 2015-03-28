import { error } from 'quiver/error'
import { configMiddleware } from 'quiver/component'
import { async, timeout, reject } from 'quiver/promise'
import { makeStreamConvertFilter } from './stream'

export const timeoutStream = (readStream, streamTimeout) => {
  const originalRead = readStream.read

  const startTimeout = () =>
    timeout(streamTimeout).then(() =>
      reject(error(408, 'stream timeout')))

  const timeoutRead = () =>
    Promise.race([
      originalRead(),
      startTimeout()
    ])

  const newStream = Object.create(readStream)
  newStream.read = timeoutRead

  return newStream
}

export const timeoutStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    const { 
      filterMode='inout',
      streamTimeout=-1
    } = config

    if(!(streamTimeout > 0)) return

    config.streamConverter = readStream =>
      timeoutStream(readStream, streamTimeout)
  }))

export const makeTimeoutStreamFilter = 
  timeoutStreamFilter.factory()
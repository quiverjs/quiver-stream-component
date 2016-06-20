import { error } from 'quiver-core/util/error'
import { timeout } from 'quiver-core/util/promise'
import { configMiddleware } from 'quiver-core/component/constructor'
import { makeStreamConvertFilter } from './stream'

export const timeoutStream = (readStream, streamTimeout) => {
  const originalRead = readStream.read

  const startTimeout = async function() {
    await timeout(streamTimeout)
    throw error(408, 'stream timeout')
  }

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
  .addMiddleware(configMiddleware(
  config => {
    const streamTimeout = config.get('streamTimeout', -1)

    if(!(streamTimeout > 0)) return

    const streamConverter = readStream =>
      timeoutStream(readStream, streamTimeout)

    return config.set('streamConverter', streamConverter)
  }))

export const makeTimeoutStreamFilter =
  timeoutStreamFilter.export()

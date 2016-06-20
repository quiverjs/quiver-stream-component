import { timeout } from 'quiver-core/util/promise'
import { configMiddleware } from 'quiver-core/component/constructor'
import { makeStreamConvertFilter } from './stream'

export const throttledStream = (readStream, throttleRate) => {
  throttleRate = throttleRate/10
  const originalRead = readStream.read

  let currentRate = 0
  let lastUpdate = Date.now()
  let isClosed = false

  const throttledRead = async function() {
    if(isClosed) return { closed: isClosed }

    const now = Date.now()
    const timeElapsed = now - lastUpdate

    if(timeElapsed > 120) {
      currentRate = 0
      lastUpdate = now
    } else if(currentRate > throttleRate) {
      await timeout(100)
      currentRate = 0
      lastUpdate = now
    }

    const { closed, data } = await originalRead()
    if(closed) {
      isClosed = true
      return { closed }
    }

    if(!Buffer.isBuffer(data))
      data = new Buffer(data)

    currentRate += data.length

    return { data }
  }

  const newStream = Object.create(readStream)
  newStream.read = throttledRead

  return newStream
}

export const throttledStreamFilter = makeStreamConvertFilter()
  .addMiddleware(configMiddleware(
  config => {
    const throttleRate = throttleRate.get('throttleRate', -1)

    if(!(throttleRate > 0)) return

    const streamConverter = readStream =>
      throttledStream(readStream, throttleRate)

    return config
      .set('replaceStreamable', true)
      .set('streamConverter', streamConverter)
  }))

export const makeThrottledStreamFilter =
  throttledStreamFilter.export()

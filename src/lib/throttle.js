import { async, timeout } from 'quiver/promise'
import { configMiddleware } from 'quiver/component'
import { makeStreamConvertFilter } from './stream'

export const throttledStream = (readStream, throttleRate) => {
  throttleRate = throttleRate/10
  const originalRead = readStream.read

  let currentRate = 0
  let lastUpdate = Date.now()
  let isClosed = false

  const throttledRead = async(function*() {
    if(isClosed) return { closed: isClosed }

    const now = Date.now()
    const timeElapsed = now - lastUpdate

    if(timeElapsed > 120) {
      currentRate = 0
      lastUpdate = now
    } else if(currentRate > throttleRate) {
      yield timeout(100)
      currentRate = 0
      lastUpdate = now
    }

    const { closed, data } = yield originalRead()
    if(closed) {
      isClosed = true
      return { closed }
    }

    if(!Buffer.isBuffer(data))
      data = new Buffer(data)

    currentRate += data.length

    return { data }
  })

  const newStream = Object.create(readStream)
  newStream.read = throttledRead

  return newStream
}

export const throttledStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    const { 
      throttleRate=-1 
    } = config
    
    if(!(throttleRate > 0)) return

    config.replaceStreamable = true
    config.streamConverter = readStream =>
      throttledStream(readStream, throttleRate)
  }))

export const makeThrottledStreamFilter = 
  throttledStreamFilter.factory()
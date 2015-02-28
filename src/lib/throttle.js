import { async, timeout } from 'quiver-core/promise'
import { configMiddleware } from 'quiver-core/component'
import { makeStreamConvertFilter } from './stream'

export let throttledStream = (readStream, throttleRate) => {
  throttleRate = throttleRate/10
  let originalRead = readStream.read

  let currentRate = 0
  let lastUpdate = Date.now()
  let isClosed = false

  let throttledRead = async(function*() {
    if(isClosed) return { closed: isClosed }

    let now = Date.now()
    let timeElapsed = now - lastUpdate

    if(timeElapsed > 120) {
      currentRate = 0
      lastUpdate = now
    } else if(currentRate > throttleRate) {
      yield timeout(100)
      currentRate = 0
      lastUpdate = now
    }

    let { closed, data } = yield originalRead()
    if(closed) {
      isClosed = true
      return { closed }
    }

    if(!Buffer.isBuffer(data))
      data = new Buffer(data)

    currentRate += data.length

    return { data }
  })

  let newStream = Object.create(readStream)
  newStream.read = throttledRead

  return newStream
}

export let throttledStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    let { 
      throttleRate=-1 
    } = config
    
    if(!(throttleRate > 0)) return

    config.replaceStreamable = true
    config.streamConverter = readStream =>
      throttledStream(readStream, throttleRate)
  }))

export let makeThrottledStreamFilter = 
  throttledStreamFilter.factory()
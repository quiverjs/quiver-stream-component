import { async, timeout } from 'quiver-core/promise'
import { configMiddleware } from 'quiver-core/component'
import { makeStreamConvertFilter } from './stream'

export var throttledStream = (readStream, throttleRate) => {
  throttleRate = throttleRate/10
  var originalRead = readStream.read

  var currentRate = 0
  var lastUpdate = Date.now()
  var isClosed = false

  var throttledRead = async(function*() {
    if(isClosed) return { closed: isClosed }

    var now = Date.now()
    var timeElapsed = now - lastUpdate

    if(timeElapsed > 120) {
      currentRate = 0
      lastUpdate = now
    } else if(currentRate > throttleRate) {
      yield timeout(100)
      currentRate = 0
      lastUpdate = now
    }

    var { closed, data } = yield originalRead()
    if(closed) {
      isClosed = true
      return { closed }
    }

    if(!Buffer.isBuffer(data))
      data = new Buffer(data)

    currentRate += data.length

    return { data }
  })

  var newStream = Object.create(readStream)
  newStream.read = throttledRead

  return newStream
}

export var throttledStreamFilter = makeStreamConvertFilter()
  .middleware(configMiddleware(
  config => {
    var { 
      throttleRate=-1 
    } = config
    
    if(!(throttleRate > 0)) return

    config.replaceStreamable = true
    config.streamConverter = readStream =>
      throttledStream(readStream, throttleRate)
  }))

export var makeThrottledStreamFilter = 
  throttledStreamFilter.factory()
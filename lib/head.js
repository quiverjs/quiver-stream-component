import { error } from 'quiver-error'
import { async } from 'quiver-promise'
import { pushbackStream } from 'quiver-stream-util'

import buffertools from 'buffertools'
var { indexOf } = buffertools


export var extractStreamHead = async(
function*(readStream, separator, options={}) {
  if(!Buffer.isBuffer(separator)) 
    separator = new Buffer(separator)

  var headBuffer = new Buffer(0)

  while(true) {
    var { closed, data } = yield readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    var previousBufferSize = headBuffer.length
    headBuffer = Buffer.concat([headBuffer, data])

    var separatorIndex = indexOf(headBuffer, separator)
    if(separatorIndex != -1) {
      var headContent = headBuffer.slice(0, separatorIndex)

      var restIndex = separatorIndex - previousBufferSize 
        + separator.length

      if(restIndex != data.length) {
        var restBuffer = data.slice(restIndex)
        readStream = pushbackStream(readStream, [restBuffer])
      }

      return [headContent, readStream]
    }
  }
})


export var extractFixedStreamHead = async(
function*(readStream, size) {
  var remaining = size
  var headBuffers = []

  while(true) {
    var { closed, data } = yield readStream.read()

    if(closed) throw error(400, 'Bad Request')
    if(!Buffer.isBuffer(data)) data = new Buffer(data)
    if(data.length == 0) continue

    var bufferSize = data.length

    if(bufferSize == remaining) {
      headBuffers.push(data)
      return [Buffer.concat(headBuffers), readStream]
    }

    if(bufferSize > remaining) {
      headBuffers.push(data.slice(0, remaining))

      readStream = pushbackStream(readStream, 
        [data.slice(remaining)])

      return [Buffer.concat(headBuffers), readStream]
    }

    headBuffers.push(data)
    remaining = remaining - bufferSize
  }
})
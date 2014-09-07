import { error } from 'quiver-error'
import { async, timeout, reject } from 'quiver-promise'

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
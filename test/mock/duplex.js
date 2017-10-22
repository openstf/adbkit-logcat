'use strict'

const stream = require('stream')

class MockDuplex extends stream.Duplex {
  _read(/*size*/) {
  }

  _write(chunk, encoding, callback) {
    this.emit('write', chunk, encoding, callback)
    callback(null)
  }

  causeRead(chunk) {
    if (!Buffer.isBuffer(chunk)) {
      chunk = new Buffer(chunk)
    }

    this.push(chunk)
  }

  causeEnd() {
    this.push(null)
  }
}

module.exports = MockDuplex

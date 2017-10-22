'use strict'

const Reader = require('./logcat/reader')
const Priority = require('./logcat/priority')

class Logcat {
  static readStream(stream, options) {
    return new Reader(options).connect(stream)
  }
}

Logcat.Reader = Reader
Logcat.Priority = Priority

module.exports = Logcat

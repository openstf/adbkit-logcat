Reader = require './logcat/reader'
Priority = require './logcat/priority'

class Logcat
  @readStream: (stream, options) ->
    new Reader(options).connect stream

Logcat.Reader = Reader
Logcat.Priority = Priority

module.exports = Logcat

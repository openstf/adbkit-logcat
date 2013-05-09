Reader = require './logcat/reader'

class Logcat
  @readStream: (stream, options) ->
    new Reader(options).connect stream

Logcat.Reader = Reader

module.exports = Logcat

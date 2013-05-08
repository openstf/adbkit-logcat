Stream = require './logcat/stream'

class Logcat
  @connectStream: (stream, options) ->
    new Stream(options).connect stream

Logcat.Stream = Stream

module.exports = Logcat

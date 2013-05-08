{EventEmitter} = require 'events'

class Format extends EventEmitter
  parse: ->
    throw new Error "parse() is unimplemented"

module.exports = Format

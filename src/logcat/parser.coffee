{EventEmitter} = require 'events'
parser = require "./parser/binary"

class Parser extends EventEmitter
  @get: (type) ->
    if type !== 'binary'
      throw new Error "Unknown parser type #{type}"
    new parser()

  parse: ->
    throw new Error "parse() is unimplemented"

module.exports = Parser

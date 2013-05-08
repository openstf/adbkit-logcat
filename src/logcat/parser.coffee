{EventEmitter} = require 'events'

class Parser extends EventEmitter
  @get: (type) ->
    parser = require "./parser/#{type}"
    new parser()

  parse: ->
    throw new Error "parse() is unimplemented"

module.exports = Parser

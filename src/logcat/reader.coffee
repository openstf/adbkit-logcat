{EventEmitter} = require 'events'

Parser = require './parser'

class Reader extends EventEmitter
  constructor: (@options = {}) ->
    @options.format ||= 'binary'
    @parser = Parser.get @options.format
    @stream = null

  _hook: ->
    @stream.on 'data', (data) =>
      @parser.parse data
    @stream.on 'error', (err) =>
      this.emit 'error', err
    @stream.on 'end', =>
      this.emit 'end'
    @stream.on 'finish', =>
      this.emit 'finish'
    @parser.on 'entry', (entry) =>
      this.emit 'entry', entry
    @parser.on 'error', (err) =>
      this.emit 'error', err
    return

  connect: (@stream) ->
    this._hook()
    return this

  end: ->
    @stream.end()
    return this

module.exports = Reader

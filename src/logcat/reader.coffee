{EventEmitter} = require 'events'

Parser = require './parser'
Transform = require './transform'
Priority = require './priority'

class Reader extends EventEmitter
  constructor: (@options = {}) ->
    @options.format ||= 'binary'
    @options.fixLineFeeds = true unless @options.fixLineFeeds?
    @filters =
      all: -1
      tags: {}
    @parser = Parser.get @options.format
    @stream = null

  exclude: (tag) ->
    @filters.tags[tag] = Priority.SILENT
    return this

  excludeAll: ->
    @filters.all = Priority.SILENT
    return this

  include: (tag, priority = Priority.DEBUG) ->
    @filters.tags[tag] = this._priority priority
    return this

  includeAll: (priority = Priority.DEBUG) ->
    @filters.all = this._priority priority
    return this

  resetFilters: ->
    @filters.all = -1
    @filters.tags = {}
    return this

  _hook: ->
    if @options.fixLineFeeds
      transform = @stream.pipe new Transform
      transform.on 'data', (data) =>
        @parser.parse data
    else
      @stream.on 'data', (data) =>
        @parser.parse data
    @stream.on 'error', (err) =>
      this.emit 'error', err
    @stream.on 'end', =>
      this.emit 'end'
    @stream.on 'finish', =>
      this.emit 'finish'
    @parser.on 'entry', (entry) =>
      this.emit 'entry', entry if this._filter entry
    @parser.on 'error', (err) =>
      this.emit 'error', err
    return

  _filter: (entry) ->
    priority = @filters.tags[entry.tag]
    unless priority >= 0
      priority = @filters.all
    return entry.priority >= priority

  _priority: (priority) ->
    if typeof priority is 'number'
      return priority
    Priority.fromName priority

  connect: (@stream) ->
    this._hook()
    return this

  end: ->
    @stream.end()
    return this

module.exports = Reader

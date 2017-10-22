'use strict'

const EventEmitter = require('events').EventEmitter

const BinaryParser = require('./parser/binary')
const Transform = require('./transform')
const Priority = require('./priority')

const ANY = '*'

class Reader extends EventEmitter {
  constructor(options) {
    super(options)

    const defaults = {
      format: 'binary',
      fixLineFeeds: true,
      priority: Priority.DEBUG
    }

    this.options = Object.assign({}, defaults, options)

    this.filters = {
      all: -1,
      tags: {}
    }

    if (this.options.format !== 'binary') {
      throw new Error(`Unsupported format '${this.options.format}'`)
    }

    this.parser = new BinaryParser()
    this.stream = null
  }

  exclude(tag) {
    if (tag === Reader.ANY) {
      return this.excludeAll()
    }

    this.filters.tags[tag] = Priority.SILENT
    return this
  }

  excludeAll() {
    this.filters.all = Priority.SILENT
    return this
  }

  include(tag, priority) {
    if (typeof priority === 'undefined') {
      priority = this.options.priority
    }

    if (tag === Reader.ANY) {
      return this.includeAll(priority)
    }

    this.filters.tags[tag] = this._priority(priority)
    return this
  }

  includeAll(priority) {
    if (typeof priority === 'undefined') {
      priority = this.options.priority
    }

    this.filters.all = this._priority(priority)
    return this
  }

  resetFilters() {
    this.filters.all = -1
    this.filters.tags = {}
    return this
  }

  _hook() {
    if (this.options.fixLineFeeds) {
      const transform = this.stream.pipe(new Transform())
      transform.on('data', data => {
        this.parser.parse(data)
      })
    } else {
      this.stream.on('data', data => {
        this.parser.parse(data)
      })
    }

    this.stream.on('error', err => {
      this.emit('error', err)
    })

    this.stream.on('end', () => {
      this.emit('end')
    })

    this.stream.on('finish', () => {
      this.emit('finish')
    })

    this.parser.on('entry', entry => {
      if (this._filter(entry)) {
        this.emit('entry', entry)
      }
    })

    this.parser.on('error', err => {
      this.emit('error', err)
    })
  }

  _filter(entry) {
    const wanted = (entry.tag in this.filters.tags)
      ? this.filters.tags[entry.tag]
      : this.filters.all

    return entry.priority >= wanted
  }

  _priority(priority) {
    return typeof priority === 'number' ? priority : Priority.fromName(priority)
  }

  connect(stream) {
    this.stream = stream
    this._hook()
    return this
  }

  end() {
    this.stream.end()
    return this
  }
}

Reader.ANY = ANY

module.exports = Reader

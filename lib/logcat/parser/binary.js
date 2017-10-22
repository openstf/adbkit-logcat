'use strict'

const EventEmitter = require('events').EventEmitter

const Entry = require('../entry')

const HEADER_SIZE_V1 = 20
const HEADER_SIZE_MAX = 100

class Binary extends EventEmitter {
  constructor(options) {
    super(options)
    this.buffer = new Buffer(0)
  }

  parse(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk])

    while (this.buffer.length > 4) {
      let cursor = 0
      const length = this.buffer.readUInt16LE(cursor)
      cursor += 2
      let headerSize = this.buffer.readUInt16LE(cursor)
      // On v1, headerSize SHOULD be 0, but isn't on some devices. Attempt to
      // avoid that situation by discarding values that are obviously incorrect.
      if ((headerSize < HEADER_SIZE_V1) || (headerSize > HEADER_SIZE_MAX)) {
        headerSize = HEADER_SIZE_V1
      }
      cursor += 2
      if (this.buffer.length < (headerSize + length)) {
        break
      }
      const entry = new Entry()
      entry.setPid(this.buffer.readInt32LE(cursor))
      cursor += 4
      entry.setTid(this.buffer.readInt32LE(cursor))
      cursor += 4
      const sec = this.buffer.readInt32LE(cursor)
      cursor += 4
      const nsec = this.buffer.readInt32LE(cursor)
      entry.setDate(new Date((sec * 1000) + (nsec / 1000000)))
      cursor += 4
      // Make sure that we don't choke if new fields are added
      cursor = headerSize
      const data = this.buffer.slice(cursor, cursor + length)
      cursor += length
      this.buffer = this.buffer.slice(cursor)
      this._processEntry(entry, data)
    }

    if (this.buffer.length) {
      this.emit('wait')
    } else {
      this.emit('drain')
    }
  }

  _processEntry(entry, data) {
    entry.setPriority(data[0])

    let cursor = 1
    while (cursor < data.length) {
      if (data[cursor] === 0) {
        entry.setTag(data.slice(1, cursor).toString())
        entry.setMessage(data.slice(cursor + 1, data.length - 1).toString())
        this.emit('entry', entry)
        return
      }
      cursor += 1
    }

    this.emit('error', new Error(`Unprocessable entry data '${data}'`))
  }
}

module.exports = Binary

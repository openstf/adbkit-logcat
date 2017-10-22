'use strict'

class Entry {
  constructor() {
    this.date = null
    this.pid = -1
    this.tid = -1
    this.priority = null
    this.tag = null
    this.message = null
  }

  setDate(date) {
    this.date = date
  }

  setPid(pid) {
    this.pid = pid
  }

  setTid(tid) {
    this.tid = tid
  }

  setPriority(priority) {
    this.priority = priority
  }

  setTag(tag) {
    this.tag = tag
  }

  setMessage(message) {
    this.message = message
  }

  toBinary() {
    let length = 20 // header
    length += 1 // priority
    length += this.tag.length
    length += 1 // NULL-byte
    length += this.message.length
    length += 1 // NULL-byte
    const buffer = new Buffer(length)
    let cursor = 0
    buffer.writeUInt16LE(length - 20, cursor)
    cursor += 4 // include 2 bytes of padding
    buffer.writeInt32LE(this.pid, cursor)
    cursor += 4
    buffer.writeInt32LE(this.tid, cursor)
    cursor += 4
    buffer.writeInt32LE(Math.floor(this.date.getTime() / 1000), cursor)
    cursor += 4
    buffer.writeInt32LE((this.date.getTime() % 1000) * 1000000, cursor)
    cursor += 4
    buffer[cursor] = this.priority
    cursor += 1
    buffer.write(this.tag, cursor, this.tag.length)
    cursor += this.tag.length
    buffer[cursor] = 0x00
    cursor += 1
    buffer.write(this.message, cursor, this.message.length)
    cursor += this.message.length
    buffer[cursor] = 0x00
    return buffer
  }
}

module.exports = Entry

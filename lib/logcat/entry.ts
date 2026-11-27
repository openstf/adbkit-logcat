class Entry {
  public date: Date = null
  public pid = -1
  public tid = -1
  public priority: number = null
  public tag: string = null
  public message: string = null

  public setDate(date: Date): void {
    this.date = date
  }

  public setPid(pid: number): void {
    this.pid = pid
  }

  public setTid(tid: number): void {
    this.tid = tid
  }

  public setPriority(priority: number): void {
    this.priority = priority
  }

  public setTag(tag: string): void {
    this.tag = tag
  }

  public setMessage(message: string): void {
    this.message = message
  }

  public toBinary(): Buffer {
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

export = Entry

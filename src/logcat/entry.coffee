class Entry
  constructor: ->
    @date = null
    @pid = -1
    @tid = -1
    @priority = null
    @tag = null
    @message = null

  setDate: (@date) ->
  setPid: (@pid) ->
  setTid: (@tid) ->
  setPriority: (@priority) ->
  setTag: (@tag) ->
  setMessage: (@message) ->

  toBinary: ->
    length = 20 # header
    length += 1 # priority
    length += @tag.length
    length += 1 # NULL-byte
    length += @message.length
    length += 1 # NULL-byte
    buffer = new Buffer length
    cursor = 0
    buffer.writeUInt16LE length - 20, cursor
    cursor += 4 # include 2 bytes of padding
    buffer.writeInt32LE @pid, cursor
    cursor += 4
    buffer.writeInt32LE @tid, cursor
    cursor += 4
    buffer.writeInt32LE Math.floor(@date.getTime() / 1000), cursor
    cursor += 4
    buffer.writeInt32LE (@date.getTime() % 1000) * 1000000, cursor
    cursor += 4
    buffer[cursor] = @priority
    cursor += 1
    buffer.write @tag, cursor, @tag.length
    cursor += @tag.length
    buffer[cursor] = 0x00
    cursor += 1
    buffer.write @message, cursor, @message.length
    cursor += @message.length
    buffer[cursor] = 0x00
    return buffer

module.exports = Entry

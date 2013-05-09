Parser = require '../parser'
Entry = require '../entry'

class Long extends Parser
  HEAD = /// ^
    \[
    \x20
    (\d{2}) # month
    -
    (\d{2}) # day
    \x20
    (\d{2}) # hour
    :
    (\d{2}) # minute
    :
    (\d{2}) # second
    \.
    (\d{3}) # millisecond
    \x20+
    (\d+) # pid
    :
    \x20*(\d+|0x[a-f0-9]+) # tid
    \x20
    ([A-Z]) # priority
    /
    ([^ ]+) # tag
    \x20
    \]
  $ ///

  BEGIN = /^--------- beginning of (.*)/

  constructor: ->
    @buffer = new Buffer ''
    @cursor = 0
    @lineMode = 0
    @linesFound = 0
    @head = null
    this.parse = this._parseBegin

  _breakBuffer: ->
    @buffer = @buffer.slice @cursor + 1
    @cursor = 0
    return

  _parseBegin: (chunk) ->
    @buffer = Buffer.concat [@buffer, chunk] if chunk
    while @cursor < @buffer.length
      switch @buffer[@cursor]
        when 0x0a # '\n'
          # Check if we are in '\r\n' mode
          if @buffer[@cursor - 1] is 0x0d # '\r'
            @lineMode = 1
          # Process line, but only if non-empty
          if @cursor isnt @lineMode
            line = @buffer.slice 0, @cursor - @lineMode
            this._checkSpecialOrComplain line.toString()
          # Remove line from buffer and start over
          @buffer = @buffer.slice @cursor + 1
          @cursor = 0
        when 0x5b # '['
          # Yield to _parseHead
          this.parse = this._parseHead
          @buffer = @buffer.slice @cursor
          @cursor = 0
          return this.parse()
        else
          @cursor += 1
    this._emitStatus()
    return

  _parseHead: (chunk) ->
    @buffer = Buffer.concat [@buffer, chunk] if chunk
    while @cursor < @buffer.length
      switch @buffer[@cursor]
        when 0x0a # '\n'
          # Process line, but only if non-empty
          if @cursor isnt @lineMode
            line = @buffer.slice 0, @cursor - @lineMode
            @head = HEAD.exec line
            if @head
              # Yield to _parseBody
              this.parse = this._parseBody
              @buffer = @buffer.slice @cursor + 1
              @cursor = 0
              return this.parse()
            else
              this._checkSpecialOrComplain line
          # Remove line from buffer and start over
          @buffer = @buffer.slice @cursor + 1
          @cursor = 0
        else
          @cursor += 1
    this._emitStatus()
    return

  _parseBody: (chunk) ->
    @buffer = Buffer.concat [@buffer, chunk] if chunk
    while @cursor < @buffer.length
      switch @buffer[@cursor]
        when 0x0a # '\n'
          # Process line, but only if non-empty
          if @cursor isnt @lineMode
            @linesFound += 1
            if @linesFound is 2
              message = @buffer.slice 0, @cursor - 1 - @lineMode * 2
              this._emitEntry @head, message.toString()
              @head = null
              @linesFound = 0
              # Yield to _parseHead
              this.parse = this._parseHead
              @buffer = @buffer.slice @cursor + 1
              @cursor = 0
              return this.parse()
            @cursor += 1
          else
            # Remove line from buffer and start over
            @buffer = @buffer.slice @cursor + 1
            @cursor = 0
        when 0x0d # '\r'
          @cursor += 1
        else
          @cursor += 1
          @linesFound = 0
    this._emitStatus()
    return

  _emitStatus: ->
    if @buffer.length
      this.emit 'wait'
    else
      this.emit 'drain'
    return

  _emitBegin: (file) ->
    this.emit 'begin', file
    return

  _emitWaitDevice: ->
    this.emit 'waitDevice'
    return

  _emitEntry: (head, message) ->
    entry = new Entry
    date = new Date()
    date.setMonth +head[1] - 1
    date.setDate +head[2]
    date.setHours +head[3]
    date.setMinutes +head[4]
    date.setSeconds +head[5]
    date.setMilliseconds +head[6]
    entry.setDate date
    entry.setPid +head[7]
    entry.setTid +head[8]
    entry.setPriority head[9]
    entry.setTag head[10]
    entry.setMessage message
    this.emit 'entry', entry
    return

  _checkSpecialOrComplain: (line) ->
    if line is '- waiting for device -'
      return this._emitWaitDevice()
    if match = BEGIN.exec line
      return this._emitBegin match[1]
    this.emit 'error', new SyntaxError "Unparseable entry '#{line}'"
    return

module.exports = Long

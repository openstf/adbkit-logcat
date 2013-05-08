Parser = require '../parser'
Entry = require '../entry'

class Long extends Parser
  FORMAT = /// ^
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
    (\d+|0x[a-f0-9]+) # tid
    \x20
    ([A-Z]) # priority
    /
    ([^ ]+) # tag
    \x20
    \]
    \r?\n
    ([\s\S]*) # message
  $ ///

  constructor: ->
    @cursor = 0
    @line = 0
    @lineEndLength = 1
    @buffer = new Buffer ''

  parse: (chunk) ->
    @buffer = Buffer.concat [@buffer, chunk]
    while @cursor < @buffer.length
      switch @buffer[@cursor]
        when 0x0a # '\n'
          if @cursor is @lineEndLength - 1 # empty line
            @buffer = @buffer.slice @cursor + 1
            this._reset()
          else if @buffer[0] is 0x2d # '--------- beginning of /dev/log/*'
            this._parseHead @buffer.slice 0, @cursor
            @buffer = @buffer.slice @cursor + 1
            this._reset()
          else
            @line += 1
            if @line >= 2 # '\n\n'
              this._parseEntry @buffer.slice 0,
                @cursor - @line * @lineEndLength + 1
              @buffer = @buffer.slice @cursor + 1
              this._reset()
        when 0x0d # '\r'
          @lineEndLength = 2
        else
          @line = 0
      @cursor += 1
    if @buffer.length
      this.emit 'wait'
    else
      this.emit 'drain'
    return

  _reset: ->
    @cursor = 0
    @line = 0
    return

  _parseHead: (data) ->
    this.emit 'begin', data.toString 'ascii', '--------- beginning of '.length
    return

  _parseEntry: (data) ->
    parsed = FORMAT.exec data.toString()
    unless parsed
      this._complain data
      return
    entry = new Entry
    date = new Date()
    date.setMonth +parsed[1] - 1
    date.setDate +parsed[2]
    date.setHours +parsed[3]
    date.setMinutes +parsed[4]
    date.setSeconds +parsed[5]
    date.setMilliseconds +parsed[6]
    entry.setDate date
    entry.setPid +parsed[7]
    entry.setTid +parsed[8]
    entry.setPriority parsed[9]
    entry.setTag parsed[10]
    entry.setMessage parsed[11]
    this.emit 'entry', entry
    return

  _complain: (entry) ->
    this.emit 'error', new SyntaxError "Unparseable entry '#{entry}'"
    return

module.exports = Long

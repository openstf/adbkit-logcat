class Priority
  @UNKNOWN: 0
  @DEFAULT: 1
  @VERBOSE: 2
  @DEBUG: 3
  @INFO: 4
  @WARN: 5
  @ERROR: 6
  @FATAL: 7
  @SILENT: 8

  names =
    0: 'UNKNOWN'
    1: 'DEFAULT'
    2: 'VERBOSE'
    3: 'DEBUG'
    4: 'INFO'
    5: 'WARN'
    6: 'ERROR'
    7: 'FATAL'
    8: 'SILENT'

  letters =
    '?': @UNKNOWN
    'V': @VERBOSE
    'D': @DEBUG
    'I': @INFO
    'W': @WARN
    'E': @ERROR
    'F': @FATAL
    'S': @SILENT

  letterNames =
    0: '?'
    1: '?'
    2: 'V'
    3: 'D'
    4: 'I'
    5: 'W'
    6: 'E'
    7: 'F'
    8: 'S'

  @toName: (value) ->
    names[value]

  @fromLetter: (letter) ->
    letters[letter]

  @toLetter: (value) ->
    letterNames[value]

module.exports = Priority

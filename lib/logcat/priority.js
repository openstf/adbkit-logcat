'use strict'

const codes = {
  UNKNOWN: 0,
  DEFAULT: 1,
  VERBOSE: 2,
  DEBUG: 3,
  INFO: 4,
  WARN: 5,
  ERROR: 6,
  FATAL: 7,
  SILENT: 8
}

const names = {
  0: 'UNKNOWN',
  1: 'DEFAULT',
  2: 'VERBOSE',
  3: 'DEBUG',
  4: 'INFO',
  5: 'WARN',
  6: 'ERROR',
  7: 'FATAL',
  8: 'SILENT'
}

const letters = {
  '?': codes.UNKNOWN,
  'V': codes.VERBOSE,
  'D': codes.DEBUG,
  'I': codes.INFO,
  'W': codes.WARN,
  'E': codes.ERROR,
  'F': codes.FATAL,
  'S': codes.SILENT
}

const letterNames = {
  0: '?',
  1: '?',
  2: 'V',
  3: 'D',
  4: 'I',
  5: 'W',
  6: 'E',
  7: 'F',
  8: 'S'
}

class Priority {
  static fromName(name) {
    const value = codes[name.toUpperCase()]

    if (value || (value === 0)) {
      return value
    }
    return Priority.fromLetter(name)
  }

  static toName(value) {
    return names[value]
  }

  static fromLetter(letter) {
    return letters[letter.toUpperCase()]
  }

  static toLetter(value) {
    return letterNames[value]
  }
}

Priority.UNKNOWN = codes.UNKNOWN
Priority.DEFAULT = codes.DEFAULT
Priority.VERBOSE = codes.VERBOSE
Priority.DEBUG = codes.DEBUG
Priority.INFO = codes.INFO
Priority.WARN = codes.WARN
Priority.ERROR = codes.ERROR
Priority.FATAL = codes.FATAL
Priority.SILENT = codes.SILENT

module.exports = Priority

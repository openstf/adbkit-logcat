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
  V: codes.VERBOSE,
  D: codes.DEBUG,
  I: codes.INFO,
  W: codes.WARN,
  E: codes.ERROR,
  F: codes.FATAL,
  S: codes.SILENT
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
  public static UNKNOWN = codes.UNKNOWN
  public static DEFAULT = codes.DEFAULT
  public static VERBOSE = codes.VERBOSE
  public static DEBUG = codes.DEBUG
  public static INFO = codes.INFO
  public static WARN = codes.WARN
  public static ERROR = codes.ERROR
  public static FATAL = codes.FATAL
  public static SILENT = codes.SILENT

  public static fromName(name: string): number {
    const value = codes[name.toUpperCase()]

    if (value || value === 0) {
      return value
    }
    return Priority.fromLetter(name)
  }

  public static toName(value: number): string {
    return names[value]
  }

  public static fromLetter(letter: string): number {
    return letters[letter.toUpperCase()]
  }

  public static toLetter(value: number): string {
    return letterNames[value]
  }
}

export = Priority

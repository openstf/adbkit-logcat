Path = require 'path'

module.exports = switch Path.extname __filename
  when '.coffee' then require './src/logcat'
  else require './lib/logcat'

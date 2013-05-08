{expect} = require 'chai'

Format = require '../../../src/logcat/parser/format'

describe 'Format', ->

  describe 'parse(chunk)', ->

    it "should throw an Error if unimplemented", (done) ->
      parser = new Format
      expect(-> parser.parse '').to.throw Error
      done()

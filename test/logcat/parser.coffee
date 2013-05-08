{expect} = require 'chai'

Parser = require '../../src/logcat/parser'
LongParser = require '../../src/logcat/parser/long'

describe 'Parser', ->

  describe '@get(type)', ->

    it "should throw an Error for an unknown type", (done) ->
      expect(-> Parser.get 'foo').to.throw Error
      done()

    it "should return a new Parser of the given type", (done) ->
      parser = Parser.get 'long'
      expect(parser).to.be.an.instanceOf LongParser
      done()

  describe 'parse(chunk)', ->

    it "should throw an Error if unimplemented", (done) ->
      parser = new Parser
      expect(-> parser.parse '').to.throw Error
      done()

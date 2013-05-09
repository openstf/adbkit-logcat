{expect} = require 'chai'

Logcat = require '../'
Reader = require '../src/logcat/reader'
MockDuplex = require './mock/duplex'

describe 'Logcat', ->

  describe 'Reader', ->

    it "should be exposed", (done) ->
      expect(Logcat.Reader).to.equal Reader
      done()

  describe '@readStream(stream, options)', ->

    before (done) ->
      @duplex = new MockDuplex
      done()

    it "should return a Reader instance", (done) ->
      logcat = Logcat.readStream @duplex
      expect(logcat).to.be.an.instanceOf Reader
      done()

    it "should pass stream to Reader", (done) ->
      logcat = Logcat.readStream @duplex
      expect(logcat.stream).to.equal @duplex
      done()

    it "should pass options to Reader", (done) ->
      options = foo: 'bar'
      logcat = Logcat.readStream @duplex, options
      expect(logcat.options.foo).to.equal 'bar'
      done()

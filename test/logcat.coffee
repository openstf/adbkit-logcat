{expect} = require 'chai'

Logcat = require '../'
Stream = require '../src/logcat/stream'
MockDuplex = require './mock/duplex'

describe 'Logcat', ->

  describe 'Stream', ->

    it "should be exposed", (done) ->
      expect(Logcat.Stream).to.equal Stream
      done()

  describe '@connectStream(stream, options)', ->

    before (done) ->
      @duplex = new MockDuplex
      done()

    it "should return a Stream instance", (done) ->
      logcat = Logcat.connectStream @duplex
      expect(logcat).to.be.an.instanceOf Stream
      done()

    it "should pass stream to Stream", (done) ->
      logcat = Logcat.connectStream @duplex
      expect(logcat.stream).to.equal @duplex
      done()

    it "should pass options to Stream", (done) ->
      options = foo: 'bar'
      logcat = Logcat.connectStream @duplex, options
      expect(logcat.options.foo).to.equal 'bar'
      done()

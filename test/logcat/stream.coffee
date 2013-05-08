Sinon = require 'sinon'
Chai = require 'chai'
Chai.use require 'sinon-chai'
{expect} = Chai

Stream = require '../../src/logcat/stream'
MockDuplex = require '../mock/duplex'

describe 'Stream', ->

  it "should have a 'stream' property", (done) ->
    logcat = new Stream()
    expect(logcat).to.have.property 'stream'
    done()

  it "should have an 'options' property", (done) ->
    logcat = new Stream()
    expect(logcat).to.have.property 'options'
    done()

  describe "options", ->

    it "should be set via constructor", (done) ->
      logcat = new Stream bar: 'foo'
      expect(logcat.options.bar).to.equal 'foo'
      done()

  describe "events", ->

    it "should emit 'finish' when underlying stream does", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      logcat.on 'finish', ->
        done()
      duplex.end()

    it "should emit 'end' when underlying stream does", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      logcat.on 'end', ->
        done()
      duplex.causeRead 'foo'
      duplex.end()

    it "should emit 'entry' when entries are found in stream", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      counter = 0
      logcat.on 'entry', (entry) ->
        counter += 1
        if counter is 3
          done()
      duplex.causeRead """
        --------- beginning of /dev/log/main
        --------- beginning of /dev/log/system
        [ 05-08 19:36:25.948  1279:0x502 D/dalvikvm ]
        GC_CONCURRENT freed 448K, 51% free x/y, external z/p, paused 8ms+2ms

        [ 05-08 19:36:32.973  2700:0xac4 E/BatteryService ]
        TMU status = 0

        [ 05-08 19:36:32.973  2700:0xac4 D/BatteryService ]
        update start


      """

    it "should emit 'error' on a parsing error", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      logcat.on 'error', (err) ->
        done()
      duplex.causeRead 'foo\n\n'

  describe 'connect(stream)', ->

    it "should set the 'stream' property", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      expect(logcat.stream).to.be.equal duplex
      done()

    it "should be chainable", (done) ->
      duplex = new MockDuplex
      logcat = new Stream()
      expect(logcat.connect duplex).to.equal logcat
      done()

  describe "end()", ->

    it "should be chainable", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      expect(logcat.end()).to.equal logcat
      done()

    it "should end underlying stream", (done) ->
      duplex = new MockDuplex
      logcat = new Stream().connect duplex
      logcat.on 'finish', ->
        done()
      logcat.end()

Sinon = require 'sinon'
Chai = require 'chai'
Chai.use require 'sinon-chai'
{expect} = Chai

Reader = require '../../src/logcat/reader'
Entry = require '../../src/logcat/entry'
MockDuplex = require '../mock/duplex'

describe 'Reader', ->

  it "should have a 'stream' property", (done) ->
    logcat = new Reader()
    expect(logcat).to.have.property 'stream'
    done()

  it "should have an 'options' property", (done) ->
    logcat = new Reader()
    expect(logcat).to.have.property 'options'
    done()

  describe "options", ->

    it "should be set via constructor", (done) ->
      logcat = new Reader bar: 'foo'
      expect(logcat.options.bar).to.equal 'foo'
      done()

  describe "events", ->

    it "should emit 'finish' when underlying stream does", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      logcat.on 'finish', ->
        done()
      duplex.end()

    it "should emit 'end' when underlying stream does", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      logcat.on 'end', ->
        done()
      duplex.causeRead 'foo'
      duplex.causeEnd()

    it "should forward 'entry' from parser", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      logcat.on 'entry', (entry) ->
        expect(entry).to.be.an.instanceOf Entry
        done()
      logcat.parser.emit 'entry', new Entry

    it "should forward 'error' from parser", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      logcat.on 'error', (err) ->
        expect(err).to.be.an.instanceOf Error
        done()
      logcat.parser.emit 'error', new Error 'foo'

  describe 'connect(stream)', ->

    it "should set the 'stream' property", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      expect(logcat.stream).to.be.equal duplex
      done()

    it "should be chainable", (done) ->
      duplex = new MockDuplex
      logcat = new Reader()
      expect(logcat.connect duplex).to.equal logcat
      done()

  describe "end()", ->

    it "should be chainable", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      expect(logcat.end()).to.equal logcat
      done()

    it "should end underlying stream", (done) ->
      duplex = new MockDuplex
      logcat = new Reader().connect duplex
      logcat.on 'finish', ->
        done()
      logcat.end()

Path = require 'path'
Fs = require 'fs'
Sinon = require 'sinon'
Chai = require 'chai'
Chai.use require 'sinon-chai'
{expect} = Chai

Parser = require '../../../src/logcat/parser'
Priority = require '../../../src/logcat/priority'
BinaryParser = require '../../../src/logcat/parser/binary'

describe 'Parser.Binary', ->

  fixt1 = Fs.readFileSync Path.join __dirname, '../../fixtures/1-default.dat'
  fixt3 = Fs.readFileSync Path.join __dirname, '../../fixtures/3-default.dat'
  broken1 = Fs.readFileSync Path.join __dirname, '../../fixtures/1-broken.dat'
  crlf1 = Fs.readFileSync Path.join __dirname, '../../fixtures/1-crlf.dat'

  it "should implement Parser", (done) ->
    parser = new BinaryParser
    expect(parser).to.be.an.instanceOf Parser
    done()

  it "should emit 'drain' when all data has been parsed", (done) ->
    parser = new BinaryParser
    parser.on 'drain', done
    parser.parse new Buffer ''

  it "should emit 'wait' when waiting for more data", (done) ->
    parser = new BinaryParser
    parser.on 'wait', done
    parser.parse new Buffer 'foo'

  it "should emit 'error' if entry data cannot be parsed", (done) ->
    parser = new BinaryParser
    parser.on 'error', (err) ->
      expect(err).to.be.an.instanceOf Error
      done()
    parser.parse broken1

  it "should emit 'entry' when an entry is found", (done) ->
    parser = new BinaryParser
    parser.on 'entry', (entry) ->
      expect(entry.date).to.be.an.instanceOf Date
      expect(entry.date.getFullYear()).to.equal 2013
      expect(entry.date.getMonth()).to.equal 4
      expect(entry.date.getDate()).to.equal 13
      expect(entry.date.getHours()).to.equal 1
      expect(entry.date.getMinutes()).to.equal 5
      expect(entry.date.getSeconds()).to.equal 25
      expect(entry.date.getMilliseconds()).to.equal 686
      expect(entry.pid).to.equal 26642
      expect(entry.tid).to.equal 26676
      expect(entry.priority).to.equal Priority.DEBUG
      expect(entry.tag).to.equal 'dalvikvm'
      expect(entry.message).to.equal 'WAIT_FOR_CONCURRENT_GC blocked 15ms'
      done()
    parser.parse fixt1

  it "should parse an entry that arrives in multiple chunks", (done) ->
    parser = new BinaryParser
    parser.on 'entry', (entry) ->
      expect(entry.message).to.equal 'WAIT_FOR_CONCURRENT_GC blocked 15ms'
      done()
    parser.parse fixt1.slice 0, 10
    parser.parse fixt1.slice 10, 34
    parser.parse fixt1.slice 34

  it "should parse multiple entries in one chunk", (done) ->
    parser = new BinaryParser
    entrySpy = Sinon.spy()
    parser.on 'entry', entrySpy
    parser.on 'drain', ->
      expect(entrySpy).to.have.been.calledThrice
      done()
    parser.parse fixt3

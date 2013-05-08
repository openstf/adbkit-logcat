Sinon = require 'sinon'
Chai = require 'chai'
Chai.use require 'sinon-chai'
{expect} = Chai

Parser = require '../../../src/logcat/parser'
LongParser = require '../../../src/logcat/parser/long'

describe 'Parser.Long', ->

  it "should implement Parser", (done) ->
    parser = new LongParser
    expect(parser).to.be.an.instanceOf Parser
    done()

  it "should emit 'drain' when all data has been parsed", (done) ->
    parser = new LongParser
    parser.on 'drain', done
    parser.parse new Buffer ''

  it "should emit 'wait' when waiting for more data", (done) ->
    parser = new LongParser
    parser.on 'wait', done
    parser.parse new Buffer 'foo'

  it "should emit 'error' for unknown data", (done) ->
    parser = new LongParser
    parser.on 'error', (err) ->
      expect(err).to.be.an.instanceOf SyntaxError
      expect(err.message).to.equal "Unparseable entry 'foo'"
      done()
    parser.parse new Buffer 'foo\n\n'

  it "should emit 'begin' for 'beginning of' lines", (done) ->
    parser = new LongParser
    beginSpy = Sinon.spy()
    entrySpy = Sinon.spy()
    parser.on 'begin', beginSpy
    parser.on 'entry', entrySpy
    parser.on 'drain', ->
      expect(beginSpy).to.have.been.calledWith '/dev/log/main'
      expect(beginSpy).to.have.been.calledWith '/dev/log/system'
      expect(entrySpy).to.not.have.been.called
      done()
    parser.parse new Buffer """
      --------- beginning of /dev/log/main
      --------- beginning of /dev/log/system

    """

  it "should emit 'entry' for a log entry", (done) ->
    parser = new LongParser
    parser.on 'entry', (entry) ->
      expect(entry.date).to.be.an.instanceOf Date
      expect(entry.date.getFullYear()).to.equal new Date().getFullYear()
      expect(entry.date.getMonth()).to.equal 4
      expect(entry.date.getDate()).to.equal 8
      expect(entry.date.getHours()).to.equal 13
      expect(entry.date.getMinutes()).to.equal 30
      expect(entry.date.getSeconds()).to.equal 11
      expect(entry.date.getMilliseconds()).to.equal 748
      expect(entry.pid).to.equal 2700
      expect(entry.tid).to.equal 0xac7
      expect(entry.priority).to.equal 'D'
      expect(entry.tag).to.equal 'PowerManagerService'
      expect(entry.message).to.equal 'onSensorChanged: light value: 1000'
      done()
    parser.parse new Buffer """
      [ 05-08 13:30:11.748  2700:0xac7 D/PowerManagerService ]
      onSensorChanged: light value: 1000


    """

  it "should parse an entry that arrives in multiple chunks", (done) ->
    parser = new LongParser
    parser.on 'entry', (entry) ->
      expect(entry.date).to.be.an.instanceOf Date
      expect(entry.date.getFullYear()).to.equal new Date().getFullYear()
      expect(entry.date.getMonth()).to.equal 11
      expect(entry.date.getDate()).to.equal 31
      expect(entry.date.getHours()).to.equal 14
      expect(entry.date.getMinutes()).to.equal 21
      expect(entry.date.getSeconds()).to.equal 56
      expect(entry.date.getMilliseconds()).to.equal 188
      expect(entry.pid).to.equal 2823
      expect(entry.tid).to.equal 0xb07
      expect(entry.priority).to.equal 'I'
      expect(entry.tag).to.equal 'StatusBarPolicy'
      expect(entry.message).to.equal 'BAT. S:5 H:2'
      done()
    parser.parse new Buffer '[ 12-31 14:21:56.188  2823:0xb'
    parser.parse new Buffer '07 I/StatusBarPolicy ]\nBA'
    parser.parse new Buffer 'T. S:5 H:2\n'
    parser.parse new Buffer '\n'

  it "should remove trailing newlines from messages", (done) ->
    parser = new LongParser
    parser.on 'entry', (entry) ->
      expect(entry.message).to.equal 'DrReadUsbStatus File Open success'
      done()
    parser.parse new Buffer """
      [ 05-08 13:30:05.013  2576:0xa10 E/DataRouter ]
      DrReadUsbStatus File Open success




    """

  it "should parse multiple entries at once", (done) ->
    parser = new LongParser
    entrySpy = Sinon.spy()
    parser.on 'entry', entrySpy
    parser.on 'drain', ->
      expect(entrySpy).to.have.been.calledThrice
      done()
    parser.parse new Buffer """
      [ 05-08 14:21:56.183  2851:0xb23 D/PhoneApp ]
      Intent.ACTION_BATTERY_CHANGED : 2

      [ 05-08 14:21:56.183  2851:0xb23 D/PhoneUtils ]
      updateRAFT current state : 4

      [ 05-08 14:21:56.183  2851:0xb23 D/PhoneUtils ]
      updateRAFT() : FactoryMode : false


    """

  it "should parse complete event stream with headers", (done) ->
    parser = new LongParser
    beginSpy = Sinon.spy()
    entrySpy = Sinon.spy()
    parser.on 'begin', beginSpy
    parser.on 'entry', entrySpy
    parser.on 'drain', ->
      expect(beginSpy).to.have.been.calledTwice
      expect(entrySpy).to.have.been.calledTwice
      done()
    parser.parse new Buffer """
      --------- beginning of /dev/log/main
      --------- beginning of /dev/log/system
      [ 05-08 14:46:41.753  2851:0xb23 D/PhoneUtils ]
      updateRAFT current state : 4

      [ 05-08 14:46:41.753  2851:0xb23 D/PhoneUtils ]
      updateRAFT() : FactoryMode : false


    """

  it "should parse padded tid", (done) ->
    parser = new LongParser
    parser.on 'entry', (entry) ->
      expect(entry.tid).to.equal 4712
      done()
    parser.parse new Buffer """
      [ 05-09 08:49:28.298  4691: 4712 D/PicasaUploaderSyncManager ]
      battery info: true


    """

  it "should parse '\\r\\n' same as '\\n'", (done) ->
    parser = new LongParser
    parser.on 'entry', (entry) ->
      expect(entry.message).to.equal 'updateRAFT() : FactoryMode : false'
      done()
    parser.parse new Buffer """
      --------- beginning of /dev/log/main\r
      --------- beginning of /dev/log/system\r
      [ 05-08 14:46:41.753  2851:0xb23 D/PhoneUtils ]\r
      updateRAFT() : FactoryMode : false\r
      \r

    """

  it "should remove trailing '\\r\\n' from messages", (done) ->
    parser = new LongParser
    beginSpy = Sinon.spy()
    entrySpy = Sinon.spy()
    parser.on 'begin', beginSpy
    parser.on 'entry', entrySpy
    parser.on 'drain', ->
      expect(beginSpy).to.have.been.calledTwice
      expect(entrySpy).to.have.been.calledTwice
      done()
    parser.parse new Buffer """
      --------- beginning of /dev/log/main\r
      --------- beginning of /dev/log/system\r
      [ 05-08 14:46:41.753  2851:0xb23 D/PhoneUtils ]\r
      updateRAFT current state : 4\r
      \r
      \r
      \r
      [ 05-08 14:46:41.753  2851:0xb23 D/PhoneUtils ]\r
      updateRAFT() : FactoryMode : false\r
      \r

    """

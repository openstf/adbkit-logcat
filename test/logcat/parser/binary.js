/* eslint-env mocha */

const {EventEmitter} = require('events')
const path = require('path')
const fs = require('fs')
const sinon = require('sinon')
const {expect} = require('chai')
  .use(require('sinon-chai'))

const Priority = require('../../../lib/logcat/priority')
const BinaryParser = require('../../../lib/logcat/parser/binary')

const fixt1 = fs.readFileSync(path.join(__dirname, '../../fixtures/1-default.dat'))
const fixt3 = fs.readFileSync(path.join(__dirname, '../../fixtures/3-default.dat'))
const broken1 = fs.readFileSync(path.join(__dirname, '../../fixtures/1-broken.dat'))

describe('Parser.Binary', () => {
  it('should implement EventEmitter', done => {
    const parser = new BinaryParser()
    expect(parser).to.be.an.instanceOf(EventEmitter)
    done()
  })

  it('should emit \'drain\' when all data has been parsed', done => {
    const parser = new BinaryParser()
    parser.on('drain', done)
    parser.parse(new Buffer(''))
  })

  it('should emit \'wait\' when waiting for more data', done => {
    const parser = new BinaryParser()
    parser.on('wait', done)
    parser.parse(new Buffer('foo'))
  })

  it('should emit \'error\' if entry data cannot be parsed', done => {
    const parser = new BinaryParser()
    parser.on('error', err => {
      expect(err).to.be.an.instanceOf(Error)
      done()
    })
    parser.parse(broken1)
  })

  it('should emit \'entry\' when an entry is found', done => {
    const parser = new BinaryParser()
    parser.on('entry', entry => {
      expect(entry.date).to.be.an.instanceOf(Date)
      expect(entry.date.getFullYear()).to.equal(2013)
      expect(entry.date.getMonth()).to.equal(4)
      expect(entry.date.getDate()).to.equal(13)
      expect(entry.date.getHours()).to.equal(1)
      expect(entry.date.getMinutes()).to.equal(5)
      expect(entry.date.getSeconds()).to.equal(25)
      expect(entry.date.getMilliseconds()).to.equal(686)
      expect(entry.pid).to.equal(26642)
      expect(entry.tid).to.equal(26676)
      expect(entry.priority).to.equal(Priority.DEBUG)
      expect(entry.tag).to.equal('dalvikvm')
      expect(entry.message).to.equal('WAIT_FOR_CONCURRENT_GC blocked 15ms')
      done()
    })
    parser.parse(fixt1)
  })

  it('should parse an entry that arrives in multiple chunks', done => {
    const parser = new BinaryParser()
    parser.on('entry', entry => {
      expect(entry.message).to.equal('WAIT_FOR_CONCURRENT_GC blocked 15ms')
      done()
    })
    parser.parse(fixt1.slice(0, 10))
    parser.parse(fixt1.slice(10, 34))
    parser.parse(fixt1.slice(34))
  })

  return it('should parse multiple entries in one chunk', done => {
    const parser = new BinaryParser()
    const entrySpy = sinon.spy()
    parser.on('entry', entrySpy)
    parser.on('drain', () => {
      expect(entrySpy).to.have.been.calledThrice
      done()
    })
    parser.parse(fixt3)
  })
})

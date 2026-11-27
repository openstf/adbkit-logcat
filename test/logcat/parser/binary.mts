import { EventEmitter } from 'events'
import path from 'path'
import fs from 'fs'
import sinon from 'sinon'
import * as chai from 'chai'
import sinonChai from 'sinon-chai'

chai.use(sinonChai)
const expect = chai.expect

import Priority from '../../../lib/logcat/priority.js'
import BinaryParser from '../../../lib/logcat/parser/binary.js'

const fixt1 = fs.readFileSync(
  path.join(import.meta.dirname, '../../fixtures/1-default.dat')
)
const fixt3 = fs.readFileSync(
  path.join(import.meta.dirname, '../../fixtures/3-default.dat')
)
const broken1 = fs.readFileSync(
  path.join(import.meta.dirname, '../../fixtures/1-broken.dat')
)

describe('Parser.Binary', () => {
  it('should implement EventEmitter', done => {
    const parser = new BinaryParser()
    expect(parser).to.be.an.instanceOf(EventEmitter)
    done()
  })

  it("should emit 'drain' when all data has been parsed", done => {
    const parser = new BinaryParser()
    parser.on('drain', done)
    parser.parse(Buffer.from(''))
  })

  it("should emit 'wait' when waiting for more data", done => {
    const parser = new BinaryParser()
    parser.on('wait', done)
    parser.parse(Buffer.from('foo'))
  })

  it("should emit 'error' if entry data cannot be parsed", done => {
    const parser = new BinaryParser()
    parser.on('error', err => {
      expect(err).to.be.an.instanceOf(Error)
      done()
    })
    parser.parse(broken1)
  })

  it("should emit 'entry' when an entry is found", done => {
    const parser = new BinaryParser()
    parser.on('entry', entry => {
      expect(entry.date).to.be.an.instanceOf(Date)
      expect(entry.date.getFullYear()).to.equal(2013)
      expect(entry.date.getMonth()).to.equal(4)
      // Date type in JavaScript includes timezone. It is not reliable to compare day/hours/minutes
      expect(entry.date.toISOString()).to.equal('2013-05-12T16:05:25.686Z')
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

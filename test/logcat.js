/* eslint-env mocha */

const expect = require('chai').expect

const Logcat = require('../')
const Reader = require('../lib/logcat/reader')
const Priority = require('../lib/logcat/priority')
const MockDuplex = require('./mock/duplex')

describe('Logcat', () => {
  describe('Reader', () => {
    it('should be exposed', done => {
      expect(Logcat.Reader).to.equal(Reader)
      done()
    })
  })

  describe('Priority', () => {
    it('should be exposed', done => {
      expect(Logcat.Priority).to.equal(Priority)
      done()
    })
  })

  describe('@readStream(stream, options)', () => {
    before(done => {
      this.duplex = new MockDuplex
      return done()
    })

    it('should return a Reader instance', done => {
      const logcat = Logcat.readStream(this.duplex)
      expect(logcat).to.be.an.instanceOf(Reader)
      done()
    })

    it('should pass stream to Reader', done => {
      const logcat = Logcat.readStream(this.duplex)
      expect(logcat.stream).to.equal(this.duplex)
      done()
    })

    it('should pass options to Reader', done => {
      const options = {foo: 'bar'}
      const logcat = Logcat.readStream(this.duplex, options)
      expect(logcat.options.foo).to.equal('bar')
      done()
    })
  })
})

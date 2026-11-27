import { expect } from 'chai'

import Logcat from '../index.js'
import Reader from '../lib/logcat/reader.js'
import Priority from '../lib/logcat/priority.js'
import MockDuplex from './mock/duplex.mts'

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
    let duplex

    before(done => {
      duplex = new MockDuplex()
      return done()
    })

    it('should return a Reader instance', done => {
      const logcat = Logcat.readStream(duplex)
      expect(logcat).to.be.an.instanceOf(Reader)
      done()
    })

    it('should pass stream to Reader', done => {
      const logcat = Logcat.readStream(duplex)
      expect(logcat.stream).to.equal(duplex)
      done()
    })

    it('should pass options to Reader', done => {
      const options = { foo: 'bar' }
      const logcat = Logcat.readStream(duplex, options)
      expect(logcat.options.foo).to.equal('bar')
      done()
    })
  })
})

/* eslint-env mocha */

const expect = require('chai').expect

const Priority = require('../../lib/logcat/priority')

describe('Priority', () => {
  describe('@toName(value)', () => {
    it('should return the name of the priority', done => {
      expect(Priority.toName(Priority.UNKNOWN)).to.equal('UNKNOWN')
      expect(Priority.toName(Priority.DEFAULT)).to.equal('DEFAULT')
      expect(Priority.toName(Priority.VERBOSE)).to.equal('VERBOSE')
      expect(Priority.toName(Priority.DEBUG)).to.equal('DEBUG')
      expect(Priority.toName(Priority.INFO)).to.equal('INFO')
      expect(Priority.toName(Priority.WARN)).to.equal('WARN')
      expect(Priority.toName(Priority.ERROR)).to.equal('ERROR')
      expect(Priority.toName(Priority.FATAL)).to.equal('FATAL')
      expect(Priority.toName(Priority.SILENT)).to.equal('SILENT')
      done()
    })

    it('should return undefined for unknown values', done => {
      expect(Priority.toName(-1)).to.be.undefined
      done()
    })
  })

  describe('@toLetter(value)', () => {
    it('should return the value of the priority', done => {
      expect(Priority.toLetter(Priority.UNKNOWN)).to.equal('?')
      expect(Priority.toLetter(Priority.DEFAULT)).to.equal('?')
      expect(Priority.toLetter(Priority.VERBOSE)).to.equal('V')
      expect(Priority.toLetter(Priority.DEBUG)).to.equal('D')
      expect(Priority.toLetter(Priority.INFO)).to.equal('I')
      expect(Priority.toLetter(Priority.WARN)).to.equal('W')
      expect(Priority.toLetter(Priority.ERROR)).to.equal('E')
      expect(Priority.toLetter(Priority.FATAL)).to.equal('F')
      expect(Priority.toLetter(Priority.SILENT)).to.equal('S')
      done()
    })

    it('should return undefined for unknown values', done => {
      expect(Priority.toLetter(-1)).to.be.undefined
      done()
    })
  })

  describe('@fromLetter(letter)', () => {
    it('should return the value of the priority', done => {
      expect(Priority.fromLetter('?')).to.equal(Priority.UNKNOWN)
      expect(Priority.fromLetter('V')).to.equal(Priority.VERBOSE)
      expect(Priority.fromLetter('D')).to.equal(Priority.DEBUG)
      expect(Priority.fromLetter('I')).to.equal(Priority.INFO)
      expect(Priority.fromLetter('W')).to.equal(Priority.WARN)
      expect(Priority.fromLetter('E')).to.equal(Priority.ERROR)
      expect(Priority.fromLetter('F')).to.equal(Priority.FATAL)
      expect(Priority.fromLetter('S')).to.equal(Priority.SILENT)
      done()
    })

    it('should ignore case', done => {
      expect(Priority.fromName('v')).to.equal(Priority.VERBOSE)
      done()
    })

    it('should return undefined for unknown letters', done => {
      expect(Priority.fromLetter('.')).to.be.undefined
      done()
    })
  })

  describe('@fromName(name)', () => {
    it('should return the value of the priority', done => {
      expect(Priority.fromName('UNKNOWN')).to.equal(Priority.UNKNOWN)
      expect(Priority.fromName('VERBOSE')).to.equal(Priority.VERBOSE)
      expect(Priority.fromName('DEBUG')).to.equal(Priority.DEBUG)
      expect(Priority.fromName('INFO')).to.equal(Priority.INFO)
      expect(Priority.fromName('WARN')).to.equal(Priority.WARN)
      expect(Priority.fromName('ERROR')).to.equal(Priority.ERROR)
      expect(Priority.fromName('FATAL')).to.equal(Priority.FATAL)
      expect(Priority.fromName('SILENT')).to.equal(Priority.SILENT)
      done()
    })

    it('should detect letters', done => {
      expect(Priority.fromName('V')).to.equal(Priority.VERBOSE)
      done()
    })

    it('should ignore case', done => {
      expect(Priority.fromName('veRboSe')).to.equal(Priority.VERBOSE)
      done()
    })

    it('should return undefined for unknown names', done => {
      expect(Priority.fromName('foo')).to.be.undefined
      done()
    })
  })
})

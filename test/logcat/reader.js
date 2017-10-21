/* eslint-env mocha */

const sinon = require('sinon')
const {expect} = require('chai')
  .use(require('sinon-chai'))

const Reader = require('../../lib/logcat/reader')
const Entry = require('../../lib/logcat/entry')
const MockDuplex = require('../mock/duplex')

describe('Reader', () => {
  const mockEntry = (date, pid, tid, priority, tag, message) => {
    const entry = new Entry()
    entry.setDate(date)
    entry.setPid(pid)
    entry.setTid(tid)
    entry.setPriority(priority)
    entry.setTag(tag)
    entry.setMessage(message)
    return entry
  }

  it('should have a \'stream\' property', done => {
    const logcat = new Reader()
    expect(logcat).to.have.property('stream')
    done()
  })

  it('should have an \'options\' property', done => {
    const logcat = new Reader()
    expect(logcat).to.have.property('options')
    done()
  })

  describe('options', () =>
    it('should be set via constructor', done => {
      const logcat = new Reader({bar: 'foo'})
      expect(logcat.options.bar).to.equal('foo')
      done()
    })
  )

  describe('events', () => {
    it('should emit \'finish\' when underlying stream does', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.on('finish', () => done())
      duplex.end()
    })

    it('should emit \'end\' when underlying stream does', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.on('end', () => done())
      duplex.causeRead('foo')
      duplex.causeEnd()
    })

    it('should forward \'entry\' from parser', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.on('entry', entry => {
        expect(entry).to.be.an.instanceOf(Entry)
        done()
      })
      logcat.parser.emit('entry', new Entry)
    })

    it('should forward \'error\' from parser', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.on('error', err => {
        expect(err).to.be.an.instanceOf(Error)
        done()
      })
      logcat.parser.emit('error', new Error('foo'))
    })
  })

  describe('exclude(tag)', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.exclude('foo')).to.equal(logcat)
      done()
    })

    it('should prevent entries with matching tag from being emitted', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.exclude('foo')
      const entry1 = mockEntry(new Date(), 1, 2, 4, 'foo', 'bar')
      const entry2 = mockEntry(new Date(), 1, 2, 4, 'not foo', 'bar')
      duplex.causeRead(entry1.toBinary())
      duplex.causeRead(entry2.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.have.been.calledOnce
        expect(spy).to.have.been.calledWith(entry2)
        done()
      })
    })

    it('should map to excludeAll() if tag is \'*\'', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      const spy = sinon.spy(logcat, 'excludeAll')
      logcat.exclude('*')
      expect(spy).to.have.been.calledOnce
      done()
    })
  })

  describe('excludeAll()', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.excludeAll()).to.equal(logcat)
      done()
    })

    it('should prevent any entries from being emitted', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.excludeAll()
      const entry = mockEntry(new Date(), 1, 2, 4, 'foo', 'bar')
      duplex.causeRead(entry.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.not.have.been.called
        done()
      })
    })
  })

  describe('include(tag, priority)', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.include('foo', 1)).to.equal(logcat)
      done()
    })

    it('should prevent emit of matching entries with < priority', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.include('foo', 5)
      const entry1 = mockEntry(new Date(), 1, 2, 4, 'foo', 'bar')
      duplex.causeRead(entry1.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.not.have.been.called
        done()
      })
    })

    it('should allow emit of matching entries with >= priority', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.include('foo', 4)
      const entry1 = mockEntry(new Date(), 1, 2, 4, 'foo', 'bar')
      duplex.causeRead(entry1.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.have.been.calledOnce
        done()
      })
    })

    it('should map to includeAll(priority) if tag is \'*\'', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      const spy = sinon.spy(logcat, 'includeAll')
      logcat.include('*', 4)
      expect(spy).to.have.been.calledOnce
      expect(spy).to.have.been.calledWith(4)
      done()
    })
  })

  describe('includeAll(priority)', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.includeAll()).to.equal(logcat)
      done()
    })

    it('should prevent emit of entries with < priority', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.includeAll(5)
      const entry = mockEntry(new Date(), 1, 2, 4, 'foo', 'bar')
      duplex.causeRead(entry.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.not.have.been.called
        done()
      })
    })

    it('should allow emit of entries with >= priority', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.includeAll(5)
      const entry = mockEntry(new Date(), 1, 2, 5, 'foo', 'bar')
      duplex.causeRead(entry.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.have.been.called
        done()
      })
    })

    it('should should override excludeAll()', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.excludeAll()
      logcat.includeAll(5)
      const entry = mockEntry(new Date(), 1, 2, 5, 'foo', 'bar')
      duplex.causeRead(entry.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.have.been.called
        done()
      })
    })
  })

  describe('resetFilters()', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.resetFilters()).to.equal(logcat)
      done()
    })

    it('should allow everything to pass again', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.include('foo', 5)
      logcat.include('bar', 9)
      logcat.excludeAll()
      logcat.resetFilters()
      const entry = mockEntry(new Date(), 99, 99, 99, 'zup', 'bar')
      duplex.causeRead(entry.toBinary())
      duplex.causeEnd()
      const spy = sinon.spy()
      logcat.on('entry', spy)
      setImmediate(() => {
        expect(spy).to.have.been.called
        done()
      })
    })
  })

  describe('connect(stream)', () => {
    it('should set the \'stream\' property', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.stream).to.be.equal(duplex)
      done()
    })

    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader()
      expect(logcat.connect(duplex)).to.equal(logcat)
      done()
    })
  })

  describe('end()', () => {
    it('should be chainable', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      expect(logcat.end()).to.equal(logcat)
      done()
    })

    it('should end underlying stream', done => {
      const duplex = new MockDuplex()
      const logcat = new Reader().connect(duplex)
      logcat.on('finish', () => done())
      logcat.end()
    })
  })
})

/* eslint-env mocha */

const {expect} = require('chai')

const Entry = require('../../lib/logcat/entry')
const BinaryParser = require('../../lib/logcat/parser/binary')

describe('Entry', () => {
  it('should have a \'date\' property', done => {
    expect(new Entry()).to.have.property('date')
    done()
  })

  it('should have a \'pid\' property', done => {
    expect(new Entry()).to.have.property('pid')
    done()
  })

  it('should have a \'tid\' property', done => {
    expect(new Entry()).to.have.property('tid')
    done()
  })

  it('should have a \'priority\' property', done => {
    expect(new Entry()).to.have.property('priority')
    done()
  })

  it('should have a \'tag\' property', done => {
    expect(new Entry()).to.have.property('tag')
    done()
  })

  it('should have a \'message\' property', done => {
    expect(new Entry()).to.have.property('message')
    done()
  })

  describe('setDate(date)', () => {
    it('should set the \'date\' property', done => {
      const entry = new Entry()
      const date = new Date
      entry.setDate(date)
      expect(entry.date).to.equal(date)
      done()
    })
  })

  describe('setPid(pid)', () => {
    it('should set the \'pid\' property', done => {
      const entry = new Entry()
      entry.setPid(346)
      expect(entry.pid).to.equal(346)
      done()
    })
  })

  describe('setTid(tid)', () => {
    it('should set the \'tid\' property', done => {
      const entry = new Entry()
      entry.setTid(3278)
      expect(entry.tid).to.equal(3278)
      done()
    })
  })

  describe('setPriority(tid)', () => {
    it('should set the \'priority\' property', done => {
      const entry = new Entry()
      entry.setPriority('D')
      expect(entry.priority).to.equal('D')
      done()
    })
  })

  describe('setTag(tag)', () => {
    it('should set the \'tag\' property', done => {
      const entry = new Entry()
      entry.setTag('dalvikvm')
      expect(entry.tag).to.equal('dalvikvm')
      done()
    })
  })

  describe('setMessage(message)', () => {
    it('should set the \'message\' property', done => {
      const entry = new Entry()
      entry.setMessage('foo bar')
      expect(entry.message).to.equal('foo bar')
      done()
    })
  })

  describe('toBinary()', () => {
    it('should return a valid binary entry', done => {
      const entry = new Entry()
      entry.setDate(new Date())
      entry.setPid(999)
      entry.setTid(888)
      entry.setPriority(6)
      entry.setTag('AAAAA')
      entry.setMessage('BBBBBB')
      const parser = new BinaryParser()
      parser.on('entry', parsed => {
        expect(JSON.stringify(parsed.date)).to.equal(JSON.stringify(entry.date))
        expect(parsed.pid).to.equal(entry.pid)
        expect(parsed.tid).to.equal(entry.tid)
        expect(parsed.priority).to.equal(entry.priority)
        expect(parsed.tag).to.equal(entry.tag)
        expect(parsed.message).to.equal(entry.message)
        done()
      })
      parser.parse(entry.toBinary())
    })
  })
})

{expect} = require 'chai'

Entry = require '../../src/logcat/entry'

describe 'Entry', ->

  it "should have a 'date' property", (done) ->
    expect(new Entry).to.have.property 'date'
    done()

  it "should have a 'pid' property", (done) ->
    expect(new Entry).to.have.property 'pid'
    done()

  it "should have a 'tid' property", (done) ->
    expect(new Entry).to.have.property 'tid'
    done()

  it "should have a 'priority' property", (done) ->
    expect(new Entry).to.have.property 'priority'
    done()

  it "should have a 'tag' property", (done) ->
    expect(new Entry).to.have.property 'tag'
    done()

  it "should have a 'message' property", (done) ->
    expect(new Entry).to.have.property 'message'
    done()

  describe 'setDate(date)', ->

    it "should set the 'date' property", (done) ->
      entry = new Entry
      date = new Date
      entry.setDate date
      expect(entry.date).to.equal date
      done()

  describe 'setPid(pid)', ->

    it "should set the 'pid' property", (done) ->
      entry = new Entry
      entry.setPid 346
      expect(entry.pid).to.equal 346
      done()

  describe 'setTid(tid)', ->

    it "should set the 'tid' property", (done) ->
      entry = new Entry
      entry.setTid 3278
      expect(entry.tid).to.equal 3278
      done()

  describe 'setPriority(tid)', ->

    it "should set the 'priority' property", (done) ->
      entry = new Entry
      entry.setPriority 'D'
      expect(entry.priority).to.equal 'D'
      done()

  describe 'setTag(tag)', ->

    it "should set the 'tag' property", (done) ->
      entry = new Entry
      entry.setTag 'dalvikvm'
      expect(entry.tag).to.equal 'dalvikvm'
      done()

  describe 'setMessage(message)', ->

    it "should set the 'message' property", (done) ->
      entry = new Entry
      entry.setMessage 'foo bar'
      expect(entry.message).to.equal 'foo bar'
      done()


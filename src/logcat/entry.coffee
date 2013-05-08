class Entry
  constructor: ->
    @date = null
    @pid = -1
    @tid = -1
    @priority = null
    @tag = null
    @message = null

  setDate: (@date) ->
  setPid: (@pid) ->
  setTid: (@tid) ->
  setPriority: (@priority) ->
  setTag: (@tag) ->
  setMessage: (@message) ->

module.exports = Entry

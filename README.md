# stf-logcat

**stf-logcat** provides a [Node.js][nodejs] interface for working with output produced by the Android [`logcat` tool][logcat-site]. It takes a log stream (that you must create separately), parses it, and emits log entries in real-time as they occur. Possible use cases include storing logs in a database, forwarding logs via [MessagePack][msgpack], or just advanced filtering.

## Example

```coffeescript
Logcat = require 'stf-logcat'
{spawn} = require 'child_process'

# Retrieve a log stream
proc = spawn 'adb', ['logcat', '-v', 'long']

# Connect logcat to the stream
logcat = Logcat.readStream proc.stdout
logcat.on 'entry', (entry) ->
  console.log entry.message

# Make sure we don't leave anything hanging
process.on 'exit', ->
  proc.kill()
```

## Links

* Liblog
    - [logprint.c][logprint-source]
* Logcat
    - [logcat.cpp][logcat-source]

## License

Restricted until further notice.

[nodejs]: <http://nodejs.org/>
[msgpack]: <http://msgpack.org/>
[logcat-site]: <http://developer.android.com/tools/help/logcat.html>
[logprint-source]: <https://github.com/android/platform_system_core/blob/master/liblog/logprint.c>
[logcat-source]: <https://github.com/android/platform_system_core/blob/master/logcat/logcat.cpp>

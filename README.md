# stf-logcat

## Example

```coffeescript
Logcat = require 'stf-logcat'
{spawn} = require 'child_process'

# Retrieve a log stream
proc = spawn 'adb', ['logcat', '-v', 'long']

# Connect logcat to the stream
logcat = Logcat.connectStream proc.stdout
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

[logprint-source]: <https://github.com/android/platform_system_core/blob/master/liblog/logprint.c>
[logcat-source]: <https://github.com/android/platform_system_core/blob/master/logcat/logcat.cpp>

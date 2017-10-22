'use strict'

const stream = require('stream')

class Transform extends stream.Transform {
  constructor(options) {
    super(options)
    this.savedR = null
  }

  // Sadly, the ADB shell is not very smart. It automatically converts every
  // 0x0a ('\n') it can find to 0x0d 0x0a ('\r\n'). This also applies to binary
  // content. We could get rid of this behavior by setting `stty raw`, but
  // unfortunately it's not available by default (you'd have to install busybox)
  // or something similar. On the up side, it really does do this for all line
  // feeds, so a simple transform works fine.
  _transform(chunk, encoding, done) {
    let lo = 0
    let hi = 0

    if (this.savedR) {
      if (chunk[0] !== 0x0a) { this.push(this.savedR) }
      this.savedR = null
    }

    const last = chunk.length - 1
    while (hi <= last) {
      if (chunk[hi] === 0x0d) {
        if (hi === last) {
          this.savedR = chunk.slice(last)
          break // Stop hi from incrementing, we want to skip the last byte.
        } else if (chunk[hi + 1] === 0x0a) {
          this.push(chunk.slice(lo, hi))
          lo = hi + 1
        }
      }
      hi += 1
    }

    if (hi !== lo) {
      this.push(chunk.slice(lo, hi))
    }

    done()
  }
}

module.exports = Transform

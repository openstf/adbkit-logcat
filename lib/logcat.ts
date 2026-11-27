import Reader from './logcat/reader'
import Priority from './logcat/priority'
import { Duplex } from 'stream'
import { ReaderOptions } from './ReaderOptions'

class Logcat {
  public static Reader = Reader
  public static Priority = Priority

  static readStream(stream: Duplex, options: ReaderOptions): Reader {
    return new Reader(options).connect(stream)
  }
}

export = Logcat

import { EventEmitter } from 'events'
import BinaryParser from './parser/binary'
import Transform from './transform'
import Priority from './priority'
import { Duplex } from 'stream'
import Entry from './entry'
import { ReaderOptions } from '../ReaderOptions'

type Filters = {
  all: number
  tags: Record<string, number>
}

class Reader extends EventEmitter {
  public static ANY = '*'

  private parser = new BinaryParser()
  private stream: Duplex = null
  private filters: Filters

  constructor(private options?: ReaderOptions) {
    super(options)

    const defaults = {
      format: 'binary',
      fixLineFeeds: true,
      priority: Priority.DEBUG
    }

    this.options = Object.assign({}, defaults, options)

    this.filters = {
      all: -1,
      tags: {}
    }

    if (this.options.format !== 'binary') {
      throw new Error(`Unsupported format '${this.options.format}'`)
    }
  }

  public exclude(tag: string): Reader {
    if (tag === Reader.ANY) {
      return this.excludeAll()
    }

    this.filters.tags[tag] = Priority.SILENT
    return this
  }

  public excludeAll(): Reader {
    this.filters.all = Priority.SILENT
    return this
  }

  public include(
    tag: string,
    priority: number = this.options.priority
  ): Reader {
    if (tag === Reader.ANY) {
      return this.includeAll(priority)
    }

    this.filters.tags[tag] = this._priority(priority)
    return this
  }

  public includeAll(priority: number = this.options.priority): Reader {
    this.filters.all = this._priority(priority)
    return this
  }

  public resetFilters(): Reader {
    this.filters.all = -1
    this.filters.tags = {}
    return this
  }

  private _hook(): void {
    if (this.options.fixLineFeeds) {
      const transform = this.stream.pipe(new Transform())
      transform.on('data', data => {
        this.parser.parse(data)
      })
    } else {
      this.stream.on('data', data => {
        this.parser.parse(data)
      })
    }

    this.stream.on('error', err => {
      this.emit('error', err)
    })

    this.stream.on('end', () => {
      this.emit('end')
    })

    this.stream.on('finish', () => {
      this.emit('finish')
    })

    this.parser.on('entry', entry => {
      if (this._filter(entry)) {
        this.emit('entry', entry)
      }
    })

    this.parser.on('error', err => {
      this.emit('error', err)
    })
  }

  private _filter(entry: Entry): boolean {
    const wanted =
      entry.tag in this.filters.tags
        ? this.filters.tags[entry.tag]
        : this.filters.all

    return entry.priority >= wanted
  }

  private _priority(priority: number | string): number {
    return typeof priority === 'number' ? priority : Priority.fromName(priority)
  }

  public connect(stream: Duplex): Reader {
    this.stream = stream
    this._hook()
    return this
  }

  public end(): Reader {
    this.stream.end()
    return this
  }
}

export = Reader

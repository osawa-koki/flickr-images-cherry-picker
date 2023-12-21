import { ulid } from 'ulid'

type LogLevel = 'log' | 'info' | 'warn' | 'error'

export interface Log {
  level: LogLevel
  date: Date
  message: string
}

class Logger {
  private readonly prefix: string

  constructor (prefix: string) {
    this.prefix = prefix
  }

  saveLog (level: LogLevel, message: string): void {
    const logBody: Log = {
      level,
      date: new Date(),
      message
    }
    const logKey = `${this.prefix}:${ulid()}`
    localStorage.setItem(logKey, JSON.stringify(logBody))
  }

  public log (message: string): void {
    this.saveLog('log', message)
  }

  public info (message: string): void {
    this.saveLog('info', message)
  }

  public warn (message: string): void {
    this.saveLog('warn', message)
  }

  public error (message: string): void {
    this.saveLog('error', message)
  }

  // -----

  public getLogs (page: number, perPage: number): {
    logs: Log[]
    page: number
    perPage: number
    totalCount: number
    totalPages: number
  } {
    const logs: Log[] = []
    const keys = Object.keys(localStorage).filter(key => key.startsWith(this.prefix)).sort().reverse()
    const start = (page - 1) * perPage
    const end = start + perPage
    for (let i = start; i < end; i++) {
      const key = keys[i]
      if (key == null) continue
      const logBody = localStorage.getItem(key)
      if (logBody == null) continue
      logs.push(JSON.parse(logBody))
    }
    return {
      logs,
      page,
      perPage,
      totalCount: keys.length,
      totalPages: Math.ceil(keys.length / perPage)
    }
  }
}

const logger = new Logger('log:')

export default logger

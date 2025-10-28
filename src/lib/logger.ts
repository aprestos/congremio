import { Logtail } from '@logtail/browser'

const isDevelopment =
  import.meta.env.VITE_ENVIRONMENT === 'development' || false
const token = import.meta.env.VITE_BETTER_STACK_TOKEN as string
const endpoint = import.meta.env.VITE_BETTER_STACK_ENDPOINT as string
const logLevel = (import.meta.env.VITE_LOG_LEVEL as string) || 'info'

enum LogLevel {
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 99,
}

const parseLogLevel = (level: string): number => {
  const levelMap: Record<string, number> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
  }
  return levelMap[level.toLowerCase()] ?? LogLevel.INFO
}

const currentLogLevel = parseLogLevel(logLevel)

let logtail: Logtail | undefined = undefined

if (isDevelopment) {
  console.log('Development environment detected, using console for logging.')
} else if (!token || !endpoint) {
  console.log(
    'Logtail token or endpoint not provided, using console for logging.',
  )
} else {
  logtail = new Logtail(token, {
    endpoint: `https://${endpoint}`,
  })
}

class Logger {
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      void logtail?.info(message, context)
      void logtail?.flush()
    } else {
      console.info(message, context)
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      void logtail?.warn(message, context)
      void logtail?.flush()
    } else {
      console.warn(message, context)
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      void logtail?.error(message, context)
      void logtail?.flush()
    } else {
      console.error(message, context)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      void logtail?.debug(message, context)
    } else {
      console.debug(message, context)
    }
  }
  private shouldLog(level: number): boolean {
    return !!logtail && !isDevelopment && level >= currentLogLevel
  }
}

export default new Logger()

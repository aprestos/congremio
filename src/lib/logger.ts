import { Logtail } from '@logtail/browser'

const isDevelopment = import.meta.env.VITE_ENVIRONMENT === 'development'

const logtail = isDevelopment
  ? null
  : new Logtail(import.meta.env.VITE_BETTER_STACK_TOKEN)

class Logger {
  info(message: string, context?: Record<string, unknown>): void {
    if (isDevelopment) {
      console.info(message, context)
    } else {
      void logtail?.info(message, context)
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    if (isDevelopment) {
      console.warn(message, context)
    } else {
      void logtail?.warn(message, context)
    }
  }

  error(message: string, context?: Record<string, unknown>): void {
    if (isDevelopment) {
      console.error(message, context)
    } else {
      void logtail?.error(message, context)
    }
  }

  debug(message: string, context?: Record<string, unknown>): void {
    if (isDevelopment) {
      console.debug(message, context)
    } else {
      void logtail?.debug(message, context)
    }
  }
}

export const log = new Logger()

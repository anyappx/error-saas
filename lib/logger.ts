// Production-safe logging utility
const isProd = process.env.NODE_ENV === 'production'

export const logger = {
  log: (...args: unknown[]) => {
    if (!isProd) {
      console.log(...args)
    }
  },
  warn: (...args: unknown[]) => {
    if (!isProd) {
      console.warn(...args)
    }
    // In production, could send to error monitoring service
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  info: (...args: unknown[]) => {
    if (!isProd) {
      console.info(...args)
    }
  },
  debug: (...args: unknown[]) => {
    if (!isProd) {
      console.debug(...args)
    }
  }
}

export default logger
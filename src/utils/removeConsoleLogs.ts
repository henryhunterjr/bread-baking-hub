/**
 * Production-safe logging utility
 * Only logs in development mode
 */
export const devLog = {
  log: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(...args);
    }
  },
  warn: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(...args);
    }
  },
  info: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.info(...args);
    }
  }
};

/**
 * No-op function for production builds
 * Replace all console.log statements with this
 */
export const noop = (...args: any[]) => {
  // No-op in production
};
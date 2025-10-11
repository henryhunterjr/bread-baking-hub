// Environment-aware logging wrapper to prevent info leakage in production
// SECURITY: Never log sensitive data (passwords, tokens, PII) even in development

export type LoggerMethod = (...args: unknown[]) => void;

export interface Logger {
  log: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
  info: LoggerMethod;
  debug: LoggerMethod;
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
const isProd = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD;

const noop: LoggerMethod = () => {};

// Safe logging wrapper that strips logs in production
export const logger: Logger = {
  // General logs - development only
  log: isDev ? ((...args) => console.log(...args)) : noop,
  
  // Errors - always log but sanitize in production
  error: isProd 
    ? ((...args) => {
        // In production, log errors but strip potentially sensitive details
        const sanitized = args.map(arg => {
          if (arg instanceof Error) {
            return { name: arg.name, message: arg.message };
          }
          if (typeof arg === 'object' && arg !== null) {
            return '[Object]';
          }
          return arg;
        });
        console.error(...sanitized);
      })
    : ((...args) => console.error(...args)),
  
  // Warnings - development only
  warn: isDev ? ((...args) => console.warn(...args)) : noop,
  
  // Info - development only
  info: isDev ? ((...args) => console.info(...args)) : noop,
  
  // Debug - development only
  debug: isDev ? ((...args) => console.debug(...args)) : noop,
};

export default logger;

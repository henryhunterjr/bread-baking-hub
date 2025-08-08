export type LoggerMethod = (...args: unknown[]) => void;

export interface Logger {
  log: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
}

const isDev = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.DEV;
const isProd = typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.PROD;

const noop: LoggerMethod = () => {};

export const logger: Logger = {
  log: isDev ? ((...args) => console.log(...args)) : noop,
  error: !isProd ? ((...args) => console.error(...args)) : noop,
  warn: isDev ? ((...args) => console.warn(...args)) : noop,
};

export default logger;

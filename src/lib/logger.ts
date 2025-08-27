// Production-safe logging utility
// Strips debug and warning logs in production builds while preserving errors

export const log = (...args: any[]) => {
  if (import.meta.env.MODE !== 'production') {
    console.log(...args);
  }
};

export const warn = (...args: any[]) => {
  if (import.meta.env.MODE !== 'production') {
    console.warn(...args);
  }
};

export const error = (...args: any[]) => {
  // Always log errors, even in production
  console.error(...args);
};

export const debug = (...args: any[]) => {
  if (import.meta.env.MODE === 'development') {
    console.debug(...args);
  }
};

export const info = (...args: any[]) => {
  if (import.meta.env.MODE !== 'production') {
    console.info(...args);
  }
};
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance that works in both browser and server (SSR)
let purifier: any;
(() => {
  try {
    const win = typeof window !== 'undefined'
      ? (window as unknown as Window)
      : (new JSDOM('').window as unknown as Window);
    purifier = createDOMPurify(win as any);
  } catch {
    // Fallback: create a minimal JSDOM window if anything goes wrong
    const { window: jsdomWindow } = new JSDOM('');
    purifier = createDOMPurify(jsdomWindow as any);
  }
})();

export type SanitizeHtmlOptions = any;

/**
 * Sanitizes HTML content to prevent XSS attacks
 * Allows only a small set of safe tags and attributes.
 */
export const sanitizeHtml = (html: string, options?: SanitizeHtmlOptions): string => {
  const defaultConfig: any = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'ul', 'li', 'a', 'img', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false,
  };
  return purifier.sanitize(html ?? '', { ...defaultConfig, ...(options || {}) });
};

/**
 * Sanitizes structured data (JSON-LD). Returns a safe JSON string.
 */
export const sanitizeStructuredData = (data: unknown): string => {
  const cleaned = JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'string') {
        return purifier.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
      }
      return value;
    })
  );
  return JSON.stringify(cleaned);
};
import createDOMPurify from 'dompurify';

// Create a DOMPurify instance only in the browser to avoid bundling server-only libs
let purifier: any = null;
const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

if (isBrowser) {
  try {
    purifier = createDOMPurify(window as any);
  } catch {
    purifier = null;
  }
}

// Very safe fallback for non-browser contexts (SSR): escape special chars
function basicEscape(input: string): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
  if (purifier) {
    return purifier.sanitize(html ?? '', { ...defaultConfig, ...(options || {}) });
  }
  // SSR fallback: escape everything (no HTML allowed)
  return basicEscape(html ?? '');
};

/**
 * Sanitizes structured data (JSON-LD). Returns a safe JSON string.
 */
export const sanitizeStructuredData = (data: unknown): string => {
  const cleaned = JSON.parse(
    JSON.stringify(data, (_key, value) => {
      if (typeof value === 'string') {
        return purifier
          ? purifier.sanitize(value, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] })
          : basicEscape(value);
      }
      return value;
    })
  );
  return JSON.stringify(cleaned);
};
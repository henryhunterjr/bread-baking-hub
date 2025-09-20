// React re-export to ensure consistent React availability
import React from 'react';

// Re-export React to ensure it's always available
export default React;

// Make sure React is globally available for external dependencies
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

// Re-export specific React features that are commonly used
export {
  useState,
  useEffect,
  useContext,
  createContext,
  useCallback,
  useMemo,
  useRef,
  Component,
  forwardRef,
  lazy,
  Suspense
} from 'react';
// CRITICAL: Global React fix to ensure React is available for all dependencies
// This is the MOST AGGRESSIVE fix for React availability issues
import React from 'react';

// Immediately create a protected React instance
const ProtectedReact = React;

// Nuclear option: Force React to be available on ALL possible global targets
const globalTargets = [globalThis, window, global, self].filter(Boolean);

globalTargets.forEach(target => {
  if (!target || typeof target !== 'object') return;
  
  // Define React with maximum protection
  try {
    Object.defineProperties(target, {
      'React': {
        value: ProtectedReact,
        writable: false,
        configurable: false,
        enumerable: true
      },
      'react': {
        value: ProtectedReact,
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
  } catch (e) {
    // Fallback if defineProperty fails
    target.React = ProtectedReact;
    target.react = ProtectedReact;
  }
});

// NUCLEAR OPTION: Override the module resolution for React
if (typeof window !== 'undefined') {
  // Intercept any require/import calls for React
  const originalDefine = (window as any)?.define;
  if (originalDefine) {
    (window as any).define = function(id: string, deps: any, factory: any) {
      if (id.includes('react') || (deps && deps.includes('react'))) {
        // Inject our protected React
        if (typeof factory === 'function') {
          const originalFactory = factory;
          factory = function(...args: any[]) {
            // Ensure React is available in the factory
            globalThis.React = ProtectedReact;
            return originalFactory.apply(this, args);
          };
        }
      }
      return originalDefine.call(this, id, deps, factory);
    };
  }
}

// Export React to ensure it's available for any import
export default ProtectedReact;
export const {
  useState,
  useEffect,
  useContext,
  createContext,
  useRef,
  useCallback,
  useMemo,
  useReducer,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
  memo,
  lazy,
  Suspense,
  Fragment,
  createElement,
  cloneElement
} = ProtectedReact;
// CRITICAL: Global React fix to ensure React is available for all dependencies
// This MUST run before any other imports or code
import React from 'react';

// Immediately freeze and lock React to prevent it from being nullified
Object.defineProperty(React, 'useState', {
  value: React.useState,
  writable: false,
  configurable: false,
  enumerable: true
});

// More aggressive global assignment with error handling
const setReactGlobally = (target: any) => {
  if (!target || typeof target !== 'object') return;
  
  try {
    // Set multiple variations of React
    Object.defineProperty(target, 'React', {
      value: React,
      writable: false,
      configurable: false,
      enumerable: true
    });
    
    Object.defineProperty(target, 'react', {
      value: React,
      writable: false,
      configurable: false,
      enumerable: true
    });
    
    // Also set as default export pattern
    if (!target.default || target.default !== React) {
      Object.defineProperty(target, 'default', {
        value: React,
        writable: false,
        configurable: false,
        enumerable: true
      });
    }
  } catch (e) {
    // Fallback if property definitions fail
    target.React = React;
    target.react = React;
    target.default = React;
  }
};

// Apply to ALL possible global targets immediately
setReactGlobally(globalThis);

if (typeof window !== 'undefined') {
  setReactGlobally(window);
}

if (typeof global !== 'undefined') {
  setReactGlobally(global);
}

if (typeof self !== 'undefined') {
  setReactGlobally(self);
}

// Force React hooks to be available globally immediately with protection
const createProtectedReactExports = () => {
  const exports = {
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    createContext: React.createContext,
    useRef: React.useRef,
    useCallback: React.useCallback,
    useMemo: React.useMemo,
    useReducer: React.useReducer,
    useLayoutEffect: React.useLayoutEffect,
    useImperativeHandle: React.useImperativeHandle,
    forwardRef: React.forwardRef,
    memo: React.memo,
    lazy: React.lazy,
    Suspense: React.Suspense,
    Fragment: React.Fragment,
    createElement: React.createElement,
    cloneElement: React.cloneElement,
  };

  // Protect each export from being overwritten
  Object.keys(exports).forEach(key => {
    try {
      Object.defineProperty(globalThis, key, {
        value: exports[key as keyof typeof exports],
        writable: false,
        configurable: false,
        enumerable: true
      });
    } catch (e) {
      // Fallback assignment if defineProperty fails
      (globalThis as any)[key] = exports[key as keyof typeof exports];
    }
  });

  return exports;
};

const reactExports = createProtectedReactExports();

// Also set on window and global for maximum compatibility
if (typeof window !== 'undefined') {
  Object.assign(window, reactExports);
}

if (typeof global !== 'undefined') {
  Object.assign(global, reactExports);
}

// Export React as default for imports
export default React;

// Re-export specific hooks and functions
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
} = React;
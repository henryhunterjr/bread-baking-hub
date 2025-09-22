// Global React fix to ensure React is available for all dependencies
import React from 'react';

// Immediately set React globally before any other code runs
const setReactGlobally = (target: any) => {
  target.React = React;
  target.react = React;
  target.default = React;
};

// Set on multiple global targets to ensure coverage
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

// Force React hooks to be available globally immediately
const reactExports = {
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

Object.assign(globalThis, reactExports);

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
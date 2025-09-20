// Global React fix to ensure React is available for all dependencies
import React from 'react';

// Ensure React is globally available for all bundled dependencies
const globalTarget = globalThis as any;
globalTarget.React = React;
globalTarget.react = React;

// Also set on window for browser environments  
if (typeof window !== 'undefined') {
  (window as any).React = React;
  (window as any).react = React;
}

// For webpack and other bundlers
if (typeof global !== 'undefined') {
  (global as any).React = React;
  (global as any).react = React;
}

// Force React hooks to be available globally
Object.assign(globalThis, {
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
});

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
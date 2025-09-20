// Enhanced React bundling fix for consistent availability
import * as React from 'react';

// Force React to be globally available immediately
if (typeof window !== 'undefined') {
  // Set React on window object
  (window as any).React = React;
  
  // Set specific React functions
  (window as any).useState = React.useState;
  (window as any).useEffect = React.useEffect;
  (window as any).useContext = React.useContext;
  (window as any).createContext = React.createContext;
  (window as any).useCallback = React.useCallback;
  (window as any).useMemo = React.useMemo;
  (window as any).useRef = React.useRef;
  (window as any).Component = React.Component;
  (window as any).forwardRef = React.forwardRef;
  (window as any).lazy = React.lazy;
  (window as any).Suspense = React.Suspense;
}

// Also set on globalThis for Node environments
if (typeof globalThis !== 'undefined') {
  (globalThis as any).React = React;
}

// Re-export specific functions to avoid TypeScript conflicts
export const {
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
} = React;

export default React;
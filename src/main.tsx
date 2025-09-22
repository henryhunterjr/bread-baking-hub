// CRITICAL: Ensure React is globally available before ANY other imports
// Apply fix SYNCHRONOUSLY before any modules load
import './lib/global-react-fix';

// Force immediate global React check and assignment
(() => {
  const ReactCheck = (globalThis as any).React;
  if (!ReactCheck || !ReactCheck.useState) {
    console.error('CRITICAL: React not available after global fix!');
    // Emergency fallback - try to load React directly
    try {
      const React = require('react');
      (globalThis as any).React = React;
      (globalThis as any).react = React;
      console.log('Emergency React fallback applied');
    } catch (e) {
      console.error('Emergency React fallback failed:', e);
    }
  }
})();

import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { Providers } from './providers/Providers';
import App from './App.tsx';
import './index.css';
import { installImageErrorHandler } from './utils/imageErrorHandler';

// Install global image error handler
installImageErrorHandler();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>
);

// Register SW in production only
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onRegisteredSW: () => console.log('SW registered')
  });
}
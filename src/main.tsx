// CRITICAL: Ensure React is globally available before ANY other imports
import './lib/global-react-fix';

// Additional safety check - verify React is available
if (typeof globalThis.React === 'undefined' || globalThis.React === null) {
  console.error('CRITICAL: React not available globally after fix');
  // Force immediate availability
  import('./lib/global-react-fix');
}

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
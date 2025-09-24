import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { Providers } from './providers/Providers';
import App from './App';
import './index.css';
import { installImageErrorHandler } from './utils/imageErrorHandler';

// TEMP DIAGNOSTIC - verify single React instance
console.log('[react version]', React.version);
console.log('[useState identity]', React.useState);
console.log('[React object]', React);
console.log('[React from window]', (window as any).React);
const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
console.log('[react renderers count]', hook?.renderers?.size ?? 'no devtools hook');
console.log('[hook renderers]', hook?.renderers);

// Check if React is duplicated in window
if ((window as any).React && (window as any).React !== React) {
  console.error('⚠️ DUPLICATE REACT DETECTED - window.React differs from imported React');
  console.log('imported React:', React);
  console.log('window.React:', (window as any).React);
}

// Prevent duplicate app mounting in iframe
if ((window as any).__BGB_APP_MOUNTED__) {
  console.warn('App already mounted; skipping duplicate mount');
} else {
  (window as any).__BGB_APP_MOUNTED__ = true;

  installImageErrorHandler();

  const root = createRoot(document.getElementById('root')!);

  root.render(
    <React.StrictMode>
      <Providers>
        <App />
      </Providers>
    </React.StrictMode>
  );

  if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    registerSW({ immediate: true, onRegisteredSW: () => console.log('SW registered') });
  }
}
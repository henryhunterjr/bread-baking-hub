import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { Providers } from './providers/Providers';
import App from './App';
import './index.css';
import { installImageErrorHandler } from './utils/imageErrorHandler';

// Add temporary version verification
console.log('[react version]', React.version);

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
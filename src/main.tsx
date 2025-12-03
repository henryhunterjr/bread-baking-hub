import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { Providers } from './providers/Providers';
import App from './App';
import './index.css';
import { installImageErrorHandler } from './utils/imageErrorHandler';

// Suppress extension and third-party script errors from crashing the app
window.addEventListener('unhandledrejection', (event) => {
  const reason = String(event.reason || '');
  // Suppress errors from browser extensions and external scripts
  if (reason.includes('Extension context') ||
      reason.includes('chrome-extension') ||
      reason.includes('speed-insights') ||
      reason.includes('_vercel') ||
      (reason.includes('Failed to fetch') && !reason.includes('supabase'))) {
    event.preventDefault();
    return;
  }
});

// Initialize first-party analytics tracking (safe import that won't throw)
import('./utils/firstPartyAnalytics').catch(() => {
  // Silently fail if analytics can't load
});

// Clear stale mount flag on page load
delete (window as any).__BGB_APP_MOUNTED__;

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
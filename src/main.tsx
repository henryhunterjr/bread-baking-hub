import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from 'react-helmet-async'
import { registerSW } from 'virtual:pwa-register'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);

// Register SW in production, but skip on Lovable "preview--" hosts
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  const isPreview = location.hostname.startsWith('preview--');
  if (!isPreview) {
    registerSW({
      immediate: true,
      onRegisteredSW: () => console.log('SW registered')
    });
  } else {
    console.log('SW not registered on preview host');
  }
}
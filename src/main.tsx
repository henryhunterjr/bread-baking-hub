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

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  registerSW({ immediate: true, onRegisteredSW: (url) => console.log('SW registered:', url) })
}
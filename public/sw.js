// Basic service worker for blog caching
const CACHE_NAME = 'blog-posts-cache-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activate');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Only handle blog-related requests
  if (event.request.url.includes('blog-proxy') || 
      event.request.url.includes('bakinggreatbread.blog') ||
      event.request.url.includes('placeholder-avatar.png')) {
    
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch from network
          return response || fetch(event.request)
            .then((fetchResponse) => {
              // Don't cache if not a success response
              if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
                return fetchResponse;
              }

              // Clone the response for caching
              const responseToCache = fetchResponse.clone();
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });

              return fetchResponse;
            })
            .catch(() => {
              // Return a fallback response if network fails
              return new Response(
                JSON.stringify({ error: 'Network unavailable', offline: true }),
                { 
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            });
        })
    );
  }
});
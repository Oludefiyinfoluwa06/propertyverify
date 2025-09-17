// Simple service worker stub for PWA
self.addEventListener('install', (event) => {
  console.log('[sw] install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[sw] activate');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // No-op fetch handler; extend for caching strategies later
});

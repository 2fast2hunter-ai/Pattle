// Bump this version with every release to force cache eviction for existing players.
const CACHE_NAME = 'pattle-v21';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const { screen } = event.notification.data || {};
  const url = screen ? `/?screen=${screen}` : '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin)) {
          client.focus();
          client.postMessage({ type: 'NAVIGATE_TO', screen: screen || 'hatchery' });
          return;
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Only handle same-origin GET requests
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;

  // Network-first for everything: always show the latest version; fall back to
  // cache only when offline. HTML navigate requests fall back to /index.html.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) => cached || (request.mode === 'navigate' ? caches.match('/index.html') : Response.error())
        )
      )
  );
});

const CACHE_NAME = 'muslim-tracker-v1';
const urlsToCache = [
  '/mgmdov.github.io/',
  '/mgmdov.github.io/index.html',
  '/mgmdov.github.io/manifest.json'
];

self.addEventListener('install', event => {
  console.log('SW установлен');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  console.log('SW активирован');
  event.waitUntil(clients.claim());
});

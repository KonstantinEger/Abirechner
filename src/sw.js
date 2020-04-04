import { version } from '../package.json';

const cacheName = `abicache-v${version}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(cacheName)
      .then(cache => cache.addAll([
        '/',
        '/styles/main.css',
        '/build/main.js',
        '/build/main-chunk.js',
        '/build/handlers-chunk.js'
      ]))
  )
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheKeys) => {
        return Promise.all(
          cacheKeys
            .filter((key) => key !== cacheName)
            .map((key) => caches.delete(key))
        );
      })
  )
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.open(cacheName)
      .then((cache) => cache.match(event.request))
      .then((response) => response || fetch(event.request))
  );
});

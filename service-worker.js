const CACHE_NAME = 'v0.0.0 b1';
const FILES_TO_CACHE = [
  "./auto-waste/",
  "./auto-waste/index.html",
  "./auto-waste/fadeinout.js",
  "./auto-waste/favicon.png",
  "./auto-waste/main.css",
  "./auto-waste/main.js",
  "./auto-waste/manifest.json",
  "./auto-waste/service-worker.js",
];

self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[ServiceWorker] Pre-caching offline page');
            return cache.addAll(FILES_TO_CACHE)
        })
    )
})

self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache', key)
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
                return response || fetch(evt.request)
            })
        })
    )
})
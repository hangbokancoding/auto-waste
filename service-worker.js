const CACHE_NAME = 'v0.0.0';
const FILES_TO_CACHE = [
    './',
    './index.html',
    './fadeinout.js',
    './favicon.png',
    './main.css',
    './main.js',
    './manifest.json',
    './service-worker.json'
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
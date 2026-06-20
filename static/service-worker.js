// DataFlow Studio v14.0 — HMG Academy Edition
// Service Worker — Offline PWA Support

const CACHE = 'dswf-v14';
const RUNTIME = 'dswf-runtime-v14';

const STATIC = [
  './', './index.html', './app.html', './features.html', './modules.html',
  './pricing.html', './about.html', './docs.html', './faq.html',
  './contact.html', './deployment.html', './404.html',
  './assets/css/style.css', './assets/css/app.css',
  './assets/js/utils/storage.js', './assets/js/utils/security.js',
  './assets/js/utils/stats.js', './assets/js/utils/ml.js',
  './assets/js/utils/export.js',
  './assets/js/core.js', './assets/js/modules.js', './assets/js/app.js',
  './assets/images/hmg-academy-logo.png',
  './static/manifest.webmanifest'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE && k !== RUNTIME).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('cdn.jsdelivr.net') || e.request.url.includes('unpkg.com')) {
    e.respondWith(cacheFirst(e.request, RUNTIME));
    return;
  }
  e.respondWith(cacheFirst(e.request, CACHE));
});

async function cacheFirst(req, name) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.status === 200) {
      const cache = await caches.open(name);
      cache.put(req, res.clone());
    }
    return res;
  } catch (e) {
    if (req.destination === 'document') return caches.match('./app.html') || caches.match('./index.html');
    throw e;
  }
}

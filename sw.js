const CACHE_GAIA = 'gaia-app-v1';

const ARQUIVOS_GAIA = [
  './',
  './index.html',
  './manifest.webmanifest',
  './gaia-180.png',
  './gaia-192.png',
  './gaia-512.png',
  './gaia-maskable-512.png'
];

self.addEventListener('install', function(event) {

  event.waitUntil(
    caches.open(CACHE_GAIA)
      .then(function(cache) {
        return cache.addAll(ARQUIVOS_GAIA);
      })
  );

  self.skipWaiting();
});


self.addEventListener('activate', function(event) {

  event.waitUntil(
    caches.keys()
      .then(function(chaves) {

        return Promise.all(
          chaves
            .filter(function(chave) {
              return chave !== CACHE_GAIA;
            })
            .map(function(chave) {
              return caches.delete(chave);
            })
        );

      })
  );

  self.clients.claim();
});


self.addEventListener('fetch', function(event) {

  const url = new URL(event.request.url);

  if (url.origin === self.location.origin) {

    event.respondWith(
      caches.match(event.request)
        .then(function(cache) {

          return cache || fetch(event.request);

        })
    );

  }

});

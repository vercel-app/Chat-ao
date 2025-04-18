self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('chatao-cache').then(function(cache) {
      return cache.addAll([
        'chatao.html',
        'manifest.json',
        'style.css',
        'script.js',
        'icon.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

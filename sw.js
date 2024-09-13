self.addEventListener('install', event => {
    event.waitUntil(
      caches.open('v1').then(cache => {
        return cache.addAll([
            '/carepital/',  // Update this path
            '/carepital/index.html',  // Update this path
            '/carepital/styles/style.css',  // Update this path
            '/carepital/scripts/script.js',  // Update this path
            '/carepital/Favicons/favicon-192x192.png',  // Update this path
            '/carepital/Favicons/favicon-512x512.png'  // Update this path
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  });
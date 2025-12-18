const CACHE_NAME = "ash-impostor-v4";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjB749IpoWxO9eRIs5uRT0IY1rWNlXHcd_VMztqSQr4G5MsyCRzp0zCuGBJbJSthkXb3NFhzEUljEhTC-PRM1ohfrcOjrYjy9JRG1X8ihWMBsyGvOc_iqEycXg-EPPASuFWziSEE8g0IJrX1t8jqXDOjC_vBTBDFVlnP4_1OBodEJWmCw9gBPThu5lGw-U/s500/1.png"
];

// INSTALL
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// ACTIVATE
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
  self.clients.claim();
});

// FETCH (OFFLINE FIX)
self.addEventListener("fetch", event => {
  // If this is a page navigation, always serve index.html
  if (event.request.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then(response => response)
    );
    return;
  }

  // Otherwise, try cache first, then network
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

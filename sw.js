const CACHE_NAME = "ash-impostor-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjB749IpoWxO9eRIs5uRT0IY1rWNlXHcd_VMztqSQr4G5MsyCRzp0zCuGBJbJSthkXb3NFhzEUljEhTC-PRM1ohfrcOjrYjy9JRG1X8ihWMBsyGvOc_iqEycXg-EPPASuFWziSEE8g0IJrX1t8jqXDOjC_vBTBDFVlnP4_1OBodEJWmCw9gBPThu5lGw-U/s500/1.png"
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
    )
  );
});

// Fetch
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

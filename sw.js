const CACHE_NAME = "ash-impostor-v21"; // ⬅ CHANGE this on every update
const OFFLINE_PAGE = "/ash-impostor/index.html";

const ASSETS = [
 "/ash-impostor/",
  "/ash-impostor/index.html",
  "/ash-impostor/manifest.json",
  "/ash-impostor/icon-192.png",
  "/ash-impostor/icon-512.png",
  "/ash-impostor/apple-touch-icon.png",
  "/ash-impostor/GL1.png",
  "/ash-impostor/qrcode.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // ⬅ IMPORTANT
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim(); // ⬅ IMPORTANT
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request).then(res => res || caches.match(OFFLINE_PAGE)))
  );
});

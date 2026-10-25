// Carnet de golf — service worker
// Network-first for pages so every deploy reaches the phone on next open;
// cache fallback so the app still opens offline at the range.
// Bump VERSION on each deploy that changes icons or the manifest.
const VERSION = "golf-v1";
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/apple-touch-icon.png", "icons/icon-192.png", "icons/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Same-origin: network first, refresh cache, fall back to cache offline.
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match("index.html")))
    );
    return;
  }

  // Google Fonts: cache first (they never change for a given URL).
  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});

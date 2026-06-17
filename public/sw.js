const CACHE_NAME = "shitbucket-v10";
const STATIC_ASSETS = [
  "/",
  "/about",
  "/manifest.json",
  "/logo-shitBucket-day.png",
  "/shitBucket-day.png",
  "/wallpaper.jpg",
  "/icon_set/How-it-works.png",
  "/icon_set/why-shit-bucket.png",
  "/icon_set/contact me.png",
  "/icon_set/design-philosophy.png",
  "/icon_set/shit-bucket.exe.png",
  "/icon_set/welcome-logo.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (event.request.url.includes("supabase.co")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => null);

      // Return cached version immediately for speed, update in background
      return cachedResponse || fetchPromise;
    })
  );
});





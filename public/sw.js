const CACHE_VERSION = "score-board-shell-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/icons/score-board-192.png",
  "/icons/score-board-512.png",
  "/icons/score-board-maskable-512.png",
];

async function cacheAppShell() {
  const cache = await caches.open(CACHE_VERSION);
  await cache.addAll(APP_SHELL);

  const indexResponse = await cache.match("/index.html");
  if (!indexResponse) {
    return;
  }

  const html = await indexResponse.text();
  const assetUrls = [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)].map(
    (match) => match[1],
  );

  await cache.addAll([...new Set(assetUrls)]);
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheAppShell());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("score-board-") && key !== CACHE_VERSION)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_VERSION).then((cache) => cache.put("/index.html", copy)),
            );
          }
          return response;
        })
        .catch(() => caches.match("/index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkResponse = fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(
              caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy)),
            );
          }
          return response;
        })
        .catch(() => cached);

      return cached ?? networkResponse;
    }),
  );
});

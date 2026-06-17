const CACHE_NAME = "mlc-weights-v1";

// Only cache model weight requests from these origins.
const CACHE_ORIGINS = [
  "huggingface.co",
  "raw.githubusercontent.com",
];

function shouldCache(url) {
  try {
    const hostname = new URL(url).hostname;
    return CACHE_ORIGINS.some((o) => hostname === o || hostname.endsWith("." + o));
  } catch {
    return false;
  }
}

self.addEventListener("install", (event) => {
  // Skip waiting so new SW activates immediately.
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE_NAME)
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  if (!shouldCache(request.url)) return;

  // Cache-first for model weight shards.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      const response = await fetch(request);
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    }),
  );
});

// Nombre del caché donde se guardarán los archivos
const CACHE_NAME = "app-shell-v1";

// Archivos que se guardarán en el caché para funcionar offline (rutas relativas)
const APP_SHELL = [
  "index.html",
  "style.css",
  "app.js",
  "assets/image.png",
  "assets/gato-negro.png",
];

// Normalizar a URLs absolutas
const ASSET_URLS = APP_SHELL.map((p) => new URL(p, self.location).href);

// Evento que se dispara cuando se instala el service worker
self.addEventListener("install", (event) => {
  self.skipWaiting(); // pasar a estado activo más rápido
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSET_URLS))
  );
});

// Evento ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        // devolver Promise.all para que waitUntil espere su resolución
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // tomar el control de las páginas
  );
});

// Evento que intercepta las peticiones de la página
self.addEventListener("fetch", (event) => {
  // Solo para peticiones GET
  if (event.request.method !== "GET") return;

  const reqUrl = new URL(event.request.url);
  const isAppShellAsset = ASSET_URLS.includes(reqUrl.href);

  if (event.request.mode === "navigate") {
    // Para navegaciones: Network First con fallback a index.html cached
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(new URL("index.html", self.location).href))
    );
    return;
  }

  if (isAppShellAsset) {
    // Cache First para assets del app-shell
    event.respondWith(
      caches.match(reqUrl.href).then((res) => res || fetch(event.request))
    );
  } else {
    // Network First para el resto (APIs, imágenes externas, etc.)
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(event.request))
    );
  }
});

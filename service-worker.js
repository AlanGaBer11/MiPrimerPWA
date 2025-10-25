// Nombre del caché donde se guardarán los archivos
const CACHE_NAME = "app-shell-v1";

// Archivos que se guardarán en el caché para funcionar offline
const APP_SHELL = [
  "/", // raíz del sitio
  "/index.html", // página principal
  "/index.css", // estilos
  "/app.js", // script principal
  "/assets/image.png", // imagen
  "/assets/gato-negro.png", // ícono
];

// Evento que se dispara cuando se instala el service worker
self.addEventListener("install", (event) => {
  // Espera a que todos los archivos se agreguen al caché
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

// Evento ACTIVATE
self.addEventListener("activate", (event) => {
  // Eliminar cachés antiguos
  event.waitUntil(
    caches.keys().then((keys) => {
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Evento que intercepta las peticiones de la página
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (APP_SHELL.includes(url.pathname)) {
    // Cache First
    event.respondWith(
      caches.match(event.request).then((res) => res || fetch(event.request))
    );
  } else {
    // Network First
    event.respondWith(
      fetch(event.request)
        .then((res) => res)
        .catch(() => caches.match(event.request))
    );
  }
});

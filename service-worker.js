// Nombre del caché donde se guardarán los archivos
const CACHE_NAME = "pwa-v1";

// Archivos que se guardarán en el caché para funcionar offline
const urlsToCache = [
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Evento que intercepta las peticiones de la página
self.addEventListener("fetch", (event) => {
  // Responde con el archivo del caché si existe, si no, lo descarga de la red
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

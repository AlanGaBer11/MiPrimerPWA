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
  "/data.json", // datos de la API
];

// Evento que se dispara cuando se instala el service worker
self.addEventListener("install", (event) => {
  // Espera a que todos los archivos se agreguen al caché
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Evento ACTIVATE
self.addEventListener("activate", (event) => {
  // Eliminar cachés antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento que intercepta las peticiones de la página
self.addEventListener("fetch", (event) => {
  console.log(event);

  const url = new URL(event.request.url);

  // Estrategia cache-first para recursos estáticos (CSS e imágenes)
  if (
    event.request.url.includes(".css") ||
    event.request.url.includes(".png") ||
    event.request.url.includes(".jpg")
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // Si está en caché, lo servimos desde ahí
        if (response) {
          console.log(
            "Sirviendo desde caché (cache-first):",
            event.request.url
          );
          return response;
        }

        // Si no está en caché, lo buscamos en la red y lo guardamos
        return fetch(event.request)
          .then((networkResponse) => {
            // Clonamos la respuesta porque solo se puede leer una vez
            let responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });

            return networkResponse;
          })
          .catch((error) => {
            console.error("Error al cargar recurso:", error);
          });
      })
    );
  }
  // Estrategia network-first para HTML y JSON (data.json)
  else if (
    event.request.url.includes(".html") ||
    event.request.url.includes(".json") ||
    event.request.url === url.origin + "/"
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Si la red responde, actualizamos la caché
          let responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          console.log(
            "Sirviendo desde red (network-first):",
            event.request.url
          );
          return networkResponse;
        })
        .catch(() => {
          // Si la red falla, intentamos cargar desde caché
          console.log(
            "Red no disponible, buscando en caché:",
            event.request.url
          );
          return caches.match(event.request).then((response) => {
            if (response) {
              console.log("Encontrado en caché:", event.request.url);
              return response;
            }
            console.log("No encontrado en caché:", event.request.url);
            // Si no está en caché y la red falló, podríamos mostrar una página de error
            // o una respuesta fallback
          });
        })
    );
  }
  // Para el resto de recursos, usamos estrategia simple de caché con fallback a red
  else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});

// Evento MESSAGE

// Evento PUSH

// Evento SYNC

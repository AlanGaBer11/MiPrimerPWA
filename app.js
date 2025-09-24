// Verifica si el navegador soporta service workers
if ("serviceWorker" in navigator) {
  // Registra el service worker para habilitar funciones offline y PWA
  navigator.serviceWorker.register("/service-worker.js");
}

// Verifica si el navegador soporta service workers
if ("serviceWorker" in navigator) {
  // Registra el service worker para habilitar funciones offline y PWA
  navigator.serviceWorker.register("/service-worker.js");
}

const container = document.getElementById("pokemons-container");

// Mostrar mensaje de carga mientras se obtienen los datos
container.innerHTML = `<p class="loading">Cargando...</p>`;

fetch("https://pokeapi.co/api/v2/pokemon?limit=12")
  .then((res) => res.json())
  .then(async (data) => {
    container.innerHTML = ""; // limpiar antes de renderizar
    // Obtener datos detallados (sprites) de cada pokemon
    const details = await Promise.all(
      data.results.map((p) => fetch(p.url).then((r) => r.json()))
    );

    details.forEach((p) => {
      const card = document.createElement("div");
      card.className = "pokemon-card";

      const img = document.createElement("img");
      const art =
        p.sprites?.other?.["official-artwork"]?.front_default ||
        p.sprites?.front_default ||
        "assets/image.png";
      img.src = art;
      img.alt = p.name;

      const title = document.createElement("h3");
      title.textContent = p.name.charAt(0).toUpperCase() + p.name.slice(1);

      card.appendChild(img);
      card.appendChild(title);
      container.appendChild(card);
    });
  })
  .catch((err) => {
    console.error("Error cargando pokemons:", err);
    container.innerHTML = `<p class="error">No se pudo cargar la información.</p>`;
  });

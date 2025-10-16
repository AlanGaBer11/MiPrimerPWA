// Verifica si el navegador soporta service workers
if ("serviceWorker" in navigator) {
  // Registra el service worker para habilitar funciones offline y PWA
  navigator.serviceWorker.register("/service-worker.js");
}

// Función para cargar los datos desde data.json
async function loadUsers() {
  try {
    const response = await fetch("/data.json");
    const data = await response.json();

    const userListElement = document.getElementById("user-list");

    // Limpia el contenedor
    userListElement.innerHTML = "";

    // Agrega cada usuario a la lista
    data.users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.classList.add("user-card");
      userDiv.innerHTML = `
        <h3>${user.nombre}</h3>
        <p>ID: ${user.id}</p>
        <p>Edad: ${user.edad}</p>
      `;
      userListElement.appendChild(userDiv);
    });
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    const userListElement = document.getElementById("user-list");
    userListElement.innerHTML =
      '<div class="error">Error al cargar los datos. Intente más tarde.</div>';
  }
}

// Cargar datos cuando la página esté lista
document.addEventListener("DOMContentLoaded", loadUsers);

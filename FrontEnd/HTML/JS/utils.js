// ===============================
// MANEJO GENERAL DE MODALES
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modalFormulario");
  const btnAbrir = document.getElementById("btnAbrirModal");
  const btnCerrar = document.getElementById("btnCerrarModal");
  const formContainer = document.getElementById("formModal");
  const modalTitulo = document.getElementById("modalTitulo");

  if (!modal || !btnAbrir || !btnCerrar) return;

  // Abrir modal de "Agregar"
  btnAbrir.addEventListener("click", () => {
    abrirModal("Agregar nuevo elemento", `
      <label>Nombre:</label>
      <input type="text" id="nombre" placeholder="Ejemplo...">
      <label>Descripción:</label>
      <textarea id="descripcion"></textarea>
      <button type="submit" class="btn btn-save">Guardar</button>
    `);
  });

  // Cerrar modal
  btnCerrar.addEventListener("click", cerrarModal);
  window.addEventListener("click", (e) => {
    if (e.target === modal) cerrarModal();
  });

  // Funciones globales
  window.abrirModal = function (titulo, contenidoHTML) {
    modalTitulo.textContent = titulo;
    formContainer.innerHTML = contenidoHTML;
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  };

  window.cerrarModal = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    formContainer.innerHTML = "";
  };

  // Cerrar modal clickeando overlay
  overlay.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  });
});
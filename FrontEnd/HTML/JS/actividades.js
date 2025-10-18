document.addEventListener("DOMContentLoaded", () => {
  listarActividades();
  configurarEventos();
});

// =============================
// DATOS SIMULADOS
// =============================
let actividades = [
  { id: 1, nombre: "Zumba", descripcion: "Baile y cardio" },
  { id: 2, nombre: "CrossFit", descripcion: "Entrenamiento de alta intensidad" }
];

let editando = false;
let idEditando = null;

// =============================
// CONFIGURAR EVENTOS PRINCIPALES
// =============================
function configurarEventos() {
  const form = document.getElementById("actividadForm");
  const modalActividad = document.getElementById("modalActividad");
  const modalConsulta = document.getElementById("modalConsulta");
  const modalDetalle = document.getElementById("modalDetalle");
  const cancelarFormBtn = document.getElementById("cancelarFormBtn");

  // Abrir modal Nueva Actividad
  document.getElementById("abrirActividadBtn").addEventListener("click", () => {
    form.reset();
    editando = false;
    idEditando = null;
    modalActividad.classList.add("show");
  });

  // Guardar / Editar actividad
  form.addEventListener("submit", e => {
    e.preventDefault();
    const nueva = {
      id: editando ? idEditando : Date.now(),
      nombre: document.getElementById("nombre").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim()
    };

    if (editando) {
      const idx = actividades.findIndex(a => a.id === idEditando);
      actividades[idx] = nueva;
      editando = false;
      idEditando = null;
    } else {
      actividades.push(nueva);
    }

    form.reset();
    modalActividad.classList.remove("show");
    listarActividades();
  });

  // Cancelar formulario (también limpia datos)
  cancelarFormBtn.addEventListener("click", () => {
    form.reset();
    editando = false;
    idEditando = null;
    modalActividad.classList.remove("show");
  });

  // Consultar actividad
  document.getElementById("buscarActividadBtn").addEventListener("click", () => {
    modalConsulta.classList.add("show");
  });

  document.getElementById("cancelarConsultaBtn").addEventListener("click", () => {
    modalConsulta.classList.remove("show");
  });

  document.getElementById("confirmarConsultaBtn").addEventListener("click", () => {
    const nombre = document.getElementById("consultaNombre").value.toLowerCase();
    const act = actividades.find(a => a.nombre.toLowerCase() === nombre);
    modalConsulta.classList.remove("show");

    if (!act) {
      alert("Actividad no encontrada");
      return;
    }

    mostrarDetalle(act);
  });

  document.getElementById("cerrarDetalleBtn").addEventListener("click", () => {
    modalDetalle.classList.remove("show");
  });
}

// =============================
// LISTAR ACTIVIDADES
// =============================
function listarActividades() {
  const tbody = document.querySelector("#actividadesTabla tbody");
  if (actividades.length === 0) {
    tbody.innerHTML = "<tr><td colspan='4'>No hay actividades registradas.</td></tr>";
    return;
  }

  tbody.innerHTML = actividades.map(a => `
    <tr>
      <td>${a.id}</td>
      <td>${a.nombre}</td>
      <td>${a.descripcion}</td>
      <td>
        <button class="btn-small btn btn-edit" onclick="editarActividad(${a.id})">Modificar</button>
        <button class="btn-small btn btn-delete" onclick="eliminarActividad(${a.id})">Eliminar</button>
        <button class="btn-small btn btn-save" onclick="imprimirActividad(${a.id})">Imprimir</button>
      </td>
    </tr>
  `).join("");
}

// =============================
// EDITAR ACTIVIDAD
// =============================
function editarActividad(id) {
  const act = actividades.find(a => a.id === id);
  if (!act) return;

  const modalDetalle = document.getElementById("modalDetalle");
  modalDetalle.classList.remove("show"); // Cierra el modal de detalle si estaba abierto

  document.getElementById("actividadId").value = act.id;
  document.getElementById("nombre").value = act.nombre;
  document.getElementById("descripcion").value = act.descripcion;

  editando = true;
  idEditando = id;

  document.getElementById("modalActividad").classList.add("show");
}

// =============================
// ELIMINAR ACTIVIDAD
// =============================
function eliminarActividad(id) {
  const modalDetalle = document.getElementById("modalDetalle");
  modalDetalle.classList.remove("show"); // Cierra detalle antes de eliminar

  if (!confirm("¿Desea eliminar esta actividad?")) return;
  actividades = actividades.filter(a => a.id !== id);
  listarActividades();
}

// =============================
// IMPRIMIR ACTIVIDAD
// =============================
function imprimirActividad(id) {
  const modalDetalle = document.getElementById("modalDetalle");
  modalDetalle.classList.remove("show"); // Cierra detalle antes de imprimir

  const act = actividades.find(a => a.id === id);
  if (!act) return;
  const ventana = window.open("", "_blank");
  ventana.document.write(`<h2>${act.nombre}</h2><p>${act.descripcion}</p>`);
  ventana.print();
}

// =============================
// MOSTRAR DETALLE (consultar())
// =============================
function mostrarDetalle(act) {
  const modal = document.getElementById("modalDetalle");
  const cont = document.getElementById("detalleContenido");
  cont.innerHTML = `
    <p><strong>ID:</strong> ${act.id}</p>
    <p><strong>Nombre:</strong> ${act.nombre}</p>
    <p><strong>Descripción:</strong> ${act.descripcion}</p>
  `;

  // Cierra detalle antes de ejecutar acciones
  document.getElementById("btnEditarDetalle").onclick = () => editarActividad(act.id);
  document.getElementById("btnEliminarDetalle").onclick = () => eliminarActividad(act.id);
  document.getElementById("btnImprimirDetalle").onclick = () => imprimirActividad(act.id);

  modal.classList.add("show");
}
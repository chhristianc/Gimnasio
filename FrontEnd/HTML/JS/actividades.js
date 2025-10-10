// ==========================================
// MODO DESARROLLO SIN API (datos simulados)
// ==========================================
let actividades = [
  { id: 1, nombre: "Zumba", descripcion: "Baile y cardio", fecha: "2025-10-10", hora: "18:00" },
  { id: 2, nombre: "CrossFit", descripcion: "Alta intensidad", fecha: "2025-10-12", hora: "19:00" },
];

const form = document.getElementById("actividadForm");
const tabla = document.querySelector("#actividadesTabla tbody");
const cancelarBtn = document.getElementById("cancelarBtn");



let editando = false;
let idEditando = null;

// =============================
// LISTAR TODAS LAS ACTIVIDADES
// =============================
function listarActividades() {
  if (actividades.length === 0) {
    tabla.innerHTML = "<tr><td colspan='5'>No hay actividades registradas.</td></tr>";
    return;
  }

  tabla.innerHTML = actividades.map(a => `
    <tr>
      <td>${a.nombre}</td>
      <td>${a.descripcion}</td>
      <td>${a.fecha}</td>
      <td>${a.hora}</td>
      <td>
        <button onclick="editarActividad(${a.id})" class="btn-small btn btn-edit">Editar</button>
        <button onclick="eliminarActividad(${a.id})" class="btn-small btn btn-delete">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

// =============================
// CREAR / ACTUALIZAR ACTIVIDAD
// =============================
form.addEventListener("submit", e => {
  e.preventDefault();

  const nuevaActividad = {
    id: editando ? idEditando : Date.now(),
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    fecha: document.getElementById("fecha").value,
    hora: document.getElementById("hora").value
  };

  if (!editando) {
    actividades.push(nuevaActividad);
  } else {
    const index = actividades.findIndex(a => a.id === idEditando);
    actividades[index] = nuevaActividad;
    editando = false;
    idEditando = null;
  }

  form.reset();
  listarActividades();
});

// =============================
// EDITAR ACTIVIDAD
// =============================
function editarActividad(id) {
  const a = actividades.find(a => a.id === id);
  if (!a) return;

  document.getElementById("actividadId").value = a.id;
  document.getElementById("nombre").value = a.nombre;
  document.getElementById("descripcion").value = a.descripcion;
  document.getElementById("fecha").value = a.fecha;
  document.getElementById("hora").value = a.hora;

  editando = true;
  idEditando = id;
}

// =============================
// ELIMINAR ACTIVIDAD
// =============================
function eliminarActividad(id) {
  if (!confirm("¿Seguro que querés eliminar esta actividad?")) return;

  actividades = actividades.filter(a => a.id !== id);
  listarActividades();
}

// =============================
// CANCELAR EDICIÓN
// =============================
cancelarBtn.addEventListener("click", () => {
  form.reset();
  editando = false;
  idEditando = null;
});

// =============================
// CARGAR AL INICIAR
// =============================
listarActividades();

document.addEventListener("DOMContentLoaded", () => {
  setupModal("modalDescuento", "abrirDescuentoBtn");
  setupModal("modalTipo", "abrirTipoBtn");
  setupModal("modalMembresia", "abrirMembresiaBtn");

  listarDescuentos();
  listarTipos();
  listarMembresias();
});

// =====================================================
// CONFIGURACIÓN DE MODALES REUTILIZABLE
// =====================================================
function setupModal(modalId, openBtnId) {
  const modal = document.getElementById(modalId);
  const openBtn = document.getElementById(openBtnId);
  const closeBtns = modal.querySelectorAll(".close-modal");

  openBtn.addEventListener("click", () => modal.classList.add("show"));

  closeBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      modal.classList.remove("show");
      modal.querySelector("form").reset();
      editando = false;
      idEditando = null;
    });
  });

  window.addEventListener("click", e => {
    if (e.target === modal) modal.classList.remove("show");
  });
}

// =====================================================
// VARIABLES Y DATOS SIMULADOS
// =====================================================
let descuentos = [
  { id: 1, descripcion: "10% estudiantes", porcentaje: 10 },
  { id: 2, descripcion: "15% fidelidad", porcentaje: 15 },
];
let tipos = [
  { id: 1, nombre: "Mensual", duracion: 30, costo: 10000, descuentoId: 1 },
];
let membresias = [
  { id: 1, miembro: "Juan Pérez", tipoId: 1, inicio: "2025-10-01", fin: "2025-10-31" },
];

let editando = false;
let idEditando = null;

// =====================================================
// DESCUENTOS
// =====================================================
const descuentoForm = document.getElementById("descuentoForm");
const descuentosTabla = document.querySelector("#descuentosTabla tbody");

function listarDescuentos() {
  descuentosTabla.innerHTML = descuentos.map(d => `
    <tr>
      <td>${d.descripcion}</td>
      <td>${d.porcentaje}%</td>
      <td>
        <button onclick="editarDescuento(${d.id})" class="btn-small btn btn-edit">Editar</button>
        <button onclick="eliminarDescuento(${d.id})" class="btn-small btn btn-delete">Eliminar</button>
      </td>
    </tr>`).join("");
  actualizarSelectDescuentos();
}

descuentoForm.addEventListener("submit", e => {
  e.preventDefault();
  const nueva = {
    id: editando ? idEditando : Date.now(),
    descripcion: document.getElementById("descripcionDescuento").value,
    porcentaje: document.getElementById("porcentajeDescuento").value
  };

  if (!editando) descuentos.push(nueva);
  else {
    const i = descuentos.findIndex(d => d.id === idEditando);
    descuentos[i] = nueva;
    editando = false;
    idEditando = null;
  }

  descuentoForm.reset();
  document.getElementById("modalDescuento").classList.remove("show");
  listarDescuentos();
});

function editarDescuento(id) {
  const d = descuentos.find(d => d.id === id);
  if (!d) return;
  document.getElementById("descuentoId").value = d.id;
  document.getElementById("descripcionDescuento").value = d.descripcion;
  document.getElementById("porcentajeDescuento").value = d.porcentaje;
  editando = true;
  idEditando = id;
  document.getElementById("modalDescuento").classList.add("show");
}

function eliminarDescuento(id) {
  if (!confirm("¿Eliminar este descuento?")) return;
  descuentos = descuentos.filter(d => d.id !== id);
  listarDescuentos();
}

function actualizarSelectDescuentos() {
  const select = document.getElementById("descuentoSelect");
  select.innerHTML = `<option value="">Sin descuento</option>` +
    descuentos.map(d => `<option value="${d.id}">${d.descripcion}</option>`).join("");
}

// =====================================================
// TIPOS DE MEMBRESÍA
// =====================================================
const tipoForm = document.getElementById("tipoForm");
const tiposTabla = document.querySelector("#tiposMembresiaTabla tbody");

function listarTipos() {
  tiposTabla.innerHTML = tipos.map(t => {
    const desc = descuentos.find(d => d.id === t.descuentoId);
    return `
      <tr>
        <td>${t.nombre}</td>
        <td>${t.duracion}</td>
        <td>$${t.costo}</td>
        <td>${desc ? desc.descripcion : "—"}</td>
        <td>
          <button onclick="editarTipo(${t.id})" class="btn-small btn btn-edit">Editar</button>
          <button onclick="eliminarTipo(${t.id})" class="btn-small btn btn-delete">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
  actualizarSelectTipos();
}

tipoForm.addEventListener("submit", e => {
  e.preventDefault();
  const nueva = {
    id: editando ? idEditando : Date.now(),
    nombre: document.getElementById("nombreTipo").value,
    duracion: document.getElementById("duracionTipo").value,
    costo: document.getElementById("costoTipo").value,
    descuentoId: document.getElementById("descuentoSelect").value
  };

  if (!editando) tipos.push(nueva);
  else {
    const i = tipos.findIndex(t => t.id === idEditando);
    tipos[i] = nueva;
    editando = false;
    idEditando = null;
  }

  tipoForm.reset();
  document.getElementById("modalTipo").classList.remove("show");
  listarTipos();
});

function editarTipo(id) {
  const t = tipos.find(t => t.id === id);
  if (!t) return;
  document.getElementById("tipoId").value = t.id;
  document.getElementById("nombreTipo").value = t.nombre;
  document.getElementById("duracionTipo").value = t.duracion;
  document.getElementById("costoTipo").value = t.costo;
  document.getElementById("descuentoSelect").value = t.descuentoId || "";
  editando = true;
  idEditando = id;
  document.getElementById("modalTipo").classList.add("show");
}

function eliminarTipo(id) {
  if (!confirm("¿Eliminar este tipo de membresía?")) return;
  tipos = tipos.filter(t => t.id !== id);
  listarTipos();
}

function actualizarSelectTipos() {
  const select = document.getElementById("tipoMembresia");
  select.innerHTML = `<option value="">Seleccionar tipo</option>` +
    tipos.map(t => `<option value="${t.id}">${t.nombre}</option>`).join("");
}

// =====================================================
// MEMBRESÍAS
// =====================================================
const membresiaForm = document.getElementById("membresiaForm");
const membresiasTabla = document.querySelector("#membresiasTabla tbody");

function listarMembresias() {
  membresiasTabla.innerHTML = membresias.map(m => {
    const tipo = tipos.find(t => t.id === m.tipoId);
    return `
      <tr>
        <td>${m.miembro}</td>
        <td>${tipo ? tipo.nombre : "—"}</td>
        <td>${m.inicio}</td>
        <td>${m.fin}</td>
        <td>
          <button onclick="editarMembresia(${m.id})" class="btn-small btn btn-edit">Editar</button>
          <button onclick="eliminarMembresia(${m.id})" class="btn-small btn btn-delete">Eliminar</button>
        </td>
      </tr>`;
  }).join("");
}

membresiaForm.addEventListener("submit", e => {
  e.preventDefault();
  const nueva = {
    id: editando ? idEditando : Date.now(),
    miembro: document.getElementById("nombreSocio").value,
    tipoId: parseInt(document.getElementById("tipoMembresia").value),
    inicio: document.getElementById("fechaInicio").value,
    fin: document.getElementById("fechaFin").value
  };

  if (!editando) membresias.push(nueva);
  else {
    const i = membresias.findIndex(m => m.id === idEditando);
    membresias[i] = nueva;
    editando = false;
    idEditando = null;
  }
});

// ========== INICIALIZACIÓN ==========

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("descuentosTabla")) renderDescuentos();
  if (document.getElementById("tiposMembresiaTabla")) renderTipos();
  if (document.getElementById("membresiasTabla")) renderMembresias();

  // Listeners de formularios
  const descuentoForm = document.getElementById("descuentoForm");
  if (descuentoForm) descuentoForm.addEventListener("submit", guardarDescuento);

  const tipoForm = document.getElementById("tipoMembresiaForm");
  if (tipoForm) tipoForm.addEventListener("submit", guardarTipo);

  const membresiaForm = document.getElementById("membresiaForm");
  if (membresiaForm) membresiaForm.addEventListener("submit", guardarMembresia);
});
// =============================
// GESTIÓN DE MEMBRESÍAS - LOCALSTORAGE
// =============================

// ----- Helpers -----
function guardarEnLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function obtenerDeLS(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function generarId() {
  return Date.now().toString();
}

// =========================================================
// 1️⃣ CRUD DESCUENTOS
// =========================================================

const descuentoForm = document.getElementById("descuentoForm");
const descuentosTabla = document.getElementById("descuentosTabla");

function renderDescuentos() {
  const descuentos = obtenerDeLS("descuentos");
  descuentosTabla.innerHTML = "";
  descuentos.forEach(d => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${d.descripcion}</td>
      <td>${d.porcentaje}%</td>
      <td>
        <button class="btn btn-edit" onclick="editarDescuento('${d.id}')">Editar</button>
        <button class="btn btn-delete" onclick="eliminarDescuento('${d.id}')">Eliminar</button>
      </td>
    `;
    descuentosTabla.appendChild(row);
  });

  // también recargar en el selector de tipos de membresía
  actualizarSelectDescuentos();
}

function actualizarSelectDescuentos() {
  const descuentos = obtenerDeLS("descuentos");
  const select = document.getElementById("descuentoTipo");
  if (!select) return;
  select.innerHTML = `<option value="">Sin descuento</option>`;
  descuentos.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.descripcion} (-${d.porcentaje}%)`;
    select.appendChild(opt);
  });
}

descuentoForm?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("descuentoId").value || generarId();
  const descripcion = document.getElementById("descripcionDescuento").value;
  const porcentaje = parseFloat(document.getElementById("porcentajeDescuento").value);

  const descuentos = obtenerDeLS("descuentos");
  const existente = descuentos.find(d => d.id === id);
  if (existente) {
    existente.descripcion = descripcion;
    existente.porcentaje = porcentaje;
  } else {
    descuentos.push({ id, descripcion, porcentaje });
  }

  guardarEnLS("descuentos", descuentos);
  descuentoForm.reset();
  renderDescuentos();
});

function editarDescuento(id) {
  const d = obtenerDeLS("descuentos").find(x => x.id === id);
  document.getElementById("descuentoId").value = d.id;
  document.getElementById("descripcionDescuento").value = d.descripcion;
  document.getElementById("porcentajeDescuento").value = d.porcentaje;
}

function eliminarDescuento(id) {
  let descuentos = obtenerDeLS("descuentos");
  descuentos = descuentos.filter(d => d.id !== id);
  guardarEnLS("descuentos", descuentos);
  renderDescuentos();
}

// =========================================================
// 2️⃣ CRUD TIPOS DE MEMBRESÍA
// =========================================================

const tipoForm = document.getElementById("tipoMembresiaForm");
const tiposTabla = document.getElementById("tiposMembresiaTabla");

function renderTipos() {
  const tipos = obtenerDeLS("tiposMembresia");
  const descuentos = obtenerDeLS("descuentos");
  tiposTabla.innerHTML = "";

  tipos.forEach(t => {
    const desc = descuentos.find(d => d.id === t.descuentoId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.nombre}</td>
      <td>${t.duracion} días</td>
      <td>$${t.costo}</td>
      <td>${desc ? desc.descripcion + " (-" + desc.porcentaje + "%)" : "—"}</td>
      <td>
        <button class="btn btn-edit" onclick="editarTipo('${t.id}')">Editar</button>
        <button class="btn btn-delete" onclick="eliminarTipo('${t.id}')">Eliminar</button>
      </td>
    `;
    tiposTabla.appendChild(row);
  });

  actualizarSelectTipos();
}

tipoForm?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("tipoMembresiaId").value || generarId();
  const nombre = document.getElementById("nombreTipo").value;
  const duracion = parseInt(document.getElementById("duracionTipo").value);
  const costo = parseFloat(document.getElementById("costoTipo").value);
  const descuentoId = document.getElementById("descuentoTipo").value || null;

  const tipos = obtenerDeLS("tiposMembresia");
  const existente = tipos.find(t => t.id === id);
  if (existente) {
    existente.nombre = nombre;
    existente.duracion = duracion;
    existente.costo = costo;
    existente.descuentoId = descuentoId;
  } else {
    tipos.push({ id, nombre, duracion, costo, descuentoId });
  }

  guardarEnLS("tiposMembresia", tipos);
  tipoForm.reset();
  renderTipos();
});

function editarTipo(id) {
  const t = obtenerDeLS("tiposMembresia").find(x => x.id === id);
  document.getElementById("tipoMembresiaId").value = t.id;
  document.getElementById("nombreTipo").value = t.nombre;
  document.getElementById("duracionTipo").value = t.duracion;
  document.getElementById("costoTipo").value = t.costo;
  document.getElementById("descuentoTipo").value = t.descuentoId || "";
}

function eliminarTipo(id) {
  let tipos = obtenerDeLS("tiposMembresia");
  tipos = tipos.filter(t => t.id !== id);
  guardarEnLS("tiposMembresia", tipos);
  renderTipos();
}

function actualizarSelectTipos() {
  const tipos = obtenerDeLS("tiposMembresia");
  const select = document.getElementById("tipoMembresia");
  if (!select) return;
  select.innerHTML = `<option value="">Seleccionar tipo</option>`;
  tipos.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.nombre} ($${t.costo})`;
    select.appendChild(opt);
  });
}

// =========================================================
// 3️⃣ CRUD MEMBRESÍAS ACTIVAS
// =========================================================

const membresiaForm = document.getElementById("membresiaForm");
const membresiasTabla = document.getElementById("membresiasTabla");

function renderMembresias() {
  const membresias = obtenerDeLS("membresias");
  const tipos = obtenerDeLS("tiposMembresia");
  membresiasTabla.innerHTML = "";

  membresias.forEach(m => {
    const tipo = tipos.find(t => t.id === m.tipoId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.miembroNombre || "Miembro X"}</td>
      <td>${tipo ? tipo.nombre : "—"}</td>
      <td>${m.fechaInicio}</td>
      <td>${m.fechaFin}</td>
      <td>${m.estado}</td>
      <td>
        <button class="btn btn-edit" onclick="editarMembresia('${m.id}')">Editar</button>
        <button class="btn btn-delete" onclick="eliminarMembresia('${m.id}')">Eliminar</button>
      </td>
    `;
    membresiasTabla.appendChild(row);
  });
}

membresiaForm?.addEventListener("submit", e => {
  e.preventDefault();
  const id = document.getElementById("membresiaId").value || generarId();
  const tipoId = document.getElementById("tipoMembresia").value;
  const miembroNombre = document.getElementById("miembro").value || "Miembro X";
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;
  const estado = document.getElementById("estado").value;

  const tipos = obtenerDeLS("tiposMembresia");
  const descuentos = obtenerDeLS("descuentos");

  const tipo = tipos.find(t => t.id === tipoId);
  const descuento = descuentos.find(d => d.id === tipo?.descuentoId);

  let costoFinal = tipo ? tipo.costo : 0;
  if (descuento) {
    costoFinal -= (costoFinal * descuento.porcentaje) / 100;
  }

  const membresias = obtenerDeLS("membresias");
  const existente = membresias.find(m => m.id === id);
  if (existente) {
    Object.assign(existente, {
      tipoId,
      miembroNombre,
      fechaInicio,
      fechaFin,
      estado,
      costoFinal
    });
  } else {
    membresias.push({ id, tipoId, miembroNombre, fechaInicio, fechaFin, estado, costoFinal });
  }

  guardarEnLS("membresias", membresias);
  membresiaForm.reset();
  renderMembresias();
});

function editarMembresia(id) {
  const m = obtenerDeLS("membresias").find(x => x.id === id);
  document.getElementById("membresiaId").value = m.id;
  document.getElementById("miembro").value = m.miembroNombre;
  document.getElementById("tipoMembresia").value = m.tipoId;
  document.getElementById("fechaInicio").value = m.fechaInicio;
  document.getElementById("fechaFin").value = m.fechaFin;
  document.getElementById("estado").value = m.estado;
}

function eliminarMembresia(id) {
  let membresias = obtenerDeLS("membresias");
  membresias = membresias.filter(m => m.id !== id);
  guardarEnLS("membresias", membresias);
  renderMembresias();
}

// =========================================================
//  🚀 INICIALIZACIÓN
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
  renderDescuentos();
  renderTipos();
  renderMembresias();
});
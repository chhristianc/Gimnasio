/* =========================================================
   GESTIÓN DE MEMBRESÍAS, TIPOS Y DESCUENTOS
   - Guarda y obtiene datos desde localStorage
   - Renderiza automáticamente las tablas si existen
========================================================= */

// ========== FUNCIONES AUXILIARES ==========

// Guardar en LocalStorage
function guardarEnLS(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

// Obtener desde LocalStorage
function obtenerDeLS(clave) {
  return JSON.parse(localStorage.getItem(clave)) || [];
}

// Generar ID único
function generarId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// ========== DESCUENTOS ==========

function renderDescuentos() {
  const descuentosTabla = document.getElementById("descuentosTabla");
  if (!descuentosTabla) return; // si no está en esta página, salir

  const descuentos = obtenerDeLS("descuentos");
  const tbody = descuentosTabla.querySelector("tbody");
  tbody.innerHTML = "";

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

  actualizarSelectDescuentos();
}

function guardarDescuento(event) {
  event.preventDefault();
  const id = document.getElementById("descuentoId").value;
  const descripcion = document.getElementById("descripcionDescuento").value.trim();
  const porcentaje = parseFloat(document.getElementById("porcentajeDescuento").value);

  if (!descripcion || isNaN(porcentaje)) return alert("Completá todos los campos");

  let descuentos = obtenerDeLS("descuentos");

  if (id) {
    // Editar
    const d = descuentos.find(x => x.id === id);
    if (d) {
      d.descripcion = descripcion;
      d.porcentaje = porcentaje;
    }
  } else {
    // Nuevo
    descuentos.push({ id: generarId(), descripcion, porcentaje });
  }

  guardarEnLS("descuentos", descuentos);
  document.getElementById("descuentoForm").reset();
  document.getElementById("descuentoId").value = "";
  renderDescuentos();
}

function editarDescuento(id) {
  const descuentos = obtenerDeLS("descuentos");
  const d = descuentos.find(x => x.id === id);
  if (!d) return;

  document.getElementById("descuentoId").value = d.id;
  document.getElementById("descripcionDescuento").value = d.descripcion;
  document.getElementById("porcentajeDescuento").value = d.porcentaje;
}

function eliminarDescuento(id) {
  if (!confirm("¿Eliminar este descuento?")) return;
  let descuentos = obtenerDeLS("descuentos").filter(x => x.id !== id);
  guardarEnLS("descuentos", descuentos);
  renderDescuentos();
}

function actualizarSelectDescuentos() {
  const select = document.getElementById("descuentoTipo");
  if (!select) return;

  const descuentos = obtenerDeLS("descuentos");
  select.innerHTML = `<option value="">Sin descuento</option>`;

  descuentos.forEach(d => {
    const opt = document.createElement("option");
    opt.value = d.id;
    opt.textContent = `${d.descripcion} (-${d.porcentaje}%)`;
    select.appendChild(opt);
  });
}

// ========== TIPOS DE MEMBRESÍA ==========

function renderTipos() {
  const tiposTabla = document.getElementById("tiposMembresiaTabla");
  if (!tiposTabla) return;

  const tipos = obtenerDeLS("tiposMembresia");
  const descuentos = obtenerDeLS("descuentos");
  const tbody = tiposTabla.querySelector("tbody");
  tbody.innerHTML = "";

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

function guardarTipo(event) {
  event.preventDefault();
  const id = document.getElementById("tipoMembresiaId").value;
  const nombre = document.getElementById("nombreTipo").value.trim();
  const duracion = parseInt(document.getElementById("duracionTipo").value);
  const costo = parseFloat(document.getElementById("costoTipo").value);
  const descuentoId = document.getElementById("descuentoTipo").value;

  if (!nombre || isNaN(duracion) || isNaN(costo)) return alert("Completá todos los campos");

  let tipos = obtenerDeLS("tiposMembresia");

  if (id) {
    const t = tipos.find(x => x.id === id);
    if (t) {
      t.nombre = nombre;
      t.duracion = duracion;
      t.costo = costo;
      t.descuentoId = descuentoId || null;
    }
  } else {
    tipos.push({ id: generarId(), nombre, duracion, costo, descuentoId: descuentoId || null });
  }

  guardarEnLS("tiposMembresia", tipos);
  document.getElementById("tipoMembresiaForm").reset();
  document.getElementById("tipoMembresiaId").value = "";
  renderTipos();
}

function editarTipo(id) {
  const tipos = obtenerDeLS("tiposMembresia");
  const t = tipos.find(x => x.id === id);
  if (!t) return;

  document.getElementById("tipoMembresiaId").value = t.id;
  document.getElementById("nombreTipo").value = t.nombre;
  document.getElementById("duracionTipo").value = t.duracion;
  document.getElementById("costoTipo").value = t.costo;
  document.getElementById("descuentoTipo").value = t.descuentoId || "";
}

function eliminarTipo(id) {
  if (!confirm("¿Eliminar este tipo de membresía?")) return;
  let tipos = obtenerDeLS("tiposMembresia").filter(x => x.id !== id);
  guardarEnLS("tiposMembresia", tipos);
  renderTipos();
}

function actualizarSelectTipos() {
  const select = document.getElementById("tipoMembresia");
  if (!select) return;

  const tipos = obtenerDeLS("tiposMembresia");
  select.innerHTML = `<option value="">Seleccionar tipo</option>`;

  tipos.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.nombre} ($${t.costo})`;
    select.appendChild(opt);
  });
}

// ========== MEMBRESÍAS ==========

function renderMembresias() {
  const membresiasTabla = document.getElementById("membresiasTabla");
  if (!membresiasTabla) return;

  const membresias = obtenerDeLS("membresias");
  const tipos = obtenerDeLS("tiposMembresia");
  const tbody =  membresiasTabla.querySelector("tbody");
  tbody.innerHTML = "";

  membresias.forEach(m => {
    const tipo = tipos.find(t => t.id === m.tipoId);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${m.nombreSocio}</td>
      <td>${tipo ? tipo.nombre : "—"}</td>
      <td>${m.fechaInicio}</td>
      <td>${m.fechaFin}</td>
      <td>
        <button class="btn btn-edit" onclick="editarMembresia('${m.id}')">Editar</button>
        <button class="btn btn-delete" onclick="eliminarMembresia('${m.id}')">Eliminar</button>
      </td>
    `;
    membresiasTabla.appendChild(row);
  });
}

function guardarMembresia(event) {
  event.preventDefault();
  const id = document.getElementById("membresiaId").value;
  const nombreSocio = document.getElementById("nombreSocio").value.trim();
  const tipoId = document.getElementById("tipoMembresia").value;
  const fechaInicio = document.getElementById("fechaInicio").value;
  const fechaFin = document.getElementById("fechaFin").value;

  if (!nombreSocio || !tipoId || !fechaInicio || !fechaFin)
    return alert("Completá todos los campos");

  let membresias = obtenerDeLS("membresias");

  if (id) {
    const m = membresias.find(x => x.id === id);
    if (m) {
      m.nombreSocio = nombreSocio;
      m.tipoId = tipoId;
      m.fechaInicio = fechaInicio;
      m.fechaFin = fechaFin;
    }
  } else {
    membresias.push({ id: generarId(), nombreSocio, tipoId, fechaInicio, fechaFin });
  }

  guardarEnLS("membresias", membresias);
  document.getElementById("membresiaForm").reset();
  document.getElementById("membresiaId").value = "";
  renderMembresias();
}

function editarMembresia(id) {
  const membresias = obtenerDeLS("membresias");
  const m = membresias.find(x => x.id === id);
  if (!m) return;

  document.getElementById("membresiaId").value = m.id;
  document.getElementById("nombreSocio").value = m.nombreSocio;
  document.getElementById("tipoMembresia").value = m.tipoId;
  document.getElementById("fechaInicio").value = m.fechaInicio;
  document.getElementById("fechaFin").value = m.fechaFin;
}

function eliminarMembresia(id) {
  if (!confirm("¿Eliminar esta membresía?")) return;
  let membresias = obtenerDeLS("membresias").filter(x => x.id !== id);
  guardarEnLS("membresias", membresias);
  renderMembresias();
}

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
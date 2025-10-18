document.addEventListener("DOMContentLoaded", () => {
  configurarEventosDescuentos();
  configurarEventosTipos();

  listarDescuentos();
  listarTipos();
});

// =====================================================
// VARIABLES GLOBALES
// =====================================================
let editando = false;
let idEditando = null;

// =====================================================
// ======== DESCUENTOS
// =====================================================
let descuentos = [
  { id: 1, descripcion: "10% estudiantes", porcentaje: 10 },
  { id: 2, descripcion: "15% fidelidad", porcentaje: 15 },
];

// === Listar Descuentos ===
function listarDescuentos() {
  const tbody = document.querySelector("#descuentosTabla tbody");
  tbody.innerHTML = descuentos
    .map(
      (d) => `
    <tr>
      <td>${d.id}</td>
      <td>${d.descripcion}</td>
      <td>${d.porcentaje}%</td>
      <td>
        <button onclick="editarDescuento(${d.id})" class="btn-small btn btn-edit">Modificar</button>
        <button onclick="eliminarDescuento(${d.id})" class="btn-small btn btn-delete">Eliminar</button>
      </td>
    </tr>`
    )
    .join("");
}

// === Guardar / Modificar ===
function guardarDescuento(e) {
  e.preventDefault();
  const nueva = {
    id: editando ? idEditando : Date.now(),
    descripcion: document.getElementById("descripcionDescuento").value,
    porcentaje: parseFloat(document.getElementById("porcentajeDescuento").value),
  };

  if (editando) {
    const i = descuentos.findIndex((d) => d.id === idEditando);
    descuentos[i] = nueva;
  } else {
    descuentos.push(nueva);
  }

  cerrarModal("modalDescuento");
  listarDescuentos();
}

// === Editar ===
function editarDescuento(id) {
  const d = descuentos.find((x) => x.id === id);
  if (!d) return;
  document.getElementById("descripcionDescuento").value = d.descripcion;
  document.getElementById("porcentajeDescuento").value = d.porcentaje;
  editando = true;
  idEditando = id;
  document.getElementById("modalDescuento").classList.add("show");
}

// === Eliminar ===
function eliminarDescuento(id) {
  if (!confirm("¿Eliminar descuento?")) return;
  descuentos = descuentos.filter((x) => x.id !== id);
  listarDescuentos();
}


// === Consultar Descuento ===
function consultarDescuento() {
  const valor = document.getElementById("buscarDescuentoInput").value.trim().toLowerCase();
  const d = descuentos.find(
    (x) => x.descripcion.toLowerCase() === valor || x.id.toString() === valor
  );

  cerrarModal("modalConsultaDescuento");

  if (!d) return alert("Descuento no encontrado");
  mostrarDetalleDescuento(d);
}

// === Mostrar Detalle de Descuento ===
function mostrarDetalleDescuento(d) {
  const div = document.getElementById("detalleContenidoDescuento");
  div.innerHTML = `
    <p><strong>ID:</strong> ${d.id}</p>
    <p><strong>Descripción:</strong> ${d.descripcion}</p>
    <p><strong>Porcentaje:</strong> ${d.porcentaje}%</p>
  `;
  document.getElementById("modalDetalleDescuento").classList.add("show");

  document.getElementById("btnEditarDescuento").onclick = () => {
    cerrarModal("modalDetalleDescuento");
    editarDescuento(d.id);
  };
  document.getElementById("btnEliminarDescuento").onclick = () => {
    cerrarModal("modalDetalleDescuento");
    eliminarDescuento(d.id);
  };
  document.getElementById("btnCerrarDetalleDescuento").onclick = () =>
    cerrarModal("modalDetalleDescuento");
}

// === Eventos específicos de Descuentos ===
function configurarEventosDescuentos() {
  document.getElementById("btnRegistrarDesc").onclick = () =>
    document.getElementById("modalDescuento").classList.add("show");

  document.getElementById("descuentoForm").addEventListener("submit", guardarDescuento);
  document.getElementById("cancelarDescuentoBtn").onclick = () =>
    cerrarModal("modalDescuento");

  document.getElementById("btnConsultarDesc").onclick = () =>
    document.getElementById("modalConsultaDescuento").classList.add("show");

  document.getElementById("confirmarConsultaDescuentoBtn").onclick = consultarDescuento;

  document.querySelector("#modalConsultaDescuento #cancelarConsultaBtn").onclick = () =>
    cerrarModal("modalConsultaDescuento");
}

// =====================================================
// ======== TIPOS DE MEMBRESÍA
// =====================================================
let tiposMembresia = [
  { id: 1, nombre: "Mensual", duracion: 30, costo: 10000, descuentoId: 1 },
];

// === Listar Tipos ===
function listarTipos() {
  const tbody = document.querySelector("#tiposMembresiaTabla tbody");
  tbody.innerHTML = tiposMembresia
    .map((t) => {
      const desc = descuentos.find((d) => d.id === t.descuentoId);
      return `
      <tr>
        <td>${t.id}</td>
        <td>${t.nombre}</td>
        <td>$${t.costo}</td>
        <td>${t.duracion} días</td>
        <td>${desc ? desc.descripcion : "—"}</td>
        <td>
          <button onclick="editarTipo(${t.id})" class="btn-small btn btn-edit">Modificar</button>
          <button onclick="eliminarTipo(${t.id})" class="btn-small btn btn-delete">Eliminar</button>
          <button onclick="imprimirTipo(${t.id})" class="btn-small btn btn-save">Imprimir</button>
        </td>
      </tr>`;
    })
    .join("");
  actualizarSelectDescuentos();
}

// === Guardar / Modificar ===
function guardarTipo(e) {
  e.preventDefault();
  const nueva = {
    id: editando ? idEditando : Date.now(),
    nombre: document.getElementById("nombreTipo").value,
    duracion: parseInt(document.getElementById("duracionTipo").value),
    costo: parseFloat(document.getElementById("costoTipo").value),
    descuentoId: parseInt(document.getElementById("descuentoTipo").value) || null,
  };

  if (editando) {
    const i = tiposMembresia.findIndex((t) => t.id === idEditando);
    tiposMembresia[i] = nueva;
  } else {
    tiposMembresia.push(nueva);
  }

  cerrarModal("modalTipo");
  listarTipos();
}

// === Editar ===
function editarTipo(id) {
  const t = tiposMembresia.find((x) => x.id === id);
  if (!t) return;
  document.getElementById("nombreTipo").value = t.nombre;
  document.getElementById("duracionTipo").value = t.duracion;
  document.getElementById("costoTipo").value = t.costo;
  document.getElementById("descuentoTipo").value = t.descuentoId || "";
  editando = true;
  idEditando = id;
  document.getElementById("modalTipo").classList.add("show");
}

// === Eliminar ===
function eliminarTipo(id) {
  if (!confirm("¿Eliminar tipo de membresía?")) return;
  tiposMembresia = tiposMembresia.filter((x) => x.id !== id);
  listarTipos();
}

// === Consultar Tipo ===
function consultarTipo() {
  const valor = document.getElementById("buscarTipoInput").value.trim().toLowerCase();
  const tipo = tiposMembresia.find(
    (t) => t.nombre.toLowerCase() === valor || t.id.toString() === valor
  );

  cerrarModal("modalConsultaTipo");

  if (!tipo) {
    alert("Tipo de membresía no encontrado");
    return;
  }

  mostrarDetalleTipo(tipo);
}

// === Mostrar Detalle Tipo ===
function mostrarDetalleTipo(t) {
  const desc = descuentos.find(d => d.id === t.descuentoId);
  const div = document.getElementById("detalleContenidoTipo");
  div.innerHTML = `
    <p><strong>ID:</strong> ${t.id}</p>
    <p><strong>Nombre:</strong> ${t.nombre}</p>
    <p><strong>Duración:</strong> ${t.duracion} días</p>
    <p><strong>Costo:</strong> $${t.costo}</p>
    <p><strong>Descuento:</strong> ${desc ? desc.descripcion + " (" + desc.porcentaje + "%)" : "Ninguno"}</p>
  `;

  document.getElementById("modalDetalleTipo").classList.add("show");

  document.getElementById("btnEditarTipo").onclick = () => {
    cerrarModal("modalDetalleTipo");
    editarTipo(t.id);
  };
  document.getElementById("btnEliminarTipo").onclick = () => {
    cerrarModal("modalDetalleTipo");
    eliminarTipo(t.id);
  };
  document.getElementById("btnImprimirTipo").onclick = () => imprimirTipo(t.id);
  document.getElementById("btnCerrarDetalleTipo").onclick = () =>
    cerrarModal("modalDetalleTipo");
}

// === Imprimir Tipo ===
function imprimirTipo(id) {
  const t = tiposMembresia.find((x) => x.id === id);
  if (!t) return alert("Tipo no encontrado");

  const desc = descuentos.find((d) => d.id === t.descuentoId);
  const costoFinal = desc
    ? t.costo - (t.costo * desc.porcentaje) / 100
    : t.costo;

  const nuevaVentana = window.open("", "_blank");
  nuevaVentana.document.write(`
    <html>
      <head>
        <title>Tipo de Membresía: ${t.nombre}</title>
        <style>
          body { font-family: Arial; padding: 20px; color: #222; }
          h1 { color: #fa3715; }
        </style>
      </head>
      <body>
        <h1>${t.nombre}</h1>
        <p><strong>Duración:</strong> ${t.duracion} días</p>
        <p><strong>Costo base:</strong> $${t.costo}</p>
        <p><strong>Descuento:</strong> ${
          desc ? desc.descripcion + " (" + desc.porcentaje + "%)" : "Ninguno"
        }</p>
        <p><strong>Costo final:</strong> $${costoFinal.toFixed(2)}</p>
      </body>
    </html>
  `);
  nuevaVentana.document.close();
  nuevaVentana.print();
}

// === Actualizar select ===
function actualizarSelectDescuentos() {
  const select = document.getElementById("descuentoTipo");
  select.innerHTML =
    `<option value="">Sin descuento</option>` +
    descuentos.map((d) => `<option value="${d.id}">${d.descripcion}</option>`).join("");
}

// === Eventos específicos de Tipos ===
function configurarEventosTipos() {
  document.getElementById("btnRegistrarTipo").onclick = () =>
    document.getElementById("modalTipo").classList.add("show");

  document.getElementById("tipoForm").addEventListener("submit", guardarTipo);

  document.getElementById("cancelarTipoBtn").onclick = () =>
    cerrarModal("modalTipo");

  document.getElementById("btnConsultarTipo").onclick = () =>
    document.getElementById("modalConsultaTipo").classList.add("show");

  document.getElementById("confirmarConsultaTipoBtn").onclick = consultarTipo;

  document.querySelector("#modalConsultaTipo #cancelarConsultaBtn").onclick = () =>
    cerrarModal("modalConsultaTipo");
}

// =====================================================
// FUNCIONES UTILITARIAS
// =====================================================
function cerrarModal(id) {
  const modal = document.getElementById(id);
  const form = modal.querySelector("form");
  if (form) form.reset();
  modal.classList.remove("show");
  editando = false;
  idEditando = null;
}
// =============================
// DATOS DE PRUEBA
// =============================
let actividadesDisponibles = [
  { id: 1, nombre: "Zumba" },
  { id: 2, nombre: "CrossFit" },
  { id: 3, nombre: "Yoga" },
  { id: 4, nombre: "Cardio" }
];
let clases = [
  {
    id: 1,
    nombre: "Yoga Flow",
    actividades: [
      { id: 3, nombre: "Yoga" }
    ],
    cupos: 20,
    idEntrenador: "Laura Gómez",
    horario: { dia: "Lunes", horaInicio: "18:00", duracion: 60 },
    inscriptos: ["Ana", "Luis"]
  },
  {
    id: 2,
    nombre: "CrossFit Intenso",
    actividades: [
      { id: 2, nombre: "CrossFit" },
      { id: 4, nombre: "Cardio" }
    ],
    cupos: 15,
    idEntrenador: "Juan Carlos",
    horario: { dia: "Martes", horaInicio: "19:00", duracion: 45 },
    inscriptos: []
  }
];

let editando = false;
let idEditando = null;

// =============================
// CARGAR LISTA DE ACTIVIDADES EN FORM
// =============================
function cargarActividades() {
  const contenedor = document.getElementById("listaActividades");
  contenedor.innerHTML = actividadesDisponibles
    .map(
      a => `
      <label>
        <input type="checkbox" value="${a.id}" /> ${a.nombre}
      </label>
    `
    )
    .join("");
}

// Llamamos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  listarClases();
  cargarActividades();
  configurarEventos();
});


// =============================
// MÉTODOS PRINCIPALES (UML)
// =============================

// Registrar Clase
function registrarClase() {

  const seleccionadas = [
    ...document.querySelectorAll("#listaActividades input:checked")
  ].map(c => {
    const act = actividadesDisponibles.find(a => a.id == c.value);
    return { id: act.id, nombre: act.nombre };
  });

  const nueva = {
    id: editando ? idEditando : Date.now(),
    nombre: document.getElementById("nombre").value,
    actividades: seleccionadas,
    cupos: parseInt(document.getElementById("cupos").value),
    idEntrenador: document.getElementById("idEntrenador").value,
    horario: {
      dia: document.getElementById("dia").value,
      horaInicio: document.getElementById("horaInicio").value,
      duracion: parseInt(document.getElementById("duracion").value)
    },
    inscriptos: editando ? clases.find(c => c.id === idEditando).inscriptos : []
  };

  if (editando) {
    const i = clases.findIndex(c => c.id === idEditando);
    clases[i] = nueva;
    editando = false;
    idEditando = null;
  } else {
    clases.push(nueva);
  }

  listarClases();
  cerrarModal("modalClase");
  document.getElementById("claseForm").reset();
  cargarActividades();
}

// Modificar Clase
function modificarClase(id) {
  const clase = clases.find(c => c.id === id);
  if (!clase) return;

  document.getElementById("nombre").value = clase.nombre;
  document.getElementById("cupos").value = clase.cupos;
  document.getElementById("idEntrenador").value = clase.idEntrenador;

  if (clase.horario) {
    document.getElementById("dia").value = clase.horario.dia;
    document.getElementById("horaInicio").value = clase.horario.horaInicio;
    document.getElementById("duracion").value = clase.horario.duracion;
  }

  // Marcar las actividades correspondientes
  const checks = document.querySelectorAll("#listaActividades input[type='checkbox']");
  checks.forEach(chk => {
    chk.checked = clase.actividades.some(a => a.id == chk.value);
  });


  editando = true;
  idEditando = id;
  document.getElementById("modalClase").classList.add("show");
}
// Eliminar Clase
function eliminarClase(id) {
  if (!confirm("¿Desea eliminar esta clase?")) return;
  clases = clases.filter(c => c.id !== id);
  listarClases();
}

// Consultar Clase
function consultarClase() {
  const valor = document.getElementById("buscarClaseInput").value.toLowerCase();
  const clase = clases.find(
    c => c.nombre.toLowerCase() === valor || c.id.toString() === valor
  );

  cerrarModal("modalConsulta");
  if (!clase) return alert("Clase no encontrada");
  mostrarDetalle(clase);
}

// Consultar Inscriptos
function consultarInscriptos(clase) {
  const ul = document.getElementById("listaInscriptos");
  ul.innerHTML = clase.inscriptos.length
    ? clase.inscriptos.map(m => `<li>${m}</li>`).join("")
    : "<li>No hay inscriptos</li>";

  document.getElementById("btnInscribirMiembro").onclick = () => inscribirMiembro(clase.id);
  document.getElementById("btnEliminarMiembro").onclick = () => eliminarMiembro(clase.id);
  document.getElementById("btnCerrarInscriptos").onclick = () => cerrarModal("modalInscriptos");

  document.getElementById("modalInscriptos").classList.add("show");
}

// Inscribir Miembro
function inscribirMiembro(id) {
  const clase = clases.find(c => c.id === id);
  const nombre = prompt("Nombre del miembro:");
  if (nombre && clase.inscriptos.length < clase.cupos) {
    clase.inscriptos.push(nombre);
    consultarInscriptos(clase);
  } else {
    alert("Clase llena o nombre inválido");
  }
}

// Eliminar Miembro
function eliminarMiembro(id) {
  const clase = clases.find(c => c.id === id);
  const nombre = prompt("Nombre del miembro a eliminar:");
  clase.inscriptos = clase.inscriptos.filter(m => m.toLowerCase() !== nombre.toLowerCase());
  consultarInscriptos(clase);
}

// Imprimir Clase
function imprimirClase(id) {
  const clase = clases.find(c => c.id === id);
  if (!clase) return alert("Clase no encontrada");

  const nuevaVentana = window.open("", "_blank");
  nuevaVentana.document.write(`
    <html>
      <head>
        <title>Clase: ${clase.nombre}</title>
        <style>
          body { font-family: Arial; padding: 20px; color: #222; }
          h1 { color: #fa3715; }
          ul { margin-left: 20px; }
        </style>
      </head>
      <body>
        <h1>${clase.nombre}</h1>
        <p><strong>Actividades:</strong> ${clase.actividades.map(a => a.nombre).join(", ")}</p>
        <p><strong>Cupos:</strong> ${clase.cupos}</p>
        <p><strong>Entrenador:</strong> ${clase.idEntrenador}</p>
        <p><strong>Horario:</strong> ${
          clase.horario
            ? `${clase.horario.dia} ${clase.horario.horaInicio} (${clase.horario.duracion} min)`
            : "No definido"
        }</p>
        <h3>Inscriptos:</h3>
        <ul>
          ${clase.inscriptos.length > 0
            ? clase.inscriptos.map(i => `<li>${i}</li>`).join("")
            : "<li>No hay inscriptos registrados</li>"}
        </ul>
      </body>
    </html>
  `);
  nuevaVentana.document.close();
  nuevaVentana.print();
}

// =============================
// LISTAR Y DETALLES
// =============================
function listarClases() {
  const tbody = document.querySelector("#clasesTabla tbody");
  tbody.innerHTML = clases.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.nombre}</td>
      <td>${c.actividades.map(a => a.nombre).join(", ")}</td>
      <td>${c.cupos}</td>
      <td>${c.idEntrenador}</td>
      <td>
        ${c.horario ? `${c.horario.dia} ${c.horario.horaInicio} (${c.horario.duracion} min)` : "No definido"}
      </td>
      <td>
        <button class="btn-small btn btn-edit" onclick="modificarClase(${c.id})">Modificar</button>
        <button class="btn-small btn btn-delete" onclick="eliminarClase(${c.id})">Eliminar</button>
        <button class="btn-small btn btn-save" onclick="imprimirClase(${c.id})">Imprimir</button>
      </td>
    </tr>
  `).join("");
}

function mostrarDetalle(c) {
  const div = document.getElementById("detalleContenido");
  div.innerHTML = `
    <p><strong>ID:</strong> ${c.id}</p>
    <p><strong>Nombre:</strong> ${c.nombre}</p>
    <p><strong>Actividades:</strong> ${c.actividades.map(a => a.nombre).join(", ")}</p>
    <p><strong>Cupos:</strong> ${c.cupos}</p>
    <p><strong>Entrenador:</strong> ${c.idEntrenador}</p>
    <p><strong>Horario:</strong> ${
      c.horario
        ? `${c.horario.dia} ${c.horario.horaInicio} (${c.horario.duracion} min)`
        : "No definido"
    }</p>
    <p><strong>Inscriptos:</strong> ${c.inscriptos.length}</p>
  `;
  document.getElementById("modalDetalle").classList.add("show");

  document.getElementById("btnEditarClase").onclick = () => { cerrarModal("modalDetalle"); modificarClase(c.id); };
  document.getElementById("btnEliminarClase").onclick = () => { cerrarModal("modalDetalle"); eliminarClase(c.id); };
  document.getElementById("btnVerInscriptos").onclick = () => { cerrarModal("modalDetalle"); consultarInscriptos(c); };
  document.getElementById("btnImprimirDetalle").onclick = () => imprimirClase(c.id);
  document.getElementById("btnCerrarDetalle").onclick = () => cerrarModal("modalDetalle");
}

// =============================
// CONFIGURACIÓN DE EVENTOS
// =============================
function configurarEventos() {
  document.getElementById("btnRegistrar").onclick = () => document.getElementById("modalClase").classList.add("show");
  document.getElementById("btnConsultar").onclick = () => document.getElementById("modalConsulta").classList.add("show");
  document.getElementById("cancelarConsultaBtn").onclick = () => cerrarModal("modalConsulta");
  document.getElementById("confirmarConsultaBtn").onclick = consultarClase;
  document.getElementById("claseForm").onsubmit = e => { e.preventDefault(); registrarClase(); };
  document.getElementById("cancelarBtn").onclick = () => { cerrarModal("modalClase"); document.getElementById("claseForm").reset(); };
}

// =============================
// UTILIDAD
// =============================
function cerrarModal(id) {
  document.getElementById(id).classList.remove("show");
}
let clases = [
  {
    id: 1,
    nombre: "Yoga Flow",
    descripcion: "Clase enfocada en la flexibilidad y respiración",
    actividades: [
      { id: 1, nombre: "Estiramiento", duracion: "15 min" },
      { id: 2, nombre: "Posturas básicas", duracion: "30 min" }
    ]
  },
  {
    id: 2,
    nombre: "CrossFit Intenso",
    descripcion: "Entrenamiento funcional de alta intensidad",
    actividades: [
      { id: 3, nombre: "Calentamiento", duracion: "10 min" },
      { id: 4, nombre: "Circuito principal", duracion: "40 min" }
    ]
  }
];

let editando = false;
let idEditando = null;
const form = document.getElementById("claseForm");
const tabla = document.querySelector("#clasesTabla tbody");
const cancelarBtn = document.getElementById("cancelarBtn");

function listarClases() {
  tabla.innerHTML = clases.map(c => `
    <tr>
      <td>${c.nombre}</td>
      <td>${c.descripcion}</td>
      <td>
        ${c.actividades.map(a => `<li>${a.nombre} (${a.duracion})</li>`).join("")}
        <button onclick="agregarActividad(${c.id})" class="btn-small">+ Actividad</button>
      </td>
      <td>
        <button onclick="editarClase(${c.id})" class="btn-small btn-edit">Editar</button>
        <button onclick="eliminarClase(${c.id})" class="btn-small btn-delete">Eliminar</button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const clase = {
    id: editando ? idEditando : Date.now(),
    nombre: document.getElementById("nombre").value,
    descripcion: document.getElementById("descripcion").value,
    actividades: editando ? clases.find(c => c.id === idEditando).actividades : []
  };

  if (!editando) {
    clases.push(clase);
  } else {
    const i = clases.findIndex(c => c.id === idEditando);
    clases[i] = clase;
    editando = false;
    idEditando = null;
  }

  form.reset();
  listarClases();
});

function editarClase(id) {
  const c = clases.find(x => x.id === id);
  if (!c) return;
  document.getElementById("nombre").value = c.nombre;
  document.getElementById("descripcion").value = c.descripcion;
  editando = true;
  idEditando = id;
}

function eliminarClase(id) {
  if (!confirm("¿Eliminar esta clase?")) return;
  clases = clases.filter(c => c.id !== id);
  listarClases();
}

function agregarActividad(idClase) {
  const clase = clases.find(c => c.id === idClase);
  const nombre = prompt("Nombre de la actividad:");
  const duracion = prompt("Duración (min):");
  if (nombre && duracion) {
    clase.actividades.push({ id: Date.now(), nombre, duracion });
    listarClases();
  }
}

cancelarBtn.addEventListener("click", () => {
  form.reset();
  editando = false;
  idEditando = null;
});

listarClases();

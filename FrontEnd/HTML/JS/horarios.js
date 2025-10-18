// =====================================================
// ========== GESTIÓN DE HORARIOS (Clase Horario)
// =====================================================

let horarios = [
  { id: 1, dia: "Lunes", hora: "08:00", clase: "Funcional" },
  { id: 2, dia: "Martes", hora: "09:00", clase: "Zumba" },
  { id: 3, dia: "Miércoles", hora: "10:00", clase: "FitCombat" },
  { id: 4, dia: "Jueves", hora: "11:00", clase: "Stretching" },
  { id: 5, dia: "Viernes", hora: "08:00", clase: "Funcional" },
  { id: 6, dia: "Sábado", hora: "10:00", clase: "Funcional" },
  { id: 7, dia: "Sábado", hora: "18:00", clase: "Funcional" },
];

let editando = false;
let idEditando = null;

document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaHorarios");
  const modalDetalle = document.getElementById("modalDetalle");
  const modalAgregar = document.getElementById("modalAgregar");
  const detalleClase = document.getElementById("detalleClase");
  const formAgregar = document.getElementById("formAgregarClase");
  const btnEliminarClase = document.getElementById("btnEliminarClase");

  let celdaActual = null;

  // ===== Mostrar horarios iniciales
    function cargarHorarios() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const tbody = tabla.querySelector("tbody");
    tbody.innerHTML = "";

    // 🔹 Generar todas las horas desde 8:00 hasta 20:00
    const horasUnicas = [];
    for (let hora = 8; hora <= 20; hora++) {
        const h = hora.toString().padStart(2, "0") + ":00";
        horasUnicas.push(h);
    }

    // 🔹 Crear filas para cada hora
    horasUnicas.forEach(hora => {
        const fila = document.createElement("tr");
        fila.innerHTML = `<td>${hora}</td>` + dias.map(dia => {
        const h = horarios.find(x => x.dia === dia && x.hora === hora);
        return h
            ? `<td><button class="btn-clase" data-dia="${dia}" data-hora="${hora}">${h.clase}</button></td>`
            : `<td></td>`;
        }).join("");
        tbody.appendChild(fila);
    });
    }

  cargarHorarios();

  /* =========================================================
     1. ABRIR MODAL DE DETALLE O DE AGREGAR
  ========================================================= */
  tabla.addEventListener("click", (e) => {
    // Si se hace clic en una clase existente
    if (e.target.classList.contains("btn-clase")) {
      const dia = e.target.dataset.dia;
      const hora = e.target.dataset.hora;
      const nombre = e.target.textContent;

      detalleClase.innerHTML = `
        <strong>${nombre}</strong><br>
        <span>Día:</span> ${dia}<br>
        <span>Hora:</span> ${hora}
      `;

      modalDetalle.classList.add("show");
      celdaActual = e.target.parentElement;
      return;
    }

    // Si se hace clic en una celda vacía
    if (e.target.tagName === "TD" && e.target.children.length === 0 && e.target.cellIndex !== 0) {
      const cabecera = e.target.closest("table").querySelectorAll("th");
      const dia = cabecera[e.target.cellIndex].textContent.trim();
      const hora = e.target.parentElement.querySelector("td").textContent.trim();

      document.getElementById("diaSeleccionado").value = dia;
      document.getElementById("horaSeleccionada").value = hora;

      modalAgregar.classList.add("show");
      celdaActual = e.target;
    }
  });

  /* =========================================================
     2. CERRAR MODALES
  ========================================================= */
  window.cerrarModal = function (id) {
    document.getElementById(id).classList.remove("show");
  };

  // Cerrar modal haciendo clic fuera del contenido
  [modalDetalle, modalAgregar].forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        modal.classList.remove("show");
      }
    });
  });

  /* =========================================================
     3. ELIMINAR CLASE DEL HORARIO
  ========================================================= */
  btnEliminarClase.addEventListener("click", () => {
    if (!celdaActual) return;

    const boton = celdaActual.querySelector(".btn-clase");
    if (!boton) return;

    const dia = boton.dataset.dia;
    const hora = boton.dataset.hora;

    // Eliminar del array de horarios
    horarios = horarios.filter(h => !(h.dia === dia && h.hora === hora));

    // Actualizar la tabla
    cargarHorarios();
    cerrarModal("modalDetalle");
  });

  /* =========================================================
     4. AGREGAR NUEVA CLASE AL HORARIO
  ========================================================= */
  formAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombreClase").value.trim();
    const dia = document.getElementById("diaSeleccionado").value;
    const hora = document.getElementById("horaSeleccionada").value;

    if (!nombre) return;

    // Agregar al array de horarios
    horarios.push({ id: Date.now(), dia, hora, clase: nombre });

    // Actualizar la tabla
    cargarHorarios();
    formAgregar.reset();
    cerrarModal("modalAgregar");
  });

  /* =========================================================
     5. IMPRIMIR HORARIO
  ========================================================= */
  const btnImprimir = document.getElementById("imprimirBtn");

    if (btnImprimir) {
    btnImprimir.addEventListener("click", (e) => {
        e.preventDefault();

        // Obtener el contenido solo del horario
        const contenido = document.getElementById("contenedor-horario").innerHTML;

        // Crear una nueva ventana temporal para imprimir solo eso
        const ventana = window.open("", "_blank", "width=900,height=700");
        ventana.document.write(`
        <html>
            <head>
            <title>Horario de Clases - CuerpoSano</title>
            <style>
                body {
                font-family: Arial, sans-serif;
                text-align: center;
                }
                table {
                border-collapse: collapse;
                width: 100%;
                margin: 20px auto;
                }
                th, td {
                border: 1px solid #000;
                padding: 10px;
                text-align: center;
                }
                th {
                background-color: #ff4500;
                color: #fff;
                }
                .btn-clase {
                border: 1px solid #007bff;
                border-radius: 10px;
                padding: 3px 8px;
                color: #007bff;
                background-color: transparent;
                }
            </style>
            </head>
            <body>
            <h2>Horario de Clases</h2>
            ${contenido}
            </body>
        </html>
        `);
        ventana.document.close();
        ventana.focus();
        ventana.print();
        ventana.close();
        });
    }
});
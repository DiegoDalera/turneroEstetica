import {
  onSnapshot,
  collection,
  db,
  obtenerEmpleados,
  obtenerServicios,
  guardarConexion,
  borrar,
  obtener,
  obtenerConexiones,
  actualizar,
} from "../js/firebase.js";

//Variables
let arrayDeTurnos = undefined;
let servicioSeleccionadoAdmin = "";
let turnoFinal = [];
//Constantes
const selectServiciosAdmin = document.getElementById("serviciosAdmin");
const gridContainer = document.getElementById("gridContainer");

document.addEventListener("DOMContentLoaded", async () => {
  arrayDeTurnos = await obtenerConexiones();
  console.log(arrayDeTurnos);
  cargarServicios();
});

//OnChange del Select Service Admin
selectServiciosAdmin.addEventListener("change", (event) => {
  servicioSeleccionadoAdmin = event.target.value;
  //Filtro de Conexiones(arrayTUrno) x Servicio Select
  turnoFinal = arrayTurnosByService(servicioSeleccionadoAdmin);
  //cargarTabla(turnoFinal[0])
  construirCalendario(
    turnoFinal[0].fechaInicio,
    turnoFinal[0].fechaFin,
    turnoFinal[0].turnos
  );
});

function cargarServicios() {
  arrayDeTurnos.forEach((conexion) => {
    const option = document.createElement("option");
    option.value = conexion.objetoServicio.servicio;
    option.textContent = conexion.objetoServicio.servicio;
    selectServiciosAdmin.appendChild(option);
  });
}

function arrayTurnosByService(servicioSeleccionado) {
  let result = arrayDeTurnos.filter(
    (el) => el.objetoServicio.servicio === servicioSeleccionado
  );
  console.log(result, "resultFilter");
  return result;
}

function cargarTabla(turnoFinal) {
  let startHour = parseInt(turnoFinal.horaInicio.slice(0, 2)); //
  let endHour = parseInt(turnoFinal.horaFin.slice(0, 2));
  let startDate = new Date(turnoFinal.fechaInicio);
  let endDate = new Date(turnoFinal.fechaFin); // Por ejemplo, rango de fechas
  const oneDay = 24 * 60 * 60 * 1000; // 1 día en milisegundos
  const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

  console.log(startDate, endDate, startHour, endHour, "hola");
  // Llenar las celdas para los días
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateCell = document.createElement("div");
    dateCell.classList.add("gridCell");
    dateCell.textContent = currentDate.toISOString().substring(0, 10);
    gridContainer.querySelector(".gridRow").appendChild(dateCell);
    currentDate.setTime(currentDate.getTime() + oneDay);
  }

  // Llenar las celdas para las horas
  for (let i = startHour; i <= endHour; i++) {
    const hourRow = document.createElement("div");
    hourRow.classList.add("gridRow");

    const hourCell = document.createElement("div");
    hourCell.classList.add("gridCell");
    hourCell.textContent = `${i.toString().padStart(2, "0")}:00`;
    hourRow.appendChild(hourCell);

    for (let j = 1; j <= (endDate - startDate) / oneDay + 1; j++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("gridCell");
      hourRow.appendChild(emptyCell);
    }

    gridContainer.appendChild(hourRow);
  }
}

// Función para construir el calendario en base a un rango de fechas y los turnos disponibles.
function construirCalendario(fechaInicio, fechaFin, turnos) {
  // Limpiamos cualquier contenido previo del contenedor.
  gridContainer.innerHTML = "";

  // Creamos una tabla.
  const table = document.createElement("table");
  table.border = "1";

  // Creamos la fila para los horarios.
  const timeRow = document.createElement("tr");
  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Horario/Fecha";
  timeRow.appendChild(timeHeader);

  // Llenamos la fila con las horas de 8 a 18.
  for (let i = 8; i <= 18; i++) {
    const timeCell = document.createElement("th");
    timeCell.textContent = `${i}:00 - ${i + 1}:00`;
    timeRow.appendChild(timeCell);
  }

  // Añadimos la fila de horarios a la tabla.
  table.appendChild(timeRow);

  // Establecemos la fecha actual a la fecha de inicio y definimos la fecha de fin.
  const currentDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  // Mientras la fecha actual no sea posterior a la fecha de fin, seguimos creando filas.
  while (currentDate <= endDate) {
    const dateRow = document.createElement("tr");
    const dateHeader = document.createElement("td");
    dateHeader.textContent = currentDate.toISOString().split("T")[0]; // Convertimos la fecha a formato YYYY-MM-DD
    dateRow.appendChild(dateHeader);

    // Para cada hora del día, verificamos si hay un turno y lo mostramos.
    for (let i = 8; i <= 18; i++) {
      const cell = document.createElement("td");

      // Buscamos si hay un turno reservado para la fecha y hora actuales.
      const turno = turnos.find((t) => {
        return (
          t.fecha === currentDate.toISOString().split("T")[0] &&
          t.horario === `${i}:00`
        );
      });

      // Si hay un turno, pintamos la celda de dorado y mostramos el cliente.
      if (turno) {
        cell.style.backgroundColor = "#FFD700";
        cell.innerText = turno.cliente;
      }

      dateRow.appendChild(cell);
    }

    // Añadimos la fila completa a la tabla.
    table.appendChild(dateRow);

    // Avanzamos al día siguiente.
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Finalmente, añadimos la tabla completa al contenedor.
  gridContainer.appendChild(table);
}

// Evento para cuando se hace clic en el botón de buscar.
document.getElementById("btn_buscar_turnos").addEventListener("click", () => {
  const fechaInicio = document.getElementById("fecha-inicio-turnos").value;
  const fechaFin = document.getElementById("fecha-fin-turnos").value;
  filtrarTurnosPorFecha(fechaInicio, fechaFin);
});

// Función para filtrar los turnos en base a un rango de fechas.
function filtrarTurnosPorFecha(fechaInicio, fechaFin) {
  // Filtramos el array de turnos basándonos en el rango de fechas.
  const turnosFiltrados = turnoFinal.filter((turno) => {
    const fechaTurno = new Date(turno.fecha);
    return (
      fechaTurno >= new Date(fechaInicio) && fechaTurno <= new Date(fechaFin)
    );
  });

  // Usamos los turnos filtrados para construir el calendario.
  construirCalendario(fechaInicio, fechaFin, turnoFinal[0].turnos);
}


document.getElementById("btn_buscar_turnos").addEventListener("click", () => {
  const fechaInicio = document.getElementById("fecha-inicio-turnos").value;
  const fechaFin = document.getElementById("fecha-fin-turnos").value;
  filtrarTurnosPorFecha(fechaInicio, fechaFin);
});

function filtrarTurnosPorFecha(fechaInicio, fechaFin) {
  const turnosFiltrados = turnoFinal.filter((turno) => {
    const fechaTurno = new Date(turno.fecha);
    return (
      fechaTurno >= new Date(fechaInicio) && fechaTurno <= new Date(fechaFin)
    );
  });

  // Luego, con esos turnos filtrados, construye tu calendario:
  construirCalendario(fechaInicio, fechaFin, turnoFinal[0].turnos);
}

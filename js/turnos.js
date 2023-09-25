import { obtenerConexiones } from "../js/firebase.js";

//Variables
let arrayDeTurnos = undefined;
let servicioSeleccionadoAdmin = "";
let turnoFinal = [];

//Constantes
const selectServiciosAdmin = document.getElementById("serviciosAdmin");
const gridContainer = document.getElementById("gridContainer");

document.addEventListener("DOMContentLoaded", async () => {
  arrayDeTurnos = await obtenerConexiones();
  cargarServicios();
});

//OnChange del Select Service Admin
selectServiciosAdmin.addEventListener("change", (event) => {
  servicioSeleccionadoAdmin = event.target.value;

  //Filtro de Conexiones(arrayTUrno) x Servicio Select
  turnoFinal = arrayTurnosByService(servicioSeleccionadoAdmin);

  console.log("ser seleccionado ", servicioSeleccionadoAdmin);
  console.log("turno final ", turnoFinal);
  // Ejemplo de uso
  const profesional = {
    horario: {
      inicio: "09:00",
      fin: "18:00",
    },
    almuerzo: {
      inicio: "13:00",
      fin: "14:00",
    },
  };
  const duracionServicio = 60; // duración en minutos
  const horariosDisponibles = calcularHorariosDisponibles(
    profesional,
    duracionServicio
  );

  console.log(horariosDisponibles, "horarios Disponibles");

  //cargarTabla(turnoFinal[0])
  construirCalendario(
    turnoFinal[0].fechaInicio,
    turnoFinal[0].fechaFin,
    turnoFinal[0].turnos,
    turnoFinal[0].color
  );
});

//Carga los servivios en el Select
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
  return result;
}

// function cargarTabla(turnoFinal) {
//   let startHour = parseInt(turnoFinal.horaInicio.slice(0, 2)); //
//   let endHour = parseInt(turnoFinal.horaFin.slice(0, 2));
//   let startDate = new Date(turnoFinal.fechaInicio);
//   let endDate = new Date(turnoFinal.fechaFin); // Por ejemplo, rango de fechas
//   const oneDay = 24 * 60 * 60 * 1000; // 1 día en milisegundos
//   const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

//   console.log(startDate, endDate, startHour, endHour, "hola");
//   // Llenar las celdas para los días
//   let currentDate = new Date(startDate);

//   while (currentDate <= endDate) {
//     const dateCell = document.createElement("div");
//     dateCell.classList.add("gridCell");
//     dateCell.textContent = currentDate.toISOString().substring(0, 10);
//     gridContainer.querySelector(".gridRow").appendChild(dateCell);
//     currentDate.setTime(currentDate.getTime() + oneDay);
//   }

//   // Llenar las celdas para las horas
//   for (let i = startHour; i <= endHour; i++) {
//     const hourRow = document.createElement("div");
//     hourRow.classList.add("gridRow");

//     const hourCell = document.createElement("div");
//     hourCell.classList.add("gridCell");
//     hourCell.textContent = `${i.toString().padStart(2, "0")}:00`;
//     hourRow.appendChild(hourCell);

//     for (let j = 1; j <= (endDate - startDate) / oneDay + 1; j++) {
//       const emptyCell = document.createElement("div");
//       emptyCell.classList.add("gridCell");
//       hourRow.appendChild(emptyCell);
//     }

//     gridContainer.appendChild(hourRow);
//   }
// }

//Funcion para pintar la tabla en base a las fechas por defecto de la conexion y sus turnos.
// function construirCalendario(fechaInicio, fechaFin, turnos) {
//   gridContainer.innerHTML = ""; // Limpiamos el contenedor

//   // Crear tabla
//   const table = document.createElement("table");
//   table.classList.add("tabla-turnos");

//   // Fila de horarios
//   const timeRow = document.createElement("tr");
//   const timeHeader = document.createElement("th");
//   timeHeader.textContent = "Horario/Fecha";
//   timeRow.appendChild(timeHeader);

//   //Rellenamos de 08:00 a 18:00
//   for (let i = 8; i <= 18; i++) {
//     const timeCell = document.createElement("th");
//     timeCell.textContent = `${i}:00 - ${i + 1}:00`;
//     timeRow.appendChild(timeCell);
//   }

//   table.appendChild(timeRow);

//   //establecemos las fechas
//   const currentDate = new Date(fechaInicio);
//   const endDate = new Date(fechaFin);

//   while (currentDate <= endDate) {
//     const dateRow = document.createElement("tr");
//     const dateHeader = document.createElement("td");
//     dateHeader.textContent = currentDate.toISOString().split("T")[0];
//     dateRow.appendChild(dateHeader);

//     for (let i = 8; i <= 18; i++) {
//       const cell = document.createElement("td");

//       // Revisa si el turno para esa fecha y hora ya está tomado
//       const turno = turnos.find((t) => {
//         return (
//           t.fecha === currentDate.toISOString().split("T")[0] &&
//           t.horario === `${i}:00`
//         );
//       });

//       if (turno) {
//         console.log("turno: ", turno);
//         cell.style.backgroundColor = "#FFD700"; // Pintamos de color dorado
//         cell.innerText = turno.docID;
//         cell.id = turno.docID; // Muestra el nombre del cliente en la celda
//       }

//       dateRow.appendChild(cell);
//     }

//     table.appendChild(dateRow);
//     currentDate.setDate(currentDate.getDate() + 1); // Avanzamos al siguiente día
//   }

//   gridContainer.appendChild(table);
// }

function construirCalendario(fechaInicio, fechaFin, turnos, color) {
  gridContainer.innerHTML = "";

  // Crear tabla
  const table = document.createElement("table");
  table.classList.add("tabla-turnos");

  // Fila de horarios
  const timeRow = document.createElement("tr");
  const timeHeader = document.createElement("th");
  timeHeader.textContent = "Horario/Fecha";
  timeRow.appendChild(timeHeader);

  //Rellenamos de 08:00 a 18:00
  for (let i = 8; i <= 18; i++) {
    const timeCell = document.createElement("th");
    timeCell.textContent = `${i}:00 - ${i + 1}:00`;
    timeRow.appendChild(timeCell);
  }

  table.appendChild(timeRow);

  //Establecemos las fechas
  const currentDate = new Date(fechaInicio);
  const endDate = new Date(fechaFin);

  while (currentDate <= endDate) {
    const dateRow = document.createElement("tr");
    const dateHeader = document.createElement("td");
    dateHeader.textContent = currentDate.toISOString().split("T")[0];
    dateRow.appendChild(dateHeader);

    for (let i = 8; i <= 18; i++) {
      const cell = document.createElement("td");

      // Revisa si el turno para esa fecha y hora ya está tomado
      const turno = turnos.find((t) => {
        return (
          t.fecha === currentDate.toISOString().split("T")[0] &&
          t.horario === `${i}:00`
        );
      });

      if (turno) {
        if (turno.seña) {
          cell.innerText = turno.cliente + "seña pagada";
          cell.classList.add("bandera");
        } else {
          cell.innerText = turno.cliente;
          cell.classList.remove("bandera");
        }

        cell.style.backgroundColor = color; // Pintamos de color
        cell.id = turno.docID; // Muestra el nombre del cliente en la celda

        // Agregar el manejador de eventos clic
        cell.addEventListener("click", () => {
          mostrarInformacionDelTurno(turno);
        });
      }

      dateRow.appendChild(cell);
    }

    table.appendChild(dateRow);
    currentDate.setDate(currentDate.getDate() + 1); // Avanzamos al siguiente día
  }
  gridContainer.appendChild(table);
}

//Funcion ONCLICK del button
document.getElementById("btn_buscar_turnos").addEventListener("click", () => {
  const fechaInicio = document.getElementById("fecha-inicio-turnos").value;
  const fechaFin = document.getElementById("fecha-fin-turnos").value;
  filtrarTurnosPorFecha(fechaInicio, fechaFin);
});

//Funcion de filtrado por 2 fechas
function filtrarTurnosPorFecha(fechaInicio, fechaFin) {
  let color = turnoFinal[0].color;

  const turnosFiltrados = turnoFinal[0].turnos.filter((turno) => {
    const fechaTurno = new Date(turno.fecha);
    return (
      fechaTurno >= new Date(fechaInicio) && fechaTurno <= new Date(fechaFin)
    );
  });

  // Luego, con esos turnos filtrados, construye tu calendario:
  construirCalendario(fechaInicio, fechaFin, turnosFiltrados, color);
}

// Modal de muestra individual
const spanCerrarModalTurnos = document.getElementById("cerrarModalTurnos");

function mostrarInformacionDelTurno(turno) {
  const modalTurnos = document.getElementById("modalTurnos");
  const spanEmail = document.getElementById("email");
  const spanCliente = document.getElementById("cliente");
  const spanFecha = document.getElementById("fecha");
  const spanTelefono = document.getElementById("telefono");
  const spanHorario = document.getElementById("horario");
  const spanComentarios = document.getElementById("comentarios");

  //botones
  const eliminarTurnoButton = document.getElementById("eliminarTurno");
  const marcarPagadoButton = document.getElementById("marcarPagado");

  // Objeto con la información del turno
  let turnoInfo = {
    email: turno.email,
    cliente: turno.cliente,
    fecha: turno.fecha,
    telefono: turno.telefono,
    comentarios: turno.comentarios,
    horario: turno.horario,
    docID: turno.docID,
  };

  spanEmail.textContent = turnoInfo.email;
  spanCliente.textContent = turnoInfo.cliente;
  spanFecha.textContent = turnoInfo.fecha;
  spanTelefono.textContent = turnoInfo.telefono;
  spanHorario.textContent = turnoInfo.horario;
  spanComentarios.textContent = turnoInfo.comentarios;

  // Muestra el modal
  modalTurnos.style.display = "block";

  eliminarTurnoButton.addEventListener("click", function () {
    console.log("subcolecion nro: ", turnoInfo.docID);
    modalTurnos.style.display = "none";
  });

  // Manejador de evento para marcar como pagado
  marcarPagadoButton.addEventListener("click", function () {
    // Puedes usar el ID del turno (turnoInfo.docID) para identificar el turno y actualizar su estado como pagado.
    modalTurnos.style.display = "none";
  });
}

// Cierra el modal cuando se hace clic en el botón de cerrar o en otra parte fuera del modal
spanCerrarModalTurnos.onclick = function () {
  modalTurnos.style.display = "none";
};

// window.onclick = function (event) {
//   if (event.target == modalTurnos) {
//     modalTurnos.style.display = "none";
//   }
// }

function stringAHora(horaString) {
  const [horas, minutos] = horaString.split(":").map(Number);
  const hora = new Date();
  hora.setHours(horas, minutos, 0, 0);
  return hora;
}
function calcularHorariosDisponibles(profesional, duracionServicio) {
  const horariosDisponibles = [];

  // Convertir horarios a objetos Date
  let horaActual = stringAHora(profesional.horario.inicio);
  const horaFinJornada = stringAHora(profesional.horario.fin);
  const horaInicioAlmuerzo = stringAHora(profesional.almuerzo.inicio);
  const horaFinAlmuerzo = stringAHora(profesional.almuerzo.fin);

  // Recorrer horario del profesional en bloques de 30 minutos
  while (horaActual < horaFinJornada) {
    // Si la hora actual está dentro del horario de almuerzo, saltar al final del almuerzo
    if (horaActual >= horaInicioAlmuerzo && horaActual < horaFinAlmuerzo) {
      horaActual = new Date(horaFinAlmuerzo);
    }

    // Verificar si hay suficiente tiempo disponible antes del próximo turno o del fin de la jornada
    if (horaActual + duracionServicio <= horaFinJornada) {
      horariosDisponibles.push(new Date(horaActual));
    }

    horaActual.setMinutes(horaActual.getMinutes() + 30); // Avanzar 30 minutos
  }

  return horariosDisponibles;
}

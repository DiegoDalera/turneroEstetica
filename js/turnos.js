import {
  obtenerConexiones,
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

function construirCalendario(fechaInicio, fechaFin, turnos) {
  gridContainer.innerHTML = ""; // Limpiamos el contenedor
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
        cell.style.backgroundColor = "#FFD700"; // Pintamos de color dorado
        cell.innerText = turno.docID;
        cell.id = turno.docID; // Muestra el nombre del cliente en la celda

        // Agregar el manejador de eventos clic
        cell.addEventListener("click", () => {
          // Muestra la información del turno
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


const spanCerrarModalTurnos = document.getElementById("cerrarModalTurnos");

function mostrarInformacionDelTurno(turno) {

  console.log(turno)
  
  const modalTurnos = document.getElementById("modalTurnos");

  const spanEmail = document.getElementById("email");
  const spanCliente = document.getElementById("cliente");
  const spanFecha = document.getElementById("fecha");
  const spanTelefono = document.getElementById("telefono");
  const spanHorario = document.getElementById("horario");
  const spanComentarios = document.getElementById("comentarios");

  // Objeto con la información del turno
  let  turnoInfo = {
    "email": turno.email ,
    "cliente": turno.cliente,
    "fecha": turno.fecha,
    "telefono": turno.telefono,
    "comentarios": turno.comentarios,
    "horario": turno.horario,
    "docID": turno.docID
  };

    spanEmail.textContent = turnoInfo.email;
    spanCliente.textContent = turnoInfo.cliente;
    spanFecha.textContent = turnoInfo.fecha;
    spanTelefono.textContent = turnoInfo.telefono;
    spanHorario.textContent = turnoInfo.horario;
    spanComentarios.textContent = turnoInfo.comentarios;

    // Muestra el modal
    modalTurnos.style.display = "block";
  }


  // Cierra el modal cuando se hace clic en el botón de cerrar o en otra parte fuera del modal
  spanCerrarModalTurnos.onclick = function () {
    modalTurnos.style.display = "none";
  }


  // window.onclick = function (event) {
  //   if (event.target == modalTurnos) {
  //     modalTurnos.style.display = "none";
  //   }
  // }


//Funcion ONCLICK del button
document.getElementById("btn_buscar_turnos").addEventListener("click", () => {
  const fechaInicio = document.getElementById("fecha-inicio-turnos").value;
  const fechaFin = document.getElementById("fecha-fin-turnos").value;
  filtrarTurnosPorFecha(fechaInicio, fechaFin);
});

//FUncion de filtrado por 2 fechas
function filtrarTurnosPorFecha(fechaInicio, fechaFin) {
  const turnosFiltrados = turnoFinal[0].turnos.filter((turno) => {
    const fechaTurno = new Date(turno.fecha);
    return (
      fechaTurno >= new Date(fechaInicio) && fechaTurno <= new Date(fechaFin)
    );
  });

  // Luego, con esos turnos filtrados, construye tu calendario:
  construirCalendario(fechaInicio, fechaFin, turnosFiltrados);
}

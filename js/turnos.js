import { obtenerColl } from "../js/firebase.js";

//Variables Globales
let arrayDeTurnos = [];
let arrayDeEmpleados = [];
let arrayDeServicios = [];

//Constantes
const selectEsteticistaAdmin = document.getElementById("esteticistasAdmin");
const fechaInicio = document.getElementById("fecha-inicio-turnos")
const fechaFin = document.getElementById("fecha-fin-turnos")
const gridContainer = document.getElementById("gridContainer");

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([cargarArrayTurnos(), cargarArrayEmpleados(), cargarArrayServicios()]);
  cargarEsteticistas()
});

async function cargarArrayTurnos() {
  try {
    const querySnapshot = await obtenerColl("turnos");
    querySnapshot.forEach((doc) => {
      // Acceder a los datos de cada documento
      const data = doc.data();
      data.id = doc.id;
      arrayDeTurnos.push(data);
    });
  } catch (error) {
    console.error("Error al obtener los turnos:", error);
  }

  console.log("array de turnos : ", arrayDeTurnos)
}

async function cargarArrayEmpleados() {
  try {
    const querySnapshot = await obtenerColl("empleados");
    querySnapshot.forEach((doc) => {
      // Acceder a los datos de cada documento
      const data = doc.data();
      // Agregar el ID como una propiedad en el objeto de datos
      data.id = doc.id;
      arrayDeEmpleados.push(data);
    });
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
  }
  console.log("array de empleados: ", arrayDeEmpleados);
}

async function cargarArrayServicios() {
  try {
    const querySnapshot = await obtenerColl("servicios");
    querySnapshot.forEach((doc) => {
      // Acceder a los datos de cada documento
      const data = doc.data();
      // Agregar el ID como una propiedad en el objeto de datos
      data.id = doc.id;
      arrayDeServicios.push(data);
    });
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
  }
  console.log("array de servicios: ", arrayDeServicios);
}

//Carga los servivios en el Select
function cargarEsteticistas() {

  arrayDeEmpleados.forEach((conexion) => {
    const option = document.createElement("option");
    option.value = conexion.id;
    option.textContent = conexion.nombre;
    selectEsteticistaAdmin.appendChild(option);

  });
}

//Funcion ONCLICK del button
document.getElementById("btn_buscar_turnos").addEventListener("click", () => {
  const fInicio = fechaInicio.value;
  const fFin = fechaFin.value
  const esteticistaID = selectEsteticistaAdmin.value
  const esteticistaNombre = selectEsteticistaAdmin.options[selectEsteticistaAdmin.selectedIndex].text;
  filtrarTurnosPorFecha(fInicio, fFin, esteticistaID, esteticistaNombre);
});

function filtrarTurnosPorFecha(fInicio, fFin, esteticistaID, esteticistaNombre) {
  console.log(fInicio, fFin, esteticistaID, esteticistaNombre);
  console.log(arrayDeTurnos);

  const turnosFiltrados = arrayDeTurnos.filter((turno) => {
    const fechaTurno = new Date(turno.fechaTurno);
    return (
      fechaTurno >= new Date(fInicio) &&
      fechaTurno <= new Date(fFin) &&
      turno.idEmpleado === esteticistaID
    );
  });

  console.log(turnosFiltrados , "turnos filtrados")

   // Ordena los turnos por fecha y hora
   turnosFiltrados.sort((a, b) => {
    const fechaA = new Date(`${a.fechaTurno}T${a.horaTurno}`);
    const fechaB = new Date(`${b.fechaTurno}T${b.horaTurno}`);
    return fechaA - fechaB;
  });

  // Luego, con esos turnos filtrados, construye tu calendario:
  construirCalendario(fInicio, fFin, turnosFiltrados, esteticistaID, esteticistaNombre);
}

//OnChange del Select Service Admin
// selectEsteticistaAdmin.addEventListener("change", (event) => {
//   servicioSeleccionadoAdmin = event.target.value;

//   //Filtro de Conexiones(arrayTUrno) x Servicio Select
//   turnoFinal = arrayTurnosByService(servicioSeleccionadoAdmin);

//   console.log("ser seleccionado ", servicioSeleccionadoAdmin);
//   console.log("turno final ", turnoFinal);
//   // Ejemplo de uso
//   const profesional = {
//     horario: {
//       inicio: "09:00",
//       fin: "18:00",
//     },
//     almuerzo: {
//       inicio: "13:00",
//       fin: "14:00",
//     },
//   };
//   const duracionServicio = 60; // duración en minutos
//   const horariosDisponibles = calcularHorariosDisponibles(
//     profesional,
//     duracionServicio
//   );

//   console.log(horariosDisponibles, "horarios Disponibles");

//   //cargarTabla(turnoFinal[0])
//   construirCalendario(
//     turnoFinal[0].fechaInicio,
//     turnoFinal[0].fechaFin,
//     turnoFinal[0].turnos,
//     turnoFinal[0].color
//   );
// });

function construirCalendario(fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre) {

  console.log("construir calendarios ", fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre)

  //calcular horario minimo y maximo de atencion
  const esteticistaEncontrado = arrayDeEmpleados.find(function (esteticista) {
    return esteticista.id === esteticistaID;
  });

  const tablaTurnos = document.getElementById("tabla-turnos");
  const tbody = tablaTurnos.querySelector("tbody");

  // Itero a través de los turnos y muestra la información en la tabla
  turnos.forEach(turno => {
    
    const fila = document.createElement("tr");

    const clienteCell = document.createElement("td");
    clienteCell.textContent = turno.cliente;
    fila.appendChild(clienteCell);

    const fechaCell = document.createElement("td");
    fechaCell.textContent = turno.fechaTurno;
    fila.appendChild(fechaCell);

    const horaCell = document.createElement("td");
    horaCell.textContent = turno.horaTurno;
    fila.appendChild(horaCell);

    const duracionCell = document.createElement("td");
    duracionCell.textContent = turno.duracion;
    fila.appendChild(duracionCell);

    const servivioCell = document.createElement("td");
    servivioCell.textContent = turno.idServicio;
    fila.appendChild(servivioCell);

    const emailCell = document.createElement("td");
    emailCell.textContent = turno.email;
    fila.appendChild(emailCell);

    const telefonoCell = document.createElement("td");
    telefonoCell.textContent = turno.telefono;
    fila.appendChild(telefonoCell);

    const señadoCell = document.createElement("td");
    señadoCell.textContent = turno.señado;
    fila.appendChild(señadoCell);

    tbody.appendChild(fila);
  });
}

// function construirCalendarioOld(fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre) {

//   console.log("construir calendarios ", fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre)

//   //calcular horario minimo y maximo de atencion

//   const esteticistaEncontrado = arrayDeEmpleados.find(function (esteticista) {
//     return esteticista.id === esteticistaID;
//   });

//   console.log("esteticista encontrado ", esteticistaEncontrado)


//   gridContainer.innerHTML = "";

//   // Crear tabla
//   const table = document.createElement("table");
//   table.classList.add("tabla-turnos");

//   // Fila de horarios
//   const timeRow = document.createElement("tr");
//   const timeHeader = document.createElement("th");
//   timeHeader.textContent = "Horario/Fecha";
//   timeRow.appendChild(timeHeader);

//   let hi = esteticistaEncontrado.horaInicio;
//   let hf = esteticistaEncontrado.horaFin;

//   //Rellenamos de 08:00 a 18:00
//   for (let i = 8; i <= 18; i++) {
//     const timeCell = document.createElement("th");
//     timeCell.textContent = `${i}:00 - ${i + 1}:00`;
//     timeRow.appendChild(timeCell);
//   }

//   table.appendChild(timeRow);

//   //Establecemos las fechas
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
//           t.fechaTurno === currentDate.toISOString().split("T")[0] &&
//           t.horaTurno === `${i}:00`
//         );
//       });

//       if (turno) {
//         if (turno.señado) {
//           cell.innerText = turno.cliente + "seña pagada";
//           cell.classList.add("bandera");
//         } else {
//           cell.innerText = turno.cliente;
//           cell.classList.remove("bandera");
//         }

//         cell.style.backgroundColor = "#FFFF00"; // Pintamos de color amarillo
//         cell.id = turno.docID; // Muestra el nombre del cliente en la celda

//         // Agregar el manejador de eventos clic
//         cell.addEventListener("click", () => {
//           mostrarInformacionDelTurno(turno);
//         });
//       }

//       dateRow.appendChild(cell);
//     }

//     table.appendChild(dateRow);
//     currentDate.setDate(currentDate.getDate() + 1); // Avanzamos al siguiente día
//   }
//   gridContainer.appendChild(table);
// }

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

function arrayTurnosByService(servicioSeleccionado) {
  let result = arrayDeTurnos.filter(
    (el) => el.objetoServicio.servicio === servicioSeleccionado
  );
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



//Funcion de filtrado por 2 fechas


// Modal de muestra individual -----------------------------------------------
const spanCerrarModalTurnos = document.getElementById("cerrarModalTurnos");

// Cierra el modal cuando se hace clic en el botón de cerrar o en otra parte fuera del modal
spanCerrarModalTurnos.onclick = function () {
  modalTurnos.style.display = "none";
};



// -----------------------------------funciones para index------------------------------------
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

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
  actualizar
} from '../js/firebase.js'


//Variables
let arrayDeTurnos = undefined;
let servicioSeleccionadoAdmin = "";
let turnoFinal = []
//Constantes
const selectServiciosAdmin = document.getElementById("serviciosAdmin");
const gridContainer = document.getElementById("gridContainer");

document.addEventListener("DOMContentLoaded", async () => {
  arrayDeTurnos = await obtenerConexiones();
  console.log(arrayDeTurnos)
  cargarServicios()

})

//OnChange del Select Service Admin
selectServiciosAdmin.addEventListener('change', (event) => {

  servicioSeleccionadoAdmin = event.target.value;
  //Filtro de Conexiones(arrayTUrno) x Servicio Select
  turnoFinal = arrayTurnosByService(servicioSeleccionadoAdmin)
  cargarTabla(turnoFinal[0])
});

function cargarServicios() {
  arrayDeTurnos.forEach((conexion) => {
    const option = document.createElement("option");
    option.value = conexion.objetoServicio.servicio;
    option.textContent = conexion.objetoServicio.servicio
    selectServiciosAdmin.appendChild(option);
  })
}

function arrayTurnosByService(servicioSeleccionado) {
  let result = arrayDeTurnos.filter(el => el.objetoServicio.servicio === servicioSeleccionado)
  console.log(result, "resultFilter")
  return result
}

function cargarTabla(turnoFinal) {
  let startHour = parseInt(turnoFinal.horaInicio.slice(0, 2)); //
  let endHour = parseInt(turnoFinal.horaFin.slice(0, 2))
  let startDate = new Date(turnoFinal.fechaInicio);
  let endDate = new Date(turnoFinal.fechaFin); // Por ejemplo, rango de fechas
  const oneDay = 24 * 60 * 60 * 1000; // 1 día en milisegundos
  const oneHour = 60 * 60 * 1000; // 1 hora en milisegundos

  console.log(startDate, endDate, startHour, endHour, "hola")
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



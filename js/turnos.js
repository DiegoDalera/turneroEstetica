import { obtenerColl, borrar, actualizar } from "../js/firebase.js";

//Variables Globales
let arrayDeTurnos = [];
let arrayDeEmpleados = [];
let arrayDeServicios = [];

//Constantes
const selectEsteticistaAdmin = document.getElementById("esteticistasAdmin");
const fechaInicio = document.getElementById("fecha-inicio-turnos")
const fechaFin = document.getElementById("fecha-fin-turnos")

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([
    cargarArray("turnos", arrayDeTurnos),
    cargarArray("empleados", arrayDeEmpleados),
    cargarArray("servicios", arrayDeServicios)
  ]);
  cargarEsteticistas()
});
async function cargarArray(coleccion, array) {
  try {
    const querySnapshot = await obtenerColl(coleccion);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.id = doc.id;
      array.push(data);
    });
    console.log(`array de ${coleccion}: `, array);
  } catch (error) {
    console.error(`Error al obtener los ${coleccion}:`, error);
  }
}

function cargarEsteticistas() {
  selectEsteticistaAdmin.innerHTML = ""
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

  console.log(turnosFiltrados, "turnos filtrados")

  // Ordena los turnos por fecha y hora
  turnosFiltrados.sort((a, b) => {
    const fechaA = new Date(`${a.fechaTurno}T${a.horaTurno}`);
    const fechaB = new Date(`${b.fechaTurno}T${b.horaTurno}`);
    return fechaA - fechaB;
  });

  // Luego, con esos turnos filtrados, construye tu calendario:
  construirCalendario(fInicio, fFin, turnosFiltrados, esteticistaID, esteticistaNombre);
}

function crearElemento(tag, contenido, clase) {
  const elemento = document.createElement(tag);
  if (contenido) elemento.textContent = contenido;
  if (clase) elemento.className = clase;
  return elemento;
}


function construirCalendario(fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre) {
  console.log("construir calendarios ", fechaInicio, fechaFin, turnos, esteticistaID, esteticistaNombre)
  //calcular horario minimo y maximo de atencion
  const esteticistaEncontrado = arrayDeEmpleados.find(function (esteticista) {
    return esteticista.id === esteticistaID;
  });

  const tablaTurnos = document.getElementById("tabla-turnos");
  const tbody = tablaTurnos.querySelector("tbody");

  tbody.innerHTML = "";

  // Itero a través de los turnos y muestra la información en la tabla
  turnos.forEach(turno => {

    const fila = document.createElement("tr");

    const clienteCell = crearElemento("td", turno.cliente);
    fila.appendChild(clienteCell);

    const fechaCell = crearElemento("td", turno.fechaTurno);
    fila.appendChild(fechaCell);

    const horaCell = crearElemento("td", turno.horaTurno);
    fila.appendChild(horaCell);

    const servicioCell = crearElemento("td", turno.servicioTurno);
    fila.appendChild(servicioCell);

    const emailCell = crearElemento("td", turno.email);
    fila.appendChild(emailCell);

    const telefonoCell = crearElemento("td", turno.telefono);
    fila.appendChild(telefonoCell);

    const señadoButton = document.createElement("button");
    console.log(turno.señado)

    if (turno.señado) {
      señadoButton.textContent = "PAGADA";
      señadoButton.setAttribute("data-turno-id", turno.id);
      señadoButton.classList.remove("no-pagada");
      señadoButton.classList.add("pagada");
    } else {
      señadoButton.textContent = "NO PAGADA";
      señadoButton.setAttribute("data-turno-id", turno.id);
      señadoButton.classList.remove("pagada");
      señadoButton.classList.add("no-pagada")
    }

    // Agrega un evento clic al botón para realizar una acción
    señadoButton.addEventListener("click", (event) => {
      const turnoId = event.target.getAttribute("data-turno-id");
      marcarTurnoSeñado(turnoId)
      Swal.fire('Seña Actualizada como abonada');
      señadoButton.classList.remove("no-pagada");
      señadoButton.classList.add("pagada");
    });

    const señadoCell = document.createElement("td");
    señadoCell.appendChild(señadoButton);
    fila.appendChild(señadoCell);

    const eliminarCell = document.createElement("td");
    const eliminarButton = document.createElement("button");
    const icon = document.createElement("i");
    icon.className = "bi bi-trash-fill";

    eliminarButton.appendChild(icon);
    eliminarButton.addEventListener("click", () => {
      eliminarTurnoPorID(turno.id);
      Swal.fire('Empleado Eliminado');
      fila.remove();

    });

    eliminarCell.appendChild(eliminarButton);
    fila.appendChild(eliminarCell);


    tbody.appendChild(fila);
  });
}

async function marcarTurnoSeñado(turnoId) {
  actualizar("turnos", turnoId, { señado: true })

  // Actualizao tambien el Array de turnos
  const elementoDeseado = arrayDeTurnos.find(turno => turno.id === turnoId);

  if (elementoDeseado) {
    elementoDeseado.señado = true;
    console.log("Campo 'señado' actualizado a true:", elementoDeseado);
  } else {
    console.log("No se encontró un elemento con el ID deseado");
  }
}

function eliminarTurnoPorID(turnoID) {
  borrar("turnos", turnoID)
}

function stringAHora(horaString) {
  const [horas, minutos] = horaString.split(":").map(Number);
  const hora = new Date();
  hora.setHours(horas, minutos, 0, 0);
  return hora;
}

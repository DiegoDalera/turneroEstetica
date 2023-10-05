import { guardarTurno, obtenerColl } from "./firebase.js";

//Variables Globales
let arrayDeTurnos = [];
let arrayDeEmpleados = [];
let arrayDeServicios = [];

let esteticistaSeleccionada = undefined;
let esteticistaSeleccionadaId = undefined;
let servicioSeleccionado = undefined;
let servicioSeleccionadoId = undefined;
let fechaSeleccionada = undefined;
let horarioSeleccionado = undefined;
let idConexion = undefined;
let empleadoEncontrado = undefined;
let servicioEncontrado = undefined;

//Constantes
const selectServicios = document.getElementById("select-servicios");
const selectEsteticistas = document.getElementById("esteticistas");
const dateInput = document.getElementById("datepicker");
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const comentarios = document.getElementById("comentarios");
const formTurnos = document.getElementById("formulario_turnos");
const btnConfirmaCita = document.getElementById("confirma_cita");
const divTurnos = document.getElementById("turnosDisponibles");

//EventListener

document.addEventListener("DOMContentLoaded", async () => {
  cargarArrayTurnos();
  cargarArrayEmpleados();
  cargarArrayServicios();
  cargarServicios();
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

  console.log("array de turnos : ", arrayDeTurnos);
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

//carga los servicios disponibles en el select

async function cargarServicios() {
  try {
    const serviciosSnapshot = await obtenerColl("servicios");
    const selectElement = document.getElementById("select-servicios");
    selectElement.innerHTML = "";

    const option = document.createElement("option");
    option.value = "1";
    option.textContent = "Selecciona con quien";
    selectElement.appendChild(option);

    serviciosSnapshot.forEach((doc) => {
      const data = doc.data();
      const nombreServicio = data.servicio; // Asegúrate de que "servicio" tenga la 's' en minúscula
      const idServicio = doc.id;
      const option = document.createElement("option");
      option.value = idServicio;
      option.textContent = nombreServicio;
      selectElement.appendChild(option);
    });
    return serviciosSnapshot;
  } catch (error) {
    console.error("Error al cargar los servicios:", error);
    throw error;
  }
}

selectServicios.addEventListener("change", (event) => {
  desabilitarInputs();
  servicioSeleccionadoId = event.target.value;
  servicioSeleccionado =
    event.target.options[event.target.selectedIndex].textContent;
  //console.log(servicioSeleccionadoId, servicioSeleccionado)
  cargarEsteticistas();
});

//Cargo los Esteticistas en el Select
function cargarEsteticistas() {
  selectEsteticistas.removeAttribute("disabled");

  while (selectEsteticistas.firstChild) {
    selectEsteticistas.removeChild(selectEsteticistas.firstChild);
  }

  const option = document.createElement("option");
  option.value = "1";
  option.textContent = "Selecciona con quien";
  selectEsteticistas.appendChild(option);

  const empleadosQueOfrecenServicio = arrayDeEmpleados.filter((empleado) => {
    return empleado.serviciosOfrecidos.includes(servicioSeleccionado);
  });

  if (empleadosQueOfrecenServicio.length > 0) {
    console.log("Objetos encontrados:", empleadosQueOfrecenServicio);
  } else {
    console.log("Objetos no encontrados - ojo no deberia entrar aqui nunca");
  }

  // Llenar el select con los empleados que ofrecen el servicio seleccionado
  empleadosQueOfrecenServicio.forEach((empleado) => {
    const option = document.createElement("option");
    option.text = empleado.nombre;
    option.value = empleado.id;
    selectEsteticistas.appendChild(option);
  });
}

//Cargo los esteticistas
selectEsteticistas.addEventListener("change", (e) => {
  esteticistaSeleccionadaId = e.target.value;
  esteticistaSeleccionada =
    e.target.options[e.target.selectedIndex].textContent;
  console.log(esteticistaSeleccionadaId, esteticistaSeleccionada);
  cargarTurnosDisponibles();
});

//Cargo las fechas disponibles en el DatePicker
function cargarTurnosDisponibles() {
  // Utiliza la función find para buscar al empleado por su ID
  empleadoEncontrado = arrayDeEmpleados.find(function (empleado) {
    return empleado.id === esteticistaSeleccionadaId;
  });

  // Utiliza la función find para buscar el por su ID
  servicioEncontrado = arrayDeServicios.find(function (servicio) {
    return servicio.id === servicioSeleccionadoId;
  });

  dateInput.removeAttribute("disabled");

  const diasDeTurnos = empleadoEncontrado.diasTrabajar;
  const diasHabilitados = diasDeTurnos.map((dia) => {
    switch (dia) {
      case "Lunes":
        return 1;
      case "Martes":
        return 2;
      case "Miercoles":
        return 3;
      case "Jueves":
        return 4;
      case "Viernes":
        return 5;
      case "Sabado":
        return 6;
      case "Domingo":
        return 0;
      default:
        return null;
    }
  });

  const picker = new Pikaday({
    field: document.getElementById("datepicker"),
    format: "YYYY-MM-DD",
    maxDate: new Date(arrayDeEmpleados.fechaFin),
    minDate: moment().toDate(),
    disableDayFn: function (date) {
      const day = moment(date).day();
      return !diasHabilitados.includes(day);
    },
  });
  picker.show();
}

//Seleccion fecha turno
dateInput.addEventListener("change", function (e) {
  e.preventDefault;
  fechaSeleccionada = dateInput.value;
  console.log("fecha seleccionada ", fechaSeleccionada);
  mostrarHorariosDisponibles();
});

function mostrarHorariosDisponibles(e) {
  divTurnos.innerHTML = "";
  const fechaAlmacenadaStr = fechaSeleccionada;

  // Empleado  y servicio encontrados
  console.log("empleado encontrado", empleadoEncontrado);
  console.log("servicio  encontrado en horarios ", servicioEncontrado);
  console.log("array de turnos: ", arrayDeTurnos);

  console.log(esteticistaSeleccionadaId);
  console.log(servicioSeleccionadoId);

  // Filtrar los elementos del array turnos que cumplan con la condición de fecha servicio y empleado
  const turnosFiltrados = arrayDeTurnos.filter(
    (objeto) =>
      objeto.idEmpleado === esteticistaSeleccionadaId &&
      objeto.idServicio === servicioSeleccionadoId
  );

  console.log("turnos filtrados ", turnosFiltrados);

  console.log(
    calcularHorariosDisponibles(
      empleadoEncontrado,
      servicioEncontrado,
      turnosFiltrados
    ),
    "disponibles turnos"
  );

  //rango Horario
  // const horarioInicio = empleadoEncontrado.horaInicio;
  // const horarioFin = empleadoEncontrado.horaFin;
  // const intervaloMinutos = 60;

  // Función para convertir una cadena de tiempo en minutos desde la medianoche
  // function tiempoAMinutos(tiempo) {
  //     const [horas, minutos] = tiempo.split(":").map(Number);
  //     return horas * 60 + minutos;
  // }

  // Creo  botones para los horarios de los turnos disponibles
  // for (let minutos = tiempoAMinutos(horarioInicio); minutos < tiempoAMinutos(horarioFin); minutos += intervaloMinutos) {
  //     const horas = Math.floor(minutos / 60);
  //     const minutosRestantes = minutos % 60;
  //     const horario = `${horas.toString().padStart(2, "0")}:${minutosRestantes.toString().padStart(2, "0")}`;

  //     const boton = document.createElement("button");
  //     boton.classList.add("botonDeHorarios");
  //     boton.textContent = horario;

  //     // validacion de horarios disponibles
  //     let existeTurno = botonHorarioHabilitado(elementosFiltrados, horario, fechaAlmacenadaStr)

  //     if (existeTurno) {
  //         boton.disabled = true
  //         //boton.classList.add("botonDeHorarios");
  //         console.log("existe Turno")
  //     }
  //     else {
  //         boton.disabled = false
  //     }

  //     boton.addEventListener("click", (e) => {
  //         e.preventDefault()
  //         alert(`Has seleccionado el turno a las ${horario} el dia ${fechaSeleccionada} para ${servicioSeleccionado} con ${esteticistaSeleccionada}`);
  //         horarioSeleccionado = horario
  //         completarDatos();
  //     });

  //     divTurnos.appendChild(boton);
  // }
}

// function calcularHorariosDisponibles() {

//     const horariosDisponibles = [];

//     let horaActual = stringAHora(empleadoEncontrado.horaInicio);
//     const horaFinJornada = stringAHora(empleadoEncontrado.horaFin);
//     const horaInicioAlmuerzo = stringAHora("12:00");
//     const horaFinAlmuerzo = stringAHora("13:00");

//     console.log(empleadoEncontrado.horaInicio,empleadoEncontrado.horaFin,servicioEncontrado.duracion)

//     // Recorrer horario del profesional en bloques de 30 minutos
//     while (horaActual < horaFinJornada) {

//         // Si la hora actual está dentro del horario de almuerzo, saltar al final del almuerzo
//         if (horaActual >= horaInicioAlmuerzo && horaActual < horaFinAlmuerzo) {
//             horaActual = new Date(horaFinAlmuerzo);
//         }

//         // Verificar si hay suficiente tiempo disponible antes del próximo turno o del fin de la jornada
//         if (horaActual + servicioEncontrado.duracion <= horaFinJornada) {
//             horariosDisponibles.push(new Date(horaActual));
//         }
//         horaActual.setMinutes(horaActual.getMinutes() + 30); // Avanzar 30 minutos
//     }

//     console.log( "horarios disponibles " , horariosDisponibles)

//     return horariosDisponibles;
// }
function calcularHorariosDisponibles(
  empleadoEncontrado,
  servicioEncontrado,
  turnosFiltrados
) {
  const horariosDisponibles = []; // Aquí almacenaremos los horarios disponibles.

  // Convertimos las horas de inicio y fin de la jornada laboral a objetos Date.
  let horaActual = stringAHora(empleadoEncontrado.horaInicio);
  const horaFinJornada = stringAHora(empleadoEncontrado.horaFin);

  // Convertimos las horas de inicio y fin del almuerzo a objetos Date.
  const horaInicioAlmuerzo = stringAHora("12:00");
  const horaFinAlmuerzo = stringAHora("13:00");

  // Iteramos sobre cada bloque de tiempo en la jornada laboral del profesional.
  while (horaActual < horaFinJornada) {
    // Si la hora actual está dentro del período de almuerzo, saltamos al final del almuerzo.
    if (horaActual >= horaInicioAlmuerzo && horaActual < horaFinAlmuerzo) {
      horaActual = new Date(horaFinAlmuerzo);
      continue;
    }

    // Calculamos la hora de finalización del servicio en el bloque de tiempo actual.
    const finServicio = new Date(
      horaActual.getTime() + servicioEncontrado.duracion * 60000
    );

    // Verificamos si el bloque de tiempo está dentro de la jornada laboral.
    if (finServicio <= horaFinJornada) {
      let disponible = true;

      // Iteramos sobre cada turno reservado para verificar si el bloque de tiempo está disponible.
      //   for (const turno of turnosFiltrado) {
      //     const inicioTurno = stringAHora(turno.horaTurno);
      //     const finTurno = new Date(
      //       inicioTurno.getTime() + turno.duracion * 60000
      //     );
      //     // Comprobamos si hay solapamiento entre el bloque de tiempo y algún turno reservado.
      //     if (
      //       (horaActual >= inicioTurno && horaActual < finTurno) ||
      //       (finServicio > inicioTurno && finServicio <= finTurno) ||
      //       (horaActual <= inicioTurno && finServicio >= finTurno)
      //     ) {
      //       disponible = false;
      //       break;
      //     }
      //   }

      // Si el bloque de tiempo está disponible, lo añadimos a la lista de horarios disponibles.
      if (disponible) {
        horariosDisponibles.push(formatoHora(horaActual));
      }
    }

    // Avanzamos la hora actual por la duración del servicio.
    horaActual.setMinutes(
      horaActual.getMinutes() + servicioEncontrado.duracion
    );
  }

  // Devolvemos la lista de horarios disponibles.
  return horariosDisponibles;
}
function stringAHora(horaString) {
  const [horas, minutos] = horaString.split(":").map(Number);
  const hora = new Date();
  hora.setHours(horas, minutos, 0, 0);
  return hora;
}

btnConfirmaCita.addEventListener("click", (e) => {
  e.preventDefault();
  const turnoData = {
    fecha: fechaSeleccionada,
    horario: horarioSeleccionado,
    cliente: nombre.value,
    email: email.value,
    telefono: telefono.value,
    comentarios: comentarios.value,
    seña: false,
  };

  (async () => {
    Swal.fire({
      icon: "success",
      title: "El Nuevo Turnos ha sido confirmado",
      showConfirmButton: false,
      timer: 2500,
    });
    await guardarTurno(idConexion, turnoData);
    location.reload();
  })();
});

//Creo los botones con los horarios Disponibles

function botonHorarioHabilitado(
  elementosFiltrados,
  horario,
  fechaAlmacenadaStr
) {
  let fechaBuscada = fechaAlmacenadaStr;
  let horarioBuscado = horario;

  for (let i = 0; i < elementosFiltrados.length; i++) {
    const item = elementosFiltrados[i];
    const turnoEncontrado = item.turnos.find(
      (turno) =>
        turno.fecha === fechaBuscada && turno.horario === horarioBuscado
    );

    if (turnoEncontrado) {
      console.log("Se encontró un turno que coincide:");
      console.log("Fecha:", turnoEncontrado.fecha);
      console.log("Horario:", turnoEncontrado.horario);
      return true;
    }
  }

  return false;
}

// Habilito los inputs inhabilitados
function completarDatos(fecha, horario, elemento) {
  nombre.removeAttribute("disabled");
  email.removeAttribute("disabled");
  telefono.removeAttribute("disabled");
  comentarios.removeAttribute("disabled");
}

function desabilitarInputs() {
  nombre.disabled = true;
  email.disabled = true;
  telefono.disabled = true;
  comentarios.disabled = true;
  dateInput.innerHTML = "";
  dateInput.disabled = true;
  divTurnos.innerHTML = "";
}

// Validar Formulario
nombre.addEventListener("input", verificarCampos);
email.addEventListener("input", verificarCampos);
telefono.addEventListener("input", verificarCampos);
comentarios.addEventListener("input", verificarCampos);

function verificarCampos() {
  if (nombre.value && email.value && telefono.value) {
    btnConfirmaCita.removeAttribute("disabled");
  } else {
    btnConfirmaCita.setAttribute("disabled", "true");
  }
}
// Función auxiliar para formatear un objeto Date a una cadena de texto con la hora.
function formatoHora(date) {
  return date.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

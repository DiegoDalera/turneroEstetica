import { obtenerColl, guardar } from "./firebase.js";

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
//let idConexion = undefined;
let empleadoEncontrado = undefined;
let servicioEncontrado = undefined;
//let duracion = undefined;

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


//cargo los servicios disponibles en el select de Servicios
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
            const nombreServicio = data.servicio;
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

//selecciono el servicio elegido
selectServicios.addEventListener("change", (event) => {
    desabilitarInputs();
    servicioSeleccionadoId = event.target.value;
    servicioSeleccionado =
        event.target.options[event.target.selectedIndex].textContent;
    cargarEsteticistas();
});

//cargo los esteticistas que ofrecen ese servicio.
function cargarEsteticistas() {
    selectEsteticistas.removeAttribute("disabled");

    while (selectEsteticistas.firstChild) {
        selectEsteticistas.removeChild(selectEsteticistas.firstChild);
    }

    const option = document.createElement("option");
    option.value = "1";
    option.textContent = "Selecciona con quien deseas atenderte";
    selectEsteticistas.appendChild(option);

    const empleadosQueOfrecenServicio = arrayDeEmpleados.filter((empleado) => {
        return empleado.serviciosOfrecidos.includes(servicioSeleccionado);
    });

    if (empleadosQueOfrecenServicio.length > 0) {
        console.log("Objetos encontrados:", empleadosQueOfrecenServicio);
    } else {
        console.log("Objetos no encontrados - ojo no deberia entrar aqui nunca");
    }

    empleadosQueOfrecenServicio.forEach((empleado) => {
        const option = document.createElement("option");
        option.text = empleado.nombre;
        option.value = empleado.id;
        selectEsteticistas.appendChild(option);
    });
}

//selecciono el esteticista elegido
selectEsteticistas.addEventListener("change", (e) => {
    esteticistaSeleccionadaId = e.target.value;
    esteticistaSeleccionada =
        e.target.options[e.target.selectedIndex].textContent;
    console.log(esteticistaSeleccionadaId, esteticistaSeleccionada);
    cargarTurnosDisponibles();
});

//Cargo las fechas disponibles en el DatePicker
function cargarTurnosDisponibles() {

    empleadoEncontrado = arrayDeEmpleados.find(function (empleado) {
        return empleado.id === esteticistaSeleccionadaId;
    });

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
    console.log("duracion ", servicioEncontrado.duracion)

    // Filtrar los elementos del array turnos que cumplan con la condición de fecha servicio y empleado
    const turnosFiltrados = arrayDeTurnos.filter(
        (objeto) =>
            objeto.idEmpleado === esteticistaSeleccionadaId &&
            objeto.fechaTurno === fechaAlmacenadaStr
    );

    console.log("turnos filtrados ", turnosFiltrados);
    console.log(calcularHorariosDisponibles(turnosFiltrados), "disponibles turnos");
    const horariosDisponibles = calcularHorariosDisponibles(turnosFiltrados)
    botonHorarioHabilitado(horariosDisponibles)

}

// NUEVA FUNCION
function calcularHorariosDisponibles(turnosFiltrados) {
    const horariosDisponibles = []; // Aquí almacenaremos los horarios disponibles.
    if (turnosFiltrados.length === 0) {
        console.log("No hay turnos en esta fecha.");
    }
    // Convertimos las horas de inicio y fin de la jornada laboral a objetos Date.
    let horaActual = stringAHora(empleadoEncontrado.horaInicio);
    const horaFinJornada = stringAHora(empleadoEncontrado.horaFin);

    // Convertimos las horas de inicio y fin del almuerzo a objetos Date.
    const horaInicioAlmuerzo = stringAHora("12:00");
    const horaFinAlmuerzo = stringAHora("13:00");

    // Iteramos sobre cada bloque de tiempo en la jornada laboral del profesional.
    while (horaActual < horaFinJornada) {
        // Si la hora actual está dentro del período de almuerzo, saltamos al final del almuerzo.
        if (
            (horaActual >= horaInicioAlmuerzo && horaActual < horaFinAlmuerzo) ||
            horaActual + servicioEncontrado.duracion >= horaInicioAlmuerzo
        ) {
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
            for (const turno of turnosFiltrados) {
                console.log("Turno Tomado: ", turno.horaTurno);
                const inicioTurno = stringAHora(turno.horaTurno);
                const finTurno = new Date(
                    inicioTurno.getTime() + turno.duracion * 60000
                );
                // Comprobamos si hay solapamiento entre el bloque de tiempo y algún turno reservado.
                if (
                    (horaActual >= inicioTurno && horaActual < finTurno) ||
                    (finServicio > inicioTurno && finServicio <= finTurno) ||
                    (horaActual <= inicioTurno && finServicio >= finTurno)
                ) {
                    disponible = false;
                    break;
                }
            }

            // Si el bloque de tiempo está disponible, lo añadimos a la lista de horarios disponibles.
            if (disponible) {
                horariosDisponibles.push(formatoHora(horaActual));
            }
        }

        // Avanzamos la hora actual por la duración del servicio.
        horaActual.setMinutes(horaActual.getMinutes() + 30);
    }

    // Devolvemos la lista de horarios disponibles.
    return horariosDisponibles;
}

//Creo los botones con los horarios Disponibles
function botonHorarioHabilitado(horariosDisponibles) {
    horariosDisponibles.forEach(horario => {
        const boton = document.createElement("button");
        boton.textContent = horario;
        boton.classList.add("btn-horario");
        boton.addEventListener("click", (e) => {
            e.preventDefault()
            horarioSeleccionado = horario;

            //-----------------------------

            Swal.fire({
                title: 'Vas a reservar un turnos con nosotros',
                text: `has seleccionado un turno a las ${horarioSeleccionado} con ${esteticistaSeleccionada} el dia  ${fechaSeleccionada}`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Seguir'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire(
                        'Leer con atencion',
                        'Por favor, a continuacion completa tus datos. Una ves confirmado el  turnos deberas....',
                        'success',
                        habilitarInputs()
                    )
                }
            })

            //---------------------------

            
        });
        divTurnos.appendChild(boton);
    });
}

function stringAHora(horaString) {
    const [horas, minutos] = horaString.split(":").map(Number);
    const hora = new Date();
    hora.setHours(horas, minutos, 0, 0);
    return hora;
}

// Habilito los inputs inhabilitados
function habilitarInputs(e) {
    nombre.removeAttribute("disabled");
    email.removeAttribute("disabled");
    telefono.removeAttribute("disabled");
    comentarios.removeAttribute("disabled");
}


btnConfirmaCita.addEventListener("click", (e) => {
    e.preventDefault();

    const turnoData = {
        cliente: nombre.value,
        comentarios: comentarios.value,
        duracion: servicioEncontrado.duracion,
        email: email.value,
        fechaTurno: fechaSeleccionada,
        horaTurno: horarioSeleccionado,
        idEmpleado: esteticistaSeleccionadaId,
        idServicio: servicioSeleccionadoId,
        señado: false,
        telefono: telefono.value,
    };

    (async () => {
        Swal.fire({
            icon: "success",
            title: "El Nuevo Turno ha sido confirmado",
            showConfirmButton: false,
            timer: 3000,
        });
        guardar(turnoData, "turnos");
        setTimeout(function () {
            location.reload();
        }, 3000);
    })();
});





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

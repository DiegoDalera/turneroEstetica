import {
    guardarTurno,
    obtenerColl,
    obtenerConexiones
} from './firebase.js'

//Variables Globales
let arrayDeTurnos = [];
let arrayDeEmpleados = [];
let esteticistaSeleccionada = undefined;
let servicioSeleccionado = undefined;
let fechaSeleccionada = undefined;
let horarioSeleccionado = undefined;
let idConexion = undefined

//Constantes
const selectServicios = document.getElementById("select-servicios");
const selectEsteticistas = document.getElementById("esteticistas");
const dateInput = document.getElementById('datepicker');
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const comentarios = document.getElementById("comentarios");
const formTurnos = document.getElementById("formulario_turnos");
const btnConfirmaCita = document.getElementById("confirma_cita");
const divTurnos = document.getElementById("turnosDisponibles");

//EventListener

document.addEventListener("DOMContentLoaded", async () => {
    cargarArrayTurnos()
    cargarArrayEmpleados()
    cargarServicios();
});

async function cargarArrayTurnos() {
    try {
        const querySnapshot = await obtenerColl("turnos");
        querySnapshot.forEach((doc) => {
            // Acceder a los datos de cada documento
            const data = doc.data();
            arrayDeTurnos.push(data);
            console.log(data, " data");
        });
    } catch (error) {
        console.error("Error al obtener los turnos:", error);
    }
}


async function cargarArrayEmpleados() {
    try {
        const querySnapshot = await obtenerColl("empleados");
        querySnapshot.forEach((doc) => {
            // Acceder a los datos de cada documento
            const data = doc.data();
            arrayDeEmpleados.push(data);
        });
    } catch (error) {
        console.error("Error al obtener los empeados:", error);
    }

}

//carga los servicios disponibles en el select
async function cargarServicios() {
    try {
        const serviciosDisponibles = await obtenerColl("servicios");
        const selectElement = document.getElementById('select-servicios');
        selectElement.innerHTML = '';

        serviciosDisponibles.forEach(servicio => {
            const nombreServicio = servicio._document.data.value.mapValue.fields.servicio.stringValue;
            const option = document.createElement('option');
            option.value = nombreServicio;
            option.textContent = nombreServicio;
            selectElement.appendChild(option);
        });
        return serviciosDisponibles;
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
        throw error;
    }
}

selectServicios.addEventListener('change', (event) => {
    desabilitarInputs();
    servicioSeleccionado = event.target.value;
    cargarEsteticistas(servicioSeleccionado)
});

//Cargo los Esteticistas en el Select
function cargarEsteticistas(servicioSeleccionado) {

    console.log(arrayDeEmpleados)
    console.log(servicioSeleccionado)

    selectEsteticistas.removeAttribute('disabled');
    // Eliminar todas las opciones del select previas
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

    console.log(empleadosQueOfrecenServicio, " empleados encontrados")

    // Llenar el select con los empleados que ofrecen el servicio seleccionado
    empleadosQueOfrecenServicio.forEach((empleado) => {
        const option = document.createElement("option");
        option.text = empleado.nombre;
        selectEsteticistas.appendChild(option);
    });
}


btnConfirmaCita.addEventListener("click", (e) => {
    e.preventDefault()
    const turnoData = {
        fecha: fechaSeleccionada,
        horario: horarioSeleccionado,
        cliente: nombre.value,
        email: email.value,
        telefono: telefono.value,
        comentarios: comentarios.value,
        seña: false
    };


    (async () => {
        Swal.fire({
            icon: 'success',
            title: 'El Nuevo Turnos ha sido confirmado',
            showConfirmButton: false,
            timer: 2500
        })
        await guardarTurno(idConexion, turnoData);
        location.reload();
    })();
})


//Cargo los esteticistas
selectEsteticistas.addEventListener('click', (e) => {
    esteticistaSeleccionada = e.target.value;
    cargarTurnosDisponibles()
})

//Cargo las fechas disponibles en el DatePicker
function cargarTurnosDisponibles() {
    dateInput.removeAttribute('disabled');

    console.log("array de turnos ", arrayDeTurnos)
    const conexionBuscada = arrayDeTurnos.find(objeto => objeto.objetoEmpleado.nombre === esteticistaSeleccionada && objeto.objetoServicio.servicio === servicioSeleccionado);
    console.log("conexion buscada  ", conexionBuscada)


    const diasDeTurnos = conexionBuscada.diasATrabajar;

    const diasHabilitados = diasDeTurnos.map(dia => {
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
    })

    const picker = new Pikaday({
        field: document.getElementById('datepicker'),
        format: 'YYYY-MM-DD',
        maxDate: new Date(conexionBuscada.fechaFin),
        minDate: moment().toDate(),
        disableDayFn: function (date) {
            const day = moment(date).day();
            return !diasHabilitados.includes(day);
        }
    });

    picker.show();
}

//Seleccion fecha turno
dateInput.addEventListener('change', function (e) {
    e.preventDefault
    fechaSeleccionada = dateInput.value;
    mostrarHorariosDisponibles()
});

//Recupera las conexiones y los carga en un array para trabajar
// async function recuperarTurnos() {

//     const turnos = await obtenerTurnos();

//     turnos.forEach(async turnoSnapshot => {
//         const turnoData = turnoSnapshot.data();

//         const objetoDeTurno = {
//             id: turnoSnapshot.id,
//             color: turnoData.color,
//             diasATrabajar: turnoData.diasATrabajar,
//             fechaFin: turnoData.fechaFin,
//             fechaInicio: turnoData.fechaInicio,
//             horaFin: turnoData.horaFin,
//             horaInicio: turnoData.horaInicio,
//             objetoEmpleado: turnoData.objetoEmpleado,
//             objetoServicio: turnoData.objetoServicio

//         };


//          const turnosColeccion = await obtenerTurnosOtorgados(turnoSnapshot.id);
//          const turnosDocumentos = turnosColeccion.docs;

//          const arrayDeObjetos = [];

//          turnosDocumentos.forEach((doc) => {
//              const objeto = doc.data();
//              arrayDeObjetos.push(objeto);
//          });

//         console.log(" array de objetos => ", arrayDeObjetos);
//         arrayDeTurnos.push(objetoDeTurno);
//         console.log(" array parcial => ", arrayDeTurnos)

//     });

//     console.log(" array final => ", arrayDeTurnos)
//     console.log("termina")
// }




//cargo los Servicios en el Select




//Creo los botones con los horarios Disponibles
function mostrarHorariosDisponibles(e) {
    divTurnos.innerHTML = '';

    const fechaAlmacenadaStr = fechaSeleccionada;

    // Filtrar los elementos del array que cumplan con la condición de fecha servicio y empleado
    const elementosFiltrados = arrayDeTurnos.filter(objeto =>
        objeto.objetoEmpleado.nombre === esteticistaSeleccionada && objeto.objetoServicio.servicio === servicioSeleccionado && objeto.fechaInicio < fechaAlmacenadaStr && objeto.fechaFin > fechaAlmacenadaStr);

    idConexion = elementosFiltrados[0].id
    console.log(elementosFiltrados[0])

    //rango Horario
    const horarioInicio = elementosFiltrados[0].horaInicio;
    const horarioFin = elementosFiltrados[0].horaFin;
    const intervaloMinutos = 60;

    // Función para convertir una cadena de tiempo en minutos desde la medianoche
    function tiempoAMinutos(tiempo) {
        const [horas, minutos] = tiempo.split(":").map(Number);
        return horas * 60 + minutos;
    }

    // Creo  botones para los horarios de los turnos disponibles 
    for (let minutos = tiempoAMinutos(horarioInicio); minutos < tiempoAMinutos(horarioFin); minutos += intervaloMinutos) {
        const horas = Math.floor(minutos / 60);
        const minutosRestantes = minutos % 60;
        const horario = `${horas.toString().padStart(2, "0")}:${minutosRestantes.toString().padStart(2, "0")}`;

        const boton = document.createElement("button");
        boton.classList.add("botonDeHorarios");
        boton.textContent = horario;

        // validacion de horarios disponibles 
        let existeTurno = botonHorarioHabilitado(elementosFiltrados, horario, fechaAlmacenadaStr)

        if (existeTurno) {
            boton.disabled = true
            //boton.classList.add("botonDeHorarios");
            console.log("existe Turno")
        }
        else {
            boton.disabled = false
        }

        boton.addEventListener("click", (e) => {
            e.preventDefault()
            alert(`Has seleccionado el turno a las ${horario} el dia ${fechaSeleccionada} para ${servicioSeleccionado} con ${esteticistaSeleccionada}`);
            horarioSeleccionado = horario
            completarDatos();
        });

        divTurnos.appendChild(boton);
    }
}

function botonHorarioHabilitado(elementosFiltrados, horario, fechaAlmacenadaStr) {
    let fechaBuscada = fechaAlmacenadaStr;
    let horarioBuscado = horario;

    for (let i = 0; i < elementosFiltrados.length; i++) {
        const item = elementosFiltrados[i];
        const turnoEncontrado = item.turnos.find(turno => turno.fecha === fechaBuscada && turno.horario === horarioBuscado);

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
    nombre.removeAttribute("disabled")
    email.removeAttribute('disabled');
    telefono.removeAttribute('disabled');
    comentarios.removeAttribute('disabled');
}

function desabilitarInputs() {
    nombre.disabled = true
    email.disabled = true
    telefono.disabled = true
    comentarios.disabled = true
    dateInput.innerHTML = ''
    dateInput.disabled = true
    divTurnos.innerHTML = '';
}

// Validar Formulario
nombre.addEventListener('input', verificarCampos);
email.addEventListener('input', verificarCampos);
telefono.addEventListener('input', verificarCampos);
comentarios.addEventListener('input', verificarCampos);

function verificarCampos() {
    if (nombre.value && email.value && telefono.value) {
        btnConfirmaCita.removeAttribute('disabled');
    } else {
        btnConfirmaCita.setAttribute('disabled', 'true');
    }
}


import {
    guardarTurno,
    obtenerTurnos,
    obtenerTurnosOtorgados,
    obtenerConexiones
} from './firebase.js'

//Variables Globales
let arrayDeTurnos = [];
let esteticistaSeleccionada = undefined;
let servicioSeleccionado = undefined;
let fechaSeleccionada = undefined;
let horarioSeleccionado = undefined;
let idConexion = undefined


//Constantes
const selectServicios = document.getElementById("servicios");
const selectEsteticistas = document.getElementById("esteticistas");
const dateInput = document.getElementById('datepicker');
const nombre = document.getElementById("nombre");
const email = document.getElementById("email");
const telefono = document.getElementById("telefono");
const comentarios = document.getElementById("comentarios");
const formTurnos = document.getElementById("formulario_turnos");
const btnConfirmaCita = document.getElementById("confirma_cita");


//EventListener
btnConfirmaCita.addEventListener("click", (e) => {

    e.preventDefault()
    // Usar idConexion 

    const turnoData = {
        fecha: fechaSeleccionada,
        horario: horarioSeleccionado,
        cliente: nombre.value,
        email: email.value,
        telefono: telefono.value,
        comentarios: comentarios.value,
    };

    // Agregar el documento a la subcolección "turnos" del servicio especificado
    guardarTurno(idConexion, turnoData)
    formTurnos.reset()

})


document.addEventListener("DOMContentLoaded", async () => {
    arrayDeTurnos = await obtenerConexiones();
    cargarServicios();
})

selectServicios.addEventListener('change', (event) => {
    servicioSeleccionado = event.target.value;
    selectEsteticistas.removeAttribute('disabled');
    cargarEsteticistas(servicioSeleccionado)
});

//cargo los esteticistas
selectEsteticistas.addEventListener('click', (e) => {
    esteticistaSeleccionada = e.target.value;
    cargarTurnosDisponibles()
})

//seleccion fecha turno
dateInput.addEventListener('change', function (e) {
    e.preventDefault
    fechaSeleccionada = dateInput.value;
    alert("entro")
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

function cargarServicios() {

    arrayDeTurnos.forEach((conexion) => {
        const option = document.createElement("option");
        option.value = conexion.objetoServicio.servicio;
        option.textContent = conexion.objetoServicio.servicio
        selectServicios.appendChild(option);
    })
}

//Cargo los Esteticistas en el Select
function cargarEsteticistas() {

    selectEsteticistas.removeAttribute('disabled');

    // Eliminar todas las opciones del select previas
    while (selectEsteticistas.firstChild) {
        selectEsteticistas.removeChild(selectEsteticistas.firstChild);
    }

    const objetosEncontrados = arrayDeTurnos.filter(objeto => objeto.objetoServicio.servicio === servicioSeleccionado);
    if (objetosEncontrados.length > 0) {
        console.log("Objetos encontrados:", objetosEncontrados);
    } else {
        console.log("Objetos no encontrados - ojo no deberia entrar aqui nunca");
    }

    objetosEncontrados.forEach(objeto => {
        const nombreEmpleado = objeto.objetoEmpleado.nombre;
        console.log(nombreEmpleado);
        const option = document.createElement("option");
        option.value = nombreEmpleado;
        option.textContent = nombreEmpleado;
        selectEsteticistas.appendChild(option);
        selectEsteticistas.disabled = false;
    });
}

//Cargo las fechas disponibles en el DatePicker
function cargarTurnosDisponibles() {

    dateInput.removeAttribute('disabled');

    const conexionBuscada = arrayDeTurnos.find(objeto => objeto.objetoEmpleado.nombre === esteticistaSeleccionada && objeto.objetoServicio.servicio === servicioSeleccionado);

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

//Creo los botones con los horarios Disponibles
function mostrarHorariosDisponibles(e) {

    const fechaAlmacenadaStr = fechaSeleccionada;

    // Filtrar los elementos del array que cumplan con la condición de fecha servicio y empleado
    const elementosFiltrados = arrayDeTurnos.filter(objeto =>
        objeto.objetoEmpleado.nombre === esteticistaSeleccionada && objeto.objetoServicio.servicio === servicioSeleccionado && objeto.fechaInicio < fechaAlmacenadaStr && objeto.fechaFin > fechaAlmacenadaStr);

    console.log(elementosFiltrados)

    idConexion = elementosFiltrados[0].id

    //rango Horario
    const horarioInicio = elementosFiltrados[0].horaInicio;
    const horarioFin = elementosFiltrados[0].horaFin;
    const intervaloMinutos = 60;

    const divTurnos = document.getElementById("turnosDisponibles");

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

        //hacer validacion de horarios disponibles aca

        boton.addEventListener("click", (e) => {
            e.preventDefault()
            alert(`Has seleccionado el turno a las ${horario} el dia ${fechaSeleccionada} para ${servicioSeleccionado} con ${esteticistaSeleccionada}`);

            horarioSeleccionado = horario
            completarDatos();
        });
        divTurnos.appendChild(boton);
    }
}

// habilito los inputs inhabilitados
function completarDatos() {
    nombre.removeAttribute("disabled")
    email.removeAttribute('disabled');
    telefono.removeAttribute('disabled');
    comentarios.removeAttribute('disabled');


}


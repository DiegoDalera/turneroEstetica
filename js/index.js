import {
    obtenerTurnos
} from './firebase.js'

//variables
const arrayDeTurnos = [];
let esteticistaSeleccionada = undefined;
let servicioSeleccionado = undefined;
let fechaSeleccionada = undefined;
let horarioSeleccionado = undefined;

//Constantes
const selectServicios = document.getElementById("servicios");
const selectEsteticistas = document.getElementById("esteticistas");


//EventListener
document.addEventListener("DOMContentLoaded", async () => {
    await recuperarTurnos();
    cargarServicios();
})


selectServicios.addEventListener('change', (event) => {
    servicioSeleccionado = event.target.value;
    //console.log('Opción seleccionada:', opcionSeleccionada);
    cargarEsteticistas(servicioSeleccionado)
});

selectEsteticistas.addEventListener('click', (e) => {
    esteticistaSeleccionada = e.target.value;
    console.log('Opción seleccionada:', esteticistaSeleccionada);
    cargarTurnosDisponibles()
})

//recupera turnos y los carga en un array para trabajar
async function recuperarTurnos() {
    //traigo todos los turnos y los almaceno en mi array
    const turnos = await obtenerTurnos();
    turnos.forEach(turnoSnapshot => {
        // Obtener los datos del documento usando .data()
        const turnoData = turnoSnapshot.data();
        const objetoDeTurno = {
            id: turnoSnapshot.id,
            color: turnoData.color,
            diasATrabajar: turnoData.diasATrabajar,
            fechaFin: turnoData.fechaFin,
            fechaInicio: turnoData.fechaInicio,
            horaFin: turnoData.horaFin,
            horaInicio: turnoData.horaInicio,
            objetoEmpleado: turnoData.objetoEmpleado,
            objetoServicio: turnoData.objetoServicio
        };
        arrayDeTurnos.push(objetoDeTurno);
    });
    console.log(arrayDeTurnos);
}

function cargarServicios() {
    arrayDeTurnos.forEach((conexion) => {
        //console.log(conexion.objetoServicio.servicio)
        const option = document.createElement("option");
        option.value = conexion.objetoServicio.servicio;
        option.textContent = conexion.objetoServicio.servicio
        selectServicios.appendChild(option);
    });

}

function cargarEsteticistas() {

    // Eliminar todas las opciones del select previas
    while (selectEsteticistas.firstChild) {
        selectEsteticistas.removeChild(selectEsteticistas.firstChild);
    }

    console.log(servicioSeleccionado)
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

function cargarTurnosDisponibles() {
    console.log(esteticistaSeleccionada)
    console.log(servicioSeleccionado)

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

//seleccion fecha turno
const dateInput = document.getElementById('datepicker');

dateInput.addEventListener('change', function (e) {
    e.preventDefault
    fechaSeleccionada = dateInput.value;
    console.log('Fecha seleccionada:', fechaSeleccionada);
    //mostrarHorariosDisponibles()
});

function mostrarHorariosDisponibles(){



}

//test

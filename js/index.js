import {
    obtenerTurnos
} from './firebase.js'

//Constantes
const arrayDeTurnos = [];
const selectServicios = document.getElementById("servicios");
const selectEsteticistas = document.getElementById("esteticistas");


//EventListener
document.addEventListener("DOMContentLoaded", async () => {
    await recuperarTurnos();
    cargarServicios();
})


selectServicios.addEventListener('change', (event) => {
    const servicioSeleccionado = event.target.value;
    //console.log('Opción seleccionada:', opcionSeleccionada);
    cargarEsteticistas(servicioSeleccionado)
});

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

function cargarEsteticistas(servicioSeleccionado) {


    // Eliminar todas las opciones
    while (selectEsteticistas.firstChild) {
        selectEsteticistas.removeChild(selectEsteticistas.firstChild);
    }

    console.log(servicioSeleccionado)
    const objetosEncontrados = arrayDeTurnos.filter(objeto => objeto.objetoServicio.servicio === servicioSeleccionado);
    if (objetosEncontrados.length > 0) {
        console.log("Objetos encontrados:", objetosEncontrados);
    } else {
        console.log("Objetos no encontrados");
    }

    const nombreEmpleado = objetosEncontrados[0].objetoEmpleado.nombre;
    console.log(nombreEmpleado)
    const option = document.createElement("option");
    option.value = nombreEmpleado;
    option.textContent = nombreEmpleado;
    selectEsteticistas.appendChild(option);
    selectEsteticistas.disabled = false;


}
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
let  arrayDeTurnos = undefined;


document.addEventListener("DOMContentLoaded", async () => {
    arrayDeTurnos = await obtenerConexiones();
    console.log(arrayDeTurnos)
    
})
 
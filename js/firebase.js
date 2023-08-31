// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    deleteDoc,
    doc,
    updateDoc,
    onSnapshot,
} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js'


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-CGvrLFUzDSyAPYdBz9L8HcDXfnNMkG4",
    authDomain: "turnosestetica-b8640.firebaseapp.com",
    projectId: "turnosestetica-b8640",
    storageBucket: "turnosestetica-b8640.appspot.com",
    messagingSenderId: "909698048504",
    appId: "1:909698048504:web:c3bbe0da09c207aa9b360d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();


// -----------------------------Funciones ---------------------------------------------------------
export {
    collection,
    onSnapshot,
    db
}

export const obtener = (collection, id) => getDoc(doc(db, collection, id))
export const borrar = (collection, id) => deleteDoc(doc(db, collection, id))
export const actualizar = (collection, id, newField) =>
    updateDoc(doc(db, collection, id), newField)


//cargar Conexiones
export const obtenerServicios = () => getDocs(collection(db, 'servicios'))
export const obtenerEmpleados = () => getDocs(collection(db, 'empleados'))
// -----------------------------Funciones Servicios---------------------------------------------------------


export const guardarServicio = (servicio, duracion, cantidadTurnos, valor) => {
    addDoc(collection(db, 'servicios'), { servicio: servicio, duracion: duracion, cantidadTurnos: cantidadTurnos, valor: valor })
}
//export const escucharCambios = () => console.log("escuchar servicios")
//export const borrarServicio = id => deleteDoc(doc(db, "servicios", id))
//export const obtenerServicio = id => getDoc(doc(db, "servicios", id))
// export const actualizarServicio = (id, newField) =>
//     updateDoc(doc(db, "servicios", id), newField)


// --------------------------------Funciones Empleados--------------------------------------------------------
export const guardarEmpleado = (nombre, mail, telefono, direccion) => {
    addDoc(collection(db, 'empleados'), { nombre: nombre, mail: mail, telefono: telefono, direccion: direccion })
}

//export const escucharCambiosEmpleado = () => console.log("escuchar empleados")
//export const borrarEmpleado = id => deleteDoc(doc(db, "empleados", id))
//obtengo solo un Empleado
//export const obtenerEmpleado = id => getDoc(doc(db, "empleados", id))
// export const actualizarEmpleado = (id, newField) =>
//     updateDoc(doc(db, "empleados", id), newField)



// ----------------------------------Funciones Conexiones-------------------------------------------------------
export const guardarConexion = (newField) => {
    addDoc(collection(db, 'conexiones'), newField)
}
//export const borrarConexion = id => deleteDoc(doc(db, "conexiones", id))
//export const obtenerConexion = id => getDoc(doc(db, "conexiones", id))
// export const actualizarConexion = (id, newField) =>
//     updateDoc(doc(db, "conexiones", id), newField)


// ----------------------------------Funciones Turnos-------------------------------------------------------


export const obtenerTurnos = () => getDocs(collection(db, 'conexiones'))

export const obtenerTurnosOtorgados = (id) => {
    return getDocs(collection(db, "conexiones", id, "turnos"));
}

export const guardarTurno = async (servicioId, turnoData) => {
    const subcoleccionTurnosRef = collection(doc(db, "conexiones", servicioId), "turnos");
    const nuevoTurnoRef = await addDoc(subcoleccionTurnosRef, turnoData);
    console.log("Turno agregado con ID:", nuevoTurnoRef.id);
};

export async function obtenerConexiones() {
    const arrayConexiones = [];
    const querySnapshot = await getDocs(collection(db, "conexiones"));
    const promesasTurnos = [];

    querySnapshot.forEach(async (docConexion) => {
        let conexionData = docConexion.data();
        let conexionId = docConexion.id
        conexionData.id = conexionId

        console.log("conexion data ", conexionData)

        const promesaTurno = getDocs(collection(db, "conexiones", docConexion.id, "turnos"))
            .then((docTurno) => {
                const listaDeTurnos = docTurno.docs.map(doc => doc.data());
                conexionData.turnos = listaDeTurnos;
                arrayConexiones.push(conexionData);
            });

        promesasTurnos.push(promesaTurno);
    });

    await Promise.all(promesasTurnos);
    return arrayConexiones;
}

















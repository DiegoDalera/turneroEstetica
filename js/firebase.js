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


// funciones Servicios
export {
    collection,
    onSnapshot,
    db
}
export const guardarServicio = (servicio, duracion, cantidadTurnos, valor) => {
    addDoc(collection(db, 'servicios'), { servicio: servicio, duracion: duracion, cantidadTurnos: cantidadTurnos, valor: valor })
}
export const obtenerServicios = () => getDocs(collection(db, 'servicios'))
export const escucharCambios = () => console.log("escuchar servicios")
export const borrarServicio = id => deleteDoc(doc(db, "servicios", id))
//obtengo solo un servicio
export const obtenerServicio = id => getDoc(doc(db, "servicios", id))
export const actualizarServicio = (id,newField) => 
updateDoc(doc(db, "servicios", id),newField)


// funciones Empleados
export const guardarEmpleado = (nombre, mail, telefono, direccion) => {
    addDoc(collection(db, 'empleados'), { nombre: nombre, mail: mail, telefono: telefono, direccion: direccion })
}
export const obtenerEmpleados = () => getDocs(collection(db, 'empleados'))
export const escucharCambiosEmpleado = () => console.log("escuchar empleados")
export const borrarEmpleado = id => deleteDoc(doc(db, "empleados", id))
//obtengo solo un Empleado
export const obtenerEmpleado = id => getDoc(doc(db, "empleados", id))
export const actualizarEmpleado = (id,newField) => 
updateDoc(doc(db, "empleados", id),newField)

// funciones conexiones

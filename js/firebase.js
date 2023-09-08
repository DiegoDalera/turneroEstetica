// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {getAuth,GoogleAuthProvider,signInWithPopup} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js'

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

const auth = getAuth(app);


// -----------------------------Funciones Autentificacion---------------------------------------------------------
const provider = new GoogleAuthProvider();

export let user;

export async function loginWithGoogle() {
    const response = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(response)
    const token = credential.accessToken;
    
    localStorage.setItem("token", token)
    if ( token ){
        user = response.user
    }

    return user
}

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


// --------------------------------Funciones Empleados--------------------------------------------------------
export const guardarEmpleado = (nombre, mail, telefono, direccion) => {
    addDoc(collection(db, 'empleados'), { nombre: nombre, mail: mail, telefono: telefono, direccion: direccion })
}


// ----------------------------------Funciones Conexiones-------------------------------------------------------
export const guardarConexion = (newField) => {
    addDoc(collection(db, 'conexiones'), newField)
}

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

















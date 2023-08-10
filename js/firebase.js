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

export const guardarServicio = (servicio, duracion, cantidadTurnos, valor) => {
    addDoc(collection(db, 'servicios'), { servicio: servicio, duracion: duracion, cantidadTurnos: cantidadTurnos, valor: valor })
}

export const obtenerServicios = () => getDocs(collection(db, 'servicios'))

export const escucharCambios = () => console.log("escuchar servicios")

export {
    collection,
    onSnapshot,
    db
}

export const borrarServicio = id => deleteDoc(doc(db, "servicios", id))

//obtengo solo un servicio
export const obtenerServicio = id => getDoc(doc(db, "servicios", id))

export const actualizarServicio = (id,newField) => 
updateDoc(doc(db, "servicios", id),newField)


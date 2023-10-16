// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { loginWithGoogle, loginWithCredentials, user } from "./auth.js";

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
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-CGvrLFUzDSyAPYdBz9L8HcDXfnNMkG4",
  authDomain: "turnosestetica-b8640.firebaseapp.com",
  projectId: "turnosestetica-b8640",
  storageBucket: "turnosestetica-b8640.appspot.com",
  messagingSenderId: "909698048504",
  appId: "1:909698048504:web:c3bbe0da09c207aa9b360d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

// Funciones 
export { collection, onSnapshot, db };

export const guardar = (newField, coleccion) => {
  addDoc(collection(db, coleccion), newField);
};
export const obtener = (collection, id) => getDoc(doc(db, collection, id));
export const borrar = (collection, id) => deleteDoc(doc(db, collection, id));
export const actualizar = (collection, id, newField) =>
  updateDoc(doc(db, collection, id), newField);

export const obtenerColl = (coll) => getDocs(collection(db, coll));


export const borrarTurnosServicio = async (id) => {
  const idServicioAEliminar = id;
  const q = query(collection(db, "turnos"), where('idServicios', '==', idServicioAEliminar));
  const querySnapshot = await getDocs(q);

  try {
    for (const doc of querySnapshot.docs) {
      await borrar("turnos", doc.id);
      console.log(`Documento con ID ${doc.id} eliminado`);
    }
  } catch (error) {
    console.error(`Error al eliminar documentos: ${error}`);
  }
};




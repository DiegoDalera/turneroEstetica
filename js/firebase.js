// Import the functions you need from the SDKs you need

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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

// -----------------------------Funciones Autentificacion---------------------------------------------------------
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export let user;

export async function loginWithGoogle() {
  const response = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(response);
  const token = credential.accessToken;

  localStorage.setItem("token", token);
  if (token) {
    user = response.user;
  }
  return user;
}

export async function loginWithCredecials(email, password) {
  // retorna un objeto credenciales
  return await createUserWithEmailAndPassword(auth, email, password);
}

// -----------------------------Funciones ---------------------------------------------------------
export { collection, onSnapshot, db };

export const guardar = (newField, coleccion) => {
  addDoc(collection(db, coleccion), newField);
};
export const obtener = (collection, id) => getDoc(doc(db, collection, id));
export const borrar = (collection, id) => deleteDoc(doc(db, collection, id));
export const actualizar = (collection, id, newField) =>
  updateDoc(doc(db, collection, id), newField);

export const obtenerColl = (coll) => getDocs(collection(db, coll));

// export const obtenerTurnosOtorgados = (id) => {
//   return getDocs(collection(db, "conexiones", id, "turnos"));
// };

export const borrarTurnosServicio = (id) => {

  const turnosCollection = db.collection('turnos');
  const idServicioAEliminar = id;

  turnosCollection.where('idServicios', '==', idServicioAEliminar)
    .get()
    .then((querySnapshot) => {

      querySnapshot.forEach((doc) => {
        doc.ref.delete()
          .then(() => {
            console.log(`Documento con ID ${doc.id} eliminado`);
          })
          .catch((error) => {
            console.error(`Error al eliminar el documento: ${error}`);
          });
      });
    })
    .catch((error) => {
      console.error(`Error al realizar la consulta: ${error}`);
    });
};


//   const subcoleccionTurnosRef = collection(
//     doc(db, "conexiones", servicioId),
//     "turnos"
//   );
//   const nuevoTurnoRef = await addDoc(subcoleccionTurnosRef, turnoData);
//   console.log("Turno agregado con ID:", nuevoTurnoRef.id);
// };

// export async function obtenerConexiones() {
//   const arrayConexiones = [];
//   const querySnapshot = await getDocs(collection(db, "conexiones"));
//   const promesasTurnos = [];

//   querySnapshot.forEach(async (docConexion) => {
//     let conexionData = docConexion.data();
//     let conexionId = docConexion.id;
//     conexionData.id = conexionId;

//     console.log("conexion data ", conexionData);

//     const promesaTurno = getDocs(
//       collection(db, "conexiones", docConexion.id, "turnos")
//     ).then((docTurno) => {
//       const listaDeTurnos = docTurno.docs.map((doc) => {
//         return {
//           ...doc.data(),
//           docID: doc.id,
//         };
//       });
//       conexionData.turnos = listaDeTurnos;
//       arrayConexiones.push(conexionData);
//     });

//     promesasTurnos.push(promesaTurno);
//   });

//   //

//   await Promise.all(promesasTurnos);
//   return arrayConexiones;
// }

//----- Registrar Usuario ----

const registroForm = document.getElementById("registerForm");
if (registroForm) {
  registroForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Usuario registrado con éxito", user.email);
        window.location.href = "loginFirebase.html";
        // Puedes redireccionar al usuario o hacer otra acción después del registro
      })
      .catch((error) => {
        alert("Error al registrar: " + error.message);
      });
  });
}


//______ INICIAR SESION USER -------
// Comprueba si existe el formulario de inicio de sesión

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert("Sesión iniciada con éxito");
        window.location.href = "/pages/turnos.html";
      })
      .catch((error) => {
        alert("Error al iniciar sesión: " + error.message);
      });
  });
}

// Filtrar , Checkear Documentacion FIrebase.

// export const guardarTurno = async (servicioId, turnoData) => {


// db.collection('Turnos')
//   .where('profesionalId', '==', profesionalId)
//   .where('fecha', '>=', inicio)
//   .where('fecha', '<=', fin)
//   .where('servicio','==',servicioSeleccionado)
//   .get()
//   .then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//       // Aquí puedes procesar cada documento de turno
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
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

// -----------------------------Funciones Autentificacion---------------------------------------------------------
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export let user;

export async function loginWithGoogle() {
  try {
    const response = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(response);
    const token = credential.accessToken;

    localStorage.setItem("token", token);
    if (token) {
      user = response.user;
    }
    return user;
  } catch (error) {
    console.error("Error al iniciar sesión con Google:", error);

  }
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

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        Swal.fire({
          icon: 'success',
          title: 'Sesión iniciada correctamente',
          showConfirmButton: false,
          timer: 2500
        }).then(() => {
          window.location.href = "/pages/turnos.html";
        });
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text: 'El inicio de sesión no es correcto. Por favor, verifica tus credenciales.'
        });
      });

  });
}


// auth.js
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-CGvrLFUzDSyAPYdBz9L8HcDXfnNMkG4",
    authDomain: "turnosestetica-b8640.firebaseapp.com",
    projectId: "turnosestetica-b8640",
    storageBucket: "turnosestetica-b8640.appspot.com",
    messagingSenderId: "909698048504",
    appId: "1:909698048504:web:c3bbe0da09c207aa9b360d",
};

const app = initializeApp(firebaseConfig);
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

export async function loginWithCredentials(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        Swal.fire({
            icon: 'success',
            title: 'Sesión iniciada correctamente',
            showConfirmButton: false,
            timer: 2500
        }).then(() => {
            window.location.href = "/pages/turnos.html";
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error al iniciar sesión',
            text: 'El inicio de sesión no es correcto. Por favor, verifica tus credenciales.'
        });
    }
}

// if (loginForm) {
//     loginForm.addEventListener("submit", async function (event) {
//         event.preventDefault();

//         const email = document.getElementById("email").value;
//         const password = document.getElementById("password").value;

//         await signInWithEmailAndPassword(auth, email, password)
//             .then((userCredential) => {
//                 const user = userCredential.user;
//                 Swal.fire({
//                     icon: 'success',
//                     title: 'Sesión iniciada correctamente',
//                     showConfirmButton: false,
//                     timer: 2500
//                 }).then(() => {
//                     window.location.href = "/pages/turnos.html";
//                 });
//             })
//             .catch((error) => {
//                 console.error("Error al iniciar sesión:", error);
//                 Swal.fire({
//                     icon: 'error',
//                     title: 'Error al iniciar sesión',
//                     text: 'El inicio de sesión no es correcto. Por favor, verifica tus credenciales.'
//                 });
//             });

//     });
// }

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


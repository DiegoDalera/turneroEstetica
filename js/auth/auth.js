import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

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
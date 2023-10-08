import {
    loginWithGoogle,
    user,
    obtener
} from './../firebase.js'


// console.log(user);
// const thumbnail = document.getElementById('section').appendChild(document.createElement('img'))
// thumbnail.alt = 'avatar'
// thumbnail.src = user?.photoURL ?? 'default.png'

// function login2() {
//     loginWithGoogle()
//         .then(data => {
//             console.log('user', user);
//             console.log(data);
//             thumbnail.src = user?.photoURL ?? 'default.png'
//         })
//         .catch(error => {
//             alert('algo fallo' + error.message)
//             console.error(error);
//         })
// }

// document.getElementById('login-google')
//     .addEventListener('click', login2)

/* crear una funcion que reciba del formulario el email y contraseña 
    e invocar a la funcion de firebase.js 
    llamada loginWithCredecials (creada por nosotros)
*/

// const btnEnviar = document.getElementById('enviarAdmin')

// btnEnviar.addEventListener("click", async (e) => {
//     e.preventDefault();
//     const username = document.getElementById('userNameAdmin').value;
//     const password = document.getElementById('pswAdmin').value;
//     const validar = await loginCheck(username, password);
    
//     if (validar) {
//         window.location.href = "../turnos.html";
//       } else {
//         alert("Usuario y/o Contraseña incorrectos");
//       }
// });

async function loginCheck(username, password) {
    try {
        const dato = await obtener("admin", "FkLPUt5IBaN9C5TLCjdB");
        const loginData = dato.data();

        if (loginData && loginData.pass === password && loginData.user === username) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error("Error al verificar el inicio de sesión:", error);
        return false;
    }
}




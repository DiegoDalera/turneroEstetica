import {
    loginWithGoogle,
    user
} from './../firebase.js'


console.log(user);
const thumbnail = document.getElementById('section').appendChild(document.createElement('img'))
thumbnail.alt = 'avatar'
thumbnail.src = user?.photoURL ?? 'default.png'
function login() {
    loginWithGoogle()
        .then(data => {
            console.log('user', user);
            console.log(data);
            thumbnail.src = user?.photoURL ?? 'default.png'
            
        })
        .catch(error => {
            console.error(error);
        })
}

document.getElementById('login-google')
    .addEventListener('click', login)
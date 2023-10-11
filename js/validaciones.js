
function soloNumeros(event) {
    const input = event.target;
    const valor = input.value;
    input.value = valor.replace(/\D/g, '');
  }

  let validacionRealizada = false; // Variable para rastrear si la validación ya se ha realizado

  function validarEmail(event) {
    const input = event.target;
    const valor = input.value;
  
    if (!validacionRealizada && !valor.match(/^.+@.+\..+$/)) {
      alert("Ingresa un correo electrónico válido");
      input.value = ""; // Limpia el campo de entrada
      input.focus(); // Devuelve el enfoque al campo de entrada
      validacionRealizada = true; // Marca que la validación se ha realizado
    } else {
      validacionRealizada = false; // Restablece la validación si el valor cambia y es diferente de un correo inválido
    }
  }
  
  
  
  
  
  
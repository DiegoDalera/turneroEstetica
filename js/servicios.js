import {
  guardarServicio,
  obtenerServicio,
  onSnapshot, collection,
  db,
  borrarServicio,
  actualizarServicio
} from '../js/firebase.js'

const formAgregarServicio = document.getElementById("formulario-servicio-agregar");
const cuerpoTablaServicios = document.getElementById("cuerpo-tabla-servicios")

const servicio = document.getElementById("nombre_servicio_ag")
const duracion = document.getElementById("duracion_ag")
const cantidadTurnos = document.getElementById("cantidad_turnos_ag")
const valor = document.getElementById("valor_ag")
const btnAgregarServicio = document.getElementById("btn_agregar_servicio")

let editStatus = false
let idEdit

//Validar formulario
servicio.addEventListener('input', verificarCampos);
duracion.addEventListener('input', verificarCampos);
cantidadTurnos.addEventListener('input', verificarCampos);
valor.addEventListener('input', verificarCampos);

function verificarCampos() {
  if (servicio.value && duracion.value && cantidadTurnos.value && valor.value) {
    btnAgregarServicio.removeAttribute('disabled');
  } else {
    btnAgregarServicio.setAttribute('disabled', 'true');
  }
}


//EventListener
document.addEventListener("DOMContentLoaded", async () => {
  onSnapshot(collection(db, "servicios"), (querySnapshot) => {
    let html = '';
    querySnapshot.forEach(doc => {
      const servicio = doc.data();
      html += `
          <tr>
            <td>${servicio.servicio}</td>
            <td>${servicio.duracion}</td>
            <td>${servicio.cantidadTurnos}</td>
            <td>${servicio.valor}</td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}">Borrar</button>
              <button class="btn-editar" doc-id="${doc.id}">Editar</button>
            </td>
          </tr>
    `
    });
    cuerpoTablaServicios.innerHTML = html;

    //agrego event listener borrar
    const botonesBorrarServicios = document.querySelectorAll(".btn-borrar")
    console.log(botonesBorrarServicios)

    botonesBorrarServicios.forEach(btn => {
      btn.addEventListener("click", (event) => {
        var id = btn.getAttribute('doc-id');
        console.log(id)
        borrarServicio(id)
      })
    })

    //agrego event listener editar
    const botonesEditarServicios = document.querySelectorAll(".btn-editar")
    console.log(botonesEditarServicios);

    botonesEditarServicios.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtenerServicio(id)
        console.log(dato.data())
        const servicioEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarServicio.innerText = "Actualizar";
        formAgregarServicio["nombre_servicio_ag"].value = servicioEditar.servicio
        formAgregarServicio["duracion_ag"].value = servicioEditar.duracion
        formAgregarServicio["cantidad_turnos_ag"].value = servicioEditar.cantidadTurnos
        formAgregarServicio["valor_ag"].value = servicioEditar.valor
      })
    })
  })
})

//Agregar y editar Servicio
btnAgregarServicio.addEventListener("click", (e) => {
  e.preventDefault
  const servicio = document.getElementById("nombre_servicio_ag").value
  const duracion = parseInt(document.getElementById("duracion_ag").value)
  const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos_ag").value)
  const valor = parseFloat(document.getElementById("valor_ag").value)

  if (!editStatus) {
    guardarServicio(servicio, duracion, cantidadTurnos, valor);
  } else {
    actualizarServicio(idEdit, { servicio, duracion, cantidadTurnos, valor })
    editStatus = false;
    btnAgregarServicio.innerText = "Grabar"
  }

  formAgregarServicio.reset();
  modal.style.display = "none";

})

// Modal Agregar Servicio
const agregarServicio = document.getElementById("enlaceAgregarServicios")
let modal = document.getElementById("modal-agregar");
let span = document.getElementsByClassName("close")[0];

agregarServicio.onclick = function () {
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}





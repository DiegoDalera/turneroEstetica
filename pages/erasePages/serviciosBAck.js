import {
  guardar,
  onSnapshot, collection,
  db,
  actualizar,
  obtener,
  borrar,
  borrarTurnosServicio
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

//Validar Formulario
servicio.addEventListener('input', verificarCampos);
duracion.addEventListener('input', verificarCampos);
cantidadTurnos.addEventListener('input', verificarCampos);
valor.addEventListener('input', verificarCampos);


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
            <td>${servicio.valor.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}</td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
              <button class="btn-editar" doc-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
            </td>
          </tr>
    `
    });
    cuerpoTablaServicios.innerHTML = html;

    //agrego event listener borrar
    const botonesBorrarServicios = document.querySelectorAll(".btn-borrar")
    botonesBorrarServicios.forEach(btn => {
      btn.addEventListener("click", (event) => {
        var id = btn.getAttribute('doc-id');
        console.log(id)
        borrar("servicios", id)
          .then(() => {
            Swal.fire('Servicio Eliminado').then(() => {
              borrarTurnosServicio(id);
            });
          })
          .catch((error) => {
            console.error(`Error al eliminar el servicio: ${error}`);
          });
      });
    });


    //Agrego event listener editar
    const botonesEditarServicios = document.querySelectorAll(".btn-editar")
    console.log(botonesEditarServicios);

    botonesEditarServicios.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtener("servicios", id)
        console.log(dato.data())
        const servicioEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarServicio.innerText = "Actualizar";
        formAgregarServicio["nombre_servicio_ag"].value = servicioEditar.servicio
        formAgregarServicio["nombre_servicio_ag"].disabled = true;
        formAgregarServicio["duracion_ag"].value = servicioEditar.duracion
        formAgregarServicio["cantidad_turnos_ag"].value = servicioEditar.cantidadTurnos
        formAgregarServicio["valor_ag"].value = servicioEditar.valor
      })
    })
  })
})

//Agregar y Editar Servicio
btnAgregarServicio.addEventListener("click", (e) => {
  e.preventDefault();

  try {
    const servicio = document.getElementById("nombre_servicio_ag").value;
    const duracion = parseInt(document.getElementById("duracion_ag").value);
    const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos_ag").value);
    const valor = parseFloat(document.getElementById("valor_ag").value);

    const newField = {
      servicio: servicio,
      duracion: duracion,
      cantidadTurnos: cantidadTurnos,
      valor: valor,
    };

    if (!editStatus) {
      guardar(newField, "servicios");
      Swal.fire({
        icon: 'success',
        title: 'El nuevo servicio a sido grabado',
        showConfirmButton: false,
        timer: 2500
      })
    } else {
      actualizar("servicios", idEdit, { servicio, duracion, cantidadTurnos, valor });
      Swal.fire({
        icon: 'success',
        title: 'El servicio a sido actualizado',
        showConfirmButton: false,
        timer: 2500
      })

      editStatus = false;
      btnAgregarServicio.innerText = "Grabar";
    }

    formAgregarServicio["nombre_servicio_ag"].disabled = false;
    formAgregarServicio.reset();
    modal.style.display = "none";
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
});


function verificarCampos() {
  const servicio = document.getElementById("nombre_servicio_ag").value;
  const duracion = document.getElementById("duracion_ag").value;
  const cantidadTurnos = document.getElementById("cantidad_turnos_ag").value;
  const valor = document.getElementById("valor_ag").value;

  if (servicio && duracion && cantidadTurnos && valor) {
    btnAgregarServicio.removeAttribute('disabled');
  } else {
    btnAgregarServicio.setAttribute('disabled', 'true');
  }
}

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





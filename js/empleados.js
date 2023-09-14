import {
  guardar,
  obtener,
  onSnapshot,
  collection,
  db,
  borrar,
  actualizar
} from '../js/firebase.js'

const formAgregarEmpleado = document.getElementById("formulario-empleado-agregar");
const btnAgregarEmpleado = document.getElementById("btn_agregar_empleado")
const cuerpoTablaEmpleados = document.getElementById("cuerpo-tabla-empleados")
const nombre = document.getElementById("nombre")
const mail = document.getElementById("mail")
const telefono = document.getElementById("telefono")
const direccion = document.getElementById("direccion")

let editStatus = false
let idEdit

//Validar formulario
nombre.addEventListener('input', verificarCampos);
mail.addEventListener('input', verificarCampos);
telefono.addEventListener('input', verificarCampos);
direccion.addEventListener('input', verificarCampos);

function verificarCampos() {
  if (nombre.value && mail.value && telefono.value && direccion.value) {
    btnAgregarEmpleado.removeAttribute('disabled');
  } else {
    btnAgregarEmpleado.setAttribute('disabled', 'true');
  }
}

// Modal Agregar Empleado
const agregarEmpleado = document.getElementById("enlaceAgregarEmpleados")
let modal = document.getElementById("modal-agregar");
let span = document.getElementsByClassName("close")[0];

agregarEmpleado.onclick = function () {
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


//EventListener
document.addEventListener("DOMContentLoaded", async () => {
  onSnapshot(collection(db, "empleados"), (querySnapshot) => {
    let html = '';
    querySnapshot.forEach(doc => {
      const empleado = doc.data();
      html += `
          <tr>
            <td>${empleado.nombre}</td>
            <td>${empleado.mail}</td>
            <td>${empleado.telefono}</td>
            <td>${empleado.direccion}</td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
              <button class="btn-editar" doc-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
            </td>
          </tr>
    `
    });
    cuerpoTablaEmpleados.innerHTML = html;

    //agrego event listener borrar
    const botonesBorrarEmpleados = document.querySelectorAll(".btn-borrar")

    botonesBorrarEmpleados.forEach(btn => {
      btn.addEventListener("click", (event) => {
        var id = btn.getAttribute('doc-id');
        borrar("empleados",id)
      })
    })

    //agrego event listener editar
    const botonesEditarEmpleado = document.querySelectorAll(".btn-editar")

    botonesEditarEmpleado.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtener("empleados",id)
        const empleadoEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarEmpleado.innerText = "Actualizar Empleado";
        formAgregarEmpleado["nombre"].value = empleadoEditar.nombre
        formAgregarEmpleado["nombre"].disabled = true;
        formAgregarEmpleado["mail"].value = empleadoEditar.mail
        formAgregarEmpleado["telefono"].value = empleadoEditar.telefono
        formAgregarEmpleado["direccion"].value = empleadoEditar.direccion
      })
    })
  })
})


//Agregar y editar Servicio
btnAgregarEmpleado.addEventListener("click", (e) => {
  e.preventDefault

  const nombre = document.getElementById("nombre").value
  const mail = document.getElementById("mail").value
  const telefono = document.getElementById("telefono").value
  const direccion = document.getElementById("direccion").value

  const newField = {
    nombre: nombre,
    mail: mail,
    telefono: telefono,
    direccion: direccion,
  };

  if (!editStatus) {
    guardar(newField,"empleados");
  } else {
    actualizar("empleados",idEdit, { nombre, mail, telefono, direccion })
    editStatus = false;
    btnAgregarEmpleado.innerText = "Grabar Empleado"
  }

  formAgregarEmpleado["nombre"].disabled = false;
  formAgregarEmpleado.reset();
  modal.style.display = "none";
})




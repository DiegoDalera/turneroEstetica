import { guardarEmpleado, obtenerEmpleado, onSnapshot, collection, db, borrarEmpleado, actualizarEmpleado } from '../js/firebase.js'

const formAgregarEmpleado = document.getElementById("formulario-empleado-agregar");
const btnAgregarEmpleado = document.getElementById("btn_agregar_empleado")
const cuerpoTablaEmpleados = document.getElementById("cuerpo-tabla-empleados")

let editStatus = false
let idEdit

// Modal Agregar Empleado
const agregarEmpleado = document.getElementById("enlaceAgregarEmpleados")
let modal = document.getElementById("modal-agregar");
let span = document.getElementsByClassName("close")[0];

agregarEmpleado.onclick = function () {
  console.log("click agreagr ")
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
              <button class="btn-borrar" doc-id="${doc.id}">Borrar</button>
              <button class="btn-editar" doc-id="${doc.id}">Editar</button>
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
        borrarEmpleado(id)
      })
    })

    //agrego event listener editar
    const botonesEditarEmpleado = document.querySelectorAll(".btn-editar")

    botonesEditarEmpleado.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtenerEmpleado(id)
        const empleadoEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarEmpleado.innerText = "Actualizar Empleado";
        formAgregarEmpleado["nombre"].value = empleadoEditar.nombre
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

  console.log(nombre, mail, telefono, direccion)

  if (!editStatus) {
    guardarEmpleado(nombre, mail, telefono, direccion);
  } else {
    console.log("actualizar")

    actualizarEmpleado(idEdit, { nombre, mail, telefono, direccion })
    editStatus = false;
    btnAgregarEmpleado.innerText = "Grabar Empleado"
  }

  formAgregarEmpleado.reset();
  modal.style.display = "none";
})




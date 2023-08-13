import { onSnapshot, collection, db, obtenerEmpleados, obtenerServicios } from '../js/firebase.js'

const formAgregarConexion = document.getElementById("formulario-conexion-agregar");
const btnAgregarConexion = document.getElementById("btn_agregar_conexion")
const cuerpoTablaConexiones = document.getElementById("cuerpo-tabla-conexiones")

let editStatus = false
let idEdit

// Modal Agregar Conexion
const agregarConexion = document.getElementById("enlaceAgregarConexion")
let modal = document.getElementById("modal-agregar");
let span = document.getElementsByClassName("close")[0];

agregarConexion.onclick = function () {
  console.log("click agreagr ")
  modal.style.display = "block";
  cargarFormularioDefault();
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

})


async function cargarFormularioDefault() {


  const empleadosSelectList = document.getElementById("empleados");
  const serviciosSelectList = document.getElementById("servicios");

  serviciosSelectList.innerHTML = "";
  empleadosSelectList.innerHTML = "";

   const empleados = await obtenerEmpleados();
   empleados.forEach((doc) => {
     const empleado = doc.data();
     const option = document.createElement("option");
     option.value = empleado.nombre; 
     option.textContent = empleado.nombre; 
     empleadosSelectList.appendChild(option);
   });

  const servicios = await obtenerServicios();
  servicios.forEach((doc) => {
    const servicio = doc.data();
    console.log(servicio.servicio)
    const option = document.createElement("option");
    option.value = servicio.servicio; 
    option.textContent = servicio.servicio; 
    serviciosSelectList.appendChild(option);
  });


}

// Llama a la función para cargar los datos
cargarFormularioDefault();



//escucha los cambios
// onSnapshot(collection(db, "Conexions"), (querySnapshot) => {

//   let html = '';
//   querySnapshot.forEach(doc => {
//     const Conexion = doc.data();
//     html += `
//          <tr>
//            <td>${Conexion.nombre}</td>
//            <td>${Conexion.mail}</td>
//            <td>${Conexion.telefono}</td>
//            <td>${Conexion.direccion}</td>
//            <td>
//              <button class="btn-borrar" doc-id="${doc.id}">Borrar</button>
//              <button class="btn-editar" doc-id="${doc.id}">Editar</button>
//            </td>
//          </tr>
//    `
//   });

//   cuerpoTablaConexiones.innerHTML = html;

//   //agrego event listener borrar
//   const botonesBorrarEmpleados = document.querySelectorAll(".btn-borrar")

//   botonesBorrarEmpleados.forEach(btn => {
//     btn.addEventListener("click", (event) => {
//       var id = btn.getAttribute('doc-id');
//       borrarEmpleado(id)
//     })
//   })

//   //agrego event listener editar
//   const botonesEditarEmpleado = document.querySelectorAll(".btn-editar")

//   botonesEditarEmpleado.forEach(btn => {
//     btn.addEventListener("click", async (event) => {
//       var id = btn.getAttribute('doc-id');

//       const dato = await obtenerEmpleado(id)
//       const empleadoEditar = dato.data()

//       let modal = document.getElementById("modal-agregar");
//       modal.style.display = "block";

//       editStatus = true
//       idEdit = id;

//       btnAgregarEmpleado.innerText = "Actualizar Empleado";
//       formAgregarEmpleado["nombre"].value = empleadoEditar.nombre
//       formAgregarEmpleado["mail"].value = empleadoEditar.mail
//       formAgregarEmpleado["telefono"].value = empleadoEditar.telefono
//       formAgregarEmpleado["direccion"].value = empleadoEditar.direccion
//     })
//   })
// })


//Agregar y editar Servicio
// btnAgregarEmpleado.addEventListener("click", (e) => {
//   e.preventDefault

//   const nombre = document.getElementById("nombre").value
//   const mail = document.getElementById("mail").value
//   const telefono = document.getElementById("telefono").value
//   const direccion = document.getElementById("direccion").value

//   console.log(nombre, mail, telefono, direccion)

//   if (!editStatus) {
//     guardarEmpleado(nombre, mail, telefono, direccion);
//   } else {
//     console.log("actualizar")

//     actualizarEmpleado(idEdit, { nombre, mail, telefono, direccion })
//     editStatus = false;
//     btnAgregarEmpleado.innerText = "Grabar Empleado"
//   }

//   formAgregarEmpleado.reset();
//   modal.style.display = "none";
// })




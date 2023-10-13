import {
  guardar,
  obtener,
  obtenerColl,
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

const dias = document.getElementById("dias");

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
  limpiarFormulario();
  cargarFormularioDefault();
  fechaActual();

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
            <td>${empleado.horaInicio}</td>
            <td>${empleado.horaFin}</td>
            <td>${empleado.serviciosOfrecidos}</td>
            <td>${empleado.diasTrabajar}</td>
            <td>${empleado.fechaInicio}</td>
            <td>${empleado.fechaFin}</td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
              <button class="btn-editar" doc-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
            </td>
          </tr>
    `
    });
    cuerpoTablaEmpleados.innerHTML = html;

    //Agrego event listener borrar
    const botonesBorrarEmpleados = document.querySelectorAll(".btn-borrar")
    botonesBorrarEmpleados.forEach(btn => {
      btn.addEventListener("click", (event) => {
        var id = btn.getAttribute('doc-id');
        borrar("empleados", id)
        Swal.fire('Empleado Eliminado');
      })
    })

    //Agrego event listener editar
    const botonesEditarEmpleado = document.querySelectorAll(".btn-editar")
    botonesEditarEmpleado.forEach(btn => {
      btn.addEventListener("click", async (event) => {

        cargarFormularioDefault();

        var id = btn.getAttribute('doc-id');
        const dato = await obtener("empleados", id)
        const empleadoEditar = dato.data()
        console.log("empleado a editar :", empleadoEditar)
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
        formAgregarEmpleado["hora-inicio"].value = empleadoEditar.horaInicio
        formAgregarEmpleado["hora-fin"].value = empleadoEditar.horaFin
        formAgregarEmpleado["fecha-inicio"].value = empleadoEditar.fechaInicio
        formAgregarEmpleado["fecha-fin"].value = empleadoEditar.fechaFin

        // Obtén una referencia al select
        const serviciosSelect = document.getElementById("serviciosOfrecidos");

        // Recorre todas las opciones del select
        for (let i = 0; i < serviciosSelect.options.length; i++) {
          const option = serviciosSelect.options[i];
          const servicio = option.value;

          // Verifica si el servicio está en la lista de serviciosOfrecidos
          if (empleadoEditar.serviciosOfrecidos.includes(servicio)) {
            option.selected = true; // Marca la opción como seleccionada
          }
        }


        // Datos proporcionados Dias de la semana trabajados
        const diasElement = document.getElementById("dias");
        diasElement.innerHTML = "";

        const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const diasATrabajar = empleadoEditar.diasTrabajar
        console.log(diasATrabajar)
        console.log(diasSemana)

        // Recorre la lista de días y crea las opciones
        for (let i = 0; i < diasSemana.length; i++) {
          const option = document.createElement("option");
          option.text = diasSemana[i];
          option.value = diasSemana[i];

          // Verifica si el día debe estar preseleccionado
          if (diasATrabajar.includes(diasSemana[i])) {
            option.selected = true;
          }
          diasElement.appendChild(option);
        }

      })
    })
  })
})

async function cargarFormularioDefault() {

  const serviciosSelectList = document.getElementById("serviciosOfrecidos");
  serviciosSelectList.innerHTML = "";

  const servicios = await obtenerColl("servicios");

  servicios.forEach((doc) => {
    const servicio = doc.data();
    const option = document.createElement("option");
    option.value = servicio.servicio;
    option.textContent = servicio.servicio;
    serviciosSelectList.appendChild(option);
  });


  const selectDias = document.getElementById("dias");
  const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Recorro la lista de días y creo las opciones
  for (let i = 0; i < diasSemana.length; i++) {
    const option = document.createElement("option");
    option.text = diasSemana[i];
    option.value = diasSemana[i];
    selectDias.appendChild(option);
  }
}

//Agregar y editar Servicio
btnAgregarEmpleado.addEventListener("click", (e) => {
  e.preventDefault();

  try {
    const nombre = document.getElementById("nombre").value;
    const mail = document.getElementById("mail").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const horaInicio = document.getElementById("hora-inicio").value;
    const horaFin = document.getElementById("hora-fin").value;
    const fechaInicio = document.getElementById("fecha-inicio").value
    const fechaFin = document.getElementById("fecha-fin").value

    const serviciosOfrecidos = document.getElementById("serviciosOfrecidos");
    const serviciosOfrecidosSeleccionados = Array.from(serviciosOfrecidos.selectedOptions).map(
      (option) => option.value
    );

    const dias = document.getElementById("dias");
    const diasSeleccionados = Array.from(dias.selectedOptions).map(
      (option) => option.value
    );

    const newField = {
      nombre: nombre,
      mail: mail,
      telefono: telefono,
      direccion: direccion,
      horaInicio: horaInicio,
      horaFin: horaFin,
      serviciosOfrecidos: serviciosOfrecidosSeleccionados,
      diasTrabajar: diasSeleccionados,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin
    };

    if (!editStatus) {
      guardar(newField, "empleados");
      Swal.fire({
        icon: 'success',
        title: 'El Nuevo empleado ha sido grabado',
        showConfirmButton: false,
        timer: 2500
      });
    } else {
      actualizar("empleados", idEdit, { nombre, mail, telefono, direccion, horaInicio, horaFin, serviciosOfrecidos: serviciosOfrecidosSeleccionados, diasTrabajar: diasSeleccionados, fechaInicio, fechaFin });
      Swal.fire({
        icon: 'success',
        title: 'El Nuevo empleado ha sido actualizado',
        showConfirmButton: false,
        timer: 2500
      });
      editStatus = false;
      btnAgregarEmpleado.innerText = "Grabar Empleado";
    }

    formAgregarEmpleado["nombre"].disabled = false;
    formAgregarEmpleado.reset();
    modal.style.display = "none";
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
});

function limpiarFormulario() {

  const formulario = document.getElementById("formulario-empleado-agregar");

  // Iterar a través de los elementos del formulario y restablecer su valor
  const elementos = formulario.elements;
  for (let i = 0; i < elementos.length; i++) {
    if (elementos[i].type !== "button" && elementos[i].type !== "submit") {
      elementos[i].value = "";
    }
  }

  // También puedes restablecer la selección en los elementos <select> múltiples
  const selectServicios = document.getElementById("serviciosOfrecidos");
  selectServicios.selectedIndex = -1; // Desselecciona todas las opciones

  const selectDias = document.getElementById("dias");
  selectDias.selectedIndex = -1; // Desselecciona todas las opciones
}

function fechaActual() {
  const fechaActual = new Date();
  // Formatea la fecha en el formato YYYY-MM-DD (compatible con input type="date")
  const fechaFormateada = fechaActual.toISOString().split('T')[0];
  document.getElementById("fecha-inicio").value = fechaFormateada;
  document.getElementById("fecha-fin").value = fechaFormateada;
};





import { onSnapshot, collection, db, obtenerEmpleados, obtenerServicios, guardarConexion, borrarConexion, obtenerConexion, actualizarConexion } from '../js/firebase.js'

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
  formAgregarConexion.reset();
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
    formAgregarConexion.reset();
  }
}

//EventListener
document.addEventListener("DOMContentLoaded", async () => {

})

btnAgregarConexion.addEventListener("click", (e) => {
  e.preventDefault

  const serviciosSelecionado = document.getElementById("servicios").value
  const empleadoSeleccionado = document.getElementById("empleados").value
  const dias = document.getElementById("dias");
  const diasSeleccionados = Array.from(dias.selectedOptions).map(option => option.value);
  const fechaInicioSeleccionada = document.getElementById("fecha-inicio").value;
  const fechaFinSeleccionada = document.getElementById("fecha-fin").value
  const horaInicioSeleccionada = document.getElementById("hora-inicio").value;
  const horaFinSeleccionada = document.getElementById("hora-fin").value;

  const newField = {
    servicioConexion: serviciosSelecionado,
    nombreEmpleado: empleadoSeleccionado,
    diasATrabajar: diasSeleccionados,
    fechaInicio: fechaInicioSeleccionada,
    fechaFin: fechaFinSeleccionada,
    horaInicio: horaInicioSeleccionada,
    horaFin: horaFinSeleccionada
};
  

  if (!editStatus) {
    guardarConexion(serviciosSelecionado, empleadoSeleccionado, diasSeleccionados, fechaInicioSeleccionada, fechaFinSeleccionada, horaInicioSeleccionada, horaFinSeleccionada);
  } else {
    console.log("entro")
    console.log(newField )

    actualizarConexion(idEdit, newField)

    editStatus = false;
    btnAgregarConexion.innerText = "Grabar Conexion"
  }

  formAgregarConexion.reset();
  modal.style.display = "none";
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

  const selectDias = document.getElementById("dias");

  // Lista de días de la semana
  const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Recorre la lista de días y crea las opciones
  for (let i = 0; i < diasSemana.length; i++) {
    const option = document.createElement("option");
    option.text = diasSemana[i];
    option.value = diasSemana[i];
    selectDias.appendChild(option);
  }

}


//EventListener
document.addEventListener("DOMContentLoaded", async () => {
  onSnapshot(collection(db, "conexiones"), (querySnapshot) => {
    let html = '';
    querySnapshot.forEach(doc => {
      const conexion = doc.data();
      html += `
          <tr>
            <td>${conexion.servicioConexion}</td>
            <td>${conexion.nombreEmpleado}</td>
            <td>${conexion.diasATrabajar}</td>
            <td>${conexion.fechaInicio}</td>
            <td>${conexion.fechaFin}</td>
            <td>${conexion.horaInicio}</td>
            <td>${conexion.horaFin}</td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}">Borrar</button>
              <button class="btn-editar" doc-id="${doc.id}">Editar</button>
            </td>
          </tr>
    `
    });
    cuerpoTablaConexiones.innerHTML = html;

    //agrego event listener borrar
    const botonesBorrarConexion = document.querySelectorAll(".btn-borrar")
    botonesBorrarConexion.forEach(btn => {
      btn.addEventListener("click", (event) => {
        var id = btn.getAttribute('doc-id');
        borrarConexion(id)
      })
    })

    //agrego event listener editar
    const botonesEditarConexion = document.querySelectorAll(".btn-editar")


    botonesEditarConexion.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtenerConexion(id)
        const conexionEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarConexion.innerText = "Actualizar Conexion";


        //Cargar el formulario de conexion para editar



        // Datos proporcionados Servicios
        const servicioConexion = conexionEditar.servicioConexion
        console.log(servicioConexion)
        const servicioElement = document.getElementById("servicios");
        const option = document.createElement("option");
        option.value = servicioConexion;
        option.text = servicioConexion;
        servicioElement.appendChild(option);
        option.selected = true;

        // Datos proporcionados Empleados
        const empleadoConexion = conexionEditar.nombreEmpleado
        console.log(empleadoConexion)
        const empleadoElement = document.getElementById("empleados");
        const optionEmpleado = document.createElement("option");
        optionEmpleado.value = empleadoConexion;
        optionEmpleado.text = empleadoConexion;
        empleadoElement.appendChild(optionEmpleado);
        optionEmpleado.selected = true;


        // Datos proporcionados Dias de la semana trabajados


       
        

        const diasElement = document.getElementById("dias");
        diasElement.innerHTML = "";

        const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado", "Domingo"];
        const diasATrabajar = conexionEditar.diasATrabajar
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


        formAgregarConexion["fecha-inicio"].value = conexionEditar.fechaInicio
        formAgregarConexion["fecha-fin"].value = conexionEditar.fechaFin
        formAgregarConexion["hora-inicio"].value = conexionEditar.horaInicio
        formAgregarConexion["hora-fin"].value = conexionEditar.horaFin
      })
    })
  })
})
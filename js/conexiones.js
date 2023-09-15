import {
  onSnapshot,
  collection,
  db,
  obtenerEmpleados,
  obtenerServicios,
  guardar,
  borrar,
  obtener,
  actualizar
} from '../js/firebase.js'


// Constantes 
const formAgregarConexion = document.getElementById("formulario-conexion-agregar");
const cuerpoTablaConexiones = document.getElementById("cuerpo-tabla-conexiones")
const btnAgregarConexion = document.getElementById("btn_agregar_conexion")
const serviciosSelecionado = document.getElementById("servicios")
const empleadoSeleccionado = document.getElementById("empleados")
const dias = document.getElementById("dias");
const diasSeleccionados = Array.from(dias.selectedOptions).map(option => option.value);
const fechaInicioSeleccionada = document.getElementById("fecha-inicio")
const fechaFinSeleccionada = document.getElementById("fecha-fin")
const horaInicioSeleccionada = document.getElementById("hora-inicio")
const horaFinSeleccionada = document.getElementById("hora-fin")
const colorSeleccionado = document.getElementById("color")

// Variables globales
let editStatus = false
let idEdit

//Validar formulario
serviciosSelecionado.addEventListener('input', verificarCampos);
empleadoSeleccionado.addEventListener('input', verificarCampos);
dias.addEventListener('input', verificarCampos);
fechaInicioSeleccionada.addEventListener('input', verificarCampos);
fechaFinSeleccionada.addEventListener('input', verificarCampos);
horaInicioSeleccionada.addEventListener('input', verificarCampos);
horaFinSeleccionada.addEventListener('input', verificarCampos);
colorSeleccionado.addEventListener('input', verificarCampos);

function verificarCampos() {
  if (serviciosSelecionado.value && empleadoSeleccionado.value && dias.value && fechaInicioSeleccionada.value && fechaFinSeleccionada.value && horaInicioSeleccionada.value && horaFinSeleccionada.value && colorSeleccionado.value) {
    btnAgregarConexion.removeAttribute('disabled');
  } else {
    btnAgregarConexion.setAttribute('disabled', 'true');
  }
}

// Modal Agregar Conexion
const enlaceAgregarConexion = document.getElementById("enlaceAgregarConexion")
let modal = document.getElementById("modal-agregar");
let span = document.getElementsByClassName("close")[0];

enlaceAgregarConexion.onclick = function () {
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


//EventListener agregar y actualizr conexion

btnAgregarConexion.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const serviciosSelecionado = document.getElementById("servicios").value;
    const empleadoSeleccionado = document.getElementById("empleados").value;
    const dias = document.getElementById("dias");
    const diasSeleccionados = Array.from(dias.selectedOptions).map(
      (option) => option.value
    );
    const fechaInicioSeleccionada = document.getElementById("fecha-inicio")
      .value;
    const fechaFinSeleccionada = document.getElementById("fecha-fin").value;
    const horaInicioSeleccionada = document.getElementById("hora-inicio")
      .value;
    const horaFinSeleccionada = document.getElementById("hora-fin").value;
    const colorSeleccionado = document.getElementById("color").value;

    const objetoEmpleado = await buscarEmpleadoSeleccionado(empleadoSeleccionado);
    const objetoServicio = await buscarServicioSeleccionado(
      serviciosSelecionado
    );

    const newField = {
      diasATrabajar: diasSeleccionados,
      fechaInicio: fechaInicioSeleccionada,
      fechaFin: fechaFinSeleccionada,
      horaInicio: horaInicioSeleccionada,
      horaFin: horaFinSeleccionada,
      color: colorSeleccionado,
      objetoEmpleado,
      objetoServicio,
    };

    if (!editStatus) {
      guardar(newField, "conexiones");
      Swal.fire('La conexion ha sido guardada')
    } else {
      console.log(newField);
      actualizar("conexiones", idEdit, newField);
      Swal.fire('La conexion ha sido actualizada')
      editStatus = false;
      btnAgregarConexion.innerText = "Grabar Conexion";
    }

    formAgregarConexion.reset();
    modal.style.display = "none";
  } catch (error) {
    console.error("Ocurrió un error:", error);
  }
});


//EventListener
document.addEventListener("DOMContentLoaded", async () => {

  onSnapshot(collection(db, "conexiones"), (querySnapshot) => {
    let html = '';
    querySnapshot.forEach(doc => {
      const conexion = doc.data();
      html += `
          <tr>
            <td>${conexion.objetoServicio.servicio}</td>
            <td>${conexion.objetoEmpleado.nombre}</td>
            <td>${conexion.diasATrabajar}</td>
            <td>${conexion.fechaInicio}</td>
            <td>${conexion.fechaFin}</td>
            <td>${conexion.horaInicio}</td>
            <td>${conexion.horaFin}</td>
            <td><input type="color" id="colorInput" value="${conexion.color}" disabled></td>
            <td>
              <button class="btn-borrar" doc-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
              <button class="btn-editar" doc-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
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
        Swal.fire({
          title: 'Estas seguro que queres borrar esta conexion?',
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'Eliminar',
          denyButtonText: `No eliminar`,
        }).then((result) => {
          
          if (result.isConfirmed) {
            borrar("conexiones", id)
            Swal.fire('Borrada', '', 'success')
          } else if (result.isDenied) {
            Swal.fire('La conexion no ha sido borrada', '', 'info')
          }
        })

       

      })
    })

    //agrego event listener editar
    const botonesEditarConexion = document.querySelectorAll(".btn-editar")

    botonesEditarConexion.forEach(btn => {
      btn.addEventListener("click", async (event) => {
        var id = btn.getAttribute('doc-id');

        const dato = await obtener("conexiones", id)
        const conexionEditar = dato.data()

        let modal = document.getElementById("modal-agregar");
        modal.style.display = "block";

        editStatus = true
        idEdit = id;

        btnAgregarConexion.innerText = "Actualizar Conexion";


        //Cargar el formulario de conexion con datos para editar
        const servicioConexion = conexionEditar.objetoServicio.servicio

        //borrar opciones previas
        const servicioElement = document.getElementById("servicios");
        servicioElement.innerHTML = '';
        const option = document.createElement("option");
        option.value = servicioConexion;
        option.text = servicioConexion;
        servicioElement.appendChild(option);
        option.selected = true;


        // Datos proporcionados Empleados
        const empleadoConexion = conexionEditar.objetoEmpleado.nombre
        const empleadoElement = document.getElementById("empleados");
        empleadoElement.innerHTML = '';
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
        formAgregarConexion["color"].value = conexionEditar.color
      })
    })
  })
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

  const fechaInicio = document.getElementById('fecha-inicio');
  const fechaFin = document.getElementById('fecha-fin');
  const fechaActual = new Date();

  // Formatea la fecha en formato DD/MM/YYYY
  const formatoFecha = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`;

  fechaInicio.value = formatoFecha;
  fechaFin.value = formatoFecha;


}

async function buscarEmpleadoSeleccionado(empleadoSeleccionado) {
  const empleados = await obtenerEmpleados();
  let campoEmpleado = null;

  empleados.forEach((doc) => {
    const empleado = doc.data();

    if (empleado.nombre === empleadoSeleccionado) {
      campoEmpleado = empleado;  // Asigno el valor del empleado seleccionado
    }
  });

  return campoEmpleado;
}


async function buscarServicioSeleccionado(serviciosSelecionado) {
  const servicios = await obtenerServicios();
  let campoServicio = null;

  servicios.forEach((doc) => {
    const servicio = doc.data();

    if (servicio.servicio === serviciosSelecionado) {
      campoServicio = servicio;  
    }
  });

  return campoServicio;
}
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const botonIngresoServicio = document.getElementById("btn_guardar_servicio");
const botonEditarServicio = document.getElementById("btn_editar_servicio");
const tablaServicios = document.getElementById("tabla-servicios");
const cuerpoTablaServicios = document.getElementById("cuerpo-tabla-servicios");

let claveServicioEditar = null;
let servicioAEditar = null;

//EventListener
document.addEventListener("DOMContentLoaded", (e) => {
  cargarServicios();
})

botonIngresoServicio.addEventListener("click", () => {
  guardarServicio();
})

botonEditarServicio.addEventListener("click", () => {
  editarServicioCargado();
})

function editarServicio(clave, servicio) {
  console.log(clave, servicio)
  claveServicioEditar = clave;
  servicioAEditar = servicio;
  window.location = "#modal-editar"

  document.getElementById("nombre_servicio_ed").value = servicio.nombre_servicio;
  document.getElementById("duracion_ed").value = servicio.duracion;
  document.getElementById("cantidad_turnos_ed").value = servicio.cantidad_turnos;
  document.getElementById("valor_ed").value = servicio.precio;
}

function editarServicioCargado() {
  const database = getDatabase();
  const referenciaServicios = ref(database, "servicios");

  var claveRegistro = claveServicioEditar;

  const nombreServicio = document.getElementById("nombre_servicio_ed").value;
  const duracion = parseInt(document.getElementById("duracion_ed").value);
  const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos_ed").value);
  const valor = parseFloat(document.getElementById("valor_ed").value);

  // Para actualizar los datos de un registro específico en Firebase, debemos construir el objeto de actualización con los campos que deseamos cambiar.
  // En este caso, asumiendo que el registro tiene una clave única, utilizaremos la función `child()` para apuntar a esa clave.
  // Luego, utilizaremos la función `update()` para realizar la actualización de los campos correspondientes.

  var registroActualizado = {};
  registroActualizado[`/${claveRegistro}/nombre_servicio`] = nombreServicio;
  registroActualizado[`/${claveRegistro}/duracion`] = duracion;
  registroActualizado[`/${claveRegistro}/cantidad_turnos`] = cantidadTurnos;
  registroActualizado[`/${claveRegistro}/precio`] = valor;

  // Ahora podemos realizar la actualización en la base de datos de Firebase
  update(referenciaServicios, registroActualizado)
    .then(function () {
      alert('Registro actualizado correctamente');
    })
    .catch(function (error) {
      console.error('Error al actualizar el registro:', error);
    });
}


/*Guarda los servicio en Firebase */
function guardarServicio() {

  const database = getDatabase();
  const referenciaServicios = ref(database, "servicios");

  const nombreServicio = document.getElementById("nombre_servicio").value;
  const duracion = parseInt(document.getElementById("duracion").value);
  const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos").value);
  const valor = parseFloat(document.getElementById("valor").value);

  const nuevoServicio = {
    nombre_servicio: nombreServicio,
    duracion: duracion,
    precio: valor,
    cantidad_turnos: cantidadTurnos
  };



  push(referenciaServicios, nuevoServicio)
    .then(() => {
      console.log("Servicio agregado correctamente a la base de datos.");
      document.getElementById("formulario_servicio").reset();
    })
    .catch((error) => {
      console.error("Error al guardar el servicio:", error);
    });
}

/* Carga los servicos en La tabla */
function cargarServicios() {

  const database = getDatabase();
  const referenciaServicios = ref(database, "servicios");

  // Escuchar cambios en la colección "servicios"
  onValue(referenciaServicios, (snapshot) => {
    cuerpoTablaServicios.innerHTML = "";

    if (snapshot.exists()) {
      const servicios = snapshot.val();

      for (const clave in servicios) {
        const servicio = servicios[clave];

        const fila = document.createElement("tr");

        // Agregar las celdas con los datos del servicio
        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = servicio.nombre_servicio;
        fila.appendChild(celdaNombre);

        const celdaDuracion = document.createElement("td");
        celdaDuracion.textContent = servicio.duracion;
        fila.appendChild(celdaDuracion);

        const celdaCantidadTurnos = document.createElement("td");
        celdaCantidadTurnos.textContent = servicio.cantidad_turnos;
        fila.appendChild(celdaCantidadTurnos);

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = servicio.precio;
        fila.appendChild(celdaPrecio);

        // Agregar botones de eliminar y editar para cada servicio
        const celdaAcciones = document.createElement("td");
        const botonEliminar = document.createElement("button");
        botonEliminar.textContent = "Eliminar";
        botonEliminar.addEventListener("click", () => eliminarServicio(clave));
        celdaAcciones.appendChild(botonEliminar);

        const botonEditar = document.createElement("button");
        botonEditar.textContent = "Editar";
        botonEditar.addEventListener("click", () => editarServicio(clave, servicio));
        celdaAcciones.appendChild(botonEditar);

        fila.appendChild(celdaAcciones);
        cuerpoTablaServicios.appendChild(fila);

      }
    } else {
      const filaVacia = document.createElement("tr");
      const celdaMensaje = document.createElement("td");
      celdaMensaje.setAttribute("colspan", "5");
      celdaMensaje.textContent = "No hay datos en la colección 'servicios'.";
      filaVacia.appendChild(celdaMensaje);
      tablaServicios.appendChild(filaVacia);
    }
  }, (error) => {
    console.error("Error al leer datos de la base de datos:", error);
  });
}

/*--- Elimina servicios ---*/
function eliminarServicio(clave) {
  const servicioAEliminar = ref(getDatabase(), `servicios/${clave}`);
  remove(servicioAEliminar)
    .then(() => {
      console.log("Servicio eliminado correctamente.");
    })
    .catch((error) => {
      console.error("Error al eliminar el servicio:", error)
    })
};
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const botonIngresoServicio = document.getElementById("btn_guardar_servicio");
const tablaServicios = document.getElementById("tabla-servicios");

//EventListener
document.addEventListener("DOMContentLoaded", (e) => {
cargarServicios();
})

botonIngresoServicio.addEventListener("click", () => {
  guardarServicio();
})

/*Guarda los servicio en firebase */ 

function guardarServicio() {
  // Obtener los valores ingresados por el usuario
  const nombreServicio = document.getElementById("nombre_servicio").value;
  const duracion = parseInt(document.getElementById("duracion").value);
  const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos").value);
  const precio = parseFloat(document.getElementById("precio").value);

  // Obtener una referencia a la base de datos
  const database = getDatabase();

  // Obtener una referencia a la colección "servicios"
  const referenciaServicios = ref(database, "servicios");

  // Crear un nuevo objeto con los datos ingresados por el usuario
  const nuevoServicio = {
    nombre_servicio: nombreServicio,
    duracion: duracion,
    cantidad_turnos: cantidadTurnos,
    precio: precio
  };
  console.log(nuevoServicio)

  // Agregar el nuevo servicio a la base de datos
  push(referenciaServicios, nuevoServicio)
    .then(() => {
      console.log("Servicio agregado correctamente a la base de datos.");
      // Limpia el formulario después de guardar los datos
      document.getElementById("formulario_servicio").reset();
    })
    .catch((error) => {
      console.error("Error al guardar el servicio:", error);
    });
}


/* Carga los servicos en La tabla */

function cargarServicios() {
  // Obtener una referencia a la base de datos
  const database = getDatabase();

  // Obtener una referencia a la colección "servicios"
  const referenciaServicios = ref(database, "servicios");

  // Escuchar cambios en la colección "servicios"
  onValue(referenciaServicios, (snapshot) => {
    // Vaciar el contenido de la tabla antes de agregar nuevos datos
    tablaServicios.innerHTML = "";

    if (snapshot.exists()) {
      const servicios = snapshot.val();

      // Recorrer los registros y agregarlos a la tabla
      for (const clave in servicios) {
        const servicio = servicios[clave];

        // Crear una nueva fila en la tabla para cada servicio
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

        // Agregar la fila a la tabla
        tablaServicios.appendChild(fila);
      }
    } else {
      // Mostrar un mensaje si no hay datos en la colección "servicios"
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

function eliminarServicio(clave) {
  // Obtener una referencia al servicio que se va a eliminar
  const servicioAEliminar = ref(getDatabase(), `servicios/${clave}`);

  // Eliminar el servicio de la base de datos
  remove(servicioAEliminar)
    .then(() => {
      console.log("Servicio eliminado correctamente.");
    })
    .catch((error) => {
      console.error("Error al eliminar el servicio:", error

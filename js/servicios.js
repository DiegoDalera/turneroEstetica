import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const botonIngresoServicio = document.getElementById("btn_guardar_servicio");
const tablaServicios = document.getElementById("tabla-servicios");
const cuerpoTablaServicios = document.getElementById("cuerpo-tabla-servicios");

//EventListener
document.addEventListener("DOMContentLoaded", (e) => {
  cargarServicios();
})

botonIngresoServicio.addEventListener("click", () => {
  guardarServicio();
})

/*Guarda los servicio en firebase */
function guardarServicio() {
  const nombreServicio = document.getElementById("nombre_servicio").value;
  const duracion = parseInt(document.getElementById("duracion").value);
  const cantidadTurnos = parseInt(document.getElementById("cantidad_turnos").value);
  const precio = parseFloat(document.getElementById("precio").value);

  const database = getDatabase();
  const referenciaServicios = ref(database, "servicios");

  const nuevoServicio = {
    nombre_servicio: nombreServicio,
    duracion: duracion,
    cantidad_turnos: cantidadTurnos,
    precio: precio
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
      

        // Agregar la fila a la tabla
        cuerpoTablaServicios.appendChild(fila);
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
  const servicioAEliminar = ref(getDatabase(), `servicios/${clave}`);
  remove(servicioAEliminar)
    .then(() => {
      console.log("Servicio eliminado correctamente.");
    })
    .catch((error) => {
      console.error("Error al eliminar el servicio:", error)
    })
};



function editarServicio(clave, servicio) {
  abrirModal("editar", clave, servicio);
}


let modoModal = "agregar"; // Variable para controlar el modo del modal (agregar o editar)

function abrirModal(modo, clave, servicio) {

const enlaceAgregarServicios = document.getElementById("enlaceAgregarServicios");
enlaceAgregarServicios.click();

  if (modo === "editar" && servicio) {
    // Si es modo editar y servicio está definido, llenar el formulario con los datos del servicio seleccionado
    document.getElementById("nombre_servicio").value = servicio.nombre_servicio;
    document.getElementById("duracion").value = servicio.duracion;
    document.getElementById("cantidad_turnos").value = servicio.cantidad_turnos;
    document.getElementById("precio").value = servicio.precio;
  } else {
    // Si es modo agregar o servicio no está definido, limpiar el formulario
    document.getElementById("nombre_servicio").value = "";
    document.getElementById("duracion").value = "";
    document.getElementById("cantidad_turnos").value = "";
    document.getElementById("precio").value = "";
  }
}


function guardarCambios(clave) {
  if (modoModal === "editar") {
    // Obtener los nuevos valores del formulario de edición
    const nuevoNombre = document.getElementById("nombre_servicio").value;
    const nuevaDuracion = document.getElementById("duracion").value;
    const nuevaCantidadTurnos = document.getElementById("cantidad_turnos").value;
    const nuevoPrecio = document.getElementById("precio").value;

    // Crear un objeto con los nuevos valores del servicio
    const servicioEditado = {
      nombre_servicio: nuevoNombre,
      duracion: nuevaDuracion,
      cantidad_turnos: nuevaCantidadTurnos,
      precio: nuevoPrecio
    };

    // Actualizar el servicio en la base de datos utilizando la clave única
    const servicioAEditar = ref(getDatabase(), `servicios/${clave}`);
    set(servicioAEditar, servicioEditado)
      .then(() => {
        console.log("Servicio editado correctamente.");
        // Cerrar el modal después de guardar los cambios
        const modal = document.getElementById("modal1");
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error al editar el servicio:", error);
      });
  } else if (modoModal === "agregar") {
    // Obtener los valores del formulario de agregar
    const nombre = document.getElementById("nombre_servicio").value;
    const duracion = document.getElementById("duracion").value;
    const cantidadTurnos = document.getElementById("cantidad_turnos").value;
    const precio = document.getElementById("precio").value;

    // Crear un objeto con los datos del nuevo servicio
    const nuevoServicio = {
      nombre_servicio: nombre,
      duracion: duracion,
      cantidad_turnos: cantidadTurnos,
      precio: precio
    };

    // Obtener una referencia a la colección "servicios"
    const referenciaServicios = ref(getDatabase(), "servicios");

    // Agregar el nuevo servicio a la base de datos
    push(referenciaServicios, nuevoServicio)
      .then(() => {
        console.log("Servicio agregado correctamente.");
        // Cerrar el modal después de guardar el nuevo servicio
        const modal = document.getElementById("modal1");
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error al agregar el servicio:", error);
      });
  }
}

// Obtener el enlace "Agregar Servicios" del modal y agregar el evento onclick
const enlaceAgregarServicios = document.querySelector(".Servicios a");
enlaceAgregarServicios.onclick = function () {
  abrirModal("agregar");
};

// ... Código posterior ...

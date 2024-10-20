import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Función para obtener los datos de Firestore.
export async function obtenerDriver() {
    const driverCollection = collection(db, "driver");
    const consulta = query(driverCollection, where("status", "==", true), where("eliminado", "==", false));

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            return;
        }

        const resultadoDiv = document.querySelector('.tabla'); // Selecciona el div para mostrar resultados.

        snapshot.forEach(doc => {
            const data = doc.data();
            const id = doc.id; 
            const nombre = data.nombre;
            const apellido = data.apellido;
            const correo = data.correo;

            // Crea un nuevo elemento div para mostrar los datos.
            const driverDiv = document.createElement('div');
            driverDiv.className = 'tabla2'; // Agrega una clase para su manipulación.
            driverDiv.innerHTML = `
                <div class="id">${id}</div>
                <div class="nombre">${nombre} ${apellido}</div>
                <div class="correo">${correo}</div>
                <div class="boton"><input type="button" value="Eliminar" class="eliminar" data-id="${id}"></div>
                <div class="boton"><input type="button" value="Ver detalles" class="detalles" data-id="${id}"></div>
                <div class="boton"><input type="button" value="Editar" class="editar" data-id="${id}"></div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(driverDiv);
        });

        // Llamamos la funcion de los eventos de los botones.
        eventoEliminar();
        eventoDetalles();
        eventoEditar();

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}

// Función para agregar evento al boton de eliminar.
function eventoEliminar() {
    const botonEliminar = document.querySelectorAll('.eliminar'); // Selecciona el boton eliminar.
    botonEliminar.forEach(boton => {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id'); // Obtén el ID del documento.
            eliminarRegistro(id); // Llama a la función para eliminar el registro.
        });
    });
}

// Función para agregar evento al boton de ver detalles.
function eventoDetalles() {
    const botonDetalles = document.querySelectorAll('.detalles'); // Selecciona el boton detalles.
    botonDetalles.forEach(boton => {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id'); // Obtén el ID del documento.
            verDetalles(id); // Llama a la función para ver detaalles.
        });
    });
}

// Función para agregar evento al boton de editar
function eventoEditar() {
    const botonEditar = document.querySelectorAll('.editar'); // Selecciona el boton editar.
    botonEditar.forEach(boton => {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id'); // Obtén el ID del documento.
            editarDriver(id); // Llama a la función para editar.
        });
    });
}

// Función para actualizar el campo eliminado a true
async function eliminarRegistro(id) {
    const confirmar = confirm(`¿Desea eliminar al driver con id ${id}?`);
    if(confirmar === true){
        try{
            const driverDoc = doc(db, "driver", id); // Referencia al documento que se actualizara
            await updateDoc(driverDoc, { eliminado: true }); // Cambia eliminado a true
            console.log(`Registro con ID ${id} marcado como eliminado.`);
            location.reload(); // Recarga la página actual
        } catch (error) {
            console.error("Error al actualizar el registro: ", error);
        }
    }
}

export function verDetalles(id){
    window.location.href = `detallesDriver.html?id=${id}`; // Redirecciona al archivo detalles Driver.
}

export async function consultaDriverUnico(id) {
    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.

    try {
        const consulta = await getDoc(driverDocRef); // Busca que el documento (driver) exista.
        if (!consulta.exists()) {
            console.log("No se encontró el documento.");
            return;
        }

        const data = consulta.data(); // Obtén los datos del documento.
        const resultadoDiv1 = document.querySelector('.img'); // Inserta la imagen.
        resultadoDiv1.innerHTML = `
            <div><img src="${data.archivo}"></div><br> 
        `;
        const resultadoDiv = document.querySelector('.col1'); // Selecciona el div donde mostrar los resultados.

        // Crea el contenido de la tabla con los detalles del driver.
        resultadoDiv.innerHTML = `
            <div>Id: ${id}</div><br>
            <div>Nombre: ${data.nombre}</div><br>
            <div>Apellidos: ${data.apellido}</div><br>
            <div>Correo: ${data.correo}</div><br>
            <div>Carro: ${data.carro}</div><br>
            <div>Modelo: ${data.modelo}</div><br>
            <div>Status: ${data.status ? 'Activo' : 'Inactivo'}</div><br>
        `;
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}

export function editarDriver(id){
    window.location.href = `editarDriver.html?id=${id}`; // Redirecciona al archivo editar Driver.
}

export async function editarDriverUnico(id){
    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.
    try {
        const consulta = await getDoc(driverDocRef); // Busca que el documento (driver) exista.
        if (!consulta.exists()) {
            console.log("No se encontró el documento.");
            return;
        }

        const data = consulta.data(); // Obtiene los datos del documento.
        
        // Asigna los valores a los inputs correspondientes en el HTML.
        document.getElementById('usuario').value = data.nombre;
        document.getElementById('apellido').value = data.apellido;
        document.getElementById('correo').value = data.correo;
        document.getElementById('telefono').value = data.telefono;
        document.getElementById('carro').value = data.carro;
        document.getElementById('modelo').value = data.modelo;

        return;
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}


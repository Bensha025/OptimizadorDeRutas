import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Función para obtener los datos de Firestore.
export async function obtenerDriver() {
    const driverCollection = collection(db, "driver");
    const consulta = query(driverCollection, where("status", "==", true), where("eliminado", "==", false), where("validado", "==", false));

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
                <div class="boton"><input type="button" value="Validar" class="validar" data-id="${id}"></div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(driverDiv);
        });

        // Llamamos la funcion de los eventos de los botones.
        eventoEliminar();
        eventoDetalles();
        eventoValidar();

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

// Función para agregar evento al boton de validar driver.
function eventoValidar() {
    const botonValidar  = document.querySelectorAll('.validar'); // Selecciona el boton editar.
    botonValidar.forEach(boton => {
        boton.addEventListener('click', function() {
            const id = this.getAttribute('data-id'); // Obtén el ID del documento.
            validarDriver(id); // Llama a la función para editar.
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
    window.location.href = `detallesValidarDriver.html?id=${id}`; // Redirecciona al archivo detalles Driver.
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

// Función para actualizar el campo validado a true
async function validarDriver(id) {
    const confirmar = confirm(`¿Desea dar por valido Driver con id: ${id}?`);
    if(confirmar === true){
        try{
            const driverDoc = doc(db, "driver", id); // Referencia al documento que se actualizara
            await updateDoc(driverDoc, { validado: true }); // Cambia validado a true
            console.log(`Registro con ID ${id} marcado como valido.`);
            location.reload(); // Recarga la página actual
        } catch (error) {
            console.error("Error al actualizar el registro: ", error);
        }
    }
}


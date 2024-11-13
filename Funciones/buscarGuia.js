import { db } from './firebaseConect.js'; // Importamos la conexión de la base de datos.
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function buscarGuia(numeroGuia) {
    const consultarGuia = collection(db, "direcciones");
    const consulta = query(consultarGuia, where("guia", "==", numeroGuia));

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            alert("No hay datos disponibles.");
            return;
        }

        // Si encontramos documentos, tomamos el primer documento
        snapshot.forEach((doc) => {
            const datosDoc = doc.data();
            console.log("ID del documento: ", doc.id); // Muestra el ID del documento
            consultarLotes(doc.id,datosDoc);
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        alert("Hubo un error al obtener los datos.");
    }
}

// Función para manejar la consulta en la colección 'lotes'
async function consultarLotes(id,guia) {
    // Buscamos en la colección 'lotes'
    const consultarEstado = collection(db, "lotes");
    const consultaLotes = query(consultarEstado);

    try {
        const obtenerId = await getDocs(consultaLotes);

        if (obtenerId.empty) {
            console.log("No hay datos disponibles.");
            alert("No hay datos disponibles.");
            return;
        }

        // Filtrar los documentos que contengan el direccionId que buscas en el array 'coordenadas'
        obtenerId.forEach((doc) => {
            const datosDoc = doc.data();
            const coordenadas = datosDoc.coordenadas; // Accedemos al array de coordenadas

            // Buscamos si alguna coordenada tiene el direccionId que coincide con el ID proporcionado
            const encontrado = coordenadas.some(coordenada => coordenada.direccionId === id);

            if (encontrado) {
                console.log("ID del documento: ", doc.id);                
                obtenerEstatus(doc.id,guia);
            }
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        alert("Hubo un error al obtener los datos.");
    }
}

async function obtenerEstatus(id,guia) {
    const consultarEstado = collection(db, "lotes");
    const consultaLotes = query(consultarEstado, where("__name__", "==", id)); // Filtra por el ID del documento

    try {
        const obtenerId = await getDocs(consultaLotes);

        if (obtenerId.empty) {
            console.log("No hay datos disponibles para el ID especificado.");
            alert("No hay datos disponibles para el ID especificado.");
            return;
        }

        const resultadoDiv = document.querySelector('.estatus'); // Selecciona el div para mostrar resultados.

        // Si encontramos el documento con el ID especificado
        obtenerId.forEach((doc) => {
            const datosDoc = doc.data();
            console.log("Estatus del documento: ", datosDoc.estatus); // Muestra el estatus del documento

            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (datosDoc.estatus) {
                case 0:
                    estatusTexto = "Listo para asignación.";
                    break;
                case 1:
                    estatusTexto = "Asignado";
                    break;
                case 2:
                    estatusTexto = "En camino";
                    break;
                case 3:
                    estatusTexto = "Entregado";
                    break;
                case 4:
                    estatusTexto = "Fallo en la entrega \n(Se volverá a realizar el intento de entrega)";
                    break;
                default:
                    estatusTexto = "ERROR(Estatus desconocido)";
            }

            // Crear un nuevo div para cada documento
            const estatus = document.createElement('div');
            estatus.innerHTML = `
                <div class="saludo">¡Hola!, tranqui ${guia.nombre} tu paquete esta en un buen trayecto.</div>
                <div class="nombre">Recibe: ${guia.nombre} ${guia.apellido}</div>
                <div class="guia">Número de guía: ${guia.guia}</div>
                <div class="direccion">Dirección: ${guia.ubicacion}</div>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(estatus);

            
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        alert("Hubo un error al obtener los datos.");
    }
}

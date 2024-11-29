import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, doc, updateDoc, getDoc, arrayUnion  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function verHistorial(numeroGuia) {
    const consultarGuia = collection(db, "direcciones");
    const consulta = query(consultarGuia, where("guia", "==", numeroGuia));

    try {
        const respuesta = await getDocs(consulta);

        let info;
        // Si encontramos documentos, tomamos el primer documento
        respuesta.forEach( async (doc) => {
            const datosDoc = doc.data();
            console.log("ID del documento: ", doc.id); // Muestra el ID del documento
            info = datosDoc.historial;
        });
        mostrarHistorial(info);
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        swal("Hubo un error al obtener los datos.");
    }
    
}

function mostrarHistorial(historial) {
    if(!historial){
        document.getElementById("historial").style.display = "none";
        document.getElementById("ocultar").style.display = "block";
        const historialdoDiv = document.querySelector('.historial'); // Selecciona el div para mostrar resultados.
        // Crear un nuevo div para cada documento
        const estatus = document.createElement('div');
        estatus.innerHTML = `
            <div class="notificacion">No hay información valida.</div>
        `;

        // Agrega el nuevo div al contenedor de resultados.
        historialdoDiv.appendChild(estatus);
    }else{
        document.getElementById("historial").style.display = "none";
        document.getElementById("ocultar").style.display = "block";
        const historialdoDiv = document.querySelector('.historial'); // Selecciona el div para mostrar resultados.
        for (let i = 0; i < historial.length; i++) {
            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (historial[i].estatus) {
                case 0:
                    estatusTexto = "¡Estamos listos! Tu paquete está preparado para asignarle un driver.";
                    break;
                case 1:
                    estatusTexto = "¡Todo en marcha! Tu paquete ha sido asignado a un conductor.";
                    break;
                case 2:
                    estatusTexto = "¡Buenas noticias! Su paquete está en camino.";
                    break;
                case 3:
                    estatusTexto = "¡Prepárate! Tu domicilio es la siguiente parada, estamos a punto de llegar.";
                    break;
                case 4:
                    estatusTexto = "¡Entregado con éxito! Tu paquete ha sido entregado. ¡Esperamos que lo disfrutes!";
                    break;
                case 5:
                    estatusTexto = "Intentamos entregarlo. Pasamos por tu domicilio, pero no encontramos a nadie. Reprogramaremos la entrega.";
                    break;
                case 6:
                    estatusTexto = "Lamentamos el inconveniente... El conductor tuvo un percance y tu entrega será reprogramada lo antes posible.";
                    break;
                default:
                    estatusTexto = "Error inesperado. No pudimos consultar el estado de tu paquete. Por favor, intenta nuevamente.";
            }

            // Crear un nuevo div para cada documento
            const estatus = document.createElement('div');
            estatus.innerHTML = `
                <div class="fecha">Fecha y hora: ${historial[i].fecha}</div>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            historialdoDiv.appendChild(estatus);
        } 
    }
}

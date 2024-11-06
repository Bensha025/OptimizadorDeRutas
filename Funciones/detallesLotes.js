import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function obtenerLotes() {
    const consultarLotes = collection(db, "lotes");
    
    try {
        const snapshot = await getDocs(consultarLotes);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            alert("No hay datos disponibles.")
            return;
        }

        const resultadoDiv = document.querySelector('.lotes'); // Selecciona el div para mostrar resultados.
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const idLote = data.id_lote; 
            const coordenadas = data.coordenadas.length;
            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (data.estatus) {
                case 0:
                    estatusTexto = "No listo.";
                    break;
                case 1:
                    estatusTexto = "Listo para asignación.";
                    break;
                case 2:
                    estatusTexto = "Asignado";
                    break;
                case 3:
                    estatusTexto = "En camino";
                    break;
                case 4:
                    estatusTexto = "Entregado";
                    break;
                case 5:
                    estatusTexto = "Fallo en la entrega \n(Se volverá a realizar el intento de entrega)";
                    break;
                default:
                    estatusTexto = "ERROR(Estatus desconocido)";
            }

            // Crear un nuevo div para cada documento
            const loteDiv = document.createElement('div');
            loteDiv.innerHTML = `
                <div class="id">ID del lote: ${idLote}</div>
                <div class="paquetes">Número de paquetes: ${coordenadas}</div>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(loteDiv);
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}

export async function buscarLote(idLote) {

    const consultarLotes = collection(db, "lotes");
    const consulta = query(consultarLotes, where("id_lote", "==", idLote));

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            alert("No hay datos disponibles.");
            return;
        }

        const resultadoDiv = document.querySelector('.lotes'); // Selecciona el div para mostrar resultados.
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const idLote = data.id_lote;
            const coordenadas = data.coordenadas ? data.coordenadas.length : "No disponible"; // Verificación de coordenadas
            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (data.estatus) {
                case 0:
                    estatusTexto = "No listo.";
                    break;
                case 1:
                    estatusTexto = "Listo para asignación.";
                    break;
                case 2:
                    estatusTexto = "Asignado";
                    break;
                case 3:
                    estatusTexto = "En camino";
                    break;
                case 4:
                    estatusTexto = "Entregado";
                    break;
                case 5:
                    estatusTexto = "Fallo en la entrega (Se volverá a realizar el intento de entrega)";
                    break;
                default:
                    estatusTexto = "ERROR(Estatus desconocido)";
            }

            // Crear un nuevo div para cada documento
            const loteDiv = document.createElement('div');
            loteDiv.innerHTML = `
                <div class="id">ID del lote: ${idLote}</div>
                <div class="paquetes">Número de paquetes: ${coordenadas}</div>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(loteDiv);
        });

    } catch (error) {
        console.log("Error al consultar el id: " + id + " (" + error + ")");
    }
}

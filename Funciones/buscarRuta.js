import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function buscaCoordenadas(numeroLote) {
    const consultarCoordenadas = collection(db, "lotes");
    const consultaLotes = query(consultarCoordenadas, where("id_lote", "==", numeroLote), where("estatus", "==", 0));

    try {
        const obtenerLote = await getDocs(consultaLotes);

        if (obtenerLote.empty) {
            console.log("No hay datos disponibles.");
            alert("No hay datos disponibles.");
            window.location.href = `tomarRuta.html`;
            return;
        }

        let coordenadas;

        // Extraemos los datos de los documentos y los mostramos
        obtenerLote.forEach(doc => {
            const data = doc.data();
            coordenadas = data.coordenadas;
        });

        return coordenadas;

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        alert("Hubo un error al obtener los datos.");
    }
}

import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function obtenerInfoUsuario(id) {
    // Referencia al documento único dentro de la colección "direcciones"
    const usuarioInfo = doc(db, "direcciones", id);

    try {
        // Obtener el documento
        const consulta = await getDoc(usuarioInfo);

        if (consulta.exists()) {
            // Extraer los datos
            const data = consulta.data();
            const nombre = data.nombre || "Desconocido";
            const apellido = data.apellido || "Desconocido";
            const correo = data.correo || "Sin correo";
            const ubicacion = data.ubicacion || "*********";
            const telefono = data.telefono || "Sin telefono"

            return {
                nombre,
                apellido,
                correo,
                ubicacion,
                telefono
            };
        } else {
            console.log("No se encontró ningún documento con el ID proporcionado.");
        }
    } catch (error) {
        console.log("Error al obtener los datos: ", error);
    }
}
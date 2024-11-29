import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, doc, updateDoc, getDoc, arrayUnion  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function modificarEstadoPaquete(id,estatus){
    const actulizarEstado = doc(db, "direcciones", id);
    try{
        await updateDoc(actulizarEstado, { estatus: estatus });
    }catch (error){
        console.log("Error al actualizar los datos: ", error);
    }
}

export async function modificarRecibido(id, recibido){
    const actulizaRecibido = doc(db, "direcciones", id);
    try{
        await updateDoc(actulizaRecibido, { recibio: recibido });
        return 1;
    }catch (error){
        console.log("Error al actualizar los datos: ", error);
    }
}

export async function modificarEntrega(id){
    const actulizaRecibido = doc(db, "direcciones", id);
    try{
        await updateDoc(actulizaRecibido, { agregado: false });
        return 1;
    }catch (error){
        console.log("Error al actualizar los datos: ", error);
    }
}

export async function consultaEstatusPaquete(id) {
    const estadoRef = doc(db, "direcciones", id);
    try{
        const docSnap = await getDoc(estadoRef); // Obtener el documento
        return [docSnap.data().estatus, docSnap.data().nombre]; // Acceder a los datos y retornar "estatus"
    }catch (error){
        console.log("Error al actualizar los datos: ", error);
    }
}

export async function modificarEstatusAdmin(numLote, estatus) {
    try {
        // Realiza una consulta para buscar el documento donde el campo `numLote` coincida
        const direccionesRef = collection(db, "lotes");
        const consulta = query(direccionesRef, where("id_lote", "==", numLote));
        const resultados = await getDocs(consulta);

        if (!resultados.empty) {
            // Actualiza el campo `estatus` en cada documento encontrado
            resultados.forEach(async (docSnap) => {
                const documentoRef = doc(db, "lotes", docSnap.id);
                await updateDoc(documentoRef, { estatus: estatus });
            });
            return 1;
        } else {
            console.log("No se encontraron documentos con el numLote especificado.");
            return 0;
        }
    } catch (error) {
        console.log("Error al actualizar los datos: ", error);
        return -1;
    }
}

export async function historialHora(id, estatus, fecha) {
    const historialRef = doc(db, "direcciones", id);

    try {
        const docStatus = await getDoc(historialRef);

        // Verifica si existe el historial
        const historial = docStatus.data()?.historial || [];

        // Revisa si ya existe un objeto con el mismo estatus y fecha
        const existeRegistro = historial.some(
            item => item.estatus === estatus && item.fecha === fecha
        );

        if (!existeRegistro) {
            // Si no existe, lo agrega
            await updateDoc(historialRef, {
                historial: arrayUnion({
                    estatus: estatus,
                    fecha: fecha
                })
            });
            console.log("Historial actualizado correctamente");
        } else {
            console.log("El estatus y la fecha ya están en el historial, no se realizó ninguna actualización");
        }
    } catch (error) {
        console.error("Error al actualizar los datos:", error);
    }
}
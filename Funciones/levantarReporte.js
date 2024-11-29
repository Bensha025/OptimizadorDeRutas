import { db } from './firebaseConect.js'; // Importamos la conecxión de la base de datos.
import { collection, addDoc, query, where, getDocs, getDoc, updateDoc, doc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { modificarEntrega } from "./estadoPaquete.js";

export async function reportError(dataReporte){
    try{
        await addDoc(collection(db, "reportes"), dataReporte);
        return 1;
    } catch (error){
        return 0;
    }
     
}

export async function obtenerIdLote(numLote) {
    const lotesRef = collection(db, "lotes");
    const id = query(lotesRef, where("id_lote", "==", numLote));
    try {
        const traerId = await getDocs(id);
        const loteDoc = traerId.docs[0];
        console.log(loteDoc)
        return loteDoc.id;
    } catch (error){
        console.log("ERROR. No se pudo obtener el id.")
    }
    
}

export async function estatusLote(idLote, numEstatus) {
    const estatusLoteRef = doc(db, "lotes", idLote);
    try {
        await updateDoc(estatusLoteRef, {estatus: numEstatus}); // Actualizar el documento
        swal("Estatus actualizado correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
    }
}

export async function obtenerIdPaquetes(idLote, numEstatus) {
    const idPaquete = doc(db, "lotes", idLote);
    try {
        const consulta = await getDoc(idPaquete);
        if (consulta.exists()) {
            estatusPaquetes(consulta.data(),numEstatus);
        } else {
            console.log("No existe un documento con el ID proporcionado.");
        }
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
    }
}

async function estatusPaquetes(consulta, numEstatus) {
    const coordenadasArray = consulta.coordenadas;

    if (Array.isArray(coordenadasArray)) {
        // Extraemos los direccionId de cada objeto en el array
        const idPaquete = coordenadasArray.map((item) => item.direccionId).filter(Boolean); // Filtramos valores nulos o indefinidos

        console.log("IDs extraídos:", idPaquete, "Cantidad:", idPaquete.length);

        for (let i = 0; i < idPaquete.length; i++) {
            const paqueteEstatus = doc(db, "direcciones", idPaquete[i]);
            
            try {
                // Consultar el estatus del documento
                const docSnap = await getDoc(paqueteEstatus);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    // Validar si el estatus es diferente de 4 antes de actualizar
                    if (data.estatus !== 4) {
                        await updateDoc(paqueteEstatus, { estatus: numEstatus }); // Actualizar el documento
                        await modificarEntrega(idPaquete[i]);
                        console.log(`Estatus y lote actualizado correctamente para ${idPaquete[i]}`);
                    }
                } else {
                    console.log(`No se encontró el documento para ${idPaquete[i]}.`);
                }
            } catch (error) {
                console.error(`Error al procesar el paquete ${idPaquete[i]}:`, error);
            }
        }
    } else {
        console.log("Las coordenadas no son un array válido.");
    }
}


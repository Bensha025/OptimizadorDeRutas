import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, doc, updateDoc, getDocs, getDoc  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


export async function validarCorreoDriver(id, correo){ // Valida el correo del driver.
    const q = query(collection(db, "driver"), where("correo", "==", correo));

    // Realiza la consulta para verificar si existe un documento con ese correo.
    const consulta = await getDocs(q);

    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.

    try {
        const docConsulta = await getDoc(driverDocRef); // Busca que el documento (driver) exista.
        const data = docConsulta.data(); // Obtén los datos del documento.
        
        if (consulta.empty || data.correo === correo) {
            return 0; // Si no existe otro documento con ese correo o si coincide con el correo del driver.
        } else {
            console.log("El correo no coincide con el ID.");
            return 1; // Si el correo ya esta registrado.
        }
    } catch (error) {
        console.error("Error al obtener el documento: ", error);
        return false;
    }
}

//Función paara editar los datos del driver.
export async function editDriverDatos(id, dataDriver){ 
    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.
    try {
        await updateDoc(driverDocRef, dataDriver); // Actualizar el documento
        alert("Datos actualizados correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
    }
}

//Función para editar la contraseña del driver.
export async function editDriverPass(id, dataDriver){
    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.
    try {
        await updateDoc(driverDocRef, dataDriver); // Actualizar el documento
        alert("Contraseña actualizada correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
    }
}

//Función para editar el archivo del driver.
export async function editDriverArchivo(id, dataDriver){
    const driverDocRef = doc(db, "driver", id); // Referencia al documento que se consultara.
    try {
        await updateDoc(driverDocRef, dataDriver); // Actualizar el documento
        alert("Archivo actualizado correctamente");
    } catch (error) {
        console.error("Error al actualizar los datos: ", error);
    }
}
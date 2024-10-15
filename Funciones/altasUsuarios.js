// Funciones para dar de alta a los usuarios.

import { db } from './firebaseConect.js'; // Importamos la conecxión de la base de datos.
import { collection, addDoc, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function adminUser(userData){ // Guarda al admnin.
    console.log("conectado", userData);
    try {
        const docRef = await addDoc(collection(db, "administrador"), userData);
        console.log("Usuario guardado con ID: ", docRef.id);
        alert("Usuario guardado con éxito");
    } catch (error) {
        console.error("Error al guardar los datos: ", error);
        alert("Error al guardar usuario");
    }
}

export async function validarCorreoAdmin(correo){ // Valida el correo del admin.
    const q = query(collection(db, "administrador"), where ("correo", "==", correo));

    const consulta = await getDocs(q);
    
    return !consulta.empty ? 1 : 0;
}

export async function driverUser(userData){ // Guarda al driver.
    console.log("conectado", userData);
    try {
        const docRef = await addDoc(collection(db, "driver"), userData);
        console.log("Usuario guardado con ID: ", docRef.id);
        alert("Usuario guardado con éxito");
    } catch (error) {
        console.error("Error al guardar los datos: ", error);
        alert("Error al guardar usuario");
    }
}

export async function validarCorreoDriver(correo){ // Valida el correo del admin.
    const q = query(collection(db,"driver"), where ("correo", "==", correo));

    const consulta = await getDocs(q);

    return !consulta.empty ? 1 : 0;
}
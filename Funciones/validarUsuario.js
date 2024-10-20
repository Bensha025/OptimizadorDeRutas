// Funciones/userFunctions.js

import { db } from './firebaseConect.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function validarUser(correo, pass) {
    try{
        const consulta = query(collection(db, "administrador"), where("correo", "==", correo));

        const querySnapshot = await getDocs(consulta)

        if (querySnapshot.empty){
            alert("Error al iniciar sesión, revise sus credenciales.");
            return false;
        } else{
            let userFound = false
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if(userData.pass == pass){
                    alert("Usuario encontrado.")
                    userFound = true;
                }
            });

            if (!userFound){
                alert("Error al iniciar sesión, revise sus credenciales.")
                return false;
            }
            return true;
        }
    }catch (error) {
        console.error("Error al verificar las credenciales:", error);
        alert("Error al verificar las credenciales");
        return false;
    }
    
}

// Funciones/userFunctions.js

import { db } from './firebaseConect.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function validarUser(correo, pass) {
    try{
        const consulta = query(collection(db, "administrador"), where("correo", "==", correo));

        const querySnapshot = await getDocs(consulta)

        if (querySnapshot.empty){
            swal('Error al iniciar sesión','revise sus credenciales.','error');
            return false;
        } else{
            let userFound = false
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                if(userData.pass == pass){
                    swal('Excelente','Usuario encontrado','success');
                    userFound = true;
                    // Almacenar los datos en sessionStorage (temporal)
                    sessionStorage.setItem("idUser", doc.id);
                    sessionStorage.setItem("nombreUser", userData.nombre);
                    sessionStorage.setItem("apellidosUser", userData.apellido);

                    // Redirigir al usuario a la página protegida
                    window.location.href = "tomarRuta.html";
                    userFound = true;
                    window.location.href = "../tablaAdministrador.html";
                }
            });

            if (!userFound){
                swal('Error al iniciar sesión','revise sus credenciales.','error');
                return false;
            }
            return true;
        }
    }catch (error) {
        console.error("Error al verificar las credenciales:", error);
        swal('Lamentamos lo sucedido','Error al verificar las credenciales','error');
        return false;
    }
}

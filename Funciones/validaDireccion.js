import { db } from './firebaseConect.js'; // Importamos la conecxión de la base de datos.
import { collection, addDoc} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function obtenerCoordenadas(direccion) {
  try {
    const userAgent = "cctmexico"; // Identificador del usuario
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(direccion)}`;
      
    const response = await fetch(url, { headers: { "User-Agent": userAgent } });
    const data = await response.json();
  
    if (data.length > 0) {
      const coordenadas = { lat: data[0].lat, lon: data[0].lon };
      return coordenadas;
    } else {
      alert("Dirección no válida.")
      console.log("Dirección no válida.");
    }
  } catch (error) {
    console.error("Error al obtener coordenadas:", error);
  }
}

export async function guardarDirec(direccionData) {
  console.log("Conectado:", direccionData);

  try {
    // Guarda la dirección en Firestore
    const docRef = await addDoc(collection(db, "direcciones"), direccionData);
    console.log("Dirección guardada con ID: ", docRef.id);

    // Envía el correo
    // await enviarCorreo(direccionData);
    // console.log("Correo enviado correctamente");

    // Retorna el número de guía si todo fue exitoso
    return direccionData.guia;

  } catch (error) {
    // Maneja errores durante el proceso
    console.error("Error al guardar los datos: ", error);
    alert("Error al guardar la dirección: " + error.message);
  }
}

export async function enviarCorreo(direccionData) {
  // Asegúrate de inicializar EmailJS solo una vez
  try {
    emailjs.init('TKe2d8116SCmfmd7u'); // Asegúrate de usar tu API Key válida

    // Prepara los parámetros del correo
    const templateParams = {
      from_name: direccionData.nombre || "Usuario",
      to_name: 'πTech', // Puede ser un destinatario genérico
      from_email: "pitech.noreply@gmail.com",
      to_email: direccionData.correo || "default@correo.com", // Evita enviar correo vacío
      message: `Hola ${direccionData.nombre || "Usuario"}, recuerda que tu número de guía es: ${direccionData.guia || "N/A"}`
    };

    // Envía el correo con EmailJS
    const response = await emailjs.send("service_7ddyizh", "template_7lbh886", templateParams);
    console.log('Correo enviado con éxito:', response);
    alert("Número de guía enviado al correo con éxito.");

  } catch (error) {
    // Maneja errores al enviar el correo
    console.error("Error al enviar el correo: ", error);
    alert("Error al enviar el correo: " + error.message);
  }
}
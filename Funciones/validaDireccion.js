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
      return 1;
    } else {
      alert("Dirección no válida.")
      console.log("Dirección no válida.");
    }
  } catch (error) {
    console.error("Error al obtener coordenadas:", error);
  }
}

export async function guardarDirec(direccionData) {

  console.log("conectado", direccionData);
  try {
    //enviarCorreo(direccionData);
    const docRef = await addDoc(collection(db, "direcciones"), direccionData);
    console.log("Dirección guardada con ID: ", docRef.id);
    alert("Dirección guardada con éxito");
    alert("Su numero de guia es: " + direccionData.guia);

    location.reload();
  } catch (error) {
    console.error("Error al guardar los datos: ", error);
    alert("Error al guardar la dirección");
  }

}

export function enviarCorreo(direccionData){
  // Inicializa EmailJS con tu API Key
  emailjs.init('TKe2d8116SCmfmd7u'); 

  // Obtenemos los valores de direccionData
  const nombre = direccionData.nombre;
  const correo = direccionData.correo;
  const guia = direccionData.guia;  // Corregido: ahora usa direccionData.guia

  // Parámetros que se envían a EmailJS
  const templateParams = {
    from_name: nombre,
    to_name: 'πTech', // Puede ser tu propio correo
    from_email: "pitech.noreply@gmail.com",
    to_email: correo,
    message: `Hola ${nombre}, ¿Dónde está mi paquete? Recuerda, tu número de guía es: ${guia}`
  };

  // Enviar el correo utilizando EmailJS
  emailjs.send("service_7ddyizh", "template_7lbh886", templateParams)
    .then(function(response) {
        console.log('Correo enviado con éxito:', response);
        alert("Número de guía enviado al correo con éxito.");
    }, function(error) {
        console.log('Error al enviar correo:', error);
        alert("ERROR AL ENVIAR EL CORREO.");
    });
}
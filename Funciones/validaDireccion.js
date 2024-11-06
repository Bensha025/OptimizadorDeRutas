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
    const docRef = await addDoc(collection(db, "direcciones"), direccionData);
    console.log("Dirección guardada con ID: ", docRef.id);
    alert("Dirección guardada con éxito");
  } catch (error) {
    console.error("Error al guardar los datos: ", error);
    alert("Error al guardar la dirección");
  }
}

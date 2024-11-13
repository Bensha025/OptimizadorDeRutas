import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, addDoc, doc, updateDoc  } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Función para obtener los datos de Firestore.
export async function obtenerRuta() {
    const ruta = collection(db, "direcciones");
    const consulta = query(ruta, where("agregado", "==", false));

    const direcciones = [];

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            alert("No hay rutas para optimizar.");
            console.log("No hay datos disponibles.");
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const ubicacion = data.ubicacion;
            const id = doc.id; // Guardamos el ID de la dirección

            direcciones.push({ ubicacion, id });
        });

        optimizarRuta(direcciones);

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}

// Geocodificación de direcciones usando Fetch API en lugar de `require`
async function geocodificar(direccion) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'cctmexico' } });
    const data = await response.json();
    return data.length ? { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) } : null;
}

// Calcular distancia de Haversine entre dos coordenadas
function haversine(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2.lat - coord1.lat) * (Math.PI / 180);
    const dLon = (coord2.lon - coord1.lon) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(coord1.lat * (Math.PI / 180)) * Math.cos(coord2.lat * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Guardar lote en Firebase con todas las coordenadas en un solo documento
async function guardarLoteEnFirebase(loteId, paquetes) {
    const lotesRef = collection(db, "lotes");

    // Crear el documento del lote con las coordenadas e IDs de direcciones
    const loteDoc = {
        id_lote: loteId,
        coordenadas: paquetes.map(paquete => ({ lat: paquete.lat, lon: paquete.lon, direccionId: paquete.id })), // Almacena todas las coordenadas y los IDs de las direcciones
        estatus: 0
    };

    try {
        // Guardar el lote en la colección 'lotes'
        await addDoc(lotesRef, loteDoc);

        // Actualizar el estatus de cada dirección en 'direcciones'
        for (const paquete of paquetes) {
            const editarEstatus = doc(db, "direcciones", paquete.id);
            await updateDoc(editarEstatus, { agregado: true });
        }
        
        console.log(`Lote ${loteId} añadido a Firebase con ${paquetes.length} coordenadas`);
    } catch (error) {
        console.error("Error al guardar lote en Firebase: ", error);
    }
}

// Optimización de rutas tipo A* para agrupar coordenadas en lotes
async function optimizacionRutaAEstrella(coordenadas, maxDistanciaKm = 5, minPaquetes = 2, maxPaquetes = 25) {
    const lotes = [];
    const visitados = new Set();

    for (let i = 0; i < coordenadas.length; i++) {
        if (visitados.has(i)) continue;

        let lote = [coordenadas[i]];
        visitados.add(i);
        const monton = [];

        for (let j = 0; j < coordenadas.length; j++) {
            if (j !== i && !visitados.has(j)) {
                const distancia = haversine(coordenadas[i], coordenadas[j]);
                if (distancia <= maxDistanciaKm) {
                    monton.push({ distancia, coord: coordenadas[j], index: j });
                }
            }
        }

        monton.sort((a, b) => a.distancia - b.distancia);

        while (monton.length && lote.length < maxPaquetes) {
            const { distancia, coord, index } = monton.shift();
            if (!visitados.has(index) && distancia <= maxDistanciaKm) {
                lote.push(coord);
                visitados.add(index);
            }
        }

        if (lote.length >= minPaquetes) {
            const loteId = Math.floor(Math.random() * 9000) + 1000; // Genera un ID de 4 dígitos
            lotes.push({ id: loteId, paquetes: lote });
        }
    }
    console.log(lotes);
    return lotes;
}

// Función principal para obtener rutas
async function optimizarRuta(direcciones) {
    console.log(direcciones)
    const inicio = Date.now();
    const coordenadas = [];

    for (const direccion of direcciones) {
        const ubicacion = await geocodificar(direccion.ubicacion);
        if (ubicacion) {
            coordenadas.push({ ...ubicacion, id: direccion.id }); // Incluimos el ID de la dirección
        }
    }
    
    const fin = Date.now();
    console.log(`Tiempo de geocodificación: ${(fin - inicio) / 1000} segundos`);
    
    const lotes = await optimizacionRutaAEstrella(coordenadas);
    
    // Guardar cada lote en Firebase
    for (const lote of lotes) {
        console.log(`Guardando lote ID ${lote.id} con ${lote.paquetes.length} coordenadas`);
        await guardarLoteEnFirebase(lote.id, lote.paquetes); // Guardar todas las coordenadas del lote en un solo documento
    }
}

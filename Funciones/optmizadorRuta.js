import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Función para obtener los datos de Firestore.
export async function obtenerRuta() {
    const ruta = collection(db, "direcciones");
    const consulta = query(ruta, where("agregado", "==", false));

    const direcciones = [];

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay rutas para optimizar.");
            swal("No hay rutas para optimizar.");
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.coordenadas) {
                const { lat, lon } = data.coordenadas;
                if (lat !== undefined && lon !== undefined) {
                    direcciones.push({ coordenadas: { lat, lon }, id: doc.id });
                } else {
                    console.warn(`Coordenadas inválidas para el documento ID: ${doc.id}`);
                }
            }
        });
        console.log(direcciones.length)
        if (direcciones.length > 1) {
            await optimizarRuta(direcciones);
        } else {
            console.log("No hay direcciones con coordenadas válidas.");
            swal("El número de rutas para optimizar es menor, intente mas tarde.");
        }

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
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
    const loteDoc = {
        id_lote: loteId,
        coordenadas: paquetes.map(paquete => ({
            lat: paquete.lat,
            lon: paquete.lon,
            direccionId: paquete.id
        })),
        estatus: 0
    };

    try {
        await addDoc(lotesRef, loteDoc);
        for (const paquete of paquetes) {
            const direccionRef = doc(db, "direcciones", paquete.id);
            await updateDoc(direccionRef, { agregado: true });
        }
        console.log(`Lote ${loteId} añadido a Firebase con ${paquetes.length} coordenadas.`);
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

        const proximos = [];

        for (let j = 0; j < coordenadas.length; j++) {
            if (i !== j && !visitados.has(j)) {
                const distancia = haversine(coordenadas[i], coordenadas[j]);
                if (distancia <= maxDistanciaKm) {
                    proximos.push({ distancia, coord: coordenadas[j], index: j });
                }
            }
        }

        proximos.sort((a, b) => a.distancia - b.distancia);

        while (proximos.length && lote.length < maxPaquetes) {
            const { coord, index } = proximos.shift();
            lote.push(coord);
            visitados.add(index);
        }

        if (lote.length >= minPaquetes) {
            const loteId = Math.floor(Math.random() * 9000) + 1000;
            lotes.push({ id: loteId, paquetes: lote });
        }
    }
    return lotes;
}

// Función principal para optimizar rutas
async function optimizarRuta(direcciones) {
    console.log("Iniciando optimización de rutas...");
    const coordenadas = direcciones.map(direccion => ({
        ...direccion.coordenadas,
        id: direccion.id
    }));

    const lotes = await optimizacionRutaAEstrella(coordenadas);

    for (const lote of lotes) {
        await guardarLoteEnFirebase(lote.id, lote.paquetes);
    }

    console.log("Optimización completada.");
    swal("Se han optimizado las rutas.");
}

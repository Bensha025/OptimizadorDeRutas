const apiKey = '5b3ce3597851110001cf624889911f91464b4fccb644713af4d78ed6';

// Función para obtener la ruta entre dos puntos consecutivos
export function obtenerRuta(inicio, destino) {
    return fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${inicio.lon},${inicio.lat}&end=${destino.lon},${destino.lat}`)
        .then(response => response.json())
        .then(data => {
            return data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        })
        .catch(error => {
            console.error('Error al obtener la ruta:', error);
            return [];
        });
}

let cont = 0;
// Función para calcular la ruta completa recorriendo todas las direcciones
export async function calcularRutaCompleta(coordenadasArray, map) {
    console.log(coordenadasArray)
    let rutasCompletas = [];
    // Llamar a obtenerRuta para cada par de destinos consecutivos y unir las rutas
    for (let i = 0; i < coordenadasArray.length - 1; i++) {
        const coordenadasRuta = await obtenerRuta(coordenadasArray[i], coordenadasArray[i + 1]);               
        rutasCompletas = rutasCompletas.concat(coordenadasRuta);
    }
    
    if(cont < 2){
        // Traza la ruta completa en el mapa
        const ruta = L.polyline(rutasCompletas, { color: 'blue', weight: 5 }).addTo(map);
        map.fitBounds(ruta.getBounds());
        cont++
    }
    return rutasCompletas;
}
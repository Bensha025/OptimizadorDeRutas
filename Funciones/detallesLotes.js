import { db } from './firebaseConect.js'; // Importamos la conexión a la base de datos.
import { collection, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function obtenerLotes() {
    const consultarLotes = collection(db, "lotes");
    
    try {
        const snapshot = await getDocs(consultarLotes);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            swal('Intentalo de nuevo','No hay datos disponibles.','error');
            return;
        }

        const resultadoDiv = document.querySelector('.lotes');
        resultadoDiv.innerHTML = '<ul class="list"></ul>'; // Crear un solo <ul> al inicio
        
        const lista = resultadoDiv.querySelector('.list'); // Seleccionar el <ul> que acabamos de crear
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const idLote = data.id_lote; 
            const coordenadas = data.coordenadas.length;
            let estatusTexto;
        
            // Definir el texto del estatus según su valor
            switch (data.estatus) {
                case 0:
                    estatusTexto = "No listo.";
                    break;
                case 1:
                    estatusTexto = "Listo para asignación.";
                    break;
                case 2:
                    estatusTexto = "Asignado";
                    break;
                case 3:
                    estatusTexto = "En camino";
                    break;
                case 4:
                    estatusTexto = "Entregado";
                    break;
                case 5:
                    estatusTexto = "Fallo en la entrega (Se volverá a realizar el intento de entrega)";
                    break;
                default:
                    estatusTexto = "ERROR (Estatus desconocido)";
            }
        
            // Crear un nuevo <li> para cada documento
            const loteItem = document.createElement('li');
            loteItem.classList.add('item'); // Agregar clase 'item' al <li>
            loteItem.innerHTML = `
                <div class="id">ID del lote\n: ${idLote}</div>
                <div class="info oculto">
                <div class="paquetes">Número de paquetes: ${coordenadas}</div>
                <br>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                </div>
            `;
        
            // Agrega un evento de clic a cada elemento li
            document.querySelectorAll('.lotes li').forEach(item => {
                item.addEventListener('click', () => {
                item.classList.remove('oculto');
                });
            });
            // Agregar el nuevo <li> al <ul>
            lista.appendChild(loteItem);
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
    }
}

export async function buscarLote(idLote) {

    const consultarLotes = collection(db, "lotes");
    const consulta = query(consultarLotes, where("id_lote", "==", idLote));

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            swal('Intentalo de nuevo','El lote que buscas no existe o no esta disponible','error');
            return;
        }

        const resultadoDiv = document.querySelector('.lotes'); // Selecciona el div para mostrar resultados.
        
        snapshot.forEach(doc => {
            const data = doc.data();
            const idLote = data.id_lote;
            const coordenadas = data.coordenadas ? data.coordenadas.length : "No disponible"; // Verificación de coordenadas
            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (data.estatus) {
                case 0:
                    estatusTexto = "Paquete listo. El paquete está preparado para asignación.";
                    break;
                case 1:
                    estatusTexto = "Asignación completa. El paquete ha sido asignado a un conductor.";
                    break;
                case 2:
                    estatusTexto = "En ruta. El paquete está siendo transportado hacia su destino.";
                    break;
                case 3:
                    estatusTexto = "Lote completado. El lote de paquetes se ha finalizado con éxito.";
                    break;
                case 4:
                    estatusTexto = "Lote incompleto. El lote de paquetes ha finalizado, pero quedan entregas pendientes.";
                    break;
                case 5:
                    estatusTexto = " Atención. El conductor ha tenido un percance y la entrega será reprogramada lo antes posible.";
                    break;
                default:
                    estatusTexto = "Error inesperado. No fue posible consultar el lote de paquetes. Por favor, intenta nuevamente.";
            }
            // Crear un nuevo div para cada documento
            const loteDiv = document.createElement('tr');
            loteDiv.classList.add('mostrar'); // Agregar la clase 'lote'
            loteDiv.innerHTML = `
                <td class="id2">ID del lote: ${idLote}</td>
                <td class="paquetes2">Número de paquetes: ${coordenadas}</td>
                <td class="estatus2">Estatus: ${estatusTexto}</td>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(loteDiv);
        });

    } catch (error) {
        console.log("Error al consultar el id: " + id + " (" + error + ")");
    }
}// Crear un elemento <style>
const style = document.createElement('style');
style.textContent = `
    /* Estilos generales para la tabla */
    table {
        width: 100%; /* Ancho completo */
        border-collapse: collapse; /* Colapsar bordes */
        margin: 20px 0; /* Margen superior e inferior */
    }

    /* Estilos para las filas */
    tr {
        background-color: #f9f9f9; /* Color de fondo claro */
        transition: background-color 0.3s; /* Transición suave para el hover */
    }

    /* Estilo para el hover en filas */
    tr:hover {
        background-color: #f1f1f1; /* Color de fondo al pasar el mouse */
    }

    /* Estilos para las celdas */
    td {
        padding: 10px; /* Espaciado interno */
        border: 1px solid #ddd; /* Bordes de las celdas */
        text-align: left; /* Alinear texto a la izquierda */
    }

    /* Estilo para la clase 'mostrar' */
    .mostrar {
        font-weight: bold; /* Negrita para la clase 'mostrar' */
        color: #333; /* Color del texto */
    }

    /* Estilos específicos para las celdas */
    .id2 {
        color: #007bff; /* Color para ID del lote */
    }

    .paquetes2 {
        color: #28a745; /* Color para Número de paquetes */
    }

    .estatus2 {
        color: #dc3545; /* Color para Estatus */
    }
`;

// Añadir el elemento <style> al <head> del documento
document.head.appendChild(style);
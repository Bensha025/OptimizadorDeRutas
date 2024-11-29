import { db } from './firebaseConect.js'; // Importamos la conexión de la base de datos.
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

export async function buscarGuia(numeroGuia) {
    const consultarGuia = collection(db, "direcciones");
    const consulta = query(consultarGuia, where("guia", "==", numeroGuia));

    try {
        const snapshot = await getDocs(consulta);
        if (snapshot.empty) {
            console.log("No hay datos disponibles.");
            swal({
                title: "¡No hay un paquete perteneciente a este numero de guia!",
                text: "Vuelve a intentarlo",
                icon: "warning"
            }).then(() => {
                // Recargar la página después de cerrar la alerta
                window.location.href("buscarGuia.html");
            });
            return;
        }

        let info = [];
        // Si encontramos documentos, tomamos el primer documento
        snapshot.forEach( async (doc) => {
            const datosDoc = doc.data();
            console.log("ID del documento: ", doc.id); // Muestra el ID del documento
            info.push({
                coordenadas: datosDoc.coordenadas,
                direccion: datosDoc.ubicacion,
                estatus: datosDoc.estatus
            });
            await obtenerEstatus(doc.id,datosDoc);
        });
        return info;
    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        swal({
            title: "¡Hubo un error al obtener los datos!",
            text: "Vuelve a intentarlo",
            icon: "warning"
        }).then(() => {
            // Recargar la página después de cerrar la alerta
            window.location.href("buscarGuia.html");
        });
    }
}

async function obtenerEstatus(id,guia) {
    const consultarEstado = collection(db, "direcciones");
    const consultaLotes = query(consultarEstado, where("__name__", "==", id)); // Filtra por el ID del documento

    try {
        const obtenerId = await getDocs(consultaLotes);

        if (obtenerId.empty) {
            console.log("No hay datos disponibles para el ID especificado.");
            swal({
                title: "¡No hay datos disponibles para el ID especifico!",
                text: "Vuelve a intentarlo",
                icon: "warning"
            }).then(() => {
                // Recargar la página después de cerrar la alerta
                window.location.href("buscarGuia.html");
            });
            return;
        }

        const resultadoDiv = document.querySelector('.estatus'); // Selecciona el div para mostrar resultados.

        // Si encontramos el documento con el ID especificado
        obtenerId.forEach((doc) => {
            const datosDoc = doc.data();
            console.log("Estatus del documento: ", datosDoc.estatus); // Muestra el estatus del documento

            let estatusTexto;

            // Definir el texto del estatus según su valor
            switch (datosDoc.estatus) {
                case 0:
                    estatusTexto = "¡Estamos listos! Tu paquete está preparado para asignarle un driver.";
                    break;
                case 1:
                    estatusTexto = "¡Todo en marcha! Tu paquete ha sido asignado a un conductor.";
                    break;
                case 2:
                    estatusTexto = "¡Buenas noticias! Su paquete está en camino.";
                    break;
                case 3:
                    estatusTexto = "¡Preparate! Tu domicilio es la siguiente parada, estamos a punto de llegar.";
                    break;
                case 4:
                    estatusTexto = "¡Entregado con éxito! Tu paquete ha sido entregado. ¡Esperamos que lo disfrutes!";
                    break;
                case 5:
                    estatusTexto = "Intentamos entregarlo. Pasamos por tu domicilio, pero no encontramos a nadie. Reprogramaremos la entrega.";
                    break;
                case 6:
                    estatusTexto = "Lamentamos el inconveniente... El conductor tuvo un percance y tu entrega será reprogramada lo antes posible.";
                    break;
                default:
                    estatusTexto = "Error inesperado. No pudimos consultar el estado de tu paquete. Por favor, intenta nuevamente.";
            }

            let horaEntregaAprox;
            let fecha;
            let mensaje;
            if(guia.historial){
                if (guia.historial.length > 0 && guia.historial.length < 3){
                    fecha = guia.historial[0].fecha.split(', ')[1];
                    let hora = guia.historial[0].fecha.split(', ')[2];
                    const [horas, minutos] = hora.split(':').map(Number);

                    // Aumentar 2 horas
                    let nuevasHoras = horas + 4;
                    if (nuevasHoras >= 24) {
                        nuevasHoras -= 24; // Ajustar para formato de 24 horas
                    }

                    horaEntregaAprox = `${nuevasHoras.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                    mensaje = "entregará";
                }

                if (guia.historial.length === 3){
                    fecha = guia.historial[0].fecha.split(', ')[1];
                    let hora = guia.historial[0].fecha.split(', ')[2];
                    const [horas, minutos] = hora.split(':').map(Number);

                    // Aumentar 2 horas
                    let nuevasHoras = horas + 1;
                    if (nuevasHoras >= 24) {
                        nuevasHoras -= 24; // Ajustar para formato de 24 horas
                    }

                    horaEntregaAprox = `${nuevasHoras.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
                    mensaje = "entregará";
                }

                if (guia.historial.length === 4) {
                    fecha = guia.historial[0].fecha.split(', ')[1];
                    const hora = guia.historial[0].fecha.split(', ')[2];

                    horaEntregaAprox = hora;
                    mensaje = "entrego";
                }

                if (guia.historial.length === 5 || guia.historial.length === 6){
                    fecha = guia.historial[0].fecha.split(', ')[1];
                    const hora = guia.historial[0].fecha.split(', ')[2];

                    horaEntregaAprox = hora;
                    mensaje = "intento entregar";
                }
            }else{
                mensaje = "intento entregar";
                fecha = "Al fia siguiente";
                horaEntregaAprox = "00:00"
            }     
            
            // Crear un nuevo div para cada documento
            const estatus = document.createElement('div');
            estatus.innerHTML = `
                <div class="saludo">¡Hola!, tranqui ${guia.nombre} tu paquete esta en un buen trayecto.</div>
                <div class="entregaProx">Tu paquete se ${mensaje} aproximadamente el dia: ${fecha} mas tardar a las: ${horaEntregaAprox}.</div>
                <div class="nombre">Recibe: ${guia.nombre} ${guia.apellido}</div>
                <div class="guia">Número de guía: ${guia.guia}</div>
                <div class="direccion">Dirección: ${guia.ubicacion}</div>
                <div class="estatus">Estatus: ${estatusTexto}</div>
                <br>
            `;

            // Agrega el nuevo div al contenedor de resultados.
            resultadoDiv.appendChild(estatus);
            
            
        });

    } catch (error) {
        console.error("Error al obtener los datos: ", error);
        swal({
            title: "¡Hubo un error al obtener los datos!",
            text: "Vuelve a intentarlo",
            icon: "warning"
        }).then(() => {
            // Recargar la página después de cerrar la alerta
            window.location.href("buscarGuia.html");
        });
    }
}

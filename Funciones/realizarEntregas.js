import { obtenerInfoUsuario } from './infoUsuario.js';

// Función para esperar el clic en un botón específico
export async function realizarEntrega(coordenadasArray,) {
    let id = coordenadasArray[ubiVisitadas].direccionId;
    const confirmar = confirm("¿Desea entregar el paquete?");
    if(confirmar){
        const info = await obtenerInfoUsuario(id);
        console.log(info);

        // Mostrar información del usuario
        const infoContainer = document.getElementById("infoUser");
        infoContainer.innerHTML = `<div><br>Genial, estás a punto de entregar el paquete para ${info.nombre} <br>
        Recibe: ${info.nombre} ${info.apellido} <br>
        Dirección : ${info.ubicacion} <br>
        Teléfono : ${info.telefono}</div><br><br>
        ¿Quien recibe?`;

        // Verificar si el formulario ya existe
        const formularioContainer = document.getElementById("formEntrega");
        formularioContainer.innerHTML = ""; // Limpia el contenido anterior

        // Crear el elemento del formulario
        const formulario = document.createElement("form");

        // Crear un contenedor para los radio buttons
        const radioContainer = document.createElement("div");
        radioContainer.setAttribute("id", "radioRecibe");

        // Opciones de selección
        const opciones = [info.nombre, "Familiar", "Vecino", "Otro"];
        opciones.forEach(opcion => {
            // Crear un contenedor para cada radio button
            const label = document.createElement("label");
            label.style.display = "block"; // Opcional: Estilo para mostrar cada opción en una línea diferente

            // Crear el radio button
            const radio = document.createElement("input");
            radio.setAttribute("type", "radio");
            radio.setAttribute("name", "recibe");
            radio.setAttribute("value", opcion.toLowerCase());

            // Crear la etiqueta asociada al radio button
            const text = document.createTextNode(opcion);

            // Agregar el radio button y el texto al label
            label.appendChild(radio);
            label.appendChild(text);

            // Agregar el label al contenedor principal
            radioContainer.appendChild(label);

            // Agregar un evento para mostrar el campo adicional si la opción es "Otro"
            radio.addEventListener("change", () => {
                if (radio.value !== info.nombre.toLowerCase()) {
                    extraInputContainer.style.display = "block";
                } else {
                    extraInputContainer.style.display = "none";
                }
            });
        });

        // Crear un contenedor para el campo de texto adicional
        const extraInputContainer = document.createElement("div");
        extraInputContainer.setAttribute("id", "extraInputContainer");
        extraInputContainer.style.display = "none";

        // Crear el campo de texto adicional
        const inputTexto = document.createElement("input");
        inputTexto.setAttribute("type", "text");
        inputTexto.setAttribute("name", "nombreExtra");
        inputTexto.setAttribute("placeholder", "Ingrese el nombre");
        extraInputContainer.appendChild(inputTexto);

        // Crear un botón de envío
        const botonEnviar = document.createElement("button");
        botonEnviar.setAttribute("type", "button"); // Cambiar a tipo botón para manejar evento manualmente
        botonEnviar.textContent = "Enviar";

        // Crear un botón para indicar que no se encontró al destinatario
        const botonEntregaFall = document.createElement("button");
        botonEntregaFall.setAttribute("type", "button"); // Cambiar a tipo botón
        botonEntregaFall.textContent = "No se encontró a " + info.nombre;

        // Agregar un evento para manejar la entrega exitosa
        botonEnviar.addEventListener("click", async () => {
            const seleccionado = document.querySelector('input[name="recibe"]:checked');
            const nombre = document.querySelector('input[name="nombreExtra"]');

            if (!seleccionado) {
                swal("Por favor, selecciona quién recibe el paquete.");
                return;
            }

            // Validar si se seleccionó "Otro" y el campo de texto está vacío
            if (seleccionado.value !== info.nombre.toLowerCase()) {
                if (!inputTexto.value.trim()) {
                    swal("Por favor, ingrese el nombre del receptor.");
                    return;
                } 
            }

            try {
                const recibe = seleccionado.value + " (" + nombre.value + ")";

                const respuesta = await modificarRecibido(id, recibe);
                const mensaje = respuesta ? 0 : 1;
                estadoDeEntrega(info,mensaje)
            } catch (error) {
                console.error("Error al modificar estado:", error);
                swal("Hubo un error al procesar la entrega.");
            }
        });

        // Agregar un evento para manejar la entrega fallida
        botonEntregaFall.addEventListener("click", async () => {
            const confirmar = confirm("¿Estás seguro que el paquete no ha podido ser entregado?");
            if (!confirmar) return;

            try {
                await modificarEstadoPaquete(id, 4);
                const respuesta = await modificarEntrega(id);
                const mensaje = respuesta ? 2 : 3;
                estadoDeEntrega(info,mensaje)
            } catch (error) {
                console.error("Error al modificar estado de entrega:", error);
                swal("Hubo un error al procesar la entrega fallida.");
            }
        });

        // Agregar los elementos al formulario
        formulario.appendChild(radioContainer);
        formulario.appendChild(extraInputContainer);
        formulario.appendChild(botonEnviar);
        formulario.appendChild(botonEntregaFall);

        // Agregar el formulario al contenedor
        formularioContainer.appendChild(formulario);
        
    }
    
}
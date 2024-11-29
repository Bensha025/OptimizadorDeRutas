//ARCHIVO DE ANGEL
const contenedorBotones = document.getElementById('contenedor-botones');
const contenedorToast = document.getElementById('contenedor-toast');

// Even Listener para detectar click en los botones

contenedorBotones.addEventListener('click', (e) => {
    e.preventDefault();

    const tipo = (e.target.dataset.tipo);

    if(tipo === 'exito'){
        agregarToast({tipo: 'exito', titulo: 'Exito!', descripcion: 'La operacion fue exitosa', autoCierre: true});
    }
    if(tipo === 'error'){
        agregarToast({tipo: 'error', titulo: 'Error!', descripcion: 'La operacion fracaso', autoCierre: true});
    }
});

// Event Listener para detectar click en los toast
contenedorToast.addEventListener('click', (e) => {
    const toastId = e.target.closest('div.toast').id;

    if(e.target.closest('button.btn-cerrar')){
        cerrarToast(toastId);
    }
});

//Funcion para cerrar el toast
const cerrarToast = (id) => {
    document.getElementById(id)?.classList.add('cerrando');
};

// Funcion para agregar la clase de cerrando al toast.
const agregarToast = ({tipo, titulo, descripcion, autoCierre}) => {
    //Crear el nuevo toast
    const nuevoToast = document.createElement('div');

    // Agregar clases correspondientes
    nuevoToast.classList.add('toast');
    nuevoToast.classList.add(tipo);
    if(autoCierre) nuevoToast.classList.add('autoCierre');

    //Agregar id del toast
    const numeroAlAzar = Math.floor(Math.random() * 100);
    const fecha = Date.now();
    const toastId = fecha + numeroAlAzar;
    nuevoToast.id = toastId;

    // Iconos
    const iconos ={
        exito: ' <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/></svg>',
        error: ' <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16"><path d="M11.46.146A.5.5 0 0 0 11.107 0H4.893a.5.5 0 0 0-.353.146L.146 4.54A.5.5 0 0 0 0 4.893v6.214a.5.5 0 0 0 .146.353l4.394 4.394a.5.5 0 0 0 .353.146h6.214a.5.5 0 0 0 .353-.146l4.394-4.394a.5.5 0 0 0 .146-.353V4.893a.5.5 0 0 0-.146-.353zM8 4c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995A.905.905 0 0 1 8 4m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/></svg>',
    };

    //Plantilla del toast
    const toast = `
                    <div class="contenido">
                        <div class="icono">
						${iconos[tipo]}
                        </div>
						<div class="texto">
                            <p class="titulo">${titulo}</p>
                            <p class="descripcion">${descripcion}</p>
                        </div>
					</div>
					<button class="btn-cerrar">
						<div class="icono">
							<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
								<path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
							</svg>
						</div>
					</button>
    `;

    //Agregar la plantilla al nuevo toast
    nuevoToast.innerHTML = toast;

    //Agregamos el nuevo toast al contenedor
    contenedorToast.appendChild(nuevoToast)

    // Funcion para manejar el cierre del toast
    const handleAnimacionCierre = (e) => {
        if(e.animationName === 'cierre') {
            nuevoToast.removeEventListener('animationend', handleAnimacionCierre);
            nuevoToast.remove();
        }
    };

    if(autoCierre){
        setTimeout(() => cerrarToast(toastId), 5000);
    }

    //Agregamos event listener para detectar cuando termine la animacion
    nuevoToast.addEventListener('animationend', handleAnimacionCierre);
};
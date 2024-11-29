//ARCHIVO DE ANGEL
let ubicacionPrincipal = window.pageYOffset
let $header = document.querySelector('#nav');

window.addEventListener('scroll', function() {
    let ubicacionActual = window.pageYOffset

    console.log(ubicacionActual);

    if( ubicacionPrincipal > ubicacionActual){
        $header.style.top = "0px"
    } else {
        $header.style.top = "-100px"
    }

    ubicacionPrincipal = ubicacionActual

})
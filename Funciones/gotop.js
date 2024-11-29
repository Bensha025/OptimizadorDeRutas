//ARCHIVO DE ANGEL
window.onscroll = function(){
    if(document.documentElement.scrollTop > 400){
        document.querySelector('.go-top-container').classList.add('show');
    }else{
        document.querySelector('.go-top-container').classList.remove('show');
    }
}

document.querySelector('.go-top-container').addEventListener('click',() =>{
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
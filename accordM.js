
document.addEventListener('DOMContentLoaded', function() {
    const accordItems = Array.from(document.querySelectorAll('.accordion li'));
    accordItems.forEach(element => {
        const label =element.querySelector('label');
        label.addEventListener('click',function(){
            element.classList.toggle('active'); 
            /* Esta parte hace que se desactiven los demas si se clickea sobre un boton
            accordItems.forEach(otherelement =>{ 
                if(otherelement!==element && otherelement.classList.contains('active')){
                    otherelement.classList.remove('active');
                }
            } ) }*/
        })
    });
    
});



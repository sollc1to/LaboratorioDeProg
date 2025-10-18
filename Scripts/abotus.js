let img = document.getElementById("imagen")

let posicion = 0;

let direccion = 1;

function mover(){

    posicion = posicion + direccion*10;
    img.style.left = posicion + "px";

    if (posicion > 1300 || posicion < 0) {
    direccion = direccion * -1; // cambia el sentido
  }

}

setInterval(mover, 10); // cada 10 milisegundos
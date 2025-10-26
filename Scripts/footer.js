// Obtener el contenedor principal del footer
const footer = document.getElementById("footer");

// Crear contenedor general
const footerContainer = document.createElement("div");
footerContainer.className = "footer-container";

//Primer div
const clase= document.createElement("div");
clase.className = "footer-about";

//Título
const titulo = document.createElement("h3");
titulo.textContent = "Sobre el proyecto";


//Parrafo q explica que es
const texto = document.createElement("p");
texto.textContent =
  "Herramienta para monitorear servidores Linux mediante SSH, desarrollada como parte de la Licenciatura en Ciencias de la Computación (3º año).";

  //Le agregamos al primer div, el texto y el titulo
clase.appendChild(titulo);
clase.appendChild(texto);

//Agregamos "clase" al contenedor general
footerContainer.appendChild(clase);


//Definimos la section redes
const redes = document.createElement("section");
redes.className = "redes";

// Imagen GitHub
const githubLogo = document.createElement("img");
githubLogo.src = "../Imagenes/github.png";
githubLogo.className = "github";

//Agregamos la imagen a "Redes"
redes.appendChild(githubLogo);

// listaF de enlaces
const listaF = document.createElement("ul");

// Enlaces de los autores
const autores = [
  { nombre: "Andrés", link: "https://github.com/andretorres077" },
  { nombre: "Teo", link: "https://github.com/Toewqr" },
  { nombre: "Marisol", link: "https://github.com/sollc1to" },
];

autores.forEach(autor => {

//Definimos cada elemento de la listaF como un enlace
  const li = document.createElement("li");
  const a = document.createElement("a");
  //Le agregamos el link, nombre, y target
  a.href = autor.link;
  a.target = "_blank";
  a.textContent = autor.nombre;
  //Agregamos a a li, y luego li a listaF
  li.appendChild(a);
  listaF.appendChild(li);
});

//Agregamos la listaF a redes, y redes al contenedor principal
redes.appendChild(listaF);
footerContainer.appendChild(redes);

//Agregamos los derechos
const derechos = document.createElement("div");
const p = document.createElement("p");
p.textContent = "© 2025 Todos los derechos reservados";
derechos.appendChild(p);
footerContainer.appendChild(derechos);

//Agregamos todo al contenedor
footer.appendChild(footerContainer);

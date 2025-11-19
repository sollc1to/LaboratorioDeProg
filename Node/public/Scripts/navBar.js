
const navBar = document.getElementById("navegador");
navBar.classList.add("navbar");

// Crear logo (izquierda)
const logo = document.createElement("img");
logo.className = "logo";
logo.src = "../Imagenes/linux.png";
navBar.appendChild(logo);

// Crear lista del menú (centro)
const lista = document.createElement("ul");
lista.className = "lista";

// Items del menú
const navItems = [
  { class: "item", href: "/", text: "Home" },
  { class: "item", href: "/About", text: "Sobre nosotros" },
];

navItems.forEach(item => {
  const li = document.createElement("li");
  li.className = item.class;
  const a = document.createElement("a");
  a.href = item.href;
  a.textContent = item.text;
  li.appendChild(a);
  lista.appendChild(li);
});

// Crear contenedor del usuario (derecha)
const userContainer = document.createElement("div");
userContainer.className = "user-container";

// Logo usuario
const usuario = document.createElement("img");
usuario.className = "usuario";
usuario.src = "../Imagenes/usuario.png";


// BOTON INGRESAR y video entran OCULTOS POR DEFECTO Y LUEGO SE VERIFICA EL LOGIN Y SE MUESTRA UNO DE LOS DOS
const ingresar = document.createElement("a");
ingresar.className = "ingresar";
ingresar.href = "/ingresar";
ingresar.textContent = "Ingresar";
ingresar.style.display="none";


const userVideo = document.createElement("video");
userVideo.className = "user-video";
userVideo.src = "../Imagenes/videoplayback1.mp4";
userVideo.autoplay = true;
userVideo.loop = true;
userVideo.muted = true;
userVideo.style.display = "none"; 


// Agregar al contenedor
userContainer.appendChild(usuario);
userContainer.appendChild(ingresar);
userContainer.appendChild(userVideo);

navBar.appendChild(lista);
navBar.appendChild(userContainer);


fetch("/auth-status")
  .then(res => res.json())
  .then(data => {
    const ingresar = document.querySelector(".ingresar");
    const userVideo = document.querySelector(".user-video");

    if (data.loginAuth) {
      ingresar.style.display = "none";
      userVideo.style.display = "block";
    } else {
      ingresar.style.display = "block";
      userVideo.style.display = "none";
    }
  });
// Obtener el contenedor principal del navbar
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
  { class: "item", href: "index.html", text: "Home" },
  { class: "item", href: "aboutus.html", text: "Sobre nosotros" },
];

// Insertar los ítems
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

// Texto "Ingresar"
const ingresar = document.createElement("a");
ingresar.className = "ingresar";
ingresar.href = "#";
ingresar.textContent = "Ingresar";

// Agregar al contenedor de usuario
userContainer.appendChild(usuario);
userContainer.appendChild(ingresar);

// Agregar lista y usuario al navbar
navBar.appendChild(lista);
navBar.appendChild(userContainer);

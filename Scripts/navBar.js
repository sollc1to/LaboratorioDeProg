// Obtener el contenedor principal del navbar
const navBar = document.getElementById("navegador");

// Crear logo
const logo = document.createElement("img");
logo.className = "logo";
logo.src = "../Imagenes/linux.png";
navBar.appendChild(logo);

// Crear lista del menú
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

navBar.appendChild(lista);
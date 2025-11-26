// Datos que definen todo el contenido de la página
const secciones = [
    {
        titulo: "Instalar el servidor SSH:",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo apt", clase: "prompt" },
                    { texto: " update", clase: "comando" }
                ]},
                { tipo: "comando", partes: [
                    { texto: "sudo apt install", clase: "prompt" },
                    { texto: " openssh-server", clase: "comando" }
                ]}
            ]
        }
    },
    {
        titulo: "Verificamos que esté funcionando:",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo", clase: "prompt" },
                    { texto: " systemctl status ", clase: "comando" },
                    { texto: "ssh", clase: "prompt" }
                ]}
            ]
        }
    },
    {
        titulo: "Si no esta activo, iniciarlo:",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo", clase: "prompt" },
                    { texto: "systemctl start ", clase: "comando" },
                    { texto: " ssh", clase: "prompt" }
                ]},
                { tipo: "comando", partes: [
                    { texto: "sudo", clase: "prompt" },
                    { texto: " systemctl ", clase: "comando" },
                    { texto: " enable ssh", clase: "prompt" }
                ]}
            ]
        }
    },
    {
        titulo: "🔒 Configuración básica de seguridad",
        tipo: "h3"
    },
    {
        titulo: "Cambiar el puerto predeterminado:",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo nano", clase: "prompt" },
                    { texto: " /etc/ssh/sshd_config", clase: "comando" }
                ]},
                { tipo: "comentario", texto: "# Cambiar: Port 22 → Port 2222" }
            ]
        }
    },
    {
        titulo: "Reiniciar el servicio:",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo", clase: "prompt" },
                    { texto: " systemctl restart ", clase: "comando" },
                    { texto: "ssh", clase: "prompt" }
                ]}
            ]
        }
    },
    {
        titulo: "🔑 Cómo conectarse",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "ssh", clase: "prompt" },
                    { texto: " usuario@direccion-ip -p puerto", clase: "comando" }
                ]},
                { tipo: "comentario", texto: "# Ejemplo: ssh miusuario@192.168.1.100 -p 22" }
            ]
        }
    },
    {
        titulo: "📋 Verificación final",
        tipo: "h3",
        terminal: {
            lineas: [
                { tipo: "comando", partes: [
                    { texto: "sudo netstat", clase: "prompt" },
                    { texto: " -tulpn | grep :22", clase: "comando" }
                ]},
                { tipo: "comentario", texto: "# Para confirmar que todo funciona:" }
            ]
        }
    }
];

// Función para crear un elemento de texto centrado
function crearTextoCentrado(texto, tipo = "h3") {
    const contenedor = document.createElement('div');
    contenedor.className = 'centrado';
    
    const elemento = document.createElement(tipo);
    elemento.textContent = texto;
    
    contenedor.appendChild(elemento);
    return contenedor;
}

// Función para crear una línea de comando
function crearLineaComando(linea) {
    const divLinea = document.createElement('div');
    divLinea.className = 'linea-comando';
    
    if (linea.tipo === "comando") {
        linea.partes.forEach(parte => {
            const span = document.createElement('span');
            span.className = parte.clase;
            span.textContent = parte.texto;
            divLinea.appendChild(span);
        });
    } else if (linea.tipo === "comentario") {
        const span = document.createElement('span');
        span.className = 'comando';
        span.style.color = '#888';
        span.textContent = linea.texto;
        divLinea.appendChild(span);
    }
    
    return divLinea;
}

// Función para crear una terminal
function crearTerminal(lineas) {
    const terminalBox = document.createElement('div');
    terminalBox.className = 'terminal-box';
    
    // Header de la terminal
    const terminalHeader = document.createElement('div');
    terminalHeader.className = 'terminal-header';
    const textoBash = document.createElement('span');
    textoBash.className = 'texto-bash';
    textoBash.textContent = 'bash';
    terminalHeader.appendChild(textoBash);
    
    // Contenido de la terminal
    const terminalContent = document.createElement('div');
    terminalContent.className = 'terminal-content';
    
    // Agregar cada línea de comando
    lineas.forEach(linea => {
        terminalContent.appendChild(crearLineaComando(linea));
    });
    
    // Ensamblar la terminal
    terminalBox.appendChild(terminalHeader);
    terminalBox.appendChild(terminalContent);
    
    return terminalBox;
}

// Función para inicializar todo el contenido
function inicializarContenido() {
    const contenedor = document.getElementById('contenido-principal');
    
    secciones.forEach(seccion => {
        // Agregar el texto centrado
        contenedor.appendChild(crearTextoCentrado(seccion.titulo, seccion.tipo));
        
        // Si la sección tiene una terminal, agregarla
        if (seccion.terminal) {
            contenedor.appendChild(crearTerminal(seccion.terminal.lineas));
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarContenido);
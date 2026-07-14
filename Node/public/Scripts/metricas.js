// metricas.js – Crea y actualiza gráficos con uPlot, maneja WebSocket
import { createCpuChart, updateCpuChart } from "./charts/CpuChart.js";
import { createRamChart, updateRamChart } from "./charts/RamChart.js";
import { createDiskChart, updateDiskChart } from "./charts/DiskChart.js";
import { createTempChart, updateTempChart } from "./charts/tempChart.js";
//metricas es el corazon de todo esto llama al socket y hace absolutamente todo el trabajo 
let activeSocket = null;
let cpuChart = null;
let ramChart = null;
let diskChart = null;
let tempChart = null;
let chartsCreated = false; // bandera para crear gráficos solo una vez

async function connectMetricsWebSocket() {
    const errorContainer = document.getElementById("error-ssh-container");
    const errorMensaje = document.getElementById("error-ssh-mensaje");
    const chartsContainer = document.getElementById("metricas-charts-container");
    const btnReintentar = document.getElementById("btn-reintentar-ssh");

    // UI inicial
    chartsContainer.style.display = "none";
    errorContainer.style.display = "block";
    errorContainer.style.backgroundColor = "#e2e3e5";
    errorContainer.style.color = "#383d41";
    errorMensaje.innerHTML = "Estableciendo conexión con el servidor remoto a través de SSH... Por favor, espera.";
    btnReintentar.style.display = "none";

    if (activeSocket) {
        try { activeSocket.close(); } catch (e) { }
        activeSocket = null;
    }

    // 1. Obtener usuario autenticado vía JWT
    let username;
    try {
        //maicena y javascript
        const resp = await fetch("/auth-status", { credentials: "same-origin" });
        if (!resp.ok) throw new Error("No autenticado");
        const data = await resp.json();
        if (!data.loginAuth || !data.user?.nombre) throw new Error("Usuario no válido");
        username = data.user.nombre;
    } catch (err) {
        errorMensaje.innerHTML = `⚠️ Error de autenticación: ${err.message}. Redirigiendo...`;
        setTimeout(() => { window.location.href = "/ingresar"; }, 2000);
        return;
    }

    // 2. Conectar WebSocket
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws/metricas?username=${encodeURIComponent(username)}`;
    const socket = new WebSocket(wsUrl);
    activeSocket = socket;

    let connectionTimeout = setTimeout(() => {
        if (socket.readyState !== WebSocket.OPEN) {
            socket.close();
            errorMensaje.innerHTML = "⏱️ El servidor no respondió a tiempo. Verifica que el backend esté corriendo.";
            btnReintentar.style.display = "inline-block";
        }
    }, 12000);

    socket.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log("WebSocket abierto, enviando start_metrics");
        socket.send("start_metrics");
        // Timeout para la respuesta de conexión SSH
        const responseTimeout = setTimeout(() => {
            if (errorContainer.style.display !== "none") {
                socket.close();
                errorMensaje.innerHTML = "⏱️ El servidor tardó demasiado en establecer la conexión SSH.";
                btnReintentar.style.display = "inline-block";
            }
        }, 10000);
        socket.responseTimer = responseTimeout;
    };

    socket.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);

            if (socket.responseTimer) clearTimeout(socket.responseTimer);

            // Manejo de comandos de terminal
            if (msg.type === "cmd_output") {
                appendToTerminal(msg.output);
                return;
            }
            if (msg.type === "cmd_error") {
                appendToTerminal(`❌ ${msg.error}`, true);
                return;
            }

            if (msg.redirect) {
                window.location.href = msg.redirect;
                return;
            }

            // ... (el resto de tu código sigue exactamente igual)
            if (msg.error === "ssh_connection_failed") {
                errorMensaje.innerHTML = `<strong>⚠️ Error de Conexión SSH:</strong><br>${msg.message}`;
                errorContainer.style.backgroundColor = "#f8d7da";
                errorContainer.style.color = "#721c24";
                btnReintentar.style.display = "inline-block";
                chartsContainer.style.display = "none";
                return;
            }
            if (msg.status === "ssh_connected") {
                // Crear gráficos solo una vez
                if (!chartsCreated) {
                    chartsCreated = true;
                    cpuChart = createCpuChart("CpuChart");
                    ramChart = createRamChart("RamChart");
                    diskChart = createDiskChart("DiskChart");
                    tempChart = createTempChart("TempChart");
                }
                errorContainer.style.display = "none";
                chartsContainer.style.display = "block";
                return;
            }
            // Actualizar métricas solo si los gráficos existen y están visibles
            if (chartsContainer.style.display === "block" && cpuChart && ramChart && diskChart && tempChart) {
                if (msg.cpu) updateCpuChart(cpuChart, msg.cpu);
                if (msg.ram) updateRamChart(ramChart, msg.ram);
                if (msg.disk) updateDiskChart(diskChart, msg.disk);
                if (msg.temp !== undefined) updateTempChart(tempChart, msg.temp);
            }
        } catch (err) {
            console.error("Error parseando mensaje WS", err);
        }
    };

    socket.onerror = (err) => {
        clearTimeout(connectionTimeout);
        errorMensaje.innerHTML = "❌ No se pudo conectar al servidor WebSocket. ¿El servidor está corriendo?";
        btnReintentar.style.display = "inline-block";
    };

    socket.onclose = () => {
        if (errorContainer.style.display !== "none" && btnReintentar.style.display === "none") {
            errorMensaje.innerHTML = "🔌 La conexión con el servidor se cerró inesperadamente.";
            btnReintentar.style.display = "inline-block";
        }
        activeSocket = null;
    };

    btnReintentar.onclick = () => {
        if (activeSocket) activeSocket.close();
        connectMetricsWebSocket();
    };
}
// ============= TERMINAL SSH =============
let terminalVisible = false;
const terminalDiv = document.getElementById('matrix-terminal');
const toggleBtn = document.getElementById('toggle-terminal');
const terminalOutput = document.getElementById('terminal-output');
const terminalInput = document.getElementById('terminal-input');

// Función para agregar texto al terminal con scroll automático
function appendToTerminal(text, isError = false) {
    const line = document.createElement('div');
    line.textContent = text;
    line.style.color = isError ? '#f44' : '#0f0';
    line.style.whiteSpace = 'pre-wrap';
    line.style.fontFamily = 'monospace';
    terminalOutput.appendChild(line);
    // Scroll infinito hacia abajo
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Enviar comando al backend vía WebSocket
function sendCommand(command) {
    if (!activeSocket || activeSocket.readyState !== WebSocket.OPEN) {
        appendToTerminal('⚠️ No hay conexión WebSocket. Reintentando...', true);
        return;
    }
    activeSocket.send(`cmd:${command}`);
    appendToTerminal(`$ ${command}`);
}

// Manejar eventos de la terminal
toggleBtn.onclick = () => {
    terminalVisible = !terminalVisible;
    terminalDiv.style.display = terminalVisible ? 'flex' : 'none';
    if (terminalVisible) terminalInput.focus();
};

terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim();
        if (cmd) {
            sendCommand(cmd);
            terminalInput.value = '';
        }
    }
});

// Hacer la ventana arrastrable 
const header = document.getElementById('terminal-header');
let isDragging = false;
let offsetX, offsetY;

header.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - terminalDiv.offsetLeft;
    offsetY = e.clientY - terminalDiv.offsetTop;
    terminalDiv.style.position = 'fixed';
    terminalDiv.style.margin = '0';
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        terminalDiv.style.left = (e.clientX - offsetX) + 'px';
        terminalDiv.style.top = (e.clientY - offsetY) + 'px';
        terminalDiv.style.right = 'auto';
        terminalDiv.style.bottom = 'auto';
    }
});
window.addEventListener('mouseup', () => isDragging = false);

document.addEventListener('DOMContentLoaded', connectMetricsWebSocket);
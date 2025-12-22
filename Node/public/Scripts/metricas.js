import { createCpuChart, updateCpuChart } from "./charts/CpuChart.js";
import { createRamChart, updateRamChart } from "./charts/RamChart.js";
import { createDiskChart, updateDiskChart } from "./charts/DiskChart.js";
import { createTempChart, updateTempChart } from "./charts/tempChart.js";

// Crear gráficos
const cpuChart = createCpuChart(document.getElementById("CpuChart").getContext("2d"));
const ramChart = createRamChart(document.getElementById("RamChart").getContext("2d"));
const diskChart = createDiskChart(document.getElementById("DiskChart").getContext("2d"));
const tempChart = createTempChart(document.getElementById("TempChart").getContext("2d"));

// Conectar websocket con username
async function connectMetricsWebSocket() {
    console.log("conectando WebSocket:");
    try {
        // Obtener usuario autenticado
        const response = await fetch("/auth-status");
        const data = await response.json();

        if (!data.loginAuth || !data.user || !data.user.nombre) {
            return;
        }

        const username = data.user.nombre;

        // Conectar WebSocket con el username
        console.log("intentando ultima conexion WebSocket:");
        const socket = new WebSocket(`ws://localhost:3000/ws/metricas?username=${encodeURIComponent(username)}`);

        socket.onopen = () => {
            console.log("WebSocket conectado, enviando start_metrics");
            socket.send("start_metrics");
        };

        socket.onmessage = (msg) => {
            const data = JSON.parse(msg.data);
           
            if (data.redirect) {
                window.location.href = data.redirect;
                return;
            }
            if (data.cpu !== undefined) updateCpuChart(cpuChart, data.cpu);
            if (data.ram !== undefined) updateRamChart(ramChart, data.ram);
            if (data.disk !== undefined) updateDiskChart(diskChart, data.disk);
            if (data.temp !== undefined) updateTempChart(tempChart, data.temp);
        };
        socket.onclose = () => {
            console.log("WebSocket cerrado");
        };

        socket.onerror = (error) => {
            console.error("Error WebSocket:", error);
        };

    } catch (error) {
        console.error("Error conectando WebSocket:", error);
    }
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', connectMetricsWebSocket);
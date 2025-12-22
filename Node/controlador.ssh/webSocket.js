const WebSocket = require("ws");
const SshClient = require("./control.ssh")
const sshUser = require("../models/user.ssh.js");

const activeSessions = new Map();

module.exports = function createMetricsWSS(server) {
    
    const wss = new WebSocket.Server({ server, path: "/ws/metricas" });

    console.log("WebSocket Server de métricas iniciado");

    wss.on("connection", async (ws, req) => {
        console.log("Nueva conexión WebSocket recibida");

        const params = new URLSearchParams(req.url.split('?')[1]);
        const username = params.get("username");
        console.log(" Usuario WebSocket:", username);

        if (!username) {
            console.log("No se proporcionó username, cerrando conexión");
            ws.close();
            return;
        }

        const sessionId = `${username}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        activeSessions.set(sessionId, {
            ws: ws,
            username: username,
            interval: null,
            client: null,
            connected: false
        });

        console.log(`Sesión creada: ${sessionId} para ${username}`);

        ws.on("message", async (message) => {
            if (message.toString() === "start_metrics") {
                console.log(`Iniciando métricas para sesión ${sessionId}`);
                await startMetrics(sessionId);
            }
        });

        ws.on("close", () => {
            console.log(`WebSocket cerrado para sesión ${sessionId}`);
            cleanupSession(sessionId);
        });

        ws.on("error", (error) => {
            console.error(`Error WebSocket para sesión ${sessionId}:`, error);
            cleanupSession(sessionId);
        });
    });

    async function startMetrics(sessionId) {
        const session = activeSessions.get(sessionId);
        if (!session) {
            console.log(`❌ Sesión ${sessionId} no encontrada`);
            return;
        }

        try {
            console.log(`📡 Cargando configuración SSH para ${session.username}`);
            
            const ssh = await sshUser.findSSH(session.username);
            if (!ssh) {
                console.log(`❌ No se encontró configuración SSH para ${session.username}`);
                session.ws.send(JSON.stringify({
                    error: "ssh_config_not_found",
                    message: "No se encontró configuración SSH"
                }));
                session.ws.close();
                return;
            }

            session.client = new SshClient();
            console.log('INTENTO DE CONEXION SSH');
            
            await session.client.connect(ssh);
            session.connected = true;
            
            console.log('CONEXION SSH ESTABLECIDA');

            session.ws.send(JSON.stringify({
                type: "ssh_connected",
                message: "Conexión SSH establecida correctamente"
            }));

            startMetricsCollection(sessionId);

        } catch (error) {
            console.error(`❌ Error iniciando métricas para sesión ${sessionId}:`, error);

            if (session.ws && session.ws.readyState === WebSocket.OPEN) {
                session.ws.send(JSON.stringify({
                    error: "ssh_connection_failed",
                    message: error.message,
                    redirect: "/"
                }));
            }

            cleanupSession(sessionId);
        }
    }

    function startMetricsCollection(sessionId) {
        const session = activeSessions.get(sessionId);
        if (!session || !session.connected) {
            console.log(`❌ Sesión ${sessionId} no conectada para métricas`);
            return;
        }

        console.log(`📊 Iniciando colección de métricas para ${sessionId}`);

        session.interval = setInterval(async () => {
            if (!session.connected || !session.client) {
                console.log(`Sesión ${sessionId} desconectada, deteniendo métricas`);
                clearInterval(session.interval);
                return;
            }

            try {
                const metrics = await getMetricsData(session.client);
                
                if (session.ws && session.ws.readyState === WebSocket.OPEN) {
                    session.ws.send(JSON.stringify({
                        type: "metrics",
                        timestamp: Date.now(),
                        ...metrics
                    }));
                }

            } catch (error) {
                console.error(`❌ Error en métricas ${sessionId}:`, error.message);
            }
        }, 2000);

        console.log(`✅ Colección de métricas iniciada para ${sessionId}`);
    }

    async function getMetricsData(client) {
        const metrics = {};
        
        try {
            console.log('Ejecutando comando CPU...');
            const cpuOutput = await client.exec(getCpuCommand());
            metrics.cpu = parseCpuOutput(cpuOutput);
        } catch (error) {
            console.error('Error CPU:', error.message);
            metrics.cpu = { cores: ['CPU 0'], usage: [0] };
        }

        try {
            console.log('💾 Ejecutando comando RAM...');
            const ramOutput = await client.exec(getRamCommand());
            metrics.ram = parseRamOutput(ramOutput);
        } catch (error) {
            console.error('❌ Error RAM:', error.message);
            metrics.ram = { used: 0, free: 100, cache: 0 };
        }

        try {
            console.log('Ejecutando comando Disk...');
            const diskOutput = await client.exec(getDiskCommand());
            metrics.disk = parseDiskOutput(diskOutput);
        } catch (error) {
            console.error('❌ Error Disk:', error.message);
            metrics.disk = { system: 0, free: 100 };
        }

        try {
            console.log('Ejecutando comando Temp...');
            const tempOutput = await client.exec(getTempCommand());
            metrics.temp = parseFloat(tempOutput) || 0;
        } catch (error) {
            console.error('❌ Error Temp:', error.message);
            metrics.temp = 0;
        }

        return metrics;
    }

    function cleanupSession(sessionId) {
        const session = activeSessions.get(sessionId);
        if (session) {
            console.log(`Limpiando sesión: ${sessionId}`);
            
            if (session.interval) {
                clearInterval(session.interval);
            }
            
            if (session.client) {
                try {
                    session.client.end();
                } catch (error) {
                    console.error(`Error desconectando cliente: ${error.message}`);
                }
            }
            
            activeSessions.delete(sessionId);
        }
    }
};

// COMANDOS ACTUALIZADOS
function getCpuCommand() {
    return `
        grep '^cpu[0-9]' /proc/stat | awk '{
            total = $2 + $3 + $4 + $5 + $6 + $7 + $8 + $9 + $10;
            idle = $5;
            usage = (1 - idle/total) * 100;
            printf "\\"%d\\": %.1f\\n", NR-1, usage
        }' | tr '\\n' ',' | sed 's/,$//' | awk '{print "{" $0 "}"}'
    `;
}

function getRamCommand() {
    return `
        free | awk 'NR==2{
            total=$2;
            used=($3/total)*100;
            free=($4/total)*100;
            cache=($6/total)*100;
            printf "{\\"used\\": %.1f, \\"free\\": %.1f, \\"cache\\": %.1f}", used, free, cache
        }'
    `;
}

function getDiskCommand() {
    return `
        # Comando disk en porcentajes - solo system y free
        df / | awk 'NR==2 {
            usage=$5;
            gsub("%","",usage);
            free=100 - usage;
            printf "{\\"system\\": %d, \\"free\\": %d}", usage, free
        }'
    `;
}

function getTempCommand() {
    return `
        cat /sys/class/thermal/thermal_zone*/temp 2>/dev/null | head -1 | awk '{if ($1 > 0) printf "%.1f", $1/1000; else print "0"}'
    `;
}

// FUNCIONES DE PARSEO ACTUALIZADAS
function parseCpuOutput(output) {
    try {
        const data = JSON.parse(output);
        return {
            cores: Object.keys(data).map(core => `CPU ${core}`),
            usage: Object.values(data)
        };
    } catch (error) {
        console.error('Error parseando CPU:', error.message);
        return { cores: ['CPU 0'], usage: [0] };
    }
}

function parseRamOutput(output) {
    try {
        return JSON.parse(output);
    } catch (error) {
        console.error('Error parseando RAM:', error.message);
        return { used: 0, free: 100, cache: 0 };
    }
}

function parseDiskOutput(output) {
    try {
        const data = JSON.parse(output);
        return {
            system: parseInt(data.system) || 0,
            free: parseInt(data.free) || 0
        };
    } catch (error) {
        console.error('Error parseando Disk:', error.message);
        return { system: 0, free: 100 };
    }
}
const WebSocket = require("ws");
const SshClient = require("./control.ssh");
const sshUser = require("../models/user.ssh.js");

const activeSessions = new Map();

module.exports = function createMetricsWSS(server) {

    const wss = new WebSocket.Server({ server, path: "/ws/metricas" });

    console.log("WebSocket Server de métricas iniciado");

    wss.on("connection", (ws, req) => {
        const params = new URLSearchParams(req.url.split('?')[1]);
        const username = params.get("username");
        if (!username) {
            ws.close(1008, "Username required");
            return;
        }

        //no me acuerdo porque hice lo de la session id encima es una forma encriptada manual 

        const sessionId = `${username}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        activeSessions.set(sessionId, { ws, username, interval: null, client: null, connected: false }); //lo de distintas sessiones era por
        // que si hubieran mas personas que 1 sola intendando entrar o ingresar a un servidor se superpone 

        ws.on("message", async (msg) => {
            const messageStr = msg.toString();

            if (messageStr === "start_metrics") {
                await startMetrics(sessionId);
            }
            // NUEVO: manejo de terminal 
            else if (messageStr.startsWith("cmd:")) {
                const command = messageStr.slice(4); // elimina "cmd:"
                const session = activeSessions.get(sessionId);
                if (session && session.connected && session.client) {
                    try {
                        const output = await session.client.exec(command);
                        ws.send(JSON.stringify({ type: "cmd_output", output: output }));
                    } catch (err) {
                        ws.send(JSON.stringify({ type: "cmd_error", error: err.message }));
                    }
                } else {
                    ws.send(JSON.stringify({ type: "cmd_error", error: "No hay conexión SSH activa o el cliente no está listo." }));
                }
            }
        });

        ws.on("close", () => {
            const session = activeSessions.get(sessionId);
            if (session) {
                if (session.interval) clearInterval(session.interval);
                if (session.client) session.client.end();
                activeSessions.delete(sessionId);
                console.log(`[WS] Sesión ${sessionId} limpiada`);
            }
        });
    });

    async function startMetrics(sessionId) {
        const session = activeSessions.get(sessionId);
        if (!session) return;

        // Limpiar intentos previos
        if (session.interval) clearInterval(session.interval);
        if (session.client) {
            try { session.client.end(); } catch (e) { }
            session.client = null;
        }
        session.connected = false;

        try {
            const sshData = await sshUser.findSSH(session.username);

            if (!sshData) {
                session.ws.send(JSON.stringify({ redirect: "/conectar" }));
                return;
            }

            console.log(`[SSH] Conectando a ${sshData.host} como ${sshData.username}`);
            const client = new SshClient();
            session.client = client;
            console.log("[DEBUG] privateKey primeras 50 chars:", sshData.privateKey.substring(0, 50));
            console.log("[DEBUG] username:", sshData.username);
            console.log("[DEBUG] host:", sshData.host);
            await client.connect({
                host: sshData.host,
                username: sshData.username,
                privateKey: sshData.privateKey,
                timeout: 18000 // aumento a 8 segundos
            });

            session.connected = true;
            session.ws.send(JSON.stringify({ status: "ssh_connected" }));

            // Envío periódico de métricas
            session.interval = setInterval(async () => {
                if (!session.connected || session.ws.readyState !== WebSocket.OPEN) {
                    clearInterval(session.interval);
                    return;
                }
                try {
                    const [cpuRaw, ramRaw, diskRaw, tempRaw] = await Promise.all([
                        client.exec(getCpuCommand()),
                        client.exec(getRamCommand()),
                        client.exec(getDiskCommand()),
                        client.exec(getTempCommand())
                    ]);
                    session.ws.send(JSON.stringify({
                        cpu: parseCpuOutput(cpuRaw),
                        ram: parseRamOutput(ramRaw),
                        disk: parseDiskOutput(diskRaw),
                        temp: parseFloat(tempRaw)
                    }));
                } catch (err) {
                    console.error("[SSH] Error ejecutando comandos:", err.message);
                    // Si falla un comando, no cerramos la sesión, solo log
                }
            }, 2000);

        } catch (sshError) {
            console.error(`[SSH] Error conectando a ${session.username}:`, sshError.message);

            let userFriendlyMessage = "";
            const errorMsg = sshError.message;


            if (errorMsg.includes("ENOTFOUND")) {
                // Extrae el nombre del host que no se encontró
                const hostMatch = errorMsg.match(/ENOTFOUND\s+(\S+)/);
                const host = hostMatch ? hostMatch[1] : "desconocido";
                userFriendlyMessage = `No se pudo encontrar el servidor "${host}". Verifica que el nombre o la IP sean correctos.`;
            }
            else if (errorMsg.includes("ECONNREFUSED")) {
                userFriendlyMessage = `El servidor remoto rechazó la conexión en el puerto SSH (posiblemente 22). ¿El servicio SSH está corriendo?`;
            }
            else if (errorMsg.includes("timed out") || errorMsg.includes("Timeout")) {
                userFriendlyMessage = `Tiempo de espera agotado. El servidor no responde. Revisa tu conexión de red.`;
            }
            else if (errorMsg.includes("authenticated")) {
                userFriendlyMessage = `Error de autenticación. Asegúrate de haber copiado la clave pública en el servidor remoto.`;
            }
            else {
                userFriendlyMessage = `Error de conexión: ${errorMsg}`;
            }

            if (session.ws.readyState === WebSocket.OPEN) {
                session.ws.send(JSON.stringify({
                    error: "ssh_connection_failed",
                    message: userFriendlyMessage
                }));
            }
        }
    }
};

// ========== COMANDOS SSH ==========
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

// ========== PARSEO ==========
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
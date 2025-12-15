const {Client} = require ('ssh2');

class sshClient {

    constructor(){
        this.ssh = new Client();
        this.connected = false;
    }

connect({ host, port = 22, username, privateKey, timeout = 5000 }) {
    return new Promise((resolve, reject) => {
        if (this.connected) return resolve();

        let timeoutId = setTimeout(() => {
            this.ssh.end();
            reject(new Error(`Timeout: no se pudo conectar a ${host}:${port}`));
        }, timeout);

        this.ssh.on('ready', () => {
            clearTimeout(timeoutId);
            this.connected = true;
            console.log('Conexion lograda');
            resolve();
        });

        this.ssh.on('error', (err) => {
            clearTimeout(timeoutId);
            reject(err);
        });

        this.ssh.connect({
            host,
            port,
            username,
            privateKey,
            readyTimeout: timeout   
        });
    });
}

    exec(comando){
        return new Promise((resolve,reject)=>{
            this.ssh.exec(comando,(err,stream)=>{
                if (err) return reject(err);
                
                let datos = '';
                let errores = '';
                
                stream.on('data',(data)=>{ 
                    datos += data.toString();
                });
                
                stream.stderr.on('data',(data)=>{
                    errores += data.toString();
                });
                
                stream.on('close', (code) => {
                    if (code === 0) {
                        resolve(datos.trim());
                    } else {
                        reject(new Error(`Comando falló (código ${code}): ${errores}`));
                    }
                });
            });
        });
    }

    end() {
        this.ssh.end();
        this.connected = false;
        console.log('Conexión SSH cerrada');
    }
}

module.exports = sshClient;
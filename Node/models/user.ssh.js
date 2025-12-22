const DBlocal = require('db-local');
const { Schema } = new DBlocal({ path: "./mongoDB" });
const { generateKeyPairSync } = require('crypto');
const SSHKeyFixer = require('./sshFixer.js'); 

const UserSSHI = Schema('UserSSHI', {
    username: { type: String, required: true },
    public_key: { type: String, required: true },
    private_key: { type: String, required: true },
    clientServerInfo: {
        type: Object, required: true,
        properties: {
            host: { type: String, required: true },
            serverName: { type: String, required: true }
        }
    }
});

class UserSshRepository {


    static async create(username, clientData) {
        try {
            const user = await UserSSHI.findOne({ username: username });

            if (!user) {

                
                
                const { publicKey, privateKey } = generateKeyPairSync('rsa', {
                    modulusLength: 2048,
                    publicKeyEncoding: {
                        type: 'pkcs1',  
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',  
                        format: 'pem'
                    }
                });

                // Guardar en la base de datos
                await UserSSHI.create({
                    username: username,
                    public_key: publicKey,
                    private_key: privateKey,
                    clientServerInfo: clientData
                }).save();

                return {
                    publicKey: publicKey,
                    privateKey: privateKey,
                    message: 'Llaves SSH generadas exitosamente'
                };

            } else {
                throw new Error('El usuario ya tiene credenciales SSH configuradas');
            }
        } catch (error) {
            throw new Error('Error creando credenciales: ' + error.message);
        }
    }
    static async findSSH(username) {
        try {
            const user = await UserSSHI.findOne({ username: username });

            if (user) {
                 const fixedPrivateKey = SSHKeyFixer.fixPrivateKey(user.private_key);
                return ({
                    host: user.clientServerInfo.host,
                    port: 22,
                    username: user.clientServerInfo.serverName,
                    privateKey: fixedPrivateKey
                });
            } else {
                return null; // ⭐ Mejor devolver null que throw error
            }
        } catch (error) {
            throw new Error('Error buscando SSH: ' + error.message);
        }
    }
}

module.exports = UserSshRepository;
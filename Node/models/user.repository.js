const DBlocal = require("db-local");
const { Schema } = new DBlocal({ path: './mongoDB' });
const crypto = require("node:crypto");
const bcrypt = require('bcrypt'); 

const User = Schema('User', {
    nombre: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true },
});

class UserRepository {

    static async create({ userName, Usermail, password }) {
        try {
            // Validaciones básicas
            if (!userName || !Usermail || !password) {
                throw new Error("Todos los campos son requeridos");
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.find({ nombre: userName });
            if (existingUser && existingUser.length > 0) {
                throw new Error("El nombre de usuario ya existe");
            }

            // Verificar si el email ya existe
            const existingEmail = await User.find({ mail: Usermail });
            if (existingEmail && existingEmail.length > 0) {
                throw new Error("El email ya está registrado");
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                nombre: userName,
                mail: Usermail,
                password: hashedPassword
            }).save();
            
            console.log("Usuario creado:", user);
            return user.nombre;

        } catch (error) {
            console.error("Error en UserRepository.create:", error);
            throw error;
        }
    }

    static async login({ userName, password }) {
        try {
            // Buscar usuario por nombre
            const users = await User.find({ nombre: userName });

            console.log("Usuarios encontrados:", users);
            
            if (users && users.length > 0) {
                const user = users[0];
                
                
                const isPasswordValid = await bcrypt.compare(password, user.password);
                
                if (isPasswordValid) {
                    return { 
                        success: true, 
                        user: users, // Devuelve el array de usuarios
                        message: "Login exitoso"
                    };
                }
            }
            
            return { 
                success: false, 
                message: "Credenciales incorrectas" 
            };
            
        } catch (error) {
            console.error("Error en UserRepository.login:", error);
            throw error;
        }
    }


    static async findById(id) {
        try {
            const user = await User.find({ _id: id }); 
            return user && user.length > 0 ? user[0] : null;
        } catch (error) {
            console.error("Error en UserRepository.findById:", error);
            throw error;
        }
    }
}

module.exports = UserRepository;
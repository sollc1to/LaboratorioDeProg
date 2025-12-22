const DBlocal = require("db-local");
const { Schema } = new DBlocal({ path: './mongoDB' });
const bcrypt = require('bcrypt'); 

const User = Schema('User', { //Se podria agregar una keySSH para cada usuario para mas seguridad al momento de acceder a un servidor por medio de ssh 
    nombre: { type: String, required: true },
    mail: { type: String, required: true },
    password: { type: String, required: true },
});

/*Para conectar un servidor ssh mediante keys primero se debe crear una key local o darle acceso a una key creada y pasarsela al usuario
una vez el usuario tenga la key debe copiarla a su carpeta /authorized_key de esta manera el servidor puede conectarse al servidor 
sin necesitar una password 
*/

class UserRepository {

    static async create({ userName, Usermail, password }) {
        try {
            // Validaciones báasicas
            if (!userName || !Usermail || !password) {
                throw new Error("Todos los campos son requeridos");
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.find({ nombre: userName }); // porque no uso findOne? 
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
            
            return ({nombre:userName,mail:Usermail});

        } catch (error) {
            console.error("Error en UserRepository.create:", error);
            throw error;
        }
    }

    static async login({ userName, password }) {
        try {
            // Buscar usuario por nombre
            const users = await User.find({ nombre: userName }); //deberia usar userfindOne pero como ya hice todos los metodos en base a un array no lo pienso cambiar
            
            if (users && users.length > 0) {
                const user = users[0];
                
                const isPasswordValid = await bcrypt.compare(password, user.password);
                
                if (isPasswordValid) {
                    return { 
                        success: true, 
                        user: users, // Devuelve el array de usuarios porque no use findOne
                        message: "Login exitoso"
                    };
                }
            }
            
            return { 
                message: "Credenciales incorrectas" 
            };
            
        } catch (error) {
            console.error("Error en UserRepository.login:", error);
            throw error;
        }
    }


}

module.exports = UserRepository;
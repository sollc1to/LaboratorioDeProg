
const DBlocal = require("db-local"); //Pequeña base local que simula una base real dejando utilizar metodos 
const { Schema } = new DBlocal({ path: './mongoDB' }); // se estrae el Schema de los datos que van a guardarse en DbLocal 

const User = Schema('User', { // crea un “modelo” de entidad llamada User, con campos y tipos.
                              //este Schema se llama user y puede usar create find save y demas siempre respetando como esta formado {Nombre mail y contraseña }
    nombre: { type: String, required: true },
    mail: { type: String, required: true },
    contraseña: { type: String, required: true },
    
});

//Se deben hacer verificaciones de todo tipo como longitud trim y demas para los datos de usuario 
//Debo buscar algun metodo para encriptar las contraseñas y deamas 

class UserRepository {

    static Validacion(datosUser){

    }

    static async create({ userName, Usermail, password }) {
        try {
            const user = await User.create({ //te prometo que creo el usuario pa
                nombre: userName,
                mail: Usermail,
                contraseña: password
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
            // Buscar usuario por nombre y contraseña
            const users = await User.find({   //te prometo que encuentro el usuario pa
                nombre: userName, 
                contraseña: password 
            });
            
            console.log("Usuarios encontrados:", users);
            
            if (users && users.length > 0) {
                return { 
                    success: true, 
                    user: users[0],
                    message: "Login exitoso" 
                };
            } else {
                return { 
                    success: false, 
                    message: "Credenciales incorrectas" 
                };
            }
        } catch (error) {
            console.error("Error en UserRepository.login:", error);
            throw error;
        }
    }
}

// 
module.exports = UserRepository;
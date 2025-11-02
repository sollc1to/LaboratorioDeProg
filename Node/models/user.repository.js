
const DBlocal = require("db-local"); //Pequeña base local que simula una base real dejando utilizar metodos 
const { Schema } = new DBlocal({ path: './mongoDB' }); // se estrae el Schema de los datos que van a guardarse en DbLocal 
const crypto =require("node:crypto");
const bcryp= require('bcrypt');

const User = Schema('User', { // crea un “modelo” de entidad llamada User, con campos y tipos.
                              //este Schema se llama user y puede usar create find save y demas siempre respetando como esta formado {Nombre mail y contraseña }
    nombre: { type: String, required: true },
    mail: { type: String, required: true },
    contraseña: { type: String, required: true },
    
});

//ya tengo mi usuario el tema es que necesito una sesion activa como la haga ? JSON WEB TOKEN sirve para hacer transacciones de forma segura entre dos partes /mandar sesion
//la idea con el token es que se le puede poner tiempo de expiracion y luego crear un token de refresh 
//Se deben hacer verificaciones de todo tipo como longitud trim y demas para los datos de usuario 
//Debo buscar algun metodo para encriptar las contraseñas y deamas 

class UserRepository {

    static Validacion(datosUser){
        //estaria bueno que se hiciera una validacion para login y create 

    }

    static async create({ userName, Usermail, password }) {
        try {
            //puede hacerse con has o hashsync : la funcion hash devuelve una promesa 
            const hasPassword = await bcryp.hash(password,10); // el numero 3 es la cantidad de vueltas que se hace para codificar mientras mayor es mas protegido pero tarda mas
            const user = await User.create({ //te prometo que creo el usuario pa
                nombre: userName,
                mail: Usermail,
                contraseña: hasPassword
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
                nombre: userName
            });

              const isPasswordValid = await bcrypt.compare(password, user.contraseña);
            
            console.log("Usuarios encontrados:", users);
            
            if (users && users.length > 0 && isPasswordValid) {
                return { 
                    success: true, 
                    user: users,
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
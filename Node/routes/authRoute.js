require('dotenv').config();
const express = require("express");
const path = require('path');
const router = express.Router();
const UserRepository = require('../models/user.repository.js'); // Importación corregida

const cookie = require('cookie-parser');
const jsw = require('jsonwebtoken');
const strict = require('assert/strict');
const { token } = require('morgan');

// SUPER IMPORTANTE PARA PENSAR 
//tal vez deberia meter todo aca nomas o hacer este el router supremo y que pueda usar los demas router asi me ahorro de andar importando dependencias en cada ruta.js 

router.use(express.json());
router.use(cookie());

router.use(async (req, res, next) => { // esto estaria bueno meterlo en el repositoruo de rutas asi todos lo tiene y puedo acceder al token de una todo el tiempo 
    try {
        const token = req.cookies.access_token;
        
        // Inicializar req.user como null
        req.user = null;
        
        if (token) {  //si no pones nada si el obj no es null lo toma como true 

            const data = await jsw.verify(token, process.env.SECRET_JWT_KEY);
            req.user = data;  
        }
        
        next(); // Continuar
        
    } catch (error) {
       
        req.user = null;
        next();
    }
});

router.get("/ingresar", function(req, resp){
    resp.sendFile(path.join(__dirname, '../public/Páginas/ingresar.html'));
});

router.get("/registrarse", function(req, resp){
    resp.sendFile(path.join(__dirname, '../public/Páginas/registrarse.html'));
});

router.post("/registrarse", async (req, resp) => {
    const { usuario, email, password, fecha } = req.body;
    try {
        const nombreUsuario = await UserRepository.create({
            userName: usuario,
            Usermail: email,
            password: password
        });
        
        resp.json({ // Muesta en formato jsaon lo que tengo en el registro o lo que registre
            success: true, 
            message: `Usuario ${nombreUsuario} creado exitosamente` 
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        resp.status(500).json({ 
            success: false, 
            message: "Error al crear el usuario" 
        });
    }
});

router.post("/loginusuario", async (req, resp) => {
    const { usuario, password } = req.body;
    
    console.log("Datos recibidos para login:", { usuario, password });
    
    try {
        const result = await UserRepository.login({
            userName: usuario,
            password: password
        });
        
        if (result.success) {
            const token = jsw.sign(user,process.env.SECRET_JWT_KEY,{expiresIn: '1h'});
           
            resp //la respuesta tiene una cookie y lo que envie 
            .cookie('access_token',token,{
                httpOnly: true, //la cookie solo se puede acceder desde el servidor no se puede leer del cliente o js
                sameSite:'strict', //solo se puede acceder desde el mismo dominio
                maxAge:1000*60*60 //tiempo de la cookie 1h

            })
            .send({ 
                user: result.nombreUser,
                //porque no envio el token aca? porque viaja en la cookie y siempre se puede acceder 
                //deberia redirigir a home con la sesion iniciada o estar protegido 
            });
  
        } else {
            resp.status(401).json({ 
                success: false, 
                message: result.message 
            });
        }
    } catch (error) {
        console.error("Error en login:", error);
        resp.status(500).json({ 
            success: false, 
            message: "Error en el servidor durante el login" 
        });
    }
});

router.get('/protected',async(req,resp)=>{
    const {user} = req.user;
    //siempre tengo user asi que con eso veo que hago puedo mandarlo o fijarme si esta logea2 y hacer algo como redirigir  
    resp.send("pagina",user)
})

module.exports =router;
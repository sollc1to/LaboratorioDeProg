const express = require("express");
const path = require('path');
const router = express.Router();
const UserRepository = require('../models/user.repository.js'); // Importación corregida

router.use(express.json());

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
            resp.json({ 
                success: true, 
                message: "Login exitoso",
                user: result.user
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

module.exports =router;

const express = require("express");
const path = require('path');
const router = express.Router();
const UserRepository = require('../models/user.repository.js');
const jwt = require('jsonwebtoken');
const { requireAuth, requireNoAuth } = require('../middleware/authMiddleware');

// NO AUTH
router.get("/ingresar", requireNoAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Páginas/ingresar.html'));
});

router.get("/registrarse", requireNoAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Páginas/registrarse.html'));
});

router.get("/conectar", requireNoAuth, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/Páginas/conectar.html'));
});

// REGISTRO - NO AUTH
router.post("/registrarse", requireNoAuth, async (req, res) => {
    const { usuario, email, password } = req.body; 
    
    try {
        // Validaciones básicas
        if (!usuario || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        const nombreUsuario = await UserRepository.create({
            userName: usuario,
            Usermail: email,
            password: password
        });
        
        res.json({
            success: true, 
            message: `Usuario ${nombreUsuario} creado exitosamente` 
        });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error al crear el usuario" 
        });
    }
});

// LOGIN - NO AUTH
router.post("/loginusuario", requireNoAuth, async (req, res) => {
    
    try {
        const { usuario, password } = await req.body;
    
    console.log("Datos recibidos para login:", { usuario, password });
    
        const result = await UserRepository.login({
            userName: usuario,
            password: password
        });
        
        if (result.success) {
            
            const user = result.user[0]; 
            
            // Datos que irán en el token JWT
            const userData = {
                id: user._id , 
                userName: user.nombre,
                email: user.mail
            };
            
            const token = jwt.sign(userData, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });
           
            res
            .cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 // 1 hora
            })
            .redirect('/'); // existe este comando magico antes trate de hacer esto 

            /*.cookie('access_token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 // 1 hora }) 
            // .json({ success: true, user: user.nombre, message: 'Login exitoso' }) el .json termina la respuesta por lo que sednfile nunca se ejecutaba y solo mandaba el json
            // .sendFile(path.join(__dirname,'../public/index.html')); */
  
        } else {
            res.status(401).json({ 
                success: false, 
                message: result.message 
            });
        }
    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error en el servidor durante el login" 
        });
    }
});

// RUTA PROTEGIDA - UN LOGIN COMO LA GENTE O UN INDEX DISTINTO ALGO
router.get('/protected', requireAuth, (req, res) => {
    res.json({
        message: 'Acceso a ruta protegida exitoso',
        user: req.user // Contiene { id, userName, email }
    });
});

// LOGOUT - IN PROGRESS JUASJUAS
router.post("/logout", (req, res) => {
    res.clearCookie('access_token')
       .json({ success: true, message: 'Logout exitoso' });
});

module.exports = router;
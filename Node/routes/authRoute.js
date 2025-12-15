
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

// REGISTRO - NO AUTH
router.post("/registrarse", requireNoAuth, async (req, res) => {
   
    try {
        const { usuario, email, password } = req.body;
        if (!usuario || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos"
            });
        }

        const user = await UserRepository.create({
            userName: usuario,
            Usermail: email,
            password: password
        });

        // porque no guardo la password?

        const userData = {  //En tokens se utiliza nombre y email 
            nombre: user.nombre,
            email: user.mail
        };

        const token = jwt.sign(userData, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });
        res
            .cookie('access_token', token, {
                httpOnly: true,
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 // 1 hora
            })
            .redirect('/');

    } catch (error) {
        console.error("Error al crear usuario:", error);
        return res.status(500).json({
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
            // Datos que irán en el token JWT y tambien podria mandar directamente el obj usuario es mas seguro mandar datos no relevantes como la contrasenia 
            const userData = { //En tokens de login se utiliza nombre, email e id 
                id: user._id,
                nombre: user.nombre,
                email: user.mail
            };

            const token = jwt.sign(userData, process.env.SECRET_JWT_KEY, { expiresIn: '1h' });
            
            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 // 1 hora
                })
                .redirect('/');

        } else {
            res.status(401).json({  // no deberia mandar siempre esto mas bien personalizar un pag de error pero bueno el status puede variar de 200 a 500 
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



// LOGOUT - IN PROGRESS JUASJUAS
router.post("/logout", (req, res) => {
    res.clearCookie('access_token')
        .json({ success: true, message: 'Logout exitoso' });
});

module.exports = router;
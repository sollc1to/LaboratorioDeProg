const express = require("express");
const path = require('path');
const router = express.Router();
const { requireAuth, requireNoAuth } = require('../middleware/authMiddleware');
const UserSshRepository = require('../models/user.ssh.js');

router.use(express.json());

//Muestran cosas privadas como las metricas pero primero se debe autentificar la conexion 
//Como conectar un servidor

router.get("/conectar", requireAuth, async (req, resp) => { 
     try {
          const user = req.user.nombre; //username mail

          
          const ssh = await UserSshRepository.findSSH(user);
          
          if (ssh) {
               resp.sendFile(path.join(__dirname, '../public/Páginas/estadisticas.html'));
          } else {
               resp.sendFile(path.join(__dirname, '../public/Páginas/conectar.html'));
          }

     } catch (error) {
          console.error('Error en /conectar:', error);
          resp.status(500).send('Error interno del servidor');
     }
});

router.post("/sshConect", requireAuth, async (req, res) => {
    try {
        const username = req.user.nombre; 
        const { host, usuario: serverName } = req.body;

        // Validación básica
        if (!host || !serverName) {
            return res.redirect('/conectar?error=missing_fields');
        }

        // Crear configuración
        const clientData = {
            host: host,
            serverName: serverName
        };

        // Guardar en base de datos
        await UserSshRepository.create(username, clientData);

        // Redirigir directamente a estadísticas      
        res.redirect('/conectar');

    } catch (error) {
        console.error('Error en sshConect:', error);
        // Redirigir con error
        res.redirect('/conectar?error=server_error');
    }
});



module.exports = router;
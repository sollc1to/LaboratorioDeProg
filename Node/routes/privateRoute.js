const express = require("express");
const path = require('path');
const router = express.Router();

//Muestran cosas privadas como las metricas pero primero se debe autentificar la conexion 
//Como conectar un servidor

router.get("/conectar", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/conectar.html'));
});

router.post("rita de accion de conectar",async(req,resp)=>{
//deberia ir todo lo que sea para verificar el conectar del servidor y el usuario
})

//las añado pero no deberian ir aca 
router.get("/estadisticas", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/estadisticas.html'));
});

//todavia estoy viendo lo de estadistica porque no se como hacer para conectar un servidor externo y hacer que este mandando metricas/valores.json a nuestro servidor y pasarlo


module.exports = router;
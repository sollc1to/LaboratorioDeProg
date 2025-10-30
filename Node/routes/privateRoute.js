const express = require("express");
const path = require('path');
const router = express.Router();

router.use(express.json());

//Muestran cosas privadas como las metricas pero primero se debe autentificar la conexion 
//Como conectar un servidor

router.get("/conectar", function(req, resp){ //falta el post para la conexion 
     resp.sendFile(path.join(__dirname, '../public/Páginas/conectar.html'));
});

//las añado pero no deberian ir aca 
router.get("/estadisticas", function(req, resp){  //aca deberia ser mas bien el post una vez que se conecte el usuario la accion de conectar del formulario conectar deberia dar a metricas
     resp.sendFile(path.join(__dirname, '../public/Páginas/estadisticas.html'));
});

router.get("/protegido",function(req,resp){
//deberia ser una ruta para la sesion iniciada del usuario /tambien debo tener una para el logOut
})



//todavia estoy viendo lo de estadistica porque no se como hacer para conectar un servidor externo y hacer que este mandando metricas/valores.json a nuestro servidor y pasarlo


module.exports = router;
const express = require("express");
const path = require('path');
const router = express.Router();

//raiz de la pagina
router.get("/", function(req, resp){
    resp.sendFile(path.join(__dirname, '../public/Páginas/index.html'));
});

//Sobre nosotros
router.get("/About", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/aboutus.html'));
});

//Como conectar un servidor
router.get("/conectar", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/conectar.html'));
});

//ingresar usuario
router.get("/ingresar", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/ingresar.html'));
});

//Tutorial para abrir el servidor
router.get("/tutorial", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/tutorial.html'));
});

router.get("/saberMas", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/sabermas.html'));
});
//las añado pero no deberian ir aca 
router.get("/estadisticas", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/estadisticas.html'));
});

router.get("/registrarse", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/registrarse.html'));
});

module.exports = router;
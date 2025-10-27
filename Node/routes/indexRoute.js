const express = require("express");
const path = require('path');
const router = express.Router();

//Contenido estatico que puede mostrarse independientemente sin necesidad de autentificar o conectar 
//raiz de la pagina

router.get("/", function(req, resp){
    resp.sendFile(path.join(__dirname, '../public/Páginas/index.html')); //el sendFile sirve para mandar una vista esto muestra el html con el css y js si es que se tiene acceso a public
});
//Sobre nosotros
router.get("/About", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/aboutus.html'));
});

//Tutorial para abrir el servidor
router.get("/tutorial", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/tutorial.html'));
});
//Mas ?*
router.get("/saberMas", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/sabermas.html'));
});

module.exports = router;
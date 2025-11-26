const express = require("express");
const path = require('path');
const router = express.Router();



router.use(express.json());


//Contenido estatico que puede mostrarse independientemente sin necesidad de autentificar o conectar 
//raiz de la pagina

router.get("/auth-status",(req,resp)=>{ // esto es para comunicarse con el html ya que este puede pedir auth-status mediante un fetch 
     resp.json({
          loginAuth:!!req.user, //esto es para probar si desaparece ingresar pero realmente se tiene que sacar del req o u hacer un metodo 
          user:req.user
     })
})

router.get("/", function(req, resp){

     //deberia leer la cookie y si tiene token iniciarle sesion podria cambiar algo en el html o el icono sacarle el iniciar sesion 
    resp.sendFile(path.join(__dirname, '../public/Páginas/index.html')); //el sendFile sirve para mandar una vista esto muestra el html con el css y js si es que se tiene acceso a public
});
//Sobre nosotros
router.get("/About", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/aboutus.html'));
});

//Tutorial para abrir el servidor
router.get("/tutorial", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/tutorialFINAL.html'));
});
//Mas ?*
router.get("/saberMas", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/sabermas.html'));
});

module.exports = router;
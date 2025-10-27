 const express = require("express");
 const path = require('path');
 const router = express.Router();

//Las siguientes rutas redirijen y controlan la autentificacion del usuario o registro
//ingresar usuario

 router.get("/ingresar", function(req, resp){
      resp.sendFile(path.join(__dirname, '../public/Páginas/ingresar.html'));
 });

 router.post("ACA DEBE IR LA RUTA DE LA ACCION",async(req,resp)=>{
    //logica para pediry autentificar un usuario


 });

 router.get("/registrarse", function(req, resp){
     resp.sendFile(path.join(__dirname, '../public/Páginas/registrarse.html'));
});

router.post("ACA DEBE IR LA RUTA DE ACCION", async(req,resp)=>{
    //aca deberia verificar los datos y ver si se puede crear mandando a la pagina principal logea2 

});

module.exports = router;
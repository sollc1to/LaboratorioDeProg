require('dotenv').config();
const express = require('express');
const app = express(); //servidor 
const path = require('path');
const port = 3000 ; // puerto donde la app escucha 


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const index = require('./routes/indexRoute.js');
const authRoutes = require('./routes/authRoute.js');
//con use o get por ejemplo se piden ciertas cosas en este caso se pide la ruta / y la funcion que quiero que utilice en este caso index
app.use("/",index);
app.use("/",authRoutes);


const PORT = process.env.PORT || 3000;

app.listen(port, () => { //Recibe el puerto y hace un callBack 
  console.log(`Example app listening on port ${port}`);
});
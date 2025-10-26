require('dotenv').config();
const express = require('express');
const app = express(); //servidor 
const path = require('path');
const port = 3000 ; // puerto donde la app escucha 


app.use(express.static(path.join(__dirname, 'public')));

const index = require('./routes/indexRoute.js');

app.use("/",index);


const PORT = process.env.port || 3000;

app.listen(port, () => { //Recibe el puerto y hace un callBack 
  console.log(`Example app listening on port ${port}`);
});
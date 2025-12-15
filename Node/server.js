require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { authMiddleware } = require('./middleware/authMiddleware'); 
const WebSocket = require("ws");

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authMiddleware);


const indexRoutes = require('./routes/indexRoute.js');
const authRoutes = require('./routes/authRoute.js');
const privateRoutes = require ('./routes/privateRoute.js');

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/",privateRoutes);


const server = app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

const createMetricsWSS = require('./controlador.ssh/webSocket.js'); // Ajusta la ruta
createMetricsWSS(server);
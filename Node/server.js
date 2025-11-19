require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const { authMiddleware } = require('./middleware/authMiddleware'); // Importar middleware

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Middlewares globales (orden importante)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); //  Cookie parser GLOBAL TODOS TIENEN COOKIES :D
app.use(authMiddleware); //  Middleware de auth GLOBAL - TODAS las rutas tendrán req.user

// Importar rutas
const indexRoutes = require('./routes/indexRoute.js');
const authRoutes = require('./routes/authRoute.js');

// Usar rutas
app.use("/", indexRoutes);
app.use("/", authRoutes);
console.log("JWT key:", process.env.SECRET_JWT_KEY);
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
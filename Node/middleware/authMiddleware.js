const jwt = require('jsonwebtoken');

/*Las funciones de middleware son funciones que tienen acceso al objeto de solicitud (req), al objeto de respuesta (res) y a la siguiente función de middleware en el ciclo de solicitud/respuestas de la aplicación. La siguiente función de middleware se denota normalmente con una variable denominada next.
Las funciones de middleware pueden realizar las siguientes tareas:
Execute any code.
Realizar cambios en la solicitud y los objetos de respuesta.
Finalizar el ciclo de solicitud/respuestas.
Invocar el siguiente middleware en la pila.
Si la función de middleware actual no finaliza el ciclo de solicitud/respuestas, debe invocar next() para pasar el control a la siguiente función de middleware. Otherwise, the request will be left hanging.*/
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        req.user = null;

        if (token) {
            const data = await jwt.verify(token, process.env.SECRET_JWT_KEY);
            req.user = data;
        }

        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

// Middleware opcional para rutas que REQUIEREN autenticación
const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'NO esta autentificado' });
    }
    next();
};

// Middleware para rutas que solo deben ser accedidas por NO autenticados
const requireNoAuth = (req, res, next) => {
    if (req.user) {
        return res.status(403).json({ error: 'Ya se autentifico el usuario' });
    }
    next();
};

module.exports = {
    authMiddleware,
    requireAuth,
    requireNoAuth
};
require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        console.log("Contenido petición: ", req)
        console.log("Cookies petición: ", req.cookies)
        console.log("encabezados petición: ", req.headers)
        const token = req.cookies['AWFS-token'];
        if (!token) {
            return res.status(401).json({ message: 'No autorizado: No hay token' });
        }

        const decoded = jwt.verify(token, process.env.BACKEND_JWT_SECRET); // Cuando no es válido se genera un error. Por eso el try-catch
        req.decodedDataInToken = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'No autorizado: Token no válido' });
    }
};

module.exports = verifyToken;
require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
    try {
        console.log("\n\n\n***************************************************************************\nCOOKIES CUERPO PETICIÓN\n***************************************************************************\n\n\n")
        console.log(req.cookies)
        // console.log("Cookie recibida:")
        // console.log(req.cookies['AWFS-token'])
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
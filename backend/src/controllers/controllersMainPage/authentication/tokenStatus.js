require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const jwt = require("jsonwebtoken");

const tokenStatus = async (req, res) => {
    const token = req.cookies['AWFS-token'];
    if (!token) {
        return res.status(401).json({ message: 'No autorizado: No hay token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.BACKEND_JWT_SECRET); // Cuando no es válido se genera un error. Por eso el try-catch
        const data = {
            _id: decoded._id,
            name: decoded.name,
            userType: decoded.userType,
            profilePicture: decoded?.profilePicture
        };
        return res.status(200).json({ message: 'Token válido', data: data });
    } catch (err) {
        return res.status(401).json({ message: 'No autorizado: Token no válido' });
    }

}

module.exports = tokenStatus
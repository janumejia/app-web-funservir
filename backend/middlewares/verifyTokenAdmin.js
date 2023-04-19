const jwt = require("jsonwebtoken");

const verifyTokenAdmin = async (req, res, next) => {
  const token = req.headers["token"];

  if (token) {
    jwt.verify(token, process.env.BACKEND_JWT_SECRET, (error, data) => {
      if (error) return res.status(401).json({ message: "Token inválido" });
      else {
        if(data.userType !== 'Administrador' && data.userType !== 'A') return res.status(403).json({ message: "Debes ser administrador" });
        else{
          req.user = data;
          next();
        }
      }
    });
  } else {
    res.status(401).json({ message: "Debes enviar un token" });
  }
};

module.exports = verifyTokenAdmin;
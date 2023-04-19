const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const token = req.headers["token"];

  if (token) {
    jwt.verify(token, process.env.BACKEND_JWT_SECRET, (error, data) => {
      if (error) return res.status(401).json({ message: "Token inválido" });
      else {
        req.user = data;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Debes enviar un token" });
  }
};

module.exports = verifyToken;
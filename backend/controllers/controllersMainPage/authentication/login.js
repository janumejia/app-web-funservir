require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const bcrypt = require("bcryptjs") // Toca bcryptjs porque la version pura de javascript, en cambio bcrypt require de python
const User = require("../../../model/user")
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    const { email, password } = req.body
    
    User.findOne({ email }).then((user) => {
        if (user) {
            /* Vamos a comparar la contraseña del body con la contraseña que está en la BD */
            bcrypt.compare(password, user.password) // Retorna un booleano sobre si coincide la contraseña
                .then((isCorrect) => {
                    if (isCorrect) {
                        const { _id, name, userType, profilePicture } = user
                        const data = {
                            _id,
                            name,
                            userType,
                            profilePicture
                        };
                        const token = jwt.sign(data, process.env.JWT_SECRET, { //revisar el método "sign"
                            expiresIn: 86400 /* 24hs */,
                        });
                        
                        res
                        .cookie("AWFS-token", token, { httpOnly: true, sameSite: "strict" }) // Enviamos el token como una cookie, y con la propiedad httpOnly. Basado en: https://medium.com/@zahedialfurquan20/using-cookies-to-store-jwt-for-authentication-and-authorization-in-a-mern-stack-app-a58d7a5d6b6e
                        .json({
                            message: "Usuario autenticado correctamente",
                            data: data
                        })

                    } else {
                        res.status(401).json({ message: "Correo y/o contraseña incorrecta", user:{}})
                    }
                })
        }else{
            res.status(401).json({ message: "Correo y/o contraseña incorrecta", user:{}})
        }
    })
}


module.exports = login
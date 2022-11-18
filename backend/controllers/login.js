require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const bcrypt = require("bcryptjs") // Toca bcryptjs porque la version pura de javascript, en cambio bcrypt require de python
const User = require("../model/user")
const jwt = require("jsonwebtoken");


const login = async (req, res) => {
    const { email, password } = req.body
    
    User.findOne({ email }).then((user) => {
        if (user) {
            /* Vamos a comparar la contraseña del body con la contraseña que está en la BD */
            bcrypt.compare(password, user.password) // Retorna un booleano sobre si coincide la contraseña
                .then((isCorrect) => {
                    if (isCorrect) {
                        const { id, name, userType } = user
                        const data = {
                            id,
                            name,
                        };
                        const token = jwt.sign(data, process.env.JWT_SECRET, { //revisar el método "sign"
                            expiresIn: 86400 /* 24hs */,
                        });
                        
                        res.json({
                            message: "Usuario autenticado correctamente",
                            user: { token, name, userType}
                        })
                    } else {
                        res.json({ message: "Correo o contraseña incorrecta", user:{}})
                    }
                })
        }else{
            res.json({ message: "Correo o contraseña incorrecta", user:{}})
        }
    })
}


module.exports = login
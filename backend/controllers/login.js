const bcrypt = require("bcryptjs") // Toca bcryptjs porque la version pura de javascript, en cambio bcrypt require de python
const User = require("../model/user")
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    const { email, password } = req.body
    
    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.json({ message: "Correo no encontrado" })
        } else {
            /* Vamos a comparar la contraseña del body con la contraseña que está en la BD */
            bcrypt.compare(password, user.password) // Retorna un booleano sobre si coincide la contraseña
                .then((isCorrect) => {
                    if (isCorrect) {
                        const { id, name } = user

                        const data = {
                            id,
                            name,
                        };

                        const token = jwt.sign(data, "secreto", {
                            expiresIn: 86400 /* 24hs */,
                        });

                        res.json({
                            message: "Usuario autenticado correctamente",
                            user: {
                                id,
                                name,
                                token,
                            }
                        })
                    } else {
                        res.json({ message: "Contraseña incorrecta" })
                    }
                })
        }
    })
}

module.exports = login
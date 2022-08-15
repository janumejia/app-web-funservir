require('dotenv').config({ path: '.env' })  // Para traer las variables de entorno
const bcrypt = require("bcryptjs") // Para cifrar las contraseñas
const User = require("../model/user") // Traemos el esquema del usuario

const register = async (req, res) => {
    const { name, email, password, edad, sexo, direccion, discapacidad, tutor, fundacion, userType } = req.body

    // Comprobamos si ya existe un usuario con ese correo 
    User.findOne({ email })
        .then((user) => { // Si todo sale bien...
            if (user) {
                return res.json({ message: "Ya existe un usuario con ese correo" })
            } else if (!name || !email || !password || !edad || !sexo || !direccion || !discapacidad || !fundacion) { // Si hay algún campo vació
                return res.json({ message: "Debes completar todos los campos" })
            } else { // Si no existe un usuario con ese email
                bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT) , (error, hashPassword) => { // Genera el hash de la contraseña ingresada
                    if (error) res.json({ error })
                    else {
                        const newUser = new User({
                            name,
                            email,
                            password: hashPassword,
                            edad,
                            sexo,
                            direccion,
                            discapacidad,
                            tutor,
                            fundacion,
                            userType
                        })
                        newUser.save()
                            .then((user) => { // Si todo sale bien...
                                res.json({ message: "Usuario creado correctamente", user })
                            })
                            .catch((error) => console.error(error))
                    }
                })
            }
        })
}

module.exports = register
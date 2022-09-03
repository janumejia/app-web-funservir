const User = require("../../model/user")
const bcrypt = require("bcryptjs")
const addUser = async (req, res) => {

    const { name, email, password, edad, sexo, direccion, discapacidad, tutor, fundacion, userType } = req.body;
    User.findOne({ email }).then((element) => {
        if (!element) {
            if (name && email && edad && sexo && password && direccion && (tutor===true || tutor===false) && fundacion && userType) {
                bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT), (error, hashPassword) => { // Genera el hash de la contraseña ingresada
                    if (error) res.json({ error })
                    else {
                        const newUser = new User({
                            name, email, password: hashPassword, edad, sexo, direccion, discapacidad, tutor, fundacion, userType
                        })
                        newUser.save().then((element) => { // Si todo sale bien...
                            res.json({ message: "Usuario creado correctamente", element })
                        })
                            .catch((error) => console.error(error))
                    }
                })
            }
        } else {
            res.json({ message: "Error" })
        }
    })
}

module.exports = addUser
const bcrypt = require("bcrypt") // Para cifrar las contraseñas
const User = require("../model/user")

const register = async (req, res) => {
    const {name, email, password} = req.body

    // console.log(`Entra a ruta /register`)
    // Comprobamos si ya existe un usuario con ese correo 
    User.findOne({email})
    .then((user) => {
        if(user){
            return res.json({message: "Ya existe un usuario con ese correo"})
        } else if(!name || !email || !password){
            return res.json({message: "Debes completar todos los campos"})
        } else{
            bcrypt.hash(password, 10, (error, hashPassword) => {
                if(error) res.json({ error })
                else{
                    const newUser = new User({
                        name,
                        email,
                        password: hashPassword,
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
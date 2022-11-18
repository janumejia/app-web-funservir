const User = require("../../model/user")
const bcrypt = require("bcryptjs")
const addUser = async (req, res) => {

    const { name, lastName, email, password, age, gender, address, condition, isCaregiver, institution, userType } = req.body;
    User.findOne({ email }).then((element) => {
        if (!element) {
            if (name && lastName && email && age && gender && password && address && isCaregiver && userType) {
                bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT), (error, hashPassword) => { // Genera el hash de la contraseña ingresada
                    if (error) res.json({ error })
                    else {
                        const newUser = new User({
                            name, 
                            lastName,
                            email, 
                            password: hashPassword, 
                            age, 
                            gender, 
                            address, 
                            condition, 
                            isCaregiver, 
                            institution, 
                            userType
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
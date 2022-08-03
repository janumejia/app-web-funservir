require('dotenv').config({ path: '.env' })
const User = require("../../model/user")
const bcrypt = require("bcryptjs")
const editUser = async (req, res) => { //En la primera versión se mandará el usuario a editar, cuando esté el front, esto puede que cambie.

    const { email, ...resto } = req.body;
    const query = { email: email };
    bcrypt.hash(resto.password, parseInt(process.env.SALT_BCRYPT), async (error, hashPassword) => { // Genera el hash de la contraseña ingresada
        if (error) res.json({ error })
        else {
            const update = {
                name: resto.name,
                email: resto.email,
                password: hashPassword,
                edad: resto.edad,
                sexo: resto.sexo,
                direccion: resto.direccion,
                tutor: resto.tutor,
                fundacion: resto.fundacion,
                userType: resto.userType
            }
           await User.findOneAndUpdate(query, update);
        }
    })
    let ans = await User.findOne(query);
    res.json(ans);
}

module.exports = editUser
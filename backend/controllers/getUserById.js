const User = require("../model/user") // Traemos el esquema del usuarios

const getUserById = async (req, res) => {
    const { id } = req.user

    if (id.length === 24) { // Debe ser de 24 porque este es el tamaño del id que crea mongo
        User.findById(id).then((user) => { // Si todo sale bien ... vamos a recibir un usuario
            if (!user) { // Si no hay usuario
                res.json({ mensaje: "No se ha encontrado esa ID" })
            } else {
                const { _id, password, _v, ...resto } = user._doc
                res.json(resto)
            }
        })
    } else {
        res.json({ mensaje: "Estas enviando un ID incorrecto" })
    }
}

module.exports = getUserById
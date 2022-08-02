require('dotenv').config({ path: '.env' })
const User = require("../../model/user")
const bcrypt = require("bcryptjs") // Para cifrar las contraseñas

const editUser = async (req, res) => { //En la primera versión se mandará el usuario a editar, cuando esté el front, esto puede que cambie.
    const { name, email, password, edad, sexo, direccion, discapacidad, tutor, fundacion, userType } = req.body;

    // Falta validar que tiene la sesión activa y que solo ese usuario pueda modificar sus datos, no los de otros

    // Para actualizar los datos, buscará por el email (El email sirve como PK)
    User.findOne({ email: email })
        .then((user) => {
            if (!user) res.json({ message: "El email no es válido" });
            else if (typeof name !== "undefined" && typeof password !== "undefined" && typeof edad !== "undefined" && typeof sexo !== "undefined" && typeof direccion !== "undefined" && typeof discapacidad !== "undefined" && typeof tutor !== "undefined" && typeof fundacion !== "undefined" && typeof userType !== "undefined") {

                // El salt de variable de entorno toca parsearlo, porque las variables de entorno viene como string
                bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT), (error, hashPassword) => {
                    if (error) {
                        console.log("Error en cifrado de contraseña\n" + error)
                        res.json({ message: "Error en cifrado de contraseña" })
                    }
                    else {
                        // Modificación de todos los datos
                        user.name = name;
                        user.password = hashPassword 
                        user.edad = edad;
                        user.sexo = sexo;
                        user.direccion = direccion;
                        user.discapacidad = discapacidad;
                        user.tutor = tutor;
                        user.fundacion = fundacion;
                        user.userType = userType;

                        // Guardar
                        user.save()
                        .then((updatedUser) => {
                            res.json({ updatedUser, message: "Usuario actualizado con éxito" });
                        })
                        .catch((err) => console.log("Error en guardado de los datos por mongoose " +  err))
                    }
                })
            } else {
                res.json({ message: "Faltan campos por enviar" });
            }
        })
        .catch((err) => console.log(err));
}

module.exports = editUser
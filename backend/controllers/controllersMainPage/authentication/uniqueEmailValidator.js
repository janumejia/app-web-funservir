const User = require("../../../model/user")
var validator = require('validator');

const uniqueEmailValidator = async (req, res) => {
    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Validación del correo ingresado
    const isValidEmail = typeof inputs.email === 'string' && validator.isEmail(inputs.email) ? true : false;
    if (!isValidEmail) return res.status(422).json({ message: "El campo de correo no es válido" });; // El valor del correo es inválido

    try {
        const user = await User.findOne({ 'email': inputs.email })
        if (user) return res.status(409).json({ message: "Ya existe un usuario con ese correo" }); // Ya existe un usuario con ese correo
        else return res.status(200).json({ message: "OK" });
    } catch (error){
        return res.status(500).json({ message: "Error del servidor" });; // Errores en el servidor
    }
}

module.exports = uniqueEmailValidator
const User = require("../../../../model/user")
const cloudinary = require("../../../../middlewares/cloudinary");
const bcrypt = require("bcryptjs")
const { randomAvatar } = require("../../../../utils/avatarGenerator/RandomAvatarGenerator")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { ...regex } = require("../../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

const changePassword = async (req, res) => {

    const { ...inputs } = req.body;

    const decodedDataInToken = req.decodedDataInToken;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    const dataArray = [
        { input: 'oldPassword', dataType: 'string', regex: new RegExp(/^.{1,100}$/) },
        { input: 'newPassword', dataType: 'string', regex: new RegExp(/^.{1,100}$/) },
    ]

    // Función validateInput que toma tres argumentos: el valor del campo, el tipo de datos que se espera y la expresión regular que se utilizará para validar el valor.
    // La función verifica si el valor del campo es válido según los criterios especificados y devuelve true o false.
    const validateInput = (input, dataName, dataType, regex) => {
        if (dataType === 'string') {
            return typeof input === 'string' && regex.test(input);
        }
        if (dataType === 'array') {
            return Array.isArray(input) && input.every(element => regex.test(element)); // Método every para iterar sobre cada uno de los elementos del arreglo y comprobar si cada elemento cumple con la expresión regular
        }
        if (dataType === 'object') {
            return typeof input === 'object' && input !== null &&
                dataArray.every(({ input: requiredInput, properties, regex: requiredRegex }) => {
                    if (requiredInput !== dataName) return true;
                    return properties.every(prop => input.hasOwnProperty(prop) && requiredRegex.test(input[prop]));
                });
        }
        return false;
    };

    // El ciclo recorre cada elemento de la matriz dataArray y llama a validateInput con el valor correspondiente del campo del objeto JSON, el tipo de datos y la expresión regular.
    // Si el valor del campo no es válido según los criterios especificados, se devuelve un mensaje de error.
    for (const { input, dataType, regex } of dataArray) {
        const inputValue = inputs[input];
        if (!validateInput(inputValue, input, dataType, regex)) {
            return res.status(422).json({ message: `El valor de ${input} no es válido` });
        }
    }

    // Validación de la contraseña nueva ingresada
    const isValidNewPassword = validator.isStrongPassword(inputs.newPassword) ? true : false;
    if (!isValidNewPassword) return res.status(422).json({ message: `El valor de la contraseña no es válido` });

    try {
        const user = await User.findOne({ _id: decodedDataInToken._id })

        if (!user) return res.status(401).json({ message: "No se encontró el usuario" })

        /* Vamos a comparar la contraseña del body con la contraseña que está en la BD */
        const isCorrect = await bcrypt.compare(inputs.oldPassword, user.password) // Retorna un booleano sobre si coincide la contraseña

        if (!isCorrect) return res.status(401).json({ message: "La contraseña actual ingresada no coincide" })

        if (inputs.oldPassword === inputs.newPassword) return res.status(401).json({ message: "La nueva contraseña no puede ser igual a la anterior" })

        // Sacamos el hash y lo guardamos
        const hash = await bcrypt.hash(inputs.newPassword, parseInt(process.env.SALT_BCRYPT));
        user.password = hash;
        await user.save();

        res.status(200).json({ message: "Contraseña actualizada correctamente" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al actualizar contraseña" });
    }
}

module.exports = changePassword
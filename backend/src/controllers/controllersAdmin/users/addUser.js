const User = require("../../../model/user")
const cloudinary = require("../../../middlewares/cloudinary");
const bcrypt = require("bcryptjs")
const { randomAvatar } = require("../../../utils/avatarGenerator/RandomAvatarGenerator")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

const addUser = async (req, res) => {

    const { ...inputs } = req.body;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    const dataArray = [
        { input: 'name', dataType: 'string', regex: regex.nameUserRegex },
        { input: 'lastName', dataType: 'string', regex: regex.lastNameUserRegex },
        { input: 'email', dataType: 'string', regex: regex.emailRegex },
        { input: 'password', dataType: 'string', regex: regex.passwordRegex },
        // { input: 'dateOfBirth', dataType: 'string', regex: regex.emailRegex }, // Se válida más abajo de otra forma
        { input: 'gender', dataType: 'string', regex: regex.genderRegex },
        { input: 'address', dataType: 'string', regex: regex.addressRegex },
        { input: 'condition', dataType: 'array', regex: regex.conditionRegex },
        { input: 'isCaregiver', dataType: 'string', regex: regex.isCaregiverRegex },
        { input: 'institution', dataType: 'string', regex: regex.institutionRegex },
        { input: 'userType', dataType: 'string', regex: regex.userTypeRegex },
        { input: 'profilePicture', dataType: 'string', regex: regex.profilePictureRegex },

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

    // Validación de fecha de nacimiento
    const isValidDateOfBirth = moment(inputs.dateOfBirth, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
    if (isValidDateOfBirth === false) return res.status(422).json({ message: "Formato de fecha de nacimiento no es válido" });

    // Validación del correo ingresado
    const isValidEmail = validator.isEmail(inputs.email) ? true : false;
    if (!isValidEmail) return res.status(422).json({ message: `El valor del correo no es válido` });

    // Validación de la contraseña ingresada
    const isValidPassword = validator.isStrongPassword(inputs.password) ? true : false;
    if (!isValidPassword) return res.status(422).json({ message: `El valor de la contraseña es inválida` });
    /* Fin sanitización entradas */

    try {
        const user = await User.findOne({ email: inputs.email });
        if (user) {
            return res.status(409).json({ message: "Ya existe un usuario con ese correo" });
        }

        const prflPic = (!inputs.profilePicture) ? randomAvatar(inputs.gender) : inputs.profilePicture;
        const uploadRes = await cloudinary.uploader.upload(prflPic, {
            upload_preset: "profile_pictures",
            public_id: inputs.email
        });

        const hash = await bcrypt.hash(inputs.password, parseInt(process.env.SALT_BCRYPT));
        const newUser = new User({
            name: inputs.name,
            lastName: inputs.lastName,
            dateOfBirth: inputs.dateOfBirth,
            email: inputs.email,
            password: hash,
            gender: inputs.gender,
            address: inputs.address,
            condition: inputs.condition,
            isCaregiver: inputs.isCaregiver,
            institution: inputs.institution,
            userType: inputs.userType,
            associatedSites: [],
            profilePicture: uploadRes.secure_url
        });

        const savedUser = await newUser.save();
        return res.status(200).json({ message: "Usuario creado correctamente", element: savedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al crear usuario" });
    }
}

module.exports = addUser
const {randomAvatar} = require("../../../utils/avatarGenerator/RandomAvatarGenerator")

const User = require("../../../model/user")
const bcrypt = require("bcryptjs")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { nameUserRegex, lastNameUserRegex, emailRegex, passwordRegex, genderRegex, addressRegex, isCaregiverRegex, institutionRegex, conditionRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

const addUser = async (req, res) => {
    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        { input: 'name', dataType: 'string', regex: nameUserRegex },
        { input: 'lastName', dataType: 'string', regex: lastNameUserRegex },
        // { input: 'email', dataType: 'string', regex: emailRegex },
        // { input: 'password', dataType: 'string', regex: passwordRegex }, // Se hace más abajo de otra manera usando la librería validator
        // { input: 'dateOfBirth', dataType: 'string', regex: inclusiveElementsRegex },
        { input: 'gender', dataType: 'string', regex: genderRegex },
        { input: 'address', dataType: 'string', regex: addressRegex },
        { input: 'condition', dataType: 'array', regex: conditionRegex },
        { input: 'isCaregiver', dataType: 'string', regex: isCaregiverRegex },
        { input: 'institution', dataType: 'string', regex: institutionRegex },
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
    
    // Validación del correo ingresado
    const isValidEmail = typeof inputs.email === 'string' && validator.isEmail(inputs.email) ? true : false;
    if(!isValidEmail) return res.status(422).json({ message: `El valor del correo no es válido` });

    // Validación de la contraseña ingresada
    const isValidPassword = typeof inputs.password === 'string' && validator.isStrongPassword(inputs.password) ? true : false;
    if(!isValidPassword) return res.status(422).json({ message: `El valor de la contraseña es inválida` });
    
    // Validación de la fecha ingresada
    const isValidDateOfBirth = typeof inputs.dateOfBirth === 'string' && moment (inputs.dateOfBirth, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid() ? true : false;
    if(!isValidDateOfBirth) return res.status(422).json({ message: `El valor de la fecha es inválida` });

    User.findOne({ 'email': inputs.email }).then((user) => {
        if (user) return res.status(409).json({ message: "Ya existe un usuario con ese correo" });

        bcrypt.hash(inputs.password, parseInt(process.env.BACKEND_SALT_BCRYPT), (err, hash) => {
            if (err) return res.status(500).json({ error: err });

            
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
                userType: "Regular", // Porque en este controlador solo se registra usuario normal
                profilePicture: randomAvatar(inputs.gender)
            });

            newUser.save().then((savedUser) => {
                return res.status(200).json({ message: "Usuario creado correctamente. Ahora debes iniciar sesión" });
            }).catch((err) => {
                console.error(err);
                return res.status(500).json({ message: "Error al crear usuario" });
            });
        });
    });
}

module.exports = addUser
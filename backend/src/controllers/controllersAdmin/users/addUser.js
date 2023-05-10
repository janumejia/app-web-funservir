const User = require("../../../model/user")
const cloudinary = require("../../../middlewares/cloudinary");
const bcrypt = require("bcryptjs")
const { randomAvatar } = require("../../../utils/avatarGenerator/RandomAvatarGenerator")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { nameUserRegex, lastNameUserRegex, emailRegex, passwordRegex, genderRegex, addressRegex, isCaregiverRegex, institutionRegex, userTypeRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas
var validator = require('validator');

// perform difference operation
// elements of set a that are not in set b
const A_and_Not_In_B = (setA, setB) => {
    let differenceSet = new Set(setA)
    for (let i of setB) {
        differenceSet.delete(i)
    }
    return differenceSet
}

const addUser = async (req, res) => {
    
    const { name, lastName, email, password, dateOfBirth, gender, address, condition, isCaregiver, institution, userType, profilePicture } = req.body;


    if (!name || !lastName || !email || !dateOfBirth || !gender || !password || !address || !isCaregiver || !userType) {
        return res.status(400).json({ message: "Faltan campos" });
    }

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if (typeof (name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    if (typeof (lastName) !== 'string') return res.status(422).json({ message: "Tipo de dato de apellido no es válido" });
    if (typeof (email) !== 'string') return res.status(422).json({ message: "Tipo de dato de correo no es válido" });
    if (typeof (password) !== 'string') return res.status(422).json({ message: "Tipo de dato de contraseña no es válido" });
    if (typeof (dateOfBirth) !== 'string') return res.status(422).json({ message: "Tipo de dato de fecha de nacimiento no es válido" });
    if (typeof (gender) !== 'string') return res.status(422).json({ message: "Tipo de dato de genero no es válido" });
    if (typeof (address) !== 'string') return res.status(422).json({ message: "Tipo de dato de dirección no es válido" });
    if (typeof (condition) !== 'object') return res.status(422).json({ message: "Tipo de dato de discapacidades no es válido" }); // Este es el único de tipo object
    if (typeof (isCaregiver) !== 'string') return res.status(422).json({ message: "Tipo de dato de ¿es tutor? no es válido" });
    if (typeof (institution) !== 'string') return res.status(422).json({ message: "Tipo de dato de fundación no es válido" });
    if (typeof (userType) !== 'string') return res.status(422).json({ message: "Tipo de dato de tipo de usuario no es válido" });

    // 2) Validar si cumple con los caracteres permitidos
    const isValidName = nameUserRegex.test(name);
    const isValidLastName = lastNameUserRegex.test(lastName);
    // const isValidEmail = emailRegex.test(email); // Se hace más abajo
    // const isValidPassword = passwordRegex.test(password); // igual
    const isValidDateOfBirth = moment(dateOfBirth, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
    const isValidGender = genderRegex.test(gender);
    const isValidAddress = addressRegex.test(address);

    const isValidCondition = () => {
        let options = { Motriz: 0, Visual: 0, Auditiva: 0, Sensorial: 0, Comunicacion: 0, Mental: 0, Multiples: 0, Otra: 0 }; // Para llevar un conteo de las opciones enviadas y que no existan repetidas
        for (const key in condition) {
            if (typeof (condition[key]) !== 'string') return false;
            switch (condition[key]) {
                case ' Motriz ':
                    if (options.Motriz > 0) return false;
                    options.Motriz++;
                    break;
                case ' Visual ':
                    if (options.Visual > 0) return false;
                    options.Visual++;
                    break;
                case ' Auditiva ':
                    if (options.Auditiva > 0) return false;
                    options.Auditiva++;
                    break;
                case ' Sensorial ':
                    if (options.Sensorial > 0) return false;
                    options.Sensorial++;
                    break;
                case ' Comunicacion ':
                    if (options.Comunicacion > 0) return false;
                    options.Comunicacion++;
                    break;
                case ' Mental ':
                    if (options.Mental > 0) return false;
                    options.Mental++;
                    break;
                case ' Multiples ':
                    if (options.Multiples > 0) return false;
                    options.Multiples++;
                    break;
                case ' Otra ':
                    if (options.Otra > 0) return false;
                    options.Otra++;
                    break;
                default:
                    return false;
            }
        }
        return true;
    }

    const isValidIsCaregiver = isCaregiverRegex.test(isCaregiver);
    const isValidInstitution = institutionRegex.test(institution);
    const isValidUserType = userTypeRegex.test(userType);


    if (isValidName === false) return res.status(422).json({ message: "Formato de nombre no es válido" });
    if (isValidLastName === false) return res.status(422).json({ message: "Formato de apellido no es válido" });
    // if (isValidEmail === false) return res.status(422).json({ message: "Formato de correo no es válido" });
    // if (isValidPassword === false) return res.status(422).json({ message: "Formato de contraseña no es válido" });
    if (isValidDateOfBirth === false) return res.status(422).json({ message: "Formato de fecha de nacimiento no es válido" });
    if (isValidGender === false) return res.status(422).json({ message: "Formato de genero no es válido" });
    if (isValidAddress === false) return res.status(422).json({ message: "Formato de dirección no es válido" });
    if (isValidCondition() === false) return res.status(422).json({ message: "Formato de discapacidad no es válido" });
    if (isValidIsCaregiver === false) return res.status(422).json({ message: "Formato de ¿es tutor? no es válido" });
    if (isValidInstitution === false) return res.status(422).json({ message: "Formato de institución no es válido" });
    if (isValidUserType === false) return res.status(422).json({ message: "Formato de tipo de usuario no es válido" }); // Caso malo


    // Validación del correo ingresado
    const isValidEmail = typeof email === 'string' && validator.isEmail(email) ? true : false;
    if (!isValidEmail) return res.status(422).json({ message: `El valor del correo no es válido` });

    // Validación de la contraseña ingresada
    const isValidPassword = typeof password === 'string' && validator.isStrongPassword(password) ? true : false;
    if (!isValidPassword) return res.status(422).json({ message: `El valor de la contraseña es inválida` });


    /* Fin sanitización entradas */



    User.findOne({ email }).then(async (user) => {
        if (user) return res.status(409).json({ message: "Ya existe un usuario con ese correo" });

        try {
            const prflPic = (!profilePicture) ? randomAvatar(gender) : profilePicture;
            const uploadRes = await cloudinary.uploader.upload(prflPic, {
                upload_preset: "profile_pictures",
                public_id: email
            })

            bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT), async (err, hash) => {
                if (err) return res.status(500).json({ error: err });

                const newUser = new User({
                    name,
                    lastName,
                    dateOfBirth,
                    email,
                    password: hash,
                    gender,
                    address,
                    condition,
                    isCaregiver,
                    institution,
                    userType,
                    associatedSites: [],
                    profilePicture: uploadRes.secure_url
                });

                await newUser.save().then((savedUser) => {
                    return res.status(200).json({ message: "Usuario creado correctamente", element: savedUser });
                }).catch((err) => {
                    console.error(err);
                    return res.status(500).json({ message: "Error al crear usuario" });
                });
            });
        } catch (error) {
            res.status(500).send(error);
        }
    });
}

module.exports = addUser
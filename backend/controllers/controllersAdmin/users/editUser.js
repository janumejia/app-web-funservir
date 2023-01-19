require('dotenv').config({ path: '.env' })
const User = require("../../../model/user")
const bcrypt = require("bcryptjs")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const { _idMongooseRegex, nameUserRegex, lastNameUserRegex, emailRegex, passwordRegex, genderRegex, addressRegex, isCaregiverRegex, institutionRegex, userTypeRegex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const editUser = async (req, res) => {

    const { _id,  name, lastName, email, password, dateOfBirth, gender, address, condition, isCaregiver, institution, userType } = req.body;

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if(typeof(_id) !== 'string') return res.status(422).json({ message: "Tipo de dato de _id no es válido" });
    if(typeof(name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    if(typeof(lastName) !== 'string') return res.status(422).json({ message: "Tipo de dato de apellido no es válido" });
    if(typeof(email) !== 'string') return res.status(422).json({ message: "Tipo de dato de correo no es válido" });
    if(typeof(password) !== 'string') return res.status(422).json({ message: "Tipo de dato de contraseña no es válido" });
    if(typeof(dateOfBirth) !== 'string') return res.status(422).json({ message: "Tipo de dato de fecha de nacimiento no es válido" });
    if(typeof(gender) !== 'string') return res.status(422).json({ message: "Tipo de dato de genero no es válido" });
    if(typeof(address) !== 'string') return res.status(422).json({ message: "Tipo de dato de dirección no es válido" });
    if(typeof(condition) !== 'object') return res.status(422).json({ message: "Tipo de dato de discapacidades no es válido" }); // Este es el único de tipo object
    if(typeof(isCaregiver) !== 'string') return res.status(422).json({ message: "Tipo de dato de ¿es tutor? no es válido" });
    if(typeof(institution) !== 'string') return res.status(422).json({ message: "Tipo de dato de fundación no es válido" });
    if(typeof(userType) !== 'string') return res.status(422).json({ message: "Tipo de dato de tipo de usuario no es válido" });

    // 2) Validar si cumple con los caracteres permitidos
    const isValid_id = _idMongooseRegex.test(_id);
    const isValidName = nameUserRegex.test(name);
    const isValidLastName = lastNameUserRegex.test(lastName);
    const isValidEmail = emailRegex.test(email);
    const isValidPassword = passwordRegex.test(password);
    const isValidDateOfBirth = moment(dateOfBirth, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
    const isValidGender = genderRegex.test(gender);
    const isValidAddress = addressRegex.test(address);

    const isValidCondition = () => {
        let options = { Motriz: 0, Visual: 0, Auditiva: 0, Sensorial: 0, Comunicacion: 0, Mental: 0, Multiples: 0, Otra: 0 }; // Para llevar un conteo de las opciones enviadas y que no existan repetidas
        for (const key in condition) {
            if(typeof(condition[key]) !== 'string') return false;
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

    if (isValid_id == false) return res.status(422).json({ message: "Formato de _id no es válido" });
    if (isValidName === false) return res.status(422).json({ message: "Formato de nombre no es válido" });
    if (isValidLastName === false) return res.status(422).json({ message: "Formato de apellido no es válido" });
    if (isValidEmail === false) return res.status(422).json({ message: "Formato de correo no es válido" });
    if (isValidPassword === false) return res.status(422).json({ message: "Formato de contraseña no es válido" });
    if (isValidDateOfBirth === false) return res.status(422).json({ message: "Formato de fecha de nacimiento no es válido" });
    if (isValidGender === false) return res.status(422).json({ message: "Formato de genero no es válido" });
    if (isValidAddress === false) return res.status(422).json({ message: "Formato de dirección no es válido" });
    if (isValidCondition() === false) return res.status(422).json({ message: "Formato de discapacidad no es válido" });
    if (isValidIsCaregiver === false) return res.status(422).json({ message: "Formato de ¿es tutor? no es válido" });
    if (isValidInstitution === false) return res.status(422).json({ message: "Formato de institución no es válido" });
    if (isValidUserType === false) return res.status(422).json({ message: "Formato de tipo de usuario no es válido" });
    /* Fin sanitización entradas */
    
    const query = { _id: _id };
    let doc = await User.findOne(query);
    if (doc.password !== password) {
        bcrypt.hash(password, parseInt(process.env.SALT_BCRYPT), async (error, hashPassword) => { // Genera el hash de la contraseña ingresada
            if (error) res.status(500).json({ message: "error" })
            else {
                doc.name = name;
                doc.lastName = lastName;
                doc.email = email;
                doc.password = hashPassword;
                doc.dateOfBirth = dateOfBirth;
                doc.gender = gender;
                doc.address = address;
                doc.condition = condition;
                doc.isCaregiver = isCaregiver;
                doc.institution = institution;
                doc.userType = userType;
                await doc.save();
            }
        })
    } else {
        doc.name = name;
        doc.lastName = lastName;
        doc.email = email;
        doc.dateOfBirth = dateOfBirth;
        doc.gender = gender;
        doc.address = address;
        doc.condition = condition;
        doc.isCaregiver = isCaregiver;
        doc.institution = institution;
        doc.userType = userType;
        await doc.save();
    }
    res.status(200).json({ message: "Usuario editado correctamente", doc });
}

module.exports = editUser
const { randomAvatar } = require("../../../utils/avatarGenerator/RandomAvatarGenerator")
const cloudinary = require("../../../middlewares/cloudinary");
const Neighborhoods = require("../../../model/neighborhoods")
const InclusiveSites = require("../../../model/site")
const User = require("../../../model/user")
const { ObjectId } = require('mongodb');
var validator = require('validator');
const bcrypt = require("bcryptjs")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida
const axios = require('axios');

const { _idMongooseRegex, nameUserRegex, lastNameUserRegex, genderRegex, addressRegex, conditionRegex, isCaregiverRegex, institutionRegex, siteNameRegex, descriptionRegex, categoryRegex, contactNumberRegex, locationRegex, localityRegex, neighborhoodRegex, passwordRegex, inclusiveElementsRegex, imgRegex, socialWhatsappRegex, socialInstagramRegex, socialFacebookRegex, socialTwitterRegex, webpageRegex, contactNumber2Regex } = require("../../../regex") // Importación de patrones de Regex

const addInclusiveSites = async (req, res) => {

    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        // Datos del dueño de sitio:
        { input: 'name', dataType: 'string', regex: nameUserRegex },
        { input: 'lastName', dataType: 'string', regex: lastNameUserRegex },
        // { input: 'email', dataType: 'string', regex: emailRegex }, // // Se hace más abajo de otra manera usando la librería validator
        { input: 'password', dataType: 'string', regex: passwordRegex }, // Se hace más abajo de otra manera usando la librería validator
        // { input: 'dateOfBirth', dataType: 'string', regex: inclusiveElementsRegex }, // Se hace más abajo de otra manera
        { input: 'gender', dataType: 'string', regex: genderRegex },
        { input: 'address', dataType: 'string', regex: addressRegex },
        { input: 'condition', dataType: 'array', regex: conditionRegex },
        { input: 'isCaregiver', dataType: 'string', regex: isCaregiverRegex },
        { input: 'institution', dataType: 'string', regex: institutionRegex },

        // Datos del sitio a agregar:
        { input: 'siteName', dataType: 'string', regex: siteNameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'contactNumber2', dataType: 'string', regex: contactNumber2Regex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'inclusiveElements', dataType: 'array', regex: _idMongooseRegex },
        // { input: 'imgToAdd', dataType: 'array', regex: imgRegex },
        { input: 'siteAddress', dataType: 'string', regex: addressRegex },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
        { input: 'location', dataType: 'object', regex: locationRegex, properties: ['lat', 'lng'] },
        // { input: 'imgToDelete', dataType: 'string', regex: _idMongooseRegex },
        { input: 'socialWhatsapp', dataType: 'string', regex: socialWhatsappRegex },
        { input: 'socialInstagram', dataType: 'string', regex: socialInstagramRegex },
        { input: 'socialFacebook', dataType: 'string', regex: socialFacebookRegex },
        { input: 'socialTwitter', dataType: 'string', regex: socialTwitterRegex },
        { input: 'webpage', dataType: 'string', regex: webpageRegex },
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
    if (!isValidEmail) return res.status(422).json({ message: `El valor del correo no es válido` });

    // Validación de la contraseña ingresada
    const isValidPassword = typeof inputs.password === 'string' && validator.isStrongPassword(inputs.password) ? true : false;
    if (!isValidPassword) return res.status(422).json({ message: `El valor de la contraseña es inválida` });

    // Validación de la fecha ingresada
    const isValidDateOfBirth = typeof inputs.dateOfBirth === 'string' && moment(inputs.dateOfBirth, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid() ? true : false;
    if (!isValidDateOfBirth) return res.status(422).json({ message: `El valor de la fecha es inválida` });

    // Validación de horario del sitio
    function validateSchedule(obj) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const { start, end } = obj[key];
                if ((start !== null && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(start)) ||
                    (end !== null && !/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/.test(end))) {
                    return false;
                }
            }
        }
        return true;
    }

    const isValidSchedule = typeof inputs.schedule === 'object' && validateSchedule(inputs.schedule);
    if (!isValidSchedule) return res.status(422).json({ message: `El valor de horario no es valido` });

    try {
        // Verificar que el correo no ha sido previamente registrado
        const user = await User.findOne({ 'email': inputs.email });
        if (user) return res.status(409).json({ message: "Ya existe un usuario con ese correo" });

        // Verificar que el correo no ha sido previamente registrado
        const site = await InclusiveSites.findOne({ 'name': inputs.siteName });
        if (site) return res.status(409).json({ message: "Ya existe un sitio con ese nombre" });

        // Verificar que el barrio y la localidad existan
        const neighborhood = await Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality });
        if (!neighborhood) return res.status(404).json({ message: "No existe el barrio o localidad ingresada" });

        // Implementación imagen aleatorio por defecto para el banner de perfil
        const randomNumber = Math.floor(Math.random() * 10); // Genera un numero aleatorio entre el 0 y 9
        let UrlInfoImage = `https://res.cloudinary.com/pasantiafunservir/image/upload/fl_getinfo/v1685387081/coverPictures/cover-image-${randomNumber}.jpg`;

        const response = await axios.get(UrlInfoImage);

        // Relación 1:4
        const estimateHeight = Math.floor(response.data.input.width / 4);
        const heightCover = estimateHeight <= response.data.input.height ? estimateHeight : response.data.input.height;

        const coverPicture = UrlInfoImage.replace("/upload/fl_getinfo/", `/upload/c_fill,g_auto,h_${heightCover},w_${response.data.input.width}/`);

        // FIN Implementación imagen aleatorio por defecto para el banner de perfil

        const hash = await bcrypt.hash(inputs.password, parseInt(process.env.BACKEND_SALT_BCRYPT)); // Hashear de la contraseña

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
            coverPicture: coverPicture,
            institution: inputs.institution,
            userType: "Propietario", // Porque en este controlador se registra un usuario dueño de sitio
            profilePicture: randomAvatar(inputs.gender)
        });

        const savedNewUser = await newUser.save(); // Aquí se crea el usuario

        // Validar que el _id del dueño de sitio exista
        const userExist = await User.findOne({ '_id': savedNewUser._id });
        if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });

        // Subir las imágenes a Cloudinary
        const uploadPromises = inputs.sitePhotos.map(img => {
            return cloudinary.uploader.upload(img, { upload_preset: "sites_pictures" });
        });

        const uploadRes = await Promise.all(uploadPromises);


        // Correccion en el campo de elementos inclusivos para que se guarde el objectID
        let inclusiveElementsWithObjectId = []
        inputs.inclusiveElements.forEach(element => inclusiveElementsWithObjectId.push(ObjectId(element)));

        // Crear objeto a agregar en mongodb
        const newInclusiveSites = new InclusiveSites({
            name: inputs.siteName,
            status: "Pendiente",
            description: inputs.description,
            category: inputs.category,
            contactNumber: inputs.contactNumber,
            contactNumber2: inputs.contactNumber2,
            inclusiveElements: inclusiveElementsWithObjectId,
            siteAddress: inputs.siteAddress,
            location: inputs.location,
            locality: inputs.locality,
            neighborhood: inputs.neighborhood,
            gallery: uploadRes,
            owner: ObjectId(savedNewUser._id),
            socialWhatsapp: inputs.socialWhatsapp,
            socialInstagram: inputs.socialInstagram,
            socialFacebook: inputs.socialFacebook,
            socialTwitter: inputs.socialTwitter,
            webpage: inputs.webpage,
            schedule: inputs.schedule
        });

        // Guardar el sitio en la colección InclusiveSites y en la colección de sitios del usuario correspondiente
        try {
            const savedSite = await newInclusiveSites.save(); // Guardamos el sitios. Tener en cuenta que si el sitio ya existe se arroja el error con código 11000
            //const a = await InclusiveSites.findById(savedSite._id).populate('owner', {name:1});

            // Procedemos a guardar también el sitio en el arreglo de sitios del usuario correspondiente
            const query = { _id: ObjectId(savedNewUser._id), associatedSites: { $ne: savedSite._id } }; // Verificar que el sitio no existe ya en el arreglo
            const update = {
                $addToSet: { associatedSites: savedSite._id }
            };

            await User.findByIdAndUpdate(query, update);

            return res.status(200).json({ message: "Registro exitoso. Ahora debes iniciar sesión", element: savedSite });

        } catch (error) {
            if (error.code === 11000) return res.status(409).json({ message: "Ya existe este sitio inclusivo" }); // Este código de error se produce cuando hay un índice único duplicado
            console.error(error);
            return res.status(500).json({ message: "Error en creación del sitios inclusivo" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error en la solicitud de registro." });

    }
}

module.exports = addInclusiveSites
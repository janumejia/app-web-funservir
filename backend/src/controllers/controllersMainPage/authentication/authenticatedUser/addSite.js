const { randomAvatar } = require("../../../../utils/avatarGenerator/RandomAvatarGenerator")
const cloudinary = require("../../../../middlewares/cloudinary");
const Neighborhoods = require("../../../../model/neighborhoods")
const InclusiveSites = require("../../../../model/site")
const User = require("../../../../model/user")
const { ObjectId } = require('mongodb');
var validator = require('validator');
const bcrypt = require("bcryptjs")
const moment = require('moment') // Para validar que el campo fecha realmente tenga una fecha válida

const { _idMongooseRegex, nameUserRegex, lastNameUserRegex, genderRegex, addressRegex, conditionRegex, isCaregiverRegex, institutionRegex, siteNameRegex, descriptionRegex, categoryRegex, contactNumberRegex, locationRegex, localityRegex, neighborhoodRegex, inclusiveElementsRegex, imgRegex, socialWhatsappRegex, socialInstagramRegex, socialFacebookRegex, socialTwitterRegex, webpageRegex, contactNumber2Regex, moreInfoInclusivityRegex } = require("../../../../regex") // Importación de patrones de Regex

const addInclusiveSites = async (req, res) => {

    // const sessionCookie = req.cookies["AWFS-token"]; // Obtenemos la cookie de sesión

    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        // Datos del sitio a agregar:
        { input: 'siteName', dataType: 'string', regex: siteNameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'contactNumber2', dataType: 'string', regex: contactNumber2Regex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'inclusiveElements', dataType: 'array', regex: _idMongooseRegex },
        { input: 'moreInfoInclusivity', dataType: 'string', regex: moreInfoInclusivityRegex },
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

    const isValidSecondNumber = typeof inputs.contactNumber === 'string' && typeof inputs.contactNumber2 === 'string' && inputs.contactNumber !== inputs.contactNumber2;
    if (!isValidSecondNumber) return res.status(422).json({ message: `Los números telefónicos no pueden ser iguales` });


    try {
        // Validar que el _id del dueño de sitio exista
        const userExist = await User.findOne({ '_id': decodedDataInToken._id });
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
            moreInfoInclusivity: inputs.moreInfoInclusivity,
            siteAddress: inputs.siteAddress,
            location: inputs.location,
            locality: inputs.locality,
            neighborhood: inputs.neighborhood,
            gallery: uploadRes,
            owner: ObjectId(decodedDataInToken._id),
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
            const query = { _id: ObjectId(decodedDataInToken._id), associatedSites: { $ne: savedSite._id } }; // Verificar que el sitio no existe ya en el arreglo
            const update = {
                $addToSet: { associatedSites: savedSite._id }
            };

            await User.findByIdAndUpdate(query, update);

            return res.status(200).json({ message: "Registro exitoso. Debes esperar a que el administrador apruebe tu sitio", element: savedSite });

        } catch (error) {
            if (error.code === 11000) return res.status(409).json({ message: "Ya existe este sitio inclusivo" }); // Este código de error se produce cuando hay un índice único duplicado
            
            return res.status(500).json({ message: "Error en creación del sitios inclusivo" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error en la solicitud de registro." });

    }
}

module.exports = addInclusiveSites
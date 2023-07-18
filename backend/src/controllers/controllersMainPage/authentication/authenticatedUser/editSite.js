const { randomAvatar } = require("../../../../utils/avatarGenerator/RandomAvatarGenerator")
const cloudinary = require("../../../../middlewares/cloudinary");
const InclusiveSites = require("../../../../model/site")
const User = require("../../../../model/user")
const { ObjectId } = require('mongodb');

const { _idMongooseRegex, nameUserRegex, lastNameUserRegex, genderRegex, addressRegex, conditionRegex, isCaregiverRegex, institutionRegex, siteNameRegex, descriptionRegex, categoryRegex, contactNumberRegex, locationRegex, localityRegex, neighborhoodRegex, inclusiveElementsRegex, imgRegex } = require("../../../../regex") // Importación de patrones de Regex

const editInclusiveSite = async (req, res) => {

    // const sessionCookie = req.cookies["AWFS-token"]; // Obtenemos la cookie de sesión

    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;
    console.log(inputs);
    const decodedDataInToken = req.decodedDataInToken;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        // Datos del sitio a agregar:
        { input: 'siteName', dataType: 'string', regex: siteNameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'inclusiveElements', dataType: 'array', regex: _idMongooseRegex },
        { input: 'siteAddress', dataType: 'string', regex: addressRegex },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
        { input: 'location', dataType: 'object', regex: locationRegex, properties: ['lat', 'lng'] }
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

    try {
        // Validar que el _id del dueño de sitio exista
        const userExist = await User.findOne({ '_id': decodedDataInToken._id });
        if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });

        // Subir las imágenes a Cloudinary
        const uploadPromises = inputs.addedPhotos?.map(img => {
            return cloudinary.uploader.upload(img, { upload_preset: "sites_pictures" });
        });
        const uploadRes = await Promise.all(uploadPromises);

        // Correccion en el campo de elementos inclusivos para que se guarde el objectID
        let inclusiveElementsWithObjectId = []
        inputs.inclusiveElements.forEach(element => inclusiveElementsWithObjectId.push(ObjectId(element)));

        // Crear objeto a agregar en mongodb
        const editedSite = {
            name: inputs.siteName,
            status: "Pendiente",
            description: inputs.description,
            category: inputs.category,
            contactNumber: inputs.contactNumber,
            inclusiveElements: inclusiveElementsWithObjectId,
            siteAddress: inputs.siteAddress,
            location: inputs.location,
            locality: inputs.locality,
            neighborhood: inputs.neighborhood,
            owner: ObjectId(decodedDataInToken._id),
        };

        // Guardar el sitio en la colección InclusiveSites y en la colección de sitios del usuario correspondiente
        try {
            const picsIds = inputs.picsToDelete?.map((pic) => {
                return pic.uid;
            })

            const savedSite = await InclusiveSites.findOneAndUpdate({ _id: inputs._id }, {
                $set: editedSite,
                $pull: { gallery: { asset_id: { $in: picsIds } } },
            },{
                new: true
              });
            console.log(uploadRes);
            savedSite.gallery.push(...uploadRes);
            savedSite.save();

            // Procedemos a guardar también el sitio en el arreglo de sitios del usuario correspondiente
            const query = { _id: ObjectId(decodedDataInToken._id), associatedSites: { $ne: savedSite._id } }; // Verificar que el sitio no existe ya en el arreglo
            const update = {
                $addToSet: { associatedSites: savedSite._id }
            };

            await User.findByIdAndUpdate(query, update);

            return res.status(200).json({ message: "Registro exitoso. Debes esperar a que el administrador apruebe tu sitio", element: savedSite });

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

module.exports = editInclusiveSite
const cloudinary = require("../../../middlewares/cloudinary");
const Neighborhoods = require("../../../model/neighborhoods")
const InclusiveSites = require("../../../model/site")
const User = require("../../../model/user")
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const { _idMongooseRegex, siteNameRegex, descriptionRegex, categoryRegex, contactNumberRegex, addressRegex, locationRegex, localityRegex, neighborhoodRegex, inclusiveElementsRegex, imageRegex, moreInfoInclusivityRegex } = require("../../../regex") // Importación de patrones de Regex

const addInclusiveSites = async (req, res) => {

    // Entradas: name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        { input: 'name', dataType: 'string', regex: siteNameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'inclusiveElements', dataType: 'array', regex: inclusiveElementsRegex },
        { input: 'moreInfoInclusivity', dataType: 'string', regex: moreInfoInclusivityRegex },
        // schedule se verifica más abajo
        { input: 'siteAddress', dataType: 'string', regex: addressRegex },
        { input: 'location', dataType: 'object', regex: locationRegex, properties: ['lat', 'lng'] },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
        // Las imágenes se validan más abajo
        { input: 'owner', dataType: 'string', regex: _idMongooseRegex },
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

    // Verificación de schedule
    const validateTime = (schedule) => {
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        for (let day in schedule) {
            const start = schedule[day]["start"];
            const end = schedule[day]["end"];
            if ((start !== null && !timeRegex.test(start)) || (end !== null && !timeRegex.test(end))) {
                return false;
            }
        }
        return true;
    }

    if (!validateTime(inputs.schedule)) return res.status(422).json({ message: `El valor de la fecha no es válido` });

    // Validación de imagen enviada
    const isBase64 = (str) => {
        try {
            return Buffer.from(str, 'base64').toString('base64') === str;
        } catch (error) {
            return false;
        }
    }

    const isImageValid = (base64Image) => {
        const maxSize = 5 * 1024 * 1024; // 5 MB in bytes
        if (!isBase64(base64Image)) {
            return false;
        }
        const sizeInBytes = Buffer.byteLength(base64Image, 'base64');
        return sizeInBytes <= maxSize;
    }


    const validateImages = (images) => {
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            if (!imageRegex.test(image)) {
                return false;
            }
            const base64Image = image.split(",")[1];
            if (!isImageValid(base64Image)) {
                return false;
            }
        }

        return true;
    };

    // La imagen tiene esta forma: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAMAAABlApw1AAAAh1BMVEUAAABk2vth2vxh2/xh2vxh2/xh2vth2/xh2vth2vxh2/xh2vxh2vxh2/xh2vxh2vxh2vth2vth2vth2...
    // entonces el base64 está después de la coma, y eso es lo que le pasamos al método de comprobación
    if (!validateImages(inputs.imgToAdd)) return res.status(422).json({ message: `La imagen no es válida por su formato o tamaño` });

    try {
        // Validar que el _id del dueño de sitio exista
        const userExist = await User.findOne({ '_id': inputs.owner });
        if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });

        // Verificar que el barrio y la localidad existan
        const neighborhood = await Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality });
        if (!neighborhood) return res.status(404).json({ message: "No existe el barrio o localidad ingresada" });

        // Subir las imágenes a Cloudinary
        const uploadPromises = inputs.imgToAdd.map(img => {
            return cloudinary.uploader.upload(img, { upload_preset: "sites_pictures" });
        });
        const uploadRes = await Promise.all(uploadPromises);

        // Crear objeto a agregar en mongodb
        const newInclusiveSites = new InclusiveSites({
            name: inputs.name,
            status: "Aprobado",
            description: inputs.description,
            category: inputs.category,
            contactNumber: inputs.contactNumber,
            inclusiveElements: inputs.inclusiveElements,
            moreInfoInclusivity: inputs.moreInfoInclusivity,
            schedule: inputs.schedule,
            siteAddress: inputs.siteAddress,
            location: inputs.location,
            locality: inputs.locality,
            neighborhood: inputs.neighborhood,
            gallery: uploadRes,
            owner: ObjectId(inputs.owner),
        });

        // Guardar el sitio en la colección InclusiveSites y en la colección de sitios del usuario correspondiente
        try {
            const savedSite = await newInclusiveSites.save(); // Guardamos el sitios. Tener en cuenta que si el sitio ya existe se arroja el error con código 11000
            //const a = await InclusiveSites.findById(savedSite._id).populate('owner', {name:1});

            // Procedemos a guardar también el sitio en el arreglo de sitios del usuario correspondiente
            const query = { _id: ObjectId(inputs.owner), associatedSites: { $ne: savedSite._id } }; // Verificar que el sitio no existe ya en el arreglo
            const update = {
                $addToSet: { associatedSites: savedSite._id }
            };

            const savedUser = await User.findByIdAndUpdate(query, update);

            return res.status(200).json({ message: "Sitio creado y usuario actualizado correctamente", element: savedSite });

        } catch (error) {
            if (error.code === 11000) return res.status(409).json({ message: "Ya existe este sitio inclusivo" }); // Este código de error se produce cuando hay un índice único duplicado
            console.error(error);
            return res.status(500).json({ message: "Error en creación del sitios inclusivo" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error en creación del sitios inclusivo" });

    }
}

module.exports = addInclusiveSites
const cloudinary = require("../../../middlewares/cloudinary");
const InclusiveSites = require("../../../model/site")
const Neighborhoods = require("../../../model/neighborhoods")
const User = require("../../../model/user")
const { ObjectId } = require('mongodb');
// const NodeClam = require('clamscan');

// Crea un objeto ClamAV para verificación de imágenes libres de virus
// const clam = new NodeClam().init();

const { _idMongooseRegex, siteNameRegex, descriptionRegex, categoryRegex, contactNumberRegex, inclusiveElementsRegex, addressRegex, locationRegex, localityRegex, neighborhoodRegex, imgRegex, _idMongooseRegexOrEmpty } = require("../../../regex") // Importación de patrones de Regex

const editInclusiveSites = async (req, res) => {

    // Entradas: _id, name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
        { input: 'name', dataType: 'string', regex: siteNameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'inclusiveElements', dataType: 'array', regex: inclusiveElementsRegex },
        { input: 'siteAddress', dataType: 'string', regex: addressRegex },
        { input: 'location', dataType: 'object', regex: locationRegex, properties: ['lat', 'lng'] },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
        // { input: 'imgToAdd', dataType: 'array', regex: imgRegex },
        // { input: 'imgToDelete', dataType: 'string', regex: _idMongooseRegex },
        { input: 'owner', dataType: 'string', regex: _idMongooseRegexOrEmpty }
    ]

    // Función validateInput que toma tres argumentos: el valor del campo, el tipo de datos que se espera y la expresión regular que se utilizará para validar el valor.
    // La función verifica si el valor del campo es válido según los criterios especificados y devuelve true o false.
    const validateInput = (input, dataName, dataType, regex) => {
        // console.log("entra va validateInput con input:", input, " dataType:", dataType, " regex:", regex)
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
        if(inputs.owner !== "") {
            const userExist = await User.findById(inputs.owner);
            if (!userExist) return res.status(404).json({ message: "No existe un usuario con ese _id" });
        }

        // Comprobamos si el _id del sitio es válido
        const elementIS = await InclusiveSites.findById(inputs._id);
        if (!elementIS) return res.status(404).json({ message: "No existe un sitio inclusivo con ese _id" });

        // Comprobamos que el nombre a modificar no exista en otro sitio inclusivo
        const existingSite = await InclusiveSites.findOne({ 'name': inputs.name });
        if (existingSite && existingSite._id.toString() !== inputs._id) {
            // Si ya existe un sitio inclusivo con ese nombre, devolvemos un error 409
            return res.status(409).json({ message: "Ya existe otro sitio inclusivo con ese nombre" });
        }

        // Buscamos el barrio y localidad ingresada
        const neighborhood = await Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality });
        if (!neighborhood) {
            // Si no existe el barrio o localidad ingresada, devolvemos un error 404
            return res.status(404).json({ message: "No existe el barrio o localidad ingresada" });
        }

        // Subimos las imágenes nuevas a Cloudinary y las agregamos al sitio inclusivo
        const uploadRes = await Promise.all(inputs.imgToAdd.map(img => // Promise.all ejecuta multiples promesas en paralelo, luego .map itera sobre el arreglo inputs.imgToAdd que contiene strings de base64
            cloudinary.uploader.upload(img, { upload_preset: "sites_pictures" }) // Nueva promesa que toma los argumentos para subir la imagen.
        ));

        // Eliminamos las imágenes que se quieren borrar de Cloudinary y del sitio inclusivo
        const deletedImgs = await Promise.all(inputs.imgToDelete.map(async img => {
            await cloudinary.uploader.destroy(img);
            return img;
        }));

        // Actualizamos el sitio inclusivo en la base de datos
        const query = { _id: inputs._id };
        const update = {
            name: inputs.name,
            status: inputs.status,
            description: inputs.description,
            category: inputs.category,
            contactNumber: inputs.contactNumber,
            inclusiveElements: inputs.inclusiveElements,
            siteAddress: inputs.siteAddress,
            location: inputs.location,
            locality: inputs.locality,
            neighborhood: inputs.neighborhood,
            $push: { gallery: { $each: uploadRes } },
            // owner: (inputs.owner === "") ? ObjectId(inputs.owner) : ObjectId(inputs.owner), // Aquí va el _id del dueño del sitio
        }
        if(inputs.owner === ""){
            update['$unset'] = { owner: "" };
        } else {
            update['owner'] = ObjectId(inputs.owner);
        }

        console.log("pasa por aqui")
        const updatedSite = await InclusiveSites.findByIdAndUpdate(query, update);

        // Eliminamos las imágenes del sitio inclusivo que se borraron en Cloudinary
        await InclusiveSites.updateMany({ $pull: { gallery: { public_id: { $in: deletedImgs } } } });

        // Buscamos los usuarios que tienen este sitio inclusivo asociado y lo actualizamos (lo desasociamos)
        await User.updateMany(
            // Filtro para seleccionar los documentos que contienen el _id en el arreglo sitios
            { "associatedSites": { $elemMatch: { $eq: ObjectId(inputs._id) } } },
            // Operador $pull para eliminar el objeto que contiene el _id del arreglo sitios
            { $pull: { associatedSites: ObjectId(inputs._id) } }
        );

        if(inputs.owner !== ""){
            // Agregar el sitio a la lista de sitios del usuario correspondiente, solo si aún no está presente
            const query2 = { _id: ObjectId(inputs.owner) };
            const update2 = {
                $addToSet: { associatedSites: { _id: ObjectId(elementIS._id) } }
            };

            const updatedUser = await User.findOneAndUpdate(query2, update2);
        }

        res.status(200).json({ message: "Sitio actualizado correctamente" });

    } catch (error) {
        // Si se produce algún error, lo capturamos y devolvemos un mensaje de error genérico
        console.error(error);
        return res.status(500).json({ message: "Error en la actualización de sitio inclusivo" });
    }

}

module.exports = editInclusiveSites
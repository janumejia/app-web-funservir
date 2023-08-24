const cloudinary = require("../../../../../middlewares/cloudinary");
const Comment = require("../../../../../model/comments");
const keyPoint = require("../../../../../model/keyPoint");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');

const { ...regex } = require("../../../../../regex") // Importación de patrones de Regex

const addKeyPoint = async (req, res) => {

    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    const dataArray = [
        { input: 'classification', dataType: 'string', regex: regex.classificationRegex },
        { input: 'title', dataType: 'string', regex: regex.siteNameRegex },
        { input: 'description', dataType: 'string', regex: regex.descriptionRegex },
        { input: 'location', dataType: 'object', regex: regex.locationRegex, properties: ['lat', 'lng'] },
        { input: 'formattedAddress', dataType: 'string', regex: regex.formattedAddressRegex },
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
        const uploadPromises = inputs.sitePhotos.map(img => {
            return cloudinary.uploader.upload(img, { upload_preset: "keypoint_pictures" });
        });
        const uploadRes = await Promise.all(uploadPromises);

        const newKeyPoint = new keyPoint({
            classification: inputs.classification,
            title: inputs.title,
            description: inputs.description,
            gallery: uploadRes,
            location: inputs.location,
            formattedAddress: inputs.formattedAddress,
            createdBy: ObjectId(decodedDataInToken._id),
        })

        const savedKeyPoint = await newKeyPoint.save();

        return res.status(200).json({ message: "Punto clave creado exitosamente", element: savedKeyPoint });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error en la publicación del punto clave" });
    }
}

module.exports = addKeyPoint;
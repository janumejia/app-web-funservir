require('dotenv').config({ path: '.env' })
const cloudinary = require("../../../middlewares/cloudinary");
const Elements = require("../../../model/inclusiveElements.js");
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas


const editElement = async (req, res) => {
    const { ...inputs } = req.body;

    // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
    if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

    const imageUrl = inputs.imageUrl
    const name = inputs.name

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
        { input: 'name', dataType: 'string', regex: regex.nameInclusiveElementRegex },
        { input: 'imageUrl', dataType: 'string', regex: new RegExp(`(${regex.imageRegex.source}|${regex.imageUrlRegex.source})`) },
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
        const element = await Elements.findOne({ 'name': name });

        if (!element || (element && element.name === name)) {
            const query = { _id: inputs._id };
            let doc = await Elements.findOne(query);

            if (doc.name !== name && doc.image.secure_url === imageUrl) {
                const renameRes = await cloudinary.uploader.rename(`inclusiveElements/${doc.name}`, `inclusiveElements/${name}`);
                doc.name = name;
                doc.image = renameRes;
                await doc.save();
            } else {
                const uploadRes = await cloudinary.uploader.upload(imageUrl, {
                    upload_preset: "inclusive_elements",
                    public_id: name,
                    invalidate: true
                });

                doc.name = name;
                doc.image = uploadRes;
                await doc.save();
            }

            res.json(doc);
        } else {
            res.status(409).json({ message: "Ya existe un elemento inclusivo con este nombre" });
        }
    } catch (error) {
        res.status(500).json({ message: "Hubo un error al cargar el elemento inclusivo" });
    }
}

module.exports = editElement
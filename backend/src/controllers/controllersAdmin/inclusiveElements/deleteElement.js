const Elements = require("../../../model/inclusiveElements.js");
const cloudinary = require("../../../middlewares/cloudinary");
const { ...regex } = require("../../../regex") // Traemos los regex necesarios para validación de entradas

const deleteElement = async (req, res) => {

    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
        { input: 'name', dataType: 'string', regex: regex.nameInclusiveElementRegex },
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
        const element = await Elements.deleteOne({ _id: inputs._id });
        await cloudinary.uploader.destroy(`inclusiveElements/${inputs.name}`);
        res.json({ message: "Elemento borrado correctamente", element });
    } catch (error) {
        res.json({ message: "No se encontró el elemento o no se pudo eliminar" });
    }

}

module.exports = deleteElement
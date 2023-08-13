const Comment = require("../../../../../model/comments");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');
const { ...regex } = require("../../../../../regex")

const reportComment = async (req, res) => {

    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        // Datos del sitio a agregar:
        { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
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
        const commentExist = await Comment.findOne({ '_id': inputs._id });
        if (!commentExist) return res.status(400).json({ message: "Comentario no existe" });

        const updatedComment = await Comment.findByIdAndUpdate(
            inputs._id,
            {
                $set: { isReported: true },
                $addToSet: { reportedBy: decodedDataInToken._id } // Con addToSet solo ingresa IDs únicos
            },
            { new: true } // Retorna la ultima versión
        );

        if (updatedComment) {
            return res.status(200).json({ message: "Comentario reportado con éxito" });
        } else {
            return res.status(500).json({ message: "No se pudo actualizar el comentario" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error en el reporte del comentario" });
    }
}

module.exports = reportComment;
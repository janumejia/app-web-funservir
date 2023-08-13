const Comment = require("../../../../../model/comments");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');
const { ...regex } = require("../../../../../regex")

const addLikeDislikeComment = async (req, res) => {

    const { ...inputs } = req.body;
    const decodedDataInToken = req.decodedDataInToken;

    // Declaración de matriz de objetos, donde cada objeto representa un campo que se espera en el JSON de entrada
    const dataArray = [
        // Datos del sitio a agregar:
        { input: '_id', dataType: 'string', regex: regex._idMongooseRegex },
        { input: 'action', dataType: 'string', regex: regex.likeDislikeRegex },
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

        const previoulyLike = commentExist.likes.includes(decodedDataInToken._id);
        const previoulyDislike = commentExist.dislikes.includes(decodedDataInToken._id);

        let actionInDB = {};
        let actionInFrontEnd = '';
        if (previoulyLike || previoulyDislike) { // Ha calificado este comentario previamente
            if (previoulyLike) {
                if (inputs.action === "like") { // Quiere quitar su like
                    actionInDB.$pull = { likes: decodedDataInToken._id };
                } else if (inputs.action === "dislike") { // Quiere cambiar de like a dislike
                    actionInDB.$pull = { likes: decodedDataInToken._id };
                    actionInDB.$addToSet = { dislikes: decodedDataInToken._id };
                    actionInFrontEnd = 'disliked'
                }
            } else if (previoulyDislike) {
                if (inputs.action === "like") { // Quiere cambiar de dislike a like
                    actionInDB.$pull = { dislikes: decodedDataInToken._id };
                    actionInDB.$addToSet = { likes: decodedDataInToken._id };
                    actionInFrontEnd = 'liked'
                } else if (inputs.action === "dislike") { // Quiere eliminar su dislike
                    actionInDB.$pull = { dislikes: decodedDataInToken._id };
                }
            }
        } else { // No ha calificado este comentario previamente
            if (inputs.action === "like") { // Quiere agregar un like
                actionInDB.$addToSet = { likes: decodedDataInToken._id };
                actionInFrontEnd = 'liked'
            } else if (inputs.action === "dislike") { // Quiere agregar un dislike
                actionInDB.$addToSet = { dislikes: decodedDataInToken._id };
                actionInFrontEnd = 'disliked'
            }
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            inputs._id,
            {
                ...actionInDB
                // $set: { isReported: true },
                // $addToSet: { reportedBy: decodedDataInToken._id }, // Con addToSet solo ingresa IDs únicos
                // $pull: { likes: decodedDataInToken._id },
                // $pull: { dislikes: decodedDataInToken._id },
                // $pull: { likes: decodedDataInToken._id },
            },
            { new: true } // Retorna la ultima versión
        );

        if (updatedComment) {
            return res.status(200).json({ message: "Comentario reportado con éxito", content: { action: actionInFrontEnd, likes: updatedComment.likes.length, dislikes: updatedComment.dislikes.length } });
        } else {
            return res.status(500).json({ message: "No se pudo actualizar el comentario" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Error en el reporte del comentario" });
    }
}

module.exports = addLikeDislikeComment;
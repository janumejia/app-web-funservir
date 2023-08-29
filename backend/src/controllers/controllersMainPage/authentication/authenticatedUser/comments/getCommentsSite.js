const Comment = require("../../../../../model/comments");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');
const { ...regex } = require("../../../../../regex")

const getCommentsSite = async (req, res) => {
    try {

        const { ...inputs } = req.body;

        // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
        if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

        const dataArray = [
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

        let dataSite = await InclusiveSite.findById(inputs._id).select("comments status")
            .populate({
                path: 'comments',
                select: 'siteId userId title content stars reviewFields createdAt updatedAt likes dislikes',
                populate: {
                    path: 'userId',
                    model: 'User',
                    select: 'name lastName email profilePicture',
                },
            }).lean(); // Para que retorne un objeto de javascript (antes daba problemas)

        // Ordenar comentarios por createdAt
        if (dataSite?.comments && dataSite.comments.length > 0) {
            dataSite.comments.sort((a, b) => b.createdAt - a.createdAt); // Más recientes primero

            // Agregar likes y dislikes
            dataSite.comments.forEach(comment => {
                const likesCount = comment && comment.likes ? comment.likes.length : 0;
                const dislikesCount = comment && comment.dislikes ? comment.dislikes.length : 0;
                comment.likesCount = likesCount;
                comment.dislikesCount = dislikesCount;
            });
        }

        // Para solo permitir sitios en estado aprobado
        if (dataSite.status === 'Aprobado') return res.json({ content: dataSite});
        else return res.status(404).json({ message: "No se encontró el sitio" });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error al cargar sitio" })
    }

}

module.exports = getCommentsSite
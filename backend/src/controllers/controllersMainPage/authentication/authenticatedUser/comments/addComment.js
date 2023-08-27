const Comment = require("../../../../../model/comments");
const InclusiveSite = require("../../../../../model/site");
const User = require("../../../../../model/user");
const { ObjectId } = require('mongodb');
const { ...regex } = require("../../../../../regex")

const addComment = async (req, res) => {

    try {
        const { ...inputs } = req.body;
        const decodedDataInToken = req.decodedDataInToken;

        // Cuando la entrada excede le limite permitido, el JSON de la petición llega vacío en este punto
        if (Object.keys(inputs).length === 0) return res.status(413).json({ message: `El tamaño de la información enviada excede los límites permitidos.` });

        const dataArray = [
            { input: 'siteId', dataType: 'string', regex: regex._idMongooseRegex },
            { input: 'title', dataType: 'string', regex: regex.siteNameRegex },
            { input: 'content', dataType: 'string', regex: regex.descriptionRegex },
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

        const validateStars = (arrayOfStars) => {
            let isValid = true;

            arrayOfStars.forEach(element => {
                if (typeof element !== 'number' || !/^[1-5]$/.test(element.toString())) {
                    isValid = false;
                }
            });

            return isValid;
        }

        const resValidateStars = validateStars([inputs.stars, inputs.inclusivity, inputs.accessibility, inputs.service]);
        if (!resValidateStars) return res.status(422).json({ message: `El valor de la puntuación en estrellas no es válido` });

        const newComment = new Comment({
            siteId: inputs.siteId,
            userId: ObjectId(decodedDataInToken._id),
            title: inputs.title,
            stars: inputs.stars,
            content: inputs.content,
            reviewFields: [
                {
                    ratingFieldName: "Elementos inclusivos",
                    rating: inputs.inclusivity
                },
                {
                    ratingFieldName: "Accesibilidad",
                    rating: inputs.accessibility
                },
                {
                    ratingFieldName: "Servicio",
                    rating: inputs.service
                },
            ]
        })

        const savedComment = await newComment.save();

        await InclusiveSite.findOne({ _id: inputs.siteId }).then((site) => {
            if (site) {
                site.ratingStars[inputs.stars] = site.ratingStars[inputs.stars] + 1;
                site.ratingTotal = site.ratingTotal + inputs.stars;
                site.ratingCount = site.ratingCount + 1;
                site.rating = (site.ratingTotal / site.ratingCount);
                site.comments.push(savedComment._id);

                site.save();
                return res.status(200).json({ message: "Comentario registrado", element: savedComment });
            } else {
                res.status(409).json({ message: "No existe el sitio solicitado" });
            }
        })
    } catch (error) {
        return res.status(500).json({ message: "Error en la publicación del comentario" });
    }
}

module.exports = addComment
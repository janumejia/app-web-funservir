const InclusiveSites = require("../../../model/site")
const Neighborhoods = require("../../../model/neighborhoods")
const { _idMongooseRegex, nameRegex, descriptionRegex, categoryRegex, contactNumberRegex, localityRegex, neighborhoodRegex } = require("../../../regex") // Importación de patrones de Regex

const editInclusiveSites = async (req, res) => {

    // Entradas: _id, name, description, category, contactNumber, locality, neighborhood
    const { ...inputs } = req.body;

    // Definición de las variables que esperamos
    const dataArray = [
        { input: '_id', dataType: 'string', regex: _idMongooseRegex },
        { input: 'name', dataType: 'string', regex: nameRegex },
        { input: 'description', dataType: 'string', regex: descriptionRegex },
        { input: 'category', dataType: 'string', regex: categoryRegex },
        { input: 'contactNumber', dataType: 'string', regex: contactNumberRegex },
        { input: 'locality', dataType: 'string', regex: localityRegex },
        { input: 'neighborhood', dataType: 'string', regex: neighborhoodRegex },
    ]

    /* Sanitización entradas */
    // Validar el tipo de dato y si cumple con los caracteres permitidos
    for (var i = 0; i < dataArray.length; i++) {
        if (typeof (inputs[dataArray[i].input]) !== dataArray[i].dataType) return res.status(422).json({ message: `Tipo de dato de ${dataArray[i].input} no es válido` });
        if (dataArray[i].regex.test(inputs[dataArray[i].input]) === false) return res.status(422).json({ message: `Formato de ${dataArray[i].input} no es válido` });
    }
    // /* Fin sanitización entradas */

    InclusiveSites.findOne({ '_id': inputs._id }).then((element) => {
        if (!element) {
            res.status(404).json({ message: "No existe un sitio inclusivo con ese _id" })
        } else {

            // Comprobamos que el nombre a modificar no exista
            InclusiveSites.findOne({ 'name': inputs.name }).then((element) => {
                if (element && element._id.toString() !== inputs._id) res.status(409).json({ message: "Ya existe otro sitio inclusivo con ese nombre" })
                else {
                    Neighborhoods.findOne({ 'name': inputs.neighborhood, 'associatedLocality': inputs.locality }).then((element) => {
                        if (element) {
                            const query = { _id: inputs._id };
                            const update = {
                                name: inputs.name,
                                description: inputs.description,
                                category: inputs.category,
                                contactNumber: inputs.contactNumber,
                                inclusiveElements: inputs.inclusiveElements,
                                location: inputs.location,
                                locality: inputs.locality,
                                neighborhood: inputs.neighborhood,
                                gallery: inputs.gallery
                            }
                            InclusiveSites.findByIdAndUpdate(query, update).then((element) => {
                                res.status(200).json({ message: "Sitio inclusivo actualizado correctamente" });
                            }).catch((error) => {
                                console.error(error)
                                res.status(500).json({ message: "Error en creación de sitios inclusivo" })
                            })
                        } else {
                            res.status(404).json({ message: "No existe el barrio o localidad ingresada" })
                        }
                    })
                }
            })

        }
    })
}

module.exports = editInclusiveSites
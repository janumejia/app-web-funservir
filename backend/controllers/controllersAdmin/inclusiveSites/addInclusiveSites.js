const { off } = require("../../../App");
const Neighborhoods = require("../../../model/neighborhoods")
const Location = require("../../../model/locations")
// const InclusiveSites = require("../../../model/inclusiveSites")
const InclusiveSites = require("../../../model/site")
const { nameRegex, descriptionRegex, categoryRegex, ratingRegex, inclusiveElementsRegex, coordinates, locationRegex, neighborhoodsRegex } = require("../../../regex") // Importación de patrones de Regex

const addInclusiveSites = async (req, res) => {

    const { name, description, category, rating, ratingCount, contactNumber, locality, neighborhood } = req.body;

    // Sanitización. Comparación de los datos ingresados con los regex

    /* Sanitización entradas */
    // 1) Validar el tipo de dato
    if (typeof (name) !== 'string') return res.status(422).json({ message: "Tipo de dato de nombre no es válido" });
    if (typeof (description) !== 'string') return res.status(422).json({ message: "Tipo de dato de descripción asociada no es válido" });
    if (typeof (category) !== 'string') return res.status(422).json({ message: "Tipo de dato de categoría no es válido" });
    if (typeof (rating) !== 'string') return res.status(422).json({ message: "Tipo de dato de calificación no es válido" });
    if (typeof (ratingCount) !== 'string') return res.status(422).json({ message: "Tipo de dato de conteo de calificaciones no es válido" });
    if (typeof (contactNumber) !== 'string') return res.status(422).json({ message: "Tipo de dato de número de contacto no es válido" });
    // if (typeof (inclusiveElements) !== 'string') return res.status(422).json({ message: "Tipo de dato de elementos inclusivos no es válido" });
    // if (typeof (location) !== 'string') return res.status(422).json({ message: "Tipo de dato de localidad no es válido" });
    if (typeof (locality) !== 'string') return res.status(422).json({ message: "Tipo de dato de localidad no es válido" });
    if (typeof (neighborhood) !== 'string') return res.status(422).json({ message: "Tipo de dato de barrio asociada no es válido" });

    // 2) Validar si cumple con los caracteres permitidos
    const isValidName = nameRegex.test(name);
    const isValidDescription = descriptionRegex.test(description);
    const isValidCategory = categoryRegex.test(category);
    const isValidRating = ratingRegex.test(rating);
    const isValidRatingCount = ratingRegex.test(ratingCount);
    const isValidContactNumber = ratingRegex.test(contactNumber);
    // const isValidInclusiveElements = inclusiveElementsRegex.test(inclusiveElements);
    const isValidLocality = localityRegex.test(locality);
    const isValidNeighborhood = neighborhoodsRegex.test(neighborhood);

    if (isValidName === false) return res.status(422).json({ message: "Formato de nombre no es válido" });
    if (isValidDescription === false) return res.status(422).json({ message: "Formato de descripción no es válido" }); // Caso malo
    if (isValidCategory === false) return res.status(422).json({ message: "Formato de categoría no es válido" });
    if (isValidRating === false) return res.status(422).json({ message: "Formato de calificación no es válido" }); // Caso malo
    if (isValidRatingCount === false) return res.status(422).json({ message: "Formato de conteo de calificaciones no es válido" }); // Caso malo
    if (isValidRatingCount === false) return res.status(422).json({ message: "Formato de conteo de calificaciones no es válido" }); // Caso malo
    if (isValidContactNumber === false) return res.status(422).json({ message: "Formato de localidad no es válido" });
    if (isValidLocality === false) return res.status(422).json({ message: "Formato de localidad no es válido" }); // Caso malo
    if (isValidNeighborhood === false) return res.status(422).json({ message: "Formato de barrio no es válido" }); // Caso malo
    /* Fin sanitización entradas */


    // Comprobamos primero que no exista ese barrio en la bd
    // let doesThisNeighborhoodExist = false;
    InclusiveSites.findOne({ name }).then((element) => {
        if (element) {
            // doesThisNeighborhoodExist = true;
            res.status(409).json({ message: "Ya existe este sitio inclusivo" })
        } else {
            // Y también comprobamos que la localidad asociada exista
            Neighborhoods.findOne({ 'name': neighborhood, 'associatedLocality': locality }).then((element) => {
                if (element) {
                    const newInclusiveSites = new InclusiveSites({
                        name,
                        description,
                        category,
                        rating,
                        ratingCount,
                        contactNumber,
                        locality,
                        neighborhood
                    })
                    newInclusiveSites.save().then((element) => { // Si todo sale bien...
                        res.status(200).json({ message: "Sitio inclusivo creado correctamente", element })
                    })
                        .catch((error) => {
                            console.error(error)
                            res.status(500).json({ message: "Error en creación de sitios inclusivo" })
                        })

                } else {
                    res.status(404).json({ message: "No existe el barrio o localidad ingresada"})
                }
            })
        }
    })


}

module.exports = addInclusiveSites
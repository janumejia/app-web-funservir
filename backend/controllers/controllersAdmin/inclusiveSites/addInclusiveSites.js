const { off } = require("../../../App");
const Neighborhoods = require("../../../model/neighborhoods")
const Location = require("../../../model/locations")
const InclusiveSites = require("../../../model/inclusiveSites")
const { titleRegex, descriptionRegex, categoryRegex, ratingRegex, inclusiveElementsRegex, coordinates, locationRegex, neighborhoodsRegex } = require("../../../regex") // Importación de patrones de Regex

const addNeighborhoods = async (req, res) => {
    console.log("req.body");
    console.log(req.body);

    const { title, description, category, rating, inclusiveElements, images, coordinates, location, neighborhood } = req.body;

    // Sanitización. Comparación de los datos ingresados con los regex
    const isValidTitle = titleRegex.test(title);
    const isValidDescription = descriptionRegex.test(description);
    const isValidCategory = categoryRegex.test(category);
    const isValidRating = ratingRegex.test(rating);
    const isValidInclusiveElements = inclusiveElementsRegex.test(inclusiveElements);
    const isValidLatitude = latitudeRegex.test

    if (isValidName === false || isValidAssociatedLocality === false) return res.json({ message: "Formato no válido" }); // Caso malo
    else { // Caso bueno
        // Comprobamos primero que no exista ese barrio en la bd
        // let doesThisNeighborhoodExist = false;
        Neighborhoods.findOne({ name }).then((element) => {
            if (element) {
                // doesThisNeighborhoodExist = true;
                res.json({ message: "Ya existe este barrio" })
            } else {
                // Y también comprobamos que la localidad asociada exista
                Location.findOne({ 'name': associatedLocality }).then((element) => {
                    if (element) {
                        const newNeighborhoods = new Neighborhoods({
                            name,
                            associatedLocality
                        })
                        newNeighborhoods.save().then((element) => { // Si todo sale bien...
                            res.json({ message: "Barrio creado correctamente", element })
                        })
                            .catch((error) => {
                                console.error(error)
                                res.json({ message: "Error en creación de barrio" })
                            })

                    } else {
                        res.json({ message: "No existe esta localidad asociada " + associatedLocality })
                    }
                })
            }
        })

    }
}

module.exports = addNeighborhoods